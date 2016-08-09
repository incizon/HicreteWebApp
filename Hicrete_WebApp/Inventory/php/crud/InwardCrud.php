<?php
require_once 'utils/Common_Methods.php';
require_once 'utils/DatabaseCommonOperations.php';
require_once "../../php/HicreteLogger.php";


/*
*Inward Data class- CRUD operation on inward entry
*/

class InwardData extends CommonMethods
{
    public $inwardNumber;
    public $material;
    public $packageUnit;
    public $companyName;
    public $suppplierName;
    public $dateOfInward;
    public $materialQty;
    public $warehouse;
    public $suppervisor;

    public $transportMode;
    public $vehicleNumber;
    public $transportCost;
    public $remark;
    public $transportAgency;
    public $driverName;
    public $transportPayable;
    public $hasTransportDetails;
    public $isSuccess;
    public $size;
    private $dbh;
    private $db;

    //Constructor
    function __construct($inwardDetails)
    {
        // $this->dbh = $pDbh;
        $opt = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        );
        global $dbh;

        /******************************************************
         *Get Data into variables
         ********************************************************/
        if ($inwardDetails->operation == 'insert') {
            $this->inwardNumber = $inwardDetails->inwardData->inwardNumber;
            $this->companyName = $inwardDetails->inwardData->companyName;
            $this->dateOfInward = $inwardDetails->inwardData->date;

            $this->warehouse = $inwardDetails->inwardData->warehouseName;
            $this->suppervisor = $inwardDetails->inwardData->suppervisor;
            $this->hasTransportDetails = $inwardDetails->inwardData->hasTransportDetails;
            if ($this->hasTransportDetails == 'Yes') {
                $this->transportMode = $inwardDetails->inwardData->transportMode;
                $this->vehicleNumber = $inwardDetails->inwardData->vehicleNumber;
                $this->transportCost = $inwardDetails->inwardData->transportCost;
                $this->remark = $inwardDetails->inwardData->transportRemark;
                $this->transportAgency = $inwardDetails->inwardData->transportAgency;
                $this->driverName = $inwardDetails->inwardData->driver;
            }
        }
    }

    //Function to fetch unit of measure
    public static function getUnitOfMeasure($dbh, $materialId)
    {
        try {
            HicreteLogger::logInfo("Getting unit of measure");
            $stmt = $dbh->prepare("select a.unitofmeasure as unitofmeasure from product_master a, material b where a.productmasterid=b.productmasterid and b.materialid=:materialid");
            $stmt->bindParam(':materialid', $materialId, PDO::PARAM_STR, 10);
            if ($stmt->execute()) {
                $json_array = array();
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    //$result = $stmt->fetch(PDO::FETCH_ASSOC);
                    $json_array['unitofmeasure'] = $result['unitofmeasure'];
                }
            }
            echo json_encode($json_array);

        } catch (Exception $e) {
            HicreteLogger::logFatal("Exception occured \n". $e->getMessage());

        }

    }

    //Funciton to fetch unit of measure
    /**********************************************************************************
     * Purpose- This function will get all the inward entries from DB
     * @param1- $dbh connection object
     * Returns- inward entries
     ***********************************************************************************/
    public function getInwardEntries($dbh, $keyword, $searchTerm, $dbhHicrete)
    {
        $keyword = "%" . $keyword . "%";
        HicreteLogger::logInfo("Fetching inward details");
        $selectStatement = "select a.*,b.companyName as companyName,c.wareHouseName as wareHouseName from inward a, companymaster b, warehousemaster c where a.warehouseid=c.warehouseid and b.companyid =a.companyid ";

        HicreteLogger::logInfo("Getting inward details");
        switch ($searchTerm) {
            case'InwardNo':
                $selectStatement = $selectStatement . " AND a.inwardno like :keyword";
                break;
            case'Company':
                $selectStatement = $selectStatement . " AND b.companyName like :keyword";
                break;
            case'Warehouse':
                $selectStatement = $selectStatement . " AND c.wareHouseName like :keyword";
                break;
        }

        $selectStatement=$selectStatement." ORDER BY a.dateofentry DESC";
        $stmt = $dbh->prepare($selectStatement);
        HicreteLogger::logDebug("Query: ".json_encode($stmt));
        if ($searchTerm == 'InwardNo' || $searchTerm == 'Company' || $searchTerm == 'Warehouse') {
            $stmt->bindParam(':keyword', $keyword, PDO::PARAM_STR, 10);
        }

        if ($stmt->execute()) {
            //push it into array
            $json_array = array();
            while ($result2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $inwardData = array();
                $inwardID = $result2['inwardid'];
                $inwardData['inwardno'] = $result2['inwardno'];
                $inwardData['inwardid'] = $inwardID;
                $inwardData['warehouseid'] = $result2['warehouseid'];
                $inwardData['companyid'] = $result2['companyid'];
                $inwardData['supervisorid'] = $result2['supervisorid'];
                $supervisorid=$result2['supervisorid'];
                $stmtUser = $dbh->prepare("select usermaster.firstName as fname,usermaster.lastName as lname from usermaster WHERE userId=:id");
                $stmtUser->bindParam(':id', $supervisorid, PDO::PARAM_STR, 10);
                if ($stmtUser->execute()) {
                    $res=$stmtUser->fetch(PDO::FETCH_ASSOC);
                    $supervisorName=$res['fname']." ".$res['lname'];
                    $inwardData['supervisor']=$supervisorName;
                }else{
                    $result2['supervisor']="";
                }
                $newDate = date("d-m-Y", strtotime($result2['dateofentry']));
                $inwardData['dateofentry'] = $newDate;
                $inwardData['companyName'] = $result2['companyName'];
                $inwardData['warehouseName'] = $result2['wareHouseName'];
                $stmtTransport = $dbh->prepare("SELECT * FROM inward_transportation_details WHERE inwardid=:inwardID");
                $stmtTransport->bindParam(':inwardID', $inwardID);
                HicreteLogger::logDebug("Query: ".json_encode($stmtTransport));
                if ($stmtTransport->execute()) {

                    if ($stmtTransport->rowCount() != 0) {
                        while ($resultTransport = $stmtTransport->fetch(PDO::FETCH_ASSOC)) {
                            $inwardData['transportationmode'] = $resultTransport['transportationmode'];
                            $inwardData['vehicleno'] = $resultTransport['vehicleno'];
                            $inwardData['drivername'] = $resultTransport['drivername'];
                            $inwardData['transportagency'] = $resultTransport['transportagency'];
                            $inwardData['cost'] = $resultTransport['cost'];
                            $inwardData['remark'] = $resultTransport['remark'];
                        }
                    } else {
                        $inwardData['transportationmode'] = "--";
                        $inwardData['vehicleno'] = "--";
                        $inwardData['drivername'] = "--";
                        $inwardData['transportagency'] = "--";
                        $inwardData['cost'] = "--";
                        $inwardData['remark'] = "--";
                    }

                }

                // Join
                $stmt1 = $dbh->prepare("SELECT inward_details.inwarddetailsid,inward_details.inwardid,inward_details.quantity,inward_details.packagedunits,
                       inward_details.size,supplier.supplierid,supplier.suppliername,material.materialid,product_master.productname FROM inward_details
                        JOIN supplier ON
                        inward_details.supplierid=supplier.supplierid
                        JOIN material ON
                        material.materialid=inward_details.materialid
                        JOIN product_master ON
                        material.productmasterid=product_master.productmasterid
                        WHERE inwardid=:inwardID");

                $stmt1->bindParam(':inwardID', $inwardID);
                HicreteLogger::logDebug("Query: ".json_encode($stmt1));
                if ($stmt1->execute()) {
                    while ($resultMaterials = $stmt1->fetch(PDO::FETCH_ASSOC)) {

                        $inwardData['materialDetails'][] = array(
                            'inwarddetailsid' => $resultMaterials['inwarddetailsid'],
                            'inwardid' => $resultMaterials['inwardid'],
                            'materialid' => $resultMaterials['materialid'],
                            'quantity' => $resultMaterials['quantity'],
                            'prevQuantity' => $resultMaterials['quantity'],
                            'supplierid' => $resultMaterials['supplierid'],
                            'productname' => $resultMaterials['productname'],
                            'suppliername' => $resultMaterials['suppliername'],
                            'packagedunits' => $resultMaterials['packagedunits'],
                            'packagesize' => $resultMaterials['size']
                        );
                    }

                    array_push($json_array, $inwardData);
                } else {
                    HicreteLogger::logError("Fetching inward details failed");
                }
            }
            $json = json_encode($json_array);
            echo $json;

        } else {
            HicreteLogger::logError("Fetching inward details failed");
        }

    }

    /**********************************************************************************
     * End of get Inward function
     ***********************************************************************************/
    public function isAvailable($dbh)
    {
        $stmt = $dbh->prepare("SELECT inwardno FROM inward WHERE inwardno =:inwardno");
        $inwardNumber = trim($this->inwardNumber);
        $stmt->bindParam(':inwardno', $inwardNumber, PDO::PARAM_STR, 10);
        $stmt->execute();

        $count = $stmt->rowcount();
        if ($count != 0) {
            return 1;
        } else {
            return 0;
        }
    }

    /**********************************************************************************
     * Purpose- This function will insert inward data into DB
     * @param1- $dbh connection object
     * @param2- $userId
     * Returns- Success Msg or Failure
     ***********************************************************************************/
    public function insertInwardInToDb($dbh, $userId, $data)
    {
        try {

            //Begin Transaction
            $dbh->beginTransaction();
            //Create preapred Statement
            $date = new DateTime($this->dateOfInward);
            $inwardDate = $date->format('Y-m-d');
            HicreteLogger::logInfo("Inserting inward entries");
            $stmtInward = $dbh->prepare("INSERT INTO inward (warehouseid,companyid,supervisorid,dateofentry,inwardno,lchnguserid,lchngtime,creuserid,cretime)
             values (:warehouseid,:companyid,:supervisorid,:dateofentry,:inwardno,:lchnguserid,now(),:creuserid,now())");
            $stmtInward->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':supervisorid', $this->suppervisor, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':dateofentry', $inwardDate, PDO::PARAM_STR, 40);
            $stmtInward->bindParam(':inwardno', $this->inwardNumber, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

            HicreteLogger::logDebug("Query: \n".json_encode($stmtInward));
            HicreteLogger::logDebug("DATA: \n".json_encode($this));
            if ($stmtInward->execute()) {
                HicreteLogger::logInfo("Insertion to Inward successful.Inserting inward Details");
                $lastInwardId = $dbh->lastInsertId();
                $materials = $data->inwardData->inwardMaterials;
                //Insert Data into Inward Details table
                foreach ($materials as $material) {
                    $stmtInwardDetails = $dbh->prepare("INSERT INTO inward_details (inwardid,materialid,supplierid,quantity,packagedunits,size,lchnguserid,lchngtime,creuserid,cretime)
                    values (:inwardid,:materialid,:supplierid,:quantity,:packagedunits,:size,:lchnguserid,now(),:creuserid,now())");
                    $stmtInwardDetails->bindParam(':inwardid', $lastInwardId, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':supplierid', $material->suppplierName, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':quantity', $material->materialQuantity, PDO::PARAM_STR, 40);
                    $stmtInwardDetails->bindParam(':packagedunits', $material->packageUnit, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':size', $material->packagesize, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                    HicreteLogger::logDebug("Query: \n".json_encode($stmtInwardDetails));
                    HicreteLogger::logDebug("DATA: \n".json_encode($material));
                    if ($stmtInwardDetails->execute()) {
                        $isSuccess = true;
                        HicreteLogger::logInfo("Insertion of Inward Details successful.Updating inventory");
                        //Check if material already exist in inventory table if yes update else Insert
                        $stmtAvailabiltyCheck = $dbh->prepare("SELECT materialid FROM inventory WHERE materialid=:materialid ");
                        $stmtAvailabiltyCheck->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);

                        $stmtAvailabiltyCheck->execute();
                        $count = $stmtAvailabiltyCheck->rowcount();
                        if ($count != 0) {
                            //UPDATE
                            HicreteLogger::logInfo("Updating inventory");
                            $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity+ :totalquantity,
                                        warehouseid=:warehouseid,companyid=:companyid
                            WHERE materialid = :materialid");

                            $stmtInventory->bindParam(':totalquantity', $material->materialQuantity, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                            HicreteLogger::logDebug("Query: \n".json_encode($stmtInventory));

                            if ($stmtInventory->execute()) {
                                $isSuccess = true;
                            } else {
                                $isSuccess = false;
                            }
                        } else {
                            //Insert
                            HicreteLogger::logInfo("Inserting to inventory");
                            $stmtInventory = $dbh->prepare("INSERT INTO inventory (materialid,warehouseid,companyid,totalquantity)
                                                      values (:materialid,:warehouseid,:companyid,:totalquantity)");

                            $stmtInventory->bindParam(':totalquantity', $material->materialQuantity, PDO::PARAM_STR, 10);

                            $stmtInventory->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);

                            HicreteLogger::logDebug("Query: \n".json_encode($stmtInventory));
                            if ($stmtInventory->execute()) {
                                $isSuccess = true;
                            } else {
                                $isSuccess = false;
                            }
                        }
                    } else {
                        $isSuccess = false;
                    }
                }

                if ($isSuccess) {
                    $lastInwardDetailsId = $dbh->lastInsertId();
                    // Insert Data into Transport Details Table
                    if ($this->hasTransportDetails == 'Yes') {
                        HicreteLogger::logInfo("Inserting into transport details ");
                        $stmtTransportDetails = $dbh->prepare("INSERT INTO inward_transportation_details (inwardid,transportationmode,vehicleno,drivername,transportagency,cost,lchnguserid,lchngtime,creuserid,cretime,remark)
                       values (:inwardid,:transportationmode,:vehicleno,:drivername,:transportagency,:cost,:lchnguserid,now(),:creuserid,now(),:remark)");
                        $stmtTransportDetails->bindParam(':inwardid', $lastInwardId, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':transportationmode', $this->transportMode, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':vehicleno', $this->vehicleNumber, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':drivername', $this->driverName, PDO::PARAM_STR, 40);
                        $stmtTransportDetails->bindParam(':transportagency', $this->transportAgency, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':cost', $this->transportCost, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                        $stmtTransportDetails->bindParam(':remark', $this->remark, PDO::PARAM_STR, 10);
                        HicreteLogger::logDebug("Query: \n".json_encode($stmtTransportDetails));
                        if ($stmtTransportDetails->execute()) {
                            $lastTransportId = $dbh->lastInsertId();
                            $this->showAlert('success', "Inward details added Successfully!!!");
                            $dbh->commit();
                            //MAP PURCHASE ORDER TO INWARD ENTRY HERE
                        } else {
                            HicreteLogger::logError("Error while adding transport");
                            $this->showAlert('Failure', "Error while adding transport");
                            $dbh->rollBack();
                        }
                    } else {
                        HicreteLogger::logInfo("Inward details added Successfully");
                        $this->showAlert('success', "Inward details added Successfully!!!");
                        $dbh->commit();
                    }
                } else {
                    HicreteLogger::logError("Error while adding 2nd");
                    $this->showAlert('Failure', "Error while adding 2nd");
                    $dbh->rollBack();
                }

            } else {
                HicreteLogger::logError("Error while adding 1st");
                $this->showAlert('Failure', "Error while adding 1st");
                $dbh->rollBack();
            }

        } catch (Exception $e) {
            HicreteLogger::logFatal("Exception occured \n". $e->getMessage());
            echo $e->getMessage();
            $dbh->rollBack();
        }
    }

    /**********************************************************************************
     * End of insert inward data function
     ***********************************************************************************/


    public function deleteProduct()
    {
    }



    public static function ModifyInwardDetails($dbh,$userId,$InwrdData)
    {
        $flag = false;
        $dbh->beginTransaction();
        //Updating main Inward details -START
       try {
           $date = new DateTime($InwrdData->dateofentry);
           $InwrdData->dateofentry = $date->format('Y-m-d');
           $stmtInwardUpdate = $dbh->prepare("UPDATE inward SET warehouseid =:warehouseid,companyid=:companyid,
            supervisorid=:supervisorid,dateofentry=:dateofentry,inwardno=:inwardno,lchnguserid=:lchnguserid,lchngtime=now() WHERE inwardid = :inwardid");
           $stmtInwardUpdate->bindParam(':warehouseid', $InwrdData->warehouseid, PDO::PARAM_STR, 10);
           $stmtInwardUpdate->bindParam(':companyid', $InwrdData->companyid, PDO::PARAM_STR, 10);
           $stmtInwardUpdate->bindParam(':supervisorid', $InwrdData->supervisorid, PDO::PARAM_STR, 10);
           $stmtInwardUpdate->bindParam(':dateofentry', $InwrdData->dateofentry, PDO::PARAM_STR, 40);
           $stmtInwardUpdate->bindParam(':inwardno', $InwrdData->inwardno, PDO::PARAM_STR, 10);
           $stmtInwardUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
           $stmtInwardUpdate->bindParam(':inwardid', $InwrdData->inwardid, PDO::PARAM_STR, 10);
           if ($stmtInwardUpdate->execute()) {
               $flag = true;
               // $this->showAlert('success',"Inward details updated Successfully!!!");
           } else {
               $message="Error while updating inward details";
               $arr = array('msg' => '', 'error' => $message);
               $jsn = json_encode($arr);
               echo($jsn);
               $dbh->rollBack();
               return;
           }
           //Updating main Inward Details -END
           $count = 0;
           //Updating materials added in inward entry-Start

           $stmtInwardDetailsCheck = $dbh->prepare("Select materialid,quantity from inward_details where  inwardid=:inwardid ");

           $stmtInwardDetailsCheck->bindParam(':inwardid', $InwrdData->inwardid, PDO::PARAM_STR, 10);


           if ($stmtInwardDetailsCheck->execute()) {
               $Maxcount = $stmtInwardDetailsCheck->rowcount();
               $count = 0;
               while ($resultMaterials = $stmtInwardDetailsCheck->fetch(PDO::FETCH_ASSOC)) {
                   //$result = $stmtInwardDetailsCheck->fetch(PDO::FETCH_ASSOC);

                   $quantity = $resultMaterials['quantity'];
                   $materialid = $resultMaterials['materialid'];

                   $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity - :quantity
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
                   $message="Error while updating inward details";
                   $arr = array('msg' => '', 'error' => $message);
                   $jsn = json_encode($arr);
                   echo($jsn);
                   $dbh->rollBack();
               }

           } else {
               $message="Error while updating inward details";
               $arr = array('msg' => '', 'error' => $message);
               $jsn = json_encode($arr);
               echo($jsn);
               $dbh->rollBack();
           }
           //echo "INWARD ID :$InwrdData->inwardid";

           $stmtDeleteInwdDetails = $dbh->prepare("DELETE FROM inward_details where inwardid = :inwardid");
           $stmtDeleteInwdDetails->bindParam(':inwardid', $InwrdData->inwardid, PDO::PARAM_STR, 10);
           if (!$stmtDeleteInwdDetails->execute()) {
               $message="Error while updating inward details";
               $arr = array('msg' => '', 'error' => $message);
               $jsn = json_encode($arr);
               echo($jsn);
               $dbh->rollBack();
               return;
           }

           $count = 0;
           for ($i = 0; $i < sizeof($InwrdData->inwardMaterials); $i++) {
               $stmtInsertInwdDetails = $dbh->prepare("INSERT INTO `inward_details`(`inwardid`, `materialid`, `supplierid`, `quantity`, `packagedunits`, `size`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`)
                 VALUES (:inwardid,:materialid,:supplierid,:quantity,:packagedunits,:size,:lchnguserid,now(),:creuserid,now())");
               $stmtInsertInwdDetails->bindParam(':inwardid', $InwrdData->inwardid, PDO::PARAM_STR, 10);
               $stmtInsertInwdDetails->bindParam(':materialid', $InwrdData->inwardMaterials[$i]->materialid, PDO::PARAM_STR, 10);
               $stmtInsertInwdDetails->bindParam(':supplierid', $InwrdData->inwardMaterials[$i]->supplierid, PDO::PARAM_STR, 10);
               $stmtInsertInwdDetails->bindParam(':quantity', $InwrdData->inwardMaterials[$i]->quantity, PDO::PARAM_STR, 40);
               $stmtInsertInwdDetails->bindParam(':packagedunits', $InwrdData->inwardMaterials[$i]->packagedunits, PDO::PARAM_STR, 10);
               $stmtInsertInwdDetails->bindParam(':size', $InwrdData->inwardMaterials[$i]->packagesize, PDO::PARAM_STR, 10);
               $stmtInsertInwdDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
               $stmtInsertInwdDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

               if (!$stmtInsertInwdDetails->execute()) {
                   break;
               } else {

                   $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity+ :quantity
                            WHERE materialid = :materialid");
                   $stmtInventory->bindParam(':quantity', $InwrdData->inwardMaterials[$i]->quantity, PDO::PARAM_STR, 10);
                   $stmtInventory->bindParam(':materialid', $InwrdData->inwardMaterials[$i]->materialid, PDO::PARAM_STR, 10);

                   if ($stmtInventory->execute()) {
                       $count++;
                   } else
                       break;
               }
           }

           if ($count != sizeof($InwrdData->inwardMaterials)) {
               $message="Error while updating inward details";
               $arr = array('msg' => '', 'error' => $message);
               $jsn = json_encode($arr);
               echo($jsn);
               $dbh->rollBack();
               return;
           } else {
               //echo "Inward entry Updated successfully";
               if($InwrdData->hasTransportDetails == "No") {
                   $message = "Inward details Updated successfully";
                   $arr = array('msg' => $message, 'error' => '');
                   $jsn = json_encode($arr);
                   echo($jsn);
                   $dbh->commit();
               }
               else if($InwrdData->hasTransportDetails == "Yes")
               {
                   $stmtModifyTransport = $dbh->prepare("DELETE FROM inward_transportation_details WHERE inwardid=:inwardid");
                   $stmtModifyTransport->bindParam(':inwardid', $InwrdData->inwardid, PDO::PARAM_STR, 10);
                   if ($stmtModifyTransport->execute()) {

                       $stmtModifyTransport = $dbh->prepare("INSERT INTO inward_transportation_details (inwardid,transportationmode,vehicleno,drivername,transportagency,cost,lchnguserid,lchngtime,creuserid,cretime,remark)
                       values (:inwardid,:transportationmode,:vehicleno,:drivername,:transportagency,:cost,:lchnguserid,now(),:creuserid,now(),:remark)");
                       $stmtModifyTransport->bindParam(':inwardid', $InwrdData->inwardid, PDO::PARAM_STR, 10);
                       $stmtModifyTransport->bindParam(':transportationmode', $InwrdData->transportationmode, PDO::PARAM_STR, 10);
                       $stmtModifyTransport->bindParam(':vehicleno', $InwrdData->vehicleno, PDO::PARAM_STR, 10);
                       $stmtModifyTransport->bindParam(':drivername', $InwrdData->drivername, PDO::PARAM_STR, 40);
                       $stmtModifyTransport->bindParam(':transportagency', $InwrdData->transportagency, PDO::PARAM_STR, 10);
                       $stmtModifyTransport->bindParam(':cost', $InwrdData->cost, PDO::PARAM_STR, 10);
                       $stmtModifyTransport->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                       $stmtModifyTransport->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                       $stmtModifyTransport->bindParam(':remark', $InwrdData->remark, PDO::PARAM_STR, 10);

                       if ($stmtModifyTransport->execute()) {
                           $message = "Inward details Updated successfully";
                           $arr = array('msg' => $message, 'error' => '');
                           $jsn = json_encode($arr);
                           echo($jsn);
                           $dbh->commit();

                       }else
                       {
                           $message="Error while updating inward transport details";
                           $arr = array('msg' => '', 'error' => $message);
                           $jsn = json_encode($arr);
                           echo($jsn);
                           $dbh->rollBack();
                       }


                   }else
                   {
                       $message="Error while updating inward transport details";
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



    /**********************************************************************************
     * Purpose- This function will Update inward data into DB
     * @param1- $dbh connection object
     * @param2- $userId
     * @param3- $pInwarData (inward data to update)
     * Returns- Success Msg or Failure
     ***********************************************************************************/
    public function updateInwardDetails($dbh, $userId, $pInwarData)
    {
        $flag = false;
        //BEGIN THE TRANSACTION
        $dbh->beginTransaction();

        $InwardDetails = $pInwarData->inwardData;
        if ($InwardDetails->isInwardTable) {
            $stmtInwardUpdate = $dbh->prepare("UPDATE inward SET warehouseid =:warehouseid,companyid=:companyid,
            supervisorid=:supervisorid,dateofentry=now(),inwardno=:inwardno,lchnguserid=:lchnguserid,lchngtime=now() WHERE inwardid = :inwardid");
            $stmtInwardUpdate->bindParam(':warehouseid', $InwardDetails->warehouseid, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':companyid', $InwardDetails->companyid, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':supervisorid', $InwardDetails->supervisorid, PDO::PARAM_STR, 10);
            // $stmtOutwardUpdate->bindParam(':dateofentry', $OutwardDetails->dateofentry, PDO::PARAM_STR, 40);
            $stmtInwardUpdate->bindParam(':inwardno', $InwardDetails->inwardno, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtInwardUpdate->bindParam(':inwardid', $InwardDetails->inwardid, PDO::PARAM_STR, 10);
            if ($stmtInwardUpdate->execute()) {
                $flag = true;
                // $this->showAlert('success',"Inward details updated Successfully!!!");
            } else {
                // $this->showAlert('Failure', $OutwardDetails);
                $flag = false;
            }
        }
        if ($InwardDetails->isInwardDetailsTable) {

            $stmtInwardDetailsUpdate = $dbh->prepare("UPDATE inward_details SET materialid =:materialid,supplierid=:supplierid,quantity=:quantity,packagedunits=:packagedunits,
            lchnguserid=:lchnguserid,lchngtime=now()
            WHERE   inwarddetailsid  =:inwarddetailsid");
            $stmtInwardDetailsUpdate->bindParam(':materialid', $InwardDetails->materialid, PDO::PARAM_STR, 10);
            $stmtInwardDetailsUpdate->bindParam(':supplierid', $InwardDetails->supplierid, PDO::PARAM_STR, 10);
            $stmtInwardDetailsUpdate->bindParam(':quantity', $InwardDetails->quantity, PDO::PARAM_STR, 40);
            $stmtInwardDetailsUpdate->bindParam(':packagedunits', $InwardDetails->packagedunits, PDO::PARAM_STR, 10);
            $stmtInwardDetailsUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtInwardDetailsUpdate->bindParam(':inwarddetailsid', $InwardDetails->inwarddetailsid, PDO::PARAM_STR, 10);
            if ($stmtInwardDetailsUpdate->execute()) {
                // $this->showAlert('success',"Outward details updated Successfully!!!");
                $flag = true;
            } else {
                // $this->showAlert('Failure',"Error while adding");
                $flag = false;
            }
        }

        if ($InwardDetails->isInwardTransportTable) {

            $stmtTransportDetailsUpdate = $dbh->prepare("UPDATE inward_transportation_details SET transportationmode =:transportationmode,vehicleno=:vehicleno,
           drivername=:drivername,transportagency=:transportagency,cost=:cost,lchnguserid=:lchnguserid,lchngtime=now(),remark=:remark
            WHERE inwardtranspid = :inwardtranspid");
            $stmtTransportDetailsUpdate->bindParam(':transportationmode', $InwardDetails->transportationmode, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':vehicleno', $InwardDetails->vehicleno, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':drivername', $InwardDetails->drivername, PDO::PARAM_STR, 40);
            $stmtTransportDetailsUpdate->bindParam(':transportagency', $InwardDetails->transportagency, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':cost', $InwardDetails->cost, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':remark', $InwardDetails->remark, PDO::PARAM_STR, 10);
            $stmtTransportDetailsUpdate->bindParam(':inwardtranspid', $InwardDetails->inwardtranspid, PDO::PARAM_STR, 10);
            if ($stmtTransportDetailsUpdate->execute()) {
                $flag = true;
            } else {
                $flag = false;
            }
        }

        if ($flag) {
            $this->showAlert('success', "Inward details updated Successfully!!!");
            $dbh->commit();
        } else {
            $this->showAlert('Failure', "Error");
            $dbh->rollback();
        }

    }
    /**********************************************************************************
     * End of insert inward data function
     ***********************************************************************************/

}

?>