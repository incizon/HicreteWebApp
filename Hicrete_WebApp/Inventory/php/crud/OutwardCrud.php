<?php
require_once 'utils/Common_Methods.php';
require_once 'utils/DatabaseCommonOperations.php';
require_once "../../php/HicreteLogger.php";

class OutwardData extends CommonMethods
{
    public $OutwardNumber;
    public $companyName;
    public $warehouse;
    public $suppervisor;
    public $dateOfOutward;

    public $material;
    public $packageUnit;
    public $materialQty;

    public $transportMode;
    public $vehicleNumber;
    public $transportCost;
    public $remark;
    public $transportAgency;
    public $driverName;
    public $transportPayable;
    public $isSuccess;
    private $dbh;
    private $db;

    function __construct($OutwardObj)
    {
        // $this->dbh = $pDbh;
        $opt = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        );
        global $dbh;

        /******************************************************
         *Get Data into variables
         *
         *******************************************************/
        if ($OutwardObj->operation == 'insert') {
            $OutwardDetails = $OutwardObj->outwardData;
            $this->OutwardNumber = $OutwardDetails->OutwardNumber;
            $this->companyName = $OutwardDetails->companyName;
            $this->dateOfOutward = $OutwardDetails->date;

            $this->warehouse = $OutwardDetails->warehouseName;
            $this->suppervisor = $OutwardDetails->suppervisor;
            $this->hasTransportDetails = $OutwardDetails->hasTransportDetails;
            if ($this->hasTransportDetails == 'Yes') {
                $this->transportMode = $OutwardDetails->transportMode;
                $this->vehicleNumber = $OutwardDetails->vehicleNumber;
                $this->transportCost = $OutwardDetails->transportCost;
                $this->remark = $OutwardDetails->transportRemark;
                $this->transportAgency = $OutwardDetails->transportAgency;
                $this->driverName = $OutwardDetails->driver;
            }
        }
    }

    public function getOutwardEntries($dbh, $keyword, $searchTerm)
    {
        $keyword = "%" . $keyword . "%";

        HicreteLogger::logInfo("Fetching outward entries");
        $selectStatement = "select a.*,b.companyName as companyName,c.wareHouseName as wareHouseName from outward a, companymaster b, warehousemaster c where a.warehouseid=c.warehouseid and b.companyid =a.companyid";

        switch ($searchTerm) {
            case 'OutwardNo':
                $selectStatement = $selectStatement . " AND a.outwardno like :keyword";
                break;
            case'Company':
                $selectStatement = $selectStatement . " AND b.companyName like :keyword";
                break;
            case'Warehouse':
                $selectStatement = $selectStatement . " AND c.wareHouseName like :keyword";
                break;
        }
        $stmt = $dbh->prepare($selectStatement);
        if ($searchTerm == 'OutwardNo' || $searchTerm == 'Company' || $searchTerm == 'Warehouse') {
            $stmt->bindParam(':keyword', $keyword, PDO::PARAM_STR, 10);
        }
        HicreteLogger::logDebug("Query: ".json_encode($stmt));
        HicreteLogger::logDebug("Keyword: ".json_encode($keyword));
        if ($stmt->execute()) {

            //push it into array
            $json_array = array();
            while ($result2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $outwardData = array();
                $outwardID = $result2['outwardid'];
                $outwardData['outwardid'] = $result2['outwardid'];
                $outwardData['outwardno'] = $result2['outwardno'];
                $outwardData['warehouseid'] = $result2['warehouseid'];
                $outwardData['companyid'] = $result2['companyid'];
                $outwardData['supervisorid'] = $result2['supervisorid'];

                $newDate = date("d-m-Y", strtotime($result2['dateofentry']));
                $outwardData['dateofentry'] = $newDate;

                $outwardData['companyName'] = $result2['companyName'];
                $outwardData['warehouseName'] = $result2['wareHouseName'];

                $stmtTransport = $dbh->prepare("SELECT * FROM outward_transportation_details WHERE outwardid=:outwardID");
                $stmtTransport->bindParam(':outwardID', $outwardID);
                HicreteLogger::logDebug("Query: ".json_encode($stmtTransport));
                if ($stmtTransport->execute()) {
                    if ($stmtTransport->rowCount() == 0) {
                        $outwardData['transportationmode'] = "--";
                        $outwardData['vehicleno'] = "--";
                        $outwardData['drivername'] = "--";
                        $outwardData['transportagency'] = "--";
                        $outwardData['cost'] = "--";
                        $outwardData['remark'] = "--";
                    } else {
                        while ($resultTransport = $stmtTransport->fetch(PDO::FETCH_ASSOC)) {
                            $outwardData['transportationmode'] = $resultTransport['transportationmode'];
                            $outwardData['vehicleno'] = $resultTransport['vehicleno'];
                            $outwardData['drivername'] = $resultTransport['drivername'];
                            $outwardData['transportagency'] = $resultTransport['transportagency'];
                            $outwardData['cost'] = $resultTransport['cost'];
                            $outwardData['remark'] = $resultTransport['remark'];
                        }
                    }
                }


                // Join
                $stmt1 = $dbh->prepare("SELECT * FROM outward_details
                        JOIN material ON
                        material.materialid=outward_details.materialid
                        JOIN product_master ON
                        material.productmasterid=product_master.productmasterid
                        WHERE outwardid=:outwardID");

                $stmt1->bindParam(':outwardID', $outwardID);
                HicreteLogger::logDebug("Query: ".json_encode($stmt1));
                if ($stmt1->execute()) {
                    while ($resultMaterials = $stmt1->fetch(PDO::FETCH_ASSOC)) {
                        $outwardData['materialDetails'][] = array(
                            'outwardid' => $resultMaterials['outwardid'],
                            'materialid' => $resultMaterials['materialid'],
                            'quantity' => $resultMaterials['quantity'],
                            'productname' => $resultMaterials['productname'],
                            'packagedunits' => $resultMaterials['packagedunits'],
                            'packagesize' => $resultMaterials['packagesize']
                        );
                    }

                    array_push($json_array, $outwardData);
                } else {
                    HicreteLogger::logError("Error occured while fetching outward data ");
                    echo "Error2 ";
                }
            }
            $json = json_encode($json_array);
            echo $json;

        } else {
            //Rollback
            HicreteLogger::logError("Error occured while fetching outward data ");
            echo "Error";
        }
    }

    public function isAvailable($dbh)
    {
        $stmt = $dbh->prepare("SELECT outwardno FROM Outward WHERE outwardno =:outwardno");
        $outwardNumber = trim($this->OutwardNumber);
        $stmt->bindParam(':outwardno', $outwardNumber, PDO::PARAM_STR, 10);

        $stmt->execute();
        $count = $stmt->rowcount();
        if ($count != 0) {
            return 1;
        } else {
            return 0;
        }
    }

    public function insertOutwardInToDb($dbh, $userId, $data)
    {
        try {
            //BEGIN THE TRANSACTION
            $dbh->beginTransaction();
            HicreteLogger::logInfo("Inserting outward entries");
            $date = new DateTime($this->dateOfOutward);
            $dob = $date->format('Y-m-d');
            $stmtOutward = $dbh->prepare("INSERT INTO outward (warehouseid,companyid,supervisorid,dateofentry,outwardno,lchnguserid,lchngtime,creuserid,cretime)
                           values (:warehouseid,:companyid,:supervisorid,:dateofentry,:Outwardno,:lchnguserid,now(),:creuserid,now())");
            $stmtOutward->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':supervisorid', $this->suppervisor, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':dateofentry', $dob, PDO::PARAM_STR, 40);
            $stmtOutward->bindParam(':Outwardno', $this->OutwardNumber, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

            HicreteLogger::logDebug("Query: ".json_encode($stmtOutward));
            HicreteLogger::logDebug("Data: ".json_encode($this));
            if ($stmtOutward->execute()) {
                HicreteLogger::logInfo("Insertion to outward successful. Inserting outward details");
                $lastOutwardId = $dbh->lastInsertId();
                $materials = $data->outwardData->outwardMaterials;
                //Insert Data into Outward Details table

                foreach ($materials as $material) {
                    $stmtOutwardDetails = $dbh->prepare("INSERT INTO outward_details (Outwardid,materialid,quantity,packagedunits,packagesize,lchnguserid,lchngtime,creuserid,cretime)
              values (:Outwardid,:materialid,:quantity,:packagedunits,:packagesize,:lchnguserid,now(),:creuserid,now())");
                    $stmtOutwardDetails->bindParam(':Outwardid', $lastOutwardId, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':quantity', $material->materialQuantity, PDO::PARAM_STR, 40);
                    $stmtOutwardDetails->bindParam(':packagedunits', $material->packageUnit, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':packagesize', $material->packagesize, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                    HicreteLogger::logDebug("Query: ".json_encode($stmtOutwardDetails));
                    HicreteLogger::logDebug("Data: ".json_encode($material));
                    if ($stmtOutwardDetails->execute()) {
                        $isSuccess = true;
                        // I CAN OPTIMIZE THIS CODE
                        HicreteLogger::logInfo(" Inserting outward details successfull updating inventory");
                        $result = null;
                        $stmtInventoryCount = $dbh->prepare("SELECT totalquantity from inventory  WHERE materialid = :materialid");
                        $stmtInventoryCount->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                        $stmtInventoryCount->execute();
                        // if($stmtInventoryCount->execute()){
                        $result = $stmtInventoryCount->setFetchMode(PDO::FETCH_ASSOC);
                        $result = $stmtInventoryCount->fetch(PDO::FETCH_ASSOC);
                        // }

                        if ($result['totalquantity'] != 0) {
                            HicreteLogger::logInfo("Updating inventory");
                            $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity- :totalquantity
                    WHERE materialid = :materialid");
                            $stmtInventory->bindParam(':totalquantity', $material->materialQuantity, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);

                            if ($stmtInventory->execute()) {
                                $isSuccess = true;

                            } else {
                                HicreteLogger::logError("Error in updating or inserting main table");
                                $this->showAlert('Failure', "Error 3rd");
                                $isSuccess = false;

                            }
                        } else {
                            HicreteLogger::logError("Error in inserting outward details");
                            $this->showAlert('Failure', "Error 2nd");
                            $isSuccess = false;
                        }
                    } else {
                        HicreteLogger::logError("Error in inserting outward details");
                        $this->showAlert('Failure', "Error 1st");
                        $isSuccess = false;
                    }
                }


                if ($isSuccess) {
                    $lastOutwardDetailsId = $dbh->lastInsertId();

                    // Insert Data into Transport Details Table
                    if ($this->hasTransportDetails == 'Yes') {
                        HicreteLogger::logInfo("Inserting transport details ");
                        $stmtTransportDetails = $dbh->prepare("INSERT INTO outward_transportation_details (Outwardid,transportationmode,vehicleno,drivername,transportagency,cost,lchnguserid,lchngtime,creuserid,cretime,remark)
               values (:Outwardid,:transportationmode,:vehicleno,:drivername,:transportagency,:cost,:lchnguserid,now(),:creuserid,now(),:remark)");
                        $stmtTransportDetails->bindParam(':Outwardid', $lastOutwardId, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':transportationmode', $this->transportMode, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':vehicleno', $this->vehicleNumber, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':drivername', $this->driverName, PDO::PARAM_STR, 40);
                        $stmtTransportDetails->bindParam(':transportagency', $this->transportAgency, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':cost', $this->transportCost, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':remark', $this->remark, PDO::PARAM_STR, 10);

                        if ($stmtTransportDetails->execute()) {
                            HicreteLogger::logInfo("Outward details added successfully");
                            $this->showAlert('success', "Outward details added Successfully!!!");
                            $dbh->commit();

                        } else {
                            HicreteLogger::logError("Error in inserting outward transport details");
                            $this->showAlert('Failure', "Error while adding 3rd");
                            $dbh->rollBack();
                        }
                    } else {
                        HicreteLogger::logInfo("Outward details added successfully");
                        $this->showAlert('success', "Outward details added Successfully!!!");
                        $dbh->commit();
                    }


                } else {
                    HicreteLogger::logError("Error in inserting outward details");
                    $this->showAlert('Failure', "Error while adding 2nf");
                    $dbh->rollBack();
                }
            } else {
                HicreteLogger::logError("Error in inserting outward");
                $this->showAlert('Failure', "Error while adding 1st");
                $dbh->rollBack();
            }
        } catch (Exception $e) {
            HicreteLogger::logFatal("Exception occured \n". $e->getMessage());
            echo $e->getMessage();
        }
    }

    public function deleteProduct()
    {
    }

    public static function ModifyOutwardDetails($dbh,$userId,$outwardData)
    {
        $flag = false;
        $dbh->beginTransaction();
        //Updating main Inward details -START
        try {
            $date = new DateTime($outwardData->dateofentry);
            $outwardData->dateofentry = $date->format('Y-m-d');
            $stmtInwardUpdate = $dbh->prepare("UPDATE outward SET warehouseid =:warehouseid,companyid=:companyid,
            supervisorid=:supervisorid,dateofentry=:dateofentry,outwardno=:outwardno,lchnguserid=:lchnguserid,lchngtime=now() WHERE outwardid = :outwardid");
            $stmtInwardUpdate->bindParam(':warehouseid', $outwardData->warehouseid, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':companyid', $outwardData->companyid, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':supervisorid', $outwardData->supervisorid, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':dateofentry', $outwardData->dateofentry, PDO::PARAM_STR, 40);
            $stmtInwardUpdate->bindParam(':outwardno', $outwardData->outwardno, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':outwardid', $outwardData->outwardid, PDO::PARAM_STR, 10);
            if ($stmtInwardUpdate->execute()) {
                $flag = true;
                // $this->showAlert('success',"Inward details updated Successfully!!!");
            } else {
                $message="Error while Updating Inward details";
                $arr = array('msg' => '', 'error' => $message);
                $jsn = json_encode($arr);
                echo($jsn);
                $dbh->rollBack();
                return;
            }
            //Updating main Inward Details -END
            $count = 0;
            //Updating materials added in inward entry-Start

            $stmtInwardDetailsCheck = $dbh->prepare("Select materialid,quantity from outward_details where  outwardid=:outwardid ");

            $stmtInwardDetailsCheck->bindParam(':outwardid', $outwardData->outwardid, PDO::PARAM_STR, 10);


            if ($stmtInwardDetailsCheck->execute()) {
                $Maxcount = $stmtInwardDetailsCheck->rowcount();
                $count = 0;
                while ($resultMaterials = $stmtInwardDetailsCheck->fetch(PDO::FETCH_ASSOC)) {
                    //$result = $stmtInwardDetailsCheck->fetch(PDO::FETCH_ASSOC);

                    $quantity = $resultMaterials['quantity'];
                    $materialid = $resultMaterials['materialid'];

                    $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity + :quantity
                            WHERE materialid = :materialid");
                    $stmtInventory->bindParam(':quantity', $quantity, PDO::PARAM_STR, 10);
                    $stmtInventory->bindParam(':materialid', $materialid, PDO::PARAM_STR, 10);
                    if ($stmtInventory->execute()) {
                        $count++;
                    } else {
                        break;
                    }
                }
                if ($Maxcount != $count) {
                    //echo "\n $count\n";
                    $message="Error while updating outward details";
                    $arr = array('msg' => '', 'error' => $message);
                    $jsn = json_encode($arr);
                    echo($jsn);
                    $dbh->rollBack();
                }

            } else {
//                echo "\n $count\n";
//                echo "Error while updating outward details";
                $message="Error while updating outward details";
                $arr = array('msg' => '', 'error' => $message);
                $jsn = json_encode($arr);
                echo($jsn);
                $dbh->rollBack();
            }
            //echo "INWARD ID :$InwrdData->inwardid";

            $stmtDeleteInwdDetails = $dbh->prepare("DELETE FROM outward_details where outwardid = :outwardid");
            $stmtDeleteInwdDetails->bindParam(':outwardid',$outwardData->outwardid, PDO::PARAM_STR, 10);
            if (!$stmtDeleteInwdDetails->execute()) {
                $message="Error while updating outward details";
                $arr = array('msg' => '', 'error' => $message);
                $jsn = json_encode($arr);
                echo($jsn);
                $dbh->rollBack();
                return;
            }

            $count = 0;
            for ($i = 0; $i < sizeof($outwardData->materialDetails); $i++) {
                $stmtInsertInwdDetails = $dbh->prepare("INSERT INTO `outward_details`(`outwardid`, `materialid`, `quantity`, `packagedunits`, `packagesize`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`)
                 VALUES (:outwardid,:materialid,:quantity,:packagedunits,:size,:lchnguserid,now(),:creuserid,now())");
                $stmtInsertInwdDetails->bindParam(':outwardid', $outwardData->outwardid, PDO::PARAM_STR, 10);
                $stmtInsertInwdDetails->bindParam(':materialid', $outwardData->materialDetails[$i]->materialid, PDO::PARAM_STR, 10);
               // $stmtInsertInwdDetails->bindParam(':supplierid', $outwardData->materialDetails[$i]->supplierid, PDO::PARAM_STR, 10);
                $stmtInsertInwdDetails->bindParam(':quantity', $outwardData->materialDetails[$i]->quantity, PDO::PARAM_STR, 40);
                $stmtInsertInwdDetails->bindParam(':packagedunits', $outwardData->materialDetails[$i]->packagedunits, PDO::PARAM_STR, 10);
                $stmtInsertInwdDetails->bindParam(':size', $outwardData->materialDetails[$i]->packagesize, PDO::PARAM_STR, 10);
                $stmtInsertInwdDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtInsertInwdDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

                if (!$stmtInsertInwdDetails->execute()) {
                    break;
                } else {
                    //echo "\n".$outwardData->materialDetails[$i]->materialid."\n";
                    $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity - :quantity
                            WHERE materialid = :materialid");
                    $stmtInventory->bindParam(':quantity', $outwardData->materialDetails[$i]->quantity, PDO::PARAM_STR, 10);
                    $stmtInventory->bindParam(':materialid', $outwardData->materialDetails[$i]->materialid, PDO::PARAM_STR, 10);

                    if ($stmtInventory->execute()) {
                        $count++;
                    } else
                        break;
                }
            }

            if ($count != sizeof($outwardData->materialDetails)) {
                $message="Error while updating outward details";
                $arr = array('msg' => '', 'error' => $message);
                $jsn = json_encode($arr);
                echo($jsn);
                $dbh->rollBack();
                return;
            } else {
                if($outwardData->hasTransportDetails == "No") {
                    $message = "Outward details Updated successfully";
                    $arr = array('msg' => $message, 'error' => '');
                    $jsn = json_encode($arr);
                    echo($jsn);
                    $dbh->commit();
                }
                else if($outwardData->hasTransportDetails == "Yes")
                {
                    $stmtModifyTransport = $dbh->prepare("DELETE FROM inward_transportation_details WHERE inwardid=:inwardid");
                    $stmtModifyTransport->bindParam(':inwardid', $outwardData->outwardid, PDO::PARAM_STR, 10);
                    if ($stmtModifyTransport->execute()) {

                        $stmtModifyTransport = $dbh->prepare("INSERT INTO outward_transportation_details (outwardid,transportationmode,vehicleno,drivername,transportagency,cost,lchnguserid,lchngtime,creuserid,cretime,remark)
                       values (:outwardid,:transportationmode,:vehicleno,:drivername,:transportagency,:cost,:lchnguserid,now(),:creuserid,now(),:remark)");
                        $stmtModifyTransport->bindParam(':outwardid', $outwardData->outwardid, PDO::PARAM_STR, 10);
                        $stmtModifyTransport->bindParam(':transportationmode', $outwardData->transportationmode, PDO::PARAM_STR, 10);
                        $stmtModifyTransport->bindParam(':vehicleno', $outwardData->vehicleno, PDO::PARAM_STR, 10);
                        $stmtModifyTransport->bindParam(':drivername', $outwardData->drivername, PDO::PARAM_STR, 40);
                        $stmtModifyTransport->bindParam(':transportagency', $outwardData->transportagency, PDO::PARAM_STR, 10);
                        $stmtModifyTransport->bindParam(':cost', $outwardData->cost, PDO::PARAM_STR, 10);
                        $stmtModifyTransport->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                        $stmtModifyTransport->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                        $stmtModifyTransport->bindParam(':remark', $outwardData->remark, PDO::PARAM_STR, 10);

                        if ($stmtModifyTransport->execute()) {
                            $message = "Outward details Updated successfully";
                            $arr = array('msg' => $message, 'error' => '');
                            $jsn = json_encode($arr);
                            echo($jsn);
                            $dbh->commit();

                        }else
                        {
                            $message="Error while updating Outward transport details";
                            $arr = array('msg' => '', 'error' => $message);
                            $jsn = json_encode($arr);
                            echo($jsn);
                            $dbh->rollBack();
                        }


                    }else
                    {
                        $message="Error while updating Outward transport details";
                        $arr = array('msg' => '', 'error' => $message);
                        $jsn = json_encode($arr);
                        echo($jsn);
                        $dbh->rollBack();
                    }
                }
            }
        }catch(Exception $e)
        {
            echo $e->getMessage();
            $dbh->rollBack();
        }
    }




    public function updateOutwardDetails($dbh, $userId, $productDetails)
    {

        $flag = false;
        //BEGIN THE TRANSACTION
        $dbh->beginTransaction();

        $OutwardDetails = $productDetails->selectedProduct;
        if ($OutwardDetails->isOutwardTable) {
            $stmtOutwardUpdate = $dbh->prepare("UPDATE Outward SET warehouseid =:warehouseid,companyid=:companyid,
        supervisorid=:supervisorid,dateofentry=now(),outwardno=:outwardno,lchnguserid=:lchnguserid,lchngtime=now() WHERE outwardid = :outwardid");
            $stmtOutwardUpdate->bindParam(':warehouseid', $OutwardDetails->warehouseid, PDO::PARAM_STR, 10);
            $stmtOutwardUpdate->bindParam(':companyid', $OutwardDetails->companyid, PDO::PARAM_STR, 10);
            $stmtOutwardUpdate->bindParam(':supervisorid', $OutwardDetails->supervisorid, PDO::PARAM_STR, 10);
            // $stmtOutwardUpdate->bindParam(':dateofentry', $OutwardDetails->dateofentry, PDO::PARAM_STR, 40);
            $stmtOutwardUpdate->bindParam(':outwardno', $OutwardDetails->outwardno, PDO::PARAM_STR, 10);
            $stmtOutwardUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtOutwardUpdate->bindParam(':outwardid', $OutwardDetails->outwardid, PDO::PARAM_STR, 10);
            if ($stmtOutwardUpdate->execute()) {
                $flag = true;
                // $this->showAlert('success',"Inward details updated Successfully!!!");
            } else {
                // $this->showAlert('Failure', $OutwardDetails);
                $flag = false;
            }
        }
        if ($OutwardDetails->isOutwardDetailsTable) {

            $stmtOutwardDetailsUpdate = $dbh->prepare("UPDATE Outward_details SET materialid =:materialid,quantity=:quantity,packagedunits=:packagedunits,
        lchnguserid=:lchnguserid,lchngtime=now()
        WHERE   outwarddtlsid =:outwarddtlsid");
            $stmtOutwardDetailsUpdate->bindParam(':materialid', $OutwardDetails->materialid, PDO::PARAM_STR, 10);
            $stmtOutwardDetailsUpdate->bindParam(':quantity', $OutwardDetails->quantity, PDO::PARAM_STR, 40);
            $stmtOutwardDetailsUpdate->bindParam(':packagedunits', $OutwardDetails->packagedunits, PDO::PARAM_STR, 10);
            $stmtOutwardDetailsUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtOutwardDetailsUpdate->bindParam(':outwarddtlsid', $userId, PDO::PARAM_STR, 10);
            if ($stmtOutwardDetailsUpdate->execute()) {
                // $this->showAlert('success',"Outward details updated Successfully!!!");
                $flag = true;
            } else {
                // $this->showAlert('Failure',"Error while adding");
                $flag = false;
            }
        }

        if ($OutwardDetails->isOutwardTransportTable) {

            $stmtTransportDetailsUpdate = $dbh->prepare("UPDATE Outward_transportation_details SET transportationmode =:transportationmode,vehicleno=:vehicleno,
       drivername=:drivername,transportagency=:transportagency,cost=:cost,lchnguserid=:lchnguserid,lchngtime=now(),remark=:remark
        WHERE outwardtranspid = :outwardtranspid");
            $stmtTransportDetailsUpdate->bindParam(':transportationmode', $OutwardDetails->transportationmode, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':vehicleno', $OutwardDetails->vehicleno, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':drivername', $OutwardDetails->drivername, PDO::PARAM_STR, 40);
            $stmtTransportDetailsUpdate->bindParam(':transportagency', $OutwardDetails->transportagency, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':cost', $OutwardDetails->cost, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':remark', $OutwardDetails->remark, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':outwardtranspid', $OutwardDetails->outwardtranspid, PDO::PARAM_STR, 10);
            if ($stmtTransportDetailsUpdate->execute()) {
                // $this->showAlert('success',"Inward details updated Successfully!!!");
                $flag = true;
            } else {
                // $this->showAlert('Failure',"Error while adding");
                $flag = false;
            }
        }

        if ($flag) {
            $this->showAlert('success', "Outward details updated Successfully!!!");
            $pmateriID = $OutwardDetails->materialid;
            $pmaterialQty = $OutwardDetails->quantity;
            $this->updateInventoryTable($dbh, $pmateriID, $pmaterialQty);
        } else {
            $this->showAlert('Failure', "Error");
            $dbh->rollback();
        }
    }

    public function updateInventoryTable($dbh, $pMaterialId, $pMaterialQty)
    {
        $result = null;
        $stmtInventoryCount = $dbh->prepare("SELECT totalquantity from inventory  WHERE materialid = :materialid");
        $stmtInventoryCount->bindParam(':materialid', $pMaterialId, PDO::PARAM_STR, 10);
        $stmtInventoryCount->execute();
        // if($stmtInventoryCount->execute()){
        $result = $stmtInventoryCount->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmtInventoryCount->fetch(PDO::FETCH_ASSOC);
        // }

        if ($result['totalquantity'] != 0) {
            $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity- :totalquantity
                    WHERE materialid = :materialid");
            $stmtInventory->bindParam(':totalquantity', $pMaterialQty, PDO::PARAM_STR, 10);
            $stmtInventory->bindParam(':materialid', $pMaterialId, PDO::PARAM_STR, 10);

            if ($stmtInventory->execute()) {
                $this->showAlert('success', "Outward details added Successfully!!!");
                $dbh->commit();
            } else {
                $this->showAlert('Failure', "Error while adding4th");
                $dbh->rollback();
            }
        }
    }

}

?>