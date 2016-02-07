<?php
require_once 'utils/Common_Methods.php';
require_once 'utils/DatabaseCommonOperations.php';

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
//            $this->material = $inwardDetails->inwardData->material;
//            $this->packageUnit = $inwardDetails->inwardData->packageUnit;
            $this->companyName = $inwardDetails->inwardData->companyName;
//            $this->suppplierName = $inwardDetails->inwardData->suppplierName;
            $this->dateOfInward = $inwardDetails->inwardData->date;
//            $this->materialQty = $inwardDetails->inwardData->materialQuantity;
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

    /**********************************************************************************
     * Purpose- This function will get all the inward entries from DB
     * @param1- $dbh connection object
     * Returns- inward entries
     ***********************************************************************************/
    public function getInwardEntries($dbh,$dbhHicrete)
    {
        $stmt = $dbh->prepare("SELECT * FROM inward");
        if ($stmt->execute()) {
            //push it into array

            $json_array=array();
            while ($result2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $inwardData = array();
                $inwardID = $result2['inwardid'];
                $inwardData['inwardno']=$result2['inwardno'];
                $inwardData['inwardid'] = $inwardID;
                $inwardData['warehouseid']=$result2['warehouseid'];
                $inwardData['companyid']=$result2['companyid'];
                $inwardData['supervisorid']=$result2['supervisorid'];
                $inwardData['dateofentry']=$result2['dateofentry'];
                $warehouseId=$result2['warehouseid'];
                $companyId=$result2['companyid'];
                $inwardData['companyName']=DatabaseCommonOperations::getCompanyName($companyId);
                $inwardData['warehouseName']=DatabaseCommonOperations::getWarehouseName($warehouseId);

                $stmtTransport=$dbh->prepare("SELECT * FROM inward_transportation_details WHERE inwardid=:inwardID");
                $stmtTransport->bindParam(':inwardID', $inwardID);
                if($stmtTransport->execute()){

                    if($stmtTransport->rowCount()==0){
                        $outwardData['transportationmode']="--";
                        $outwardData['vehicleno']="--";
                        $outwardData['drivername']="--";
                        $outwardData['transportagency']="--";
                        $outwardData['cost']="--";
                        $outwardData['remark']="--";
                    }else {
                        while ($resultTransport = $stmtTransport->fetch(PDO::FETCH_ASSOC)) {
                            $inwardData['transportationmode'] = $resultTransport['transportationmode'];
                            $inwardData['vehicleno'] = $resultTransport['vehicleno'];
                            $inwardData['drivername'] = $resultTransport['drivername'];
                            $inwardData['transportagency'] = $resultTransport['transportagency'];
                            $inwardData['cost'] = $resultTransport['cost'];
                            $inwardData['remark'] = $resultTransport['remark'];
                        }
                    }

                }
                //push inward data into array

                //push inward transport details data into array

                // Join
                $stmt1 = $dbh->prepare("SELECT * FROM inward_details
                        JOIN supplier ON
                        inward_details.supplierid=supplier.supplierid
                        JOIN material ON
                        material.materialid=inward_details.materialid
                        JOIN product_master ON
                        material.productmasterid=product_master.productmasterid
                        WHERE inwardid=:inwardID");

                $stmt1->bindParam(':inwardID', $inwardID);

                if ($stmt1->execute()) {
//                    array_push($inwardData,$stmt1->fetchAll());
                    while ($resultMaterials = $stmt1->fetch(PDO::FETCH_ASSOC)) {

                        $inwardData['materialDetails'][] = array(
                            'inwardid' => $resultMaterials['inwardid'],
                            'materialid' => $resultMaterials['materialid'],
                            'quantity' => $resultMaterials['quantity'],
                            'supplierid' => $resultMaterials['supplierid'],
                            'productname' => $resultMaterials['productname'],
                            'suppliername' => $resultMaterials['suppliername'],
                            'packagedunits' => $resultMaterials['packagedunits']
                        );
                    }

                    array_push($json_array,$inwardData);
                } else {
                    //Rollback
                }
            }
            $json = json_encode($json_array);
            echo $json;

        } else {

        }

    }
    /**********************************************************************************
     * End of get Inward function
     ***********************************************************************************/
    public function isAvailable($dbh,$data){

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
            $stmtInward = $dbh->prepare("INSERT INTO inward (warehouseid,companyid,supervisorid,dateofentry,inwardno,lchnguserid,lchngtime,creuserid,cretime) 
             values (:warehouseid,:companyid,:supervisorid,:dateofentry,:inwardno,:lchnguserid,now(),:creuserid,now())");
            $stmtInward->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':supervisorid', $this->suppervisor, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':dateofentry', $this->dateOfInward, PDO::PARAM_STR, 40);
            $stmtInward->bindParam(':inwardno', $this->inwardNumber, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

            if ($stmtInward->execute()) {
                $lastInwardId = $dbh->lastInsertId();
                $materials = $data->inwardData->inwardMaterials;
                //Insert Data into Inward Details table
                foreach ($materials as $material) {
                    $stmtInwardDetails = $dbh->prepare("INSERT INTO inward_details (inwardid,materialid,supplierid,quantity,packagedunits,lchnguserid,lchngtime,creuserid,cretime)
                    values (:inwardid,:materialid,:supplierid,:quantity,:packagedunits,:lchnguserid,now(),:creuserid,now())");
                    $stmtInwardDetails->bindParam(':inwardid', $lastInwardId, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':supplierid', $material->suppplierName, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':quantity', $material->materialQuantity, PDO::PARAM_STR, 40);
                    $stmtInwardDetails->bindParam(':packagedunits', $material->packageUnit, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                    $stmtInwardDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                    if ($stmtInwardDetails->execute()) {
                        $isSuccess = true;
                        //Check if material already exist in inventory table if yes update else Insert
                        $stmtAvailabiltyCheck = $dbh->prepare("SELECT materialid FROM inventory WHERE materialid=:materialid");
                        $stmtAvailabiltyCheck->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);
                        $stmtAvailabiltyCheck->execute();
                        $count = $stmtAvailabiltyCheck->rowcount();
                        if ($count != 0) {
                            //UPDATE
                            $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity+ :totalquantity,
                                        warehouseid=:warehouseid,companyid=:companyid
                            WHERE materialid = :materialid");

                            $stmtInventory->bindParam(':totalquantity', $material->materialQuantity, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);

                            if ($stmtInventory->execute()) {
                                $isSuccess = true;
                            } else {
                                $isSuccess = false;
                            }
                        }else{
                            //Insert
                            $stmtInventory = $dbh->prepare("INSERT INTO inventory (materialid,warehouseid,companyid,totalquantity)
                                                      values (:materialid,:companyid,:warehouseid,:totalquantity)");

                            $stmtInventory->bindParam(':totalquantity', $material->materialQuantity, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':warehouseid', $this->warehouse, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':companyid', $this->companyName, PDO::PARAM_STR, 10);
                            $stmtInventory->bindParam(':materialid', $material->material, PDO::PARAM_STR, 10);

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

                        if ($stmtTransportDetails->execute()) {
                            $lastTransportId = $dbh->lastInsertId();
                            $this->showAlert('success', "Inward details added Successfully!!!");
                            $dbh->commit();
                            //MAP PURCHASE ORDER TO INWARD ENTRY HERE
                        } else {
                            $this->showAlert('Failure', "Error while adding transport");
                            $dbh->rollBack();
                        }
                    } else {
                        $this->showAlert('success', "Inward details added Successfully!!!");
                        $dbh->commit();
                    }
                } else {
                    $this->showAlert('Failure', "Error while adding 2nd");
                    $dbh->rollBack();
                }

            } else {
                $this->showAlert('Failure', "Error while adding 1st");
                $dbh->rollBack();
            }

        } catch (Exception $e) {
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
                // $this->showAlert('success',"Inward details updated Successfully!!!");
                $flag = true;
            } else {
                // $this->showAlert('Failure',"Error while adding");
                $flag = false;
            }
        }

        if ($flag) {
            $this->showAlert('success', "Inward details updated Successfully!!!");
            $dbh->commit();
            $pmateriID = $InwardDetails->materialid;
            $pmaterialQty = $InwardDetails->quantity;
            //  $this->updateInventoryTable($dbh,$pmateriID,$pmaterialQty);
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