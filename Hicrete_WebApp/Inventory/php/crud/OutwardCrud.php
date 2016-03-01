<?php
require_once 'utils/Common_Methods.php';
require_once 'utils/DatabaseCommonOperations.php';

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
//            $this->material = $OutwardDetails->material;
//            $this->packageUnit = $OutwardDetails->packageUnit;
            $this->companyName = $OutwardDetails->companyName;
            $this->dateOfOutward = $OutwardDetails->date;

//            $this->materialQty = $OutwardDetails->materialQuantity;
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
                // $this->transportPayable = $OutwardDetails->transportPayable;
            }
        }
    }

    public function getOutwardEntries($dbh)
    {


        $stmt = $dbh->prepare("SELECT * FROM Outward");
        if ($stmt->execute()) {

            //push it into array
            $json_array=array();
            while ($result2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $outwardData = array();
                $outwardID = $result2['outwardid'];
                $outwardData['outwardno']=$result2['outwardno'];
                $outwardData['warehouseid']=$result2['warehouseid'];
                $outwardData['companyid']=$result2['companyid'];
                $outwardData['supervisorid']=$result2['supervisorid'];
                $outwardData['dateofentry']=$result2['dateofentry'];

                $companyId=$result2['companyid'];
                $warehouseId=$result2['warehouseid'];;
                $outwardData['companyName']=DatabaseCommonOperations::getCompanyName($companyId);
                $outwardData['warehouseName']=DatabaseCommonOperations::getWarehouseName($warehouseId);

                $stmtTransport=$dbh->prepare("SELECT * FROM Outward_transportation_details WHERE outwardid=:outwardID");
                $stmtTransport->bindParam(':outwardID', $outwardID);
                if($stmtTransport->execute()){
                    if($stmtTransport->rowCount()==0){
                        $outwardData['transportationmode']="--";
                        $outwardData['vehicleno']="--";
                        $outwardData['drivername']="--";
                        $outwardData['transportagency']="--";
                        $outwardData['cost']="--";
                        $outwardData['remark']="--";
                    }else{
                        while ($resultTransport = $stmtTransport->fetch(PDO::FETCH_ASSOC)){
                            $outwardData['transportationmode']=$resultTransport['transportationmode'];
                            $outwardData['vehicleno']=$resultTransport['vehicleno'];
                            $outwardData['drivername']=$resultTransport['drivername'];
                            $outwardData['transportagency']=$resultTransport['transportagency'];
                            $outwardData['cost']=$resultTransport['cost'];
                            $outwardData['remark']=$resultTransport['remark'];
                        }
                    }
                }
                //push inward data into array

                //push inward transport details data into array

                // Join
                $stmt1 = $dbh->prepare("SELECT * FROM Outward_details
                        JOIN material ON
                        material.materialid=Outward_details.materialid
                        JOIN product_master ON
                        material.productmasterid=product_master.productmasterid
                        WHERE outwardid=:outwardID");

                $stmt1->bindParam(':outwardID', $outwardID);

                if ($stmt1->execute()) {
//                    array_push($inwardData,$stmt1->fetchAll());
                    while ($resultMaterials = $stmt1->fetch(PDO::FETCH_ASSOC)) {

                        $outwardData['materialDetails'][] = array(
                            'outwardid' => $resultMaterials['outwardid'],
                            'materialid' => $resultMaterials['materialid'],
                            'quantity' => $resultMaterials['quantity'],
                            'productname' => $resultMaterials['productname'],
                            'packagedunits' => $resultMaterials['packagedunits']
                        );
                    }

                    array_push($json_array,$outwardData);
                } else {
                    //Rollback
                    echo "Error2 ";
                }
            }
            $json = json_encode($json_array);
            echo $json;

        } else {
            //Rollback
            echo "Error";
        }








    }

    public function insertOutwardInToDb($dbh, $userId, $data)
    {
        try {
            //BEGIN THE TRANSACTION
            $dbh->beginTransaction();

            $stmtOutward = $dbh->prepare("INSERT INTO Outward (warehouseid,companyid,supervisorid,dateofentry,outwardno,lchnguserid,lchngtime,creuserid,cretime)
                           values (:warehouseid,:companyid,:supervisorid,now(),:Outwardno,:lchnguserid,now(),:creuserid,now())");
            $stmtOutward->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':supervisorid',  $this->suppervisor, PDO::PARAM_STR, 10);
            // $stmtOutward->bindParam(':dateofentry', $this->dateOfInward, PDO::PARAM_STR, 40);
            $stmtOutward->bindParam(':Outwardno', $this->OutwardNumber, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtOutward->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

            if ($stmtOutward->execute()) {
                $lastOutwardId = $dbh->lastInsertId();
                $materials = $data->outwardData->outwardMaterials;
                //Insert Data into Outward Details table

                foreach ($materials as $material) {
                    $stmtOutwardDetails = $dbh->prepare("INSERT INTO Outward_details (Outwardid,materialid,quantity,packagedunits,lchnguserid,lchngtime,creuserid,cretime)
              values (:Outwardid,:materialid,:quantity,:packagedunits,:lchnguserid,now(),:creuserid,now())");
                    $stmtOutwardDetails->bindParam(':Outwardid', $lastOutwardId, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':quantity', $material->materialQuantity, PDO::PARAM_STR, 40);
                    $stmtOutwardDetails->bindParam(':packagedunits', $material->packageUnit, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                    $stmtOutwardDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                    if ($stmtOutwardDetails->execute()) {
                        $isSuccess = true;
                        // I CAN OPTIMIZE THIS CODE

                        $result = null;
                        $stmtInventoryCount = $dbh->prepare("SELECT totalquantity from inventory  WHERE materialid = :materialid");
                        $stmtInventoryCount->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                        $stmtInventoryCount->execute();
                        // if($stmtInventoryCount->execute()){
                        $result = $stmtInventoryCount->setFetchMode(PDO::FETCH_ASSOC);
                        $result = $stmtInventoryCount->fetch(PDO::FETCH_ASSOC);
                        // }

                        if ($result['totalquantity'] != 0) {
                            $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity- :totalquantity
                    WHERE materialid = :materialid");
                            $stmtInventory->bindParam(':totalquantity', $material->materialQuantity, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);

                            if ($stmtInventory->execute()) {
                                $isSuccess=true;
//                                $this->showAlert('success', "Outward details added Successfully!!!");
//                                $dbh->commit();
                            } else {
                                $isSuccess=false;
//                                $this->showAlert('Failure', "Error while adding4th");
//                                $dbh->rollBack();
                            }
                        }
                    } else {
                        $isSuccess = false;
                    }
                }


                if ($isSuccess) {
                    $lastOutwardDetailsId = $dbh->lastInsertId();

                    // Insert Data into Transport Details Table
                    if ($this->hasTransportDetails == 'Yes') {
                        $stmtTransportDetails = $dbh->prepare("INSERT INTO Outward_transportation_details (Outwardid,transportationmode,vehicleno,drivername,transportagency,cost,lchnguserid,lchngtime,creuserid,cretime,remark)
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
                                $this->showAlert('success', "Outward details added Successfully!!!");
                                $dbh->commit();

                        } else {
                            $this->showAlert('Failure', "Error while adding 3rd");
                            $dbh->rollBack();
                        }
                    } else {
                                $this->showAlert('success', "Outward details added Successfully!!!");
                                $dbh->commit();
                    }


                } else {
                    $this->showAlert('Failure', "Error while adding 2nf");
                    $dbh->rollBack();
                }
            } else {
                $this->showAlert('Failure', "Error while adding 1st");
                $dbh->rollBack();
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function deleteProduct()
    {
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