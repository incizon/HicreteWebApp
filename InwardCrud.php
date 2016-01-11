<?php
require_once 'utils/Common_Methods.php';
/*
*Inward Data class- CRUD operation on inward entry
*/
class InwardData extends CommonMethods{
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

        private $dbh;
        private $db;
        //Constructor
        function __construct($inwardDetails){
            // $this->dbh = $pDbh;
            $opt = array(
               PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
               PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
               );
            global $dbh;
            
         /******************************************************
         *Get Data into variables
         ********************************************************/
         if($inwardDetails->operation=='insert'){
                $this->inwardNumber = $inwardDetails->inwardData->inwardNumber;
                 $this->material = $inwardDetails->inwardData->material;  
                 $this->packageUnit = $inwardDetails->inwardData->packageUnit;
                 $this->companyName = $inwardDetails->inwardData->companyName;
                 $this->suppplierName = $inwardDetails->inwardData->suppplierName;
                 $this->dateOfInward = $inwardDetails->inwardData->date;
                 $this->materialQty = $inwardDetails->inwardData->materialQuantity;
                 $this->warehouse = $inwardDetails->inwardData->warehouseName;
                 $this->suppervisor = $inwardDetails->inwardData->suppervisor;
                 $this->hasTransportDetails=$inwardDetails->inwardData->hasTransportDetails;
                 if($this->hasTransportDetails=='Yes'){
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
     public function getInwardEntries($dbh) {
        $stmt=$dbh->prepare("SELECT * FROM inward  
            JOIN inward_details ON 
            inward.inwardid=inward_details.inwardid
            JOIN inward_transportation_details ON
            inward_transportation_details.inwardid=inward.inwardid
            JOIN supplier ON
            inward_details.supplierid=supplier.supplierid
            JOIN material ON 
            material.materialid=inward_details.materialid
            JOIN product_master ON
            material.productmasterid=product_master.productmasterid");
        if($stmt->execute()){
           $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
           $result = $stmt->fetchAll();
           $json= json_encode($result);
           echo $json;
       }

    }
    /**********************************************************************************
    * End of get Inward function
    ***********************************************************************************/

    /**********************************************************************************
    * Purpose- This function will insert inward data into DB
    * @param1- $dbh connection object
    * @param2- $userId 
    * Returns- Success Msg or Failure
    ***********************************************************************************/
    public function insertInwardInToDb($dbh,$userId){ 
      try{
                // global $dbh;
            $userId=1;
            $userId1=2;
            $materialId=1;
            //Begin Transaction
            $dbh->beginTransaction();
            //Create preapred Statement
            $stmtInward = $dbh->prepare("INSERT INTO inward (warehouseid,companyid,supervisorid,dateofentry,inwardno,lchnguserid,lchngtime,creuserid,cretime) 
             values (:warehouseid,:companyid,:supervisorid,:dateofentry,:inwardno,:lchnguserid,now(),:creuserid,now())");
            $stmtInward->bindParam(':warehouseid', $userId, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':companyid', $userId, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':supervisorid', $userId, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':dateofentry', $this->dateOfInward, PDO::PARAM_STR, 40);
            $stmtInward->bindParam(':inwardno', $this->inwardNumber, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtInward->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

            if($stmtInward->execute()){
              $lastInwardId=$dbh->lastInsertId();

            //Insert Data into Inward Details table

              $stmtInwardDetails = $dbh->prepare("INSERT INTO inward_details (inwardid,materialid,supplierid,quantity,packagedunits,lchnguserid,lchngtime,creuserid,cretime) 
                 values (:inwardid,:materialid,:supplierid,:quantity,:packagedunits,:lchnguserid,now(),:creuserid,now())");
              $stmtInwardDetails->bindParam(':inwardid', $lastInwardId, PDO::PARAM_STR, 10);
              $stmtInwardDetails->bindParam(':materialid', $this->material, PDO::PARAM_STR, 10);
              $stmtInwardDetails->bindParam(':supplierid', $this->suppplierName, PDO::PARAM_STR, 10);
              $stmtInwardDetails->bindParam(':quantity', $this->materialQty, PDO::PARAM_STR, 40);
              $stmtInwardDetails->bindParam(':packagedunits', $this->packageUnit, PDO::PARAM_STR, 10);
              $stmtInwardDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
              $stmtInwardDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

              if($stmtInwardDetails->execute()){
                 $lastInwardDetailsId=$dbh->lastInsertId();
                // Insert Data into Transport Details Table
                 if( $this->hasTransportDetails=='Yes'){
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

                     if($stmtTransportDetails->execute()){
                        $lastTransportId=$dbh->lastInsertId();
                        //MAP PURCHASE ORDER TO INWARD ENTRY HERE
                    }
                    else
                    {
                        $this->showAlert('Failure',"Error while adding transport");
                        $dbh->rollBack();
                    }
                   
                 }else{
                    //dssdkfnkjndf
                 }
                 //Check if material already exist in inventory table if yes update else Insert
                $stmtAvailabiltyCheck=$dbh->prepare("SELECT materialid FROM inventory WHERE materialid=:materialid");
                $stmtAvailabiltyCheck->bindParam(':materialid', $this->material, PDO::PARAM_STR, 10);
                $stmtAvailabiltyCheck->execute();
                $count=$stmtAvailabiltyCheck->rowcount();
                if($count!=0){
                    //UPDATE
                    $stmtInventory = $dbh->prepare("UPDATE inventory SET totalquantity =totalquantity+ :totalquantity
                   WHERE materialid = :materialid");
                    $stmtInventory->bindParam(':totalquantity', $this->materialQty, PDO::PARAM_STR, 10);
                    $stmtInventory->bindParam(':materialid',$this->material, PDO::PARAM_STR, 10);

                    if($stmtInventory->execute()){
                        $this->showAlert('success',"Inward details added Successfully!!!");
                        $dbh->commit();
                    }else
                    {
                       $this->showAlert('Failure',"Error while adding");
                       $dbh->rollBack();
                    }
                }else{
                    //INSERT material into inventory table
                    $stmtInventoryInsert = $dbh->prepare("INSERT INTO inventory (materialid,warehouseid,companyid,totalquantity) 
                       values (:materialid,:warehouseid,:companyid,:totalquantity)");
                    $stmtInventoryInsert->bindParam(':materialid', $this->material, PDO::PARAM_STR, 10);
                    $stmtInventoryInsert->bindParam(':warehouseid', $userId, PDO::PARAM_STR, 10);
                    $stmtInventoryInsert->bindParam(':companyid', $userId, PDO::PARAM_STR, 10);
                    $stmtInventoryInsert->bindParam(':totalquantity', $this->materialQty, PDO::PARAM_STR, 10);
                    if($stmtInventoryInsert->execute()){
                        $this->showAlert('success',"Inward details added Successfully!!!");
                        $dbh->commit();
                    }else
                    {
                       $this->showAlert('Failure',"Error while adding");
                       $dbh->rollBack();
                    }
                }
            } else
            {
               $this->showAlert('Failure',"Error while adding");
               $dbh->rollBack();
            }

            }else
            {
                $this->showAlert('Failure',"Error while adding");
                $dbh->rollBack();
            }

        }catch(Exception $e){
          echo $e->getMessage();
          $dbh->rollBack();
        }
    }
    /**********************************************************************************
    * End of insert inward data function
    ***********************************************************************************/
    public function deleteProduct() {   }
    public function updateInwardDetails() {   }

}
?>