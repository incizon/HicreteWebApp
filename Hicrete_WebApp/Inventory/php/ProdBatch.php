<?php
require_once "../../php/HicreteLogger.php";
class ProdBatch
{
    public $batchNo;
    public $batchCodeName; //The single instance
    public $dateOfEntry;
    public $startDate;
    public $endDate;
    public $supervisor;

    public $rawMaterial;

    public $prodcdMaterial;
    public $quantityProdMat; //The single instance
    public $dateOfEntryAftrProd;
    public $pckgdUnits;
    public $company;
    public $wareHouse;
    public $step;
    

    public $modeOfTransport; //The single instance
    public $vehicleNo;
    public $driver;
    public $TranspAgency;
    public $cost;

    public $prodMasterId;
    public $producedGoodId;
    public $inhouseInwardId;

    public $option;
    public $tranReq;
    

  

    public function __construct($prodBatchInfo){
        //echo $supplier->supplierName;
        $this->batchNo=$prodBatchInfo->batchNo;
        $this->batchCodeName=$prodBatchInfo->batchCodeName;
        $this->dateOfEntry=$prodBatchInfo->dateOfEntry;
        $this->startDate=$prodBatchInfo->startDate;
        $this->endDate=$prodBatchInfo->endDate;
        $this->supervisor=$prodBatchInfo->supervisor;

        $this->rawMaterial=$prodBatchInfo->rawMaterial;
        $this->prodcdMaterial=$prodBatchInfo->prodcdMaterial;
        $this->quantityProdMat=$prodBatchInfo->quantityProdMat;
        $this->dateOfEntryAftrProd=$prodBatchInfo->dateOfEntryAftrProd;
        $this->pckgdUnits=$prodBatchInfo->pckgdUnits;
        $this->company=$prodBatchInfo->company;

        $this->wareHouse=$prodBatchInfo->wareHouse;
        $this->modeOfTransport=$prodBatchInfo->modeOfTransport;
        $this->vehicleNo=$prodBatchInfo->vehicleNo;
        $this->driver=$prodBatchInfo->driver;
        $this->TranspAgency=$prodBatchInfo->TranspAgency;
        $this->cost=$prodBatchInfo->cost;
        $this->step=$prodBatchInfo->step;

        $this->option=$prodBatchInfo->option;
        $this->tranReq=$prodBatchInfo->tranReq;


    }
    public function checkAvlblBatchNo($dbh)
    {
        HicreteLogger::logInfo("Checking if the Batch no is available");
         $stmt = $dbh->prepare("SELECT BATCHCODENAME FROM production_batch_master WHERE BATCHNO =:batchNo");
         $stmt->bindParam(':batchNo', $this->batchNo, PDO::PARAM_STR, 10);
         $stmt->execute();
         $count=$stmt->rowcount();
        HicreteLogger::logInfo("Count is : ".$count);
         if($count!=0)
         {return 1;}
         else
         {return 0;}

    }

    public function addToProdBatchMaster($dbh,$userId)
    {
       
        try{
            HicreteLogger::logInfo("Adding Production Batch");
            $this->dateOfEntry=date('y-m-d', strtotime($this->dateOfEntry));
            //echo json_encode($this->dateOfEntry);
            $this->startDate=date('y-m-d', strtotime($this->startDate));
           // echo json_encode($this->startDate);
            $this->endDate=date('y-m-d', strtotime($this->endDate));
           // echo json_encode($this->endDate);

            $dbh->beginTransaction();

        $stmt = $dbh->prepare("INSERT INTO production_batch_master (BATCHNO,BATCHCODENAME,DATEOFENTRY,PRODUCTIONSTARTDATE,PRODUCTIONENDDATE,PRODUCTIONSUPERVISORID,LCHNGUSERID,LCHNGTIME,CREUSERID,CRETIME) 
              values (:batchNo,:batchCodeName,:dateOfEntry,:startDate,:endDate,:supervisor,:lchngUserId,now(),:creUserId,now())");

        $stmt->bindParam(':batchNo', $this->batchNo, PDO::PARAM_STR,10);
        $stmt->bindParam(':batchCodeName', $this->batchCodeName, PDO::PARAM_STR, 10);
        $stmt->bindParam(':dateOfEntry', $this->dateOfEntry, PDO::PARAM_STR, 10);
        $stmt->bindParam(':startDate', $this->startDate, PDO::PARAM_STR, 10);
        $stmt->bindParam(':endDate', $this->endDate, PDO::PARAM_STR, 10);
        $stmt->bindParam(':supervisor', $this->supervisor, PDO::PARAM_STR, 10);
        
        $stmt->bindParam(':lchngUserId', $userId, PDO::PARAM_STR, 10);
        $stmt->bindParam(':creUserId', $userId, PDO::PARAM_STR, 10);
            HicreteLogger::logInfo("Query:".json_encode($stmt));
            HicreteLogger::logInfo("Data:\n".json_encode($this));
            if($stmt->execute())
            {
                    HicreteLogger::logInfo("Insert to production batch master is successful");
                   $lastId = $dbh->lastInsertId();

                    $this->prodMasterId=$lastId;
                
                for ($i=0; $i < sizeof($this->rawMaterial); $i++) 
                {
                    $stmt2 = $dbh->prepare("select count(1) as count from inventory where materialid=:material");
                    $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                    $stmt2 ->execute();
                    $result=$stmt2->fetch(PDO::FETCH_ASSOC);
                    $count=$result['count'];
                    HicreteLogger::logInfo("count of materials: ".$count);
                    if($count == 1)
                    {
                        $stmt2= $dbh->prepare("UPDATE inventory SET totalquantity=totalquantity- :quantity where materialid=:material");
                        $stmt2->bindParam(':quantity', $this->rawMaterial[$i]->quantity, PDO::PARAM_STR,10);
                        $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                        HicreteLogger::logInfo("query: \n".json_encode($stmt2));
                        //HicreteLogger::logInfo("check execution value: ".$stmt2->execute());
                        $valcheck = $stmt2->execute();
                        HicreteLogger::logInfo("Value check after execution".$valcheck);
                        /*if($valcheck == 1){                        {
                            HicreteLogger::logInfo("Inventory Entry Updated successfully for: ".$this->rawMaterial[$i]);
                        }
                        else
                        {
                            HicreteLogger::logInfo("Inventory Entry Updation failed for: ".$this->rawMaterial[$i]);
                            return 0;
                        }*/
                    }
                    else
                    {
                        HicreteLogger::logError("Error while checking material");
                        $dbh->rollBack();
                        return 0;
                    }

                    HicreteLogger::logInfo("Inserting data to production_raw_materials_details");
                $stmt1 = $dbh->prepare("INSERT INTO production_raw_materials_details (productionbatchmasterid,materialid,quantity,lchnguserid,lchngtime,creuserid,cretime)
                  values (:prodMasterId,:material,:quantity,:lchnguserid,now(),:creuserid,now())");

                $stmt1->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR,10);
                $stmt1->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                $stmt1->bindParam(':quantity', $this->rawMaterial[$i]->quantity, PDO::PARAM_STR,10);
                $stmt1->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmt1->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

                    HicreteLogger::logDebug("Query : ".json_encode($stmt1));
                if(!$stmt1->execute())
                    break;
                }
                if ($i!=(sizeof($this->rawMaterial)))
                {
                    HicreteLogger::logInfo("One of the entry to Production_raw_material_details failed");
                    $dbh->rollBack();
                     return 0;   
                }
                else
                {
                    HicreteLogger::logInfo("Data inserted successfully");
                    $dbh->commit();
                     return 1;   
                }
                //Raw maaterial end
                
            }
            else
            {
                HicreteLogger::logInfo("Failure while adding data to production batch master");
                $dbh->rollBack();
                return 0;
            }
        }catch(Exception $e)
        {
            HicreteLogger::logFatal("Exception occured: ".$e->getMessage());

        }

            
    }//addToProdBatchMaster

   


    public function addToProducedGood($dbh,$userId)
    {

             try{
                 $this->dateOfEntryAftrProd=date('y-m-d', strtotime($this->dateOfEntryAftrProd));
                 $this->dateOfEntry=date('y-m-d', strtotime($this->dateOfEntry));
                 //echo json_encode($this->dateOfEntry);
                 $this->startDate=date('y-m-d', strtotime($this->startDate));
                 // echo json_encode($this->startDate);
                 $this->endDate=date('y-m-d', strtotime($this->endDate));
                 // echo json_encode($this->endDate);

                 $dbh->beginTransaction();


                 HicreteLogger::logInfo("Adding data to produced good");
                 $stmt = $dbh->prepare("INSERT INTO produced_good (productionbatchmasterid,materialproducedid,QUANTITY,PACKAGEDUNITS,LCHNGUSERID,LCHNGTIME,CREUSERID,CRETIME)
                                          values (:productionbatchmasterid,:prodcdMaterial,:quantityProdMat,:pckgdUnits,:lchngUserId,now(),:creUserId,now())");

                 $stmt->bindParam(':productionbatchmasterid', $this->prodMasterId, PDO::PARAM_STR,10);
                 //echo ("This is the produced material".$this->prodcdMaterial);
                 $stmt->bindParam(':prodcdMaterial', $this->prodcdMaterial, PDO::PARAM_STR, 10);
                 $stmt->bindParam(':quantityProdMat', $this->quantityProdMat, PDO::PARAM_STR, 10);
                 $stmt->bindParam(':pckgdUnits', $this->pckgdUnits, PDO::PARAM_STR, 10);


                 $stmt->bindParam(':lchngUserId', $userId, PDO::PARAM_STR, 10);
                 $stmt->bindParam(':creUserId', $userId, PDO::PARAM_STR, 10);


                 HicreteLogger::logDebug("Query:".json_encode($stmt));
                 HicreteLogger::logDebug("Data:\n".json_encode($this));

                 if($stmt->execute())
                 {
                     HicreteLogger::logInfo("Insertion into produced good is successful");
                     HicreteLogger::logInfo("Inserting in inhouse inward entry");
                     $lastId = $dbh->lastInsertId();

                     $this->producedGoodId=$lastId;

                     $stmt = $dbh->prepare("INSERT INTO inhouse_inward_entry (productionbatchmasterid,producedgoodid,warehouseid,companyid,dateofentry,supervisorid,LCHNGUSERID,LCHNGTIME,CREUSERID,CRETIME)
                                                          values (:productionbatchmasterid,:producedgoodid,:warehouseid,:companyid,:dateOfEntry,:supervisorid,:lchngUserId,now(),:creUserId,now())");
                     //echo $this->prodMasterId;
                     $stmt->bindParam(':productionbatchmasterid', $this->prodMasterId, PDO::PARAM_STR,10);
                     $stmt->bindParam(':producedgoodid', $this->producedGoodId, PDO::PARAM_STR,10);
                     //echo "\n Before binding".$this->wareHouse."\n";
                     $stmt->bindParam(':warehouseid', $this->wareHouse, PDO::PARAM_STR, 10);
                     $stmt->bindParam(':companyid', $this->company, PDO::PARAM_STR, 10);
                     $stmt->bindParam(':dateOfEntry', $this->dateOfEntryAftrProd, PDO::PARAM_STR, 10);
                     $stmt->bindParam(':supervisorid', $this->supervisor, PDO::PARAM_STR, 10);


                     $stmt->bindParam(':lchngUserId', $userId, PDO::PARAM_STR, 10);
                     $stmt->bindParam(':creUserId', $userId, PDO::PARAM_STR, 10);

                     //$stmt->execute();

                     HicreteLogger::logDebug("Query:".json_encode($stmt));
                     HicreteLogger::logDebug("Data:\n".json_encode($this));
                     if($stmt->execute())
                     {
                         HicreteLogger::logInfo("Insertion into inhouse_inward_entry is successful");
                         $lastId = $dbh->lastInsertId();
                         //Fetch master id from product master table
                         $this->inhouseInwardId=$lastId;

                         if ($this->tranReq) {
                             HicreteLogger::logInfo("Inserting into inhouse transport");
                             if($this->addToInhouseTransport($dbh,$userId)){
                                 HicreteLogger::logInfo("Insertion to inhouse transport successful");
                             }
                             else{
                                 HicreteLogger::logError("Error while Insertion to inhouse transport ");
                                 $dbh->rollBack();
                                 return 0;
                             }
                             # code...
                         }
                         HicreteLogger::logInfo("Inserting into inventory");
                         if($this->insertToInventory($dbh,$userId))
                         {
                             HicreteLogger::logInfo("Insertion to inventory successful");
                             $dbh->commit();
                             return 1;
                         }
                         else {
                             HicreteLogger::logError("Error while updating inventory");
                             $dbh->rollBack();
                             return 0;
                         }
                         $dbh->commit();
                         return 1;

                     }
                     else
                     {
                         HicreteLogger::logError("Error while Insertion into inhouse_inward_entry");
                         $dbh->rollBack();
                         return 0;
                     }



                     //Inhouse Inward End
                     $dbh->commit();
                     return 1;
                 }
                 else
                 {
                     HicreteLogger::logError("Error while Insertion into produced good");
                     $dbh->rollBack();
                     return 0;
                 }




        }catch(Exception $e)
        {
            HicreteLogger::logFatal("Exception occured: \n".$e->getMessage());

        }

        
    }//addToProducedGood
  
    public function insertToInventory($dbh,$userId)
    {

         $stmt2 = $dbh->prepare("select count(1) as count from inventory where materialid=:prodcdMaterial");
            $stmt2->bindParam(':prodcdMaterial', $this->prodcdMaterial, PDO::PARAM_STR, 10);
                                 
                                                    //$stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);

            if($stmt2 ->execute()) {

                $result = $stmt2->fetch(PDO::FETCH_ASSOC);
                $count = $result['count'];
                if ($count == 1) {

                    $stmt2 = $dbh->prepare("UPDATE inventory set totalquantity=totalquantity + :quantityProdMat where materialid=:prodcdMaterial");
                    $stmt2->bindParam(':quantityProdMat', $this->quantityProdMat, PDO::PARAM_STR, 10);
                    $stmt2->bindParam(':prodcdMaterial', $this->prodcdMaterial, PDO::PARAM_STR, 10);

                    HicreteLogger::logDebug("query: ".json_encode($stmt2));
                    if (!$stmt2->execute()) {
                        HicreteLogger::logError("Updation to inventory unsuccessful");
                        return 0;
                    } else {
                        HicreteLogger::logInfo("Updation to inventory successful");
                        return 1;
                    }

                } else {

                    //echo "inserting \n";
                    $stmt2 = $dbh->prepare("INSERT INTO inventory (materialid,warehouseid,companyid,totalquantity)
                                                            values(:materialid,:warehouseid,:companyid,:totalquantity)");

                    $stmt2->bindParam(':materialid', $this->prodcdMaterial, PDO::PARAM_STR, 10);
                    $stmt2->bindParam(':warehouseid', $this->wareHouse, PDO::PARAM_STR, 10);
                    $stmt2->bindParam(':companyid', $this->company, PDO::PARAM_STR, 10);
                    $stmt2->bindParam(':totalquantity', $this->quantityProdMat, PDO::PARAM_STR, 10);
                    HicreteLogger::logDebug("Query: \n".json_encode($stmt2));
                    if ($stmt2->execute()) {
                        HicreteLogger::logInfo("Insertion to inventory successful");
                        return 1;
                    } else {
                        HicreteLogger::logError("Insertion to inventory unsuccessful");
                        return 0;
                    }

                }


            }
    }



  


    public function addToInhouseTransport($dbh,$userId)
    {

             try{

                 //$dbh->beginTransaction();
        $stmt = $dbh->prepare("INSERT INTO inhouse_transportation_details (inhouseinwardid,transportationmode,vehicleno,drivername,transportagency,cost,LCHNGUSERID,LCHNGTIME,CREUSERID,CRETIME) 
              values (:inhouseinwardid,:transportationmode,:vehicleno,:drivername,:transportagency,:cost,:lchngUserId,now(),:creUserId,now())");



        $stmt->bindParam(':inhouseinwardid', $this->inhouseInwardId, PDO::PARAM_STR,10);
        $stmt->bindParam(':transportationmode', $this->modeOfTransport, PDO::PARAM_STR, 10);
        $stmt->bindParam(':vehicleno', $this->vehicleNo, PDO::PARAM_STR, 10);
        $stmt->bindParam(':drivername', $this->driver, PDO::PARAM_STR, 10);
        $stmt->bindParam(':transportagency', $this->TranspAgency, PDO::PARAM_STR, 10);
        $stmt->bindParam(':cost', $this->cost, PDO::PARAM_STR, 10);
        
        $stmt->bindParam(':lchngUserId', $userId, PDO::PARAM_STR, 10);
        $stmt->bindParam(':creUserId', $userId, PDO::PARAM_STR, 10);


                 HicreteLogger::logDebug("Query: \n".json_encode($stmt));
            if($stmt->execute())
            {
                HicreteLogger::logInfo("Insert to inhouse_transport_details successful");
                return 1;
            }
            else
            {
                HicreteLogger::logError("Insert to inhouse_transport_details unsuccessful");

                return 0;
            }
        }catch(Exception $e)
        {
            HicreteLogger::logFatal("Exception occured: \n".$e->getMessage());

        }

        
    }//addToInhouseTransport


    public function modifyPartDetails($dbh,$userId)
    {
             $dbh->beginTransaction();
             $stmt = $dbh->prepare("UPDATE production_batch_master set BATCHCODENAME=:batchCodeName,PRODUCTIONSTARTDATE=:prodStartDate,PRODUCTIONENDDATE=:prodEndDate,PRODUCTIONSUPERVISORID=:supervisorId,LCHNGUSERID=:lchgUserId,LCHNGTIME=now() where productionbatchmasterid=:prodMasterId  ");

                
                $stmt->bindParam(':batchCodeName', $this->batchCodeName, PDO::PARAM_STR, 10);
                $stmt->bindParam(':prodStartDate', $this->startDate, PDO::PARAM_STR, 10);
                $stmt->bindParam(':prodEndDate', $this->endDate, PDO::PARAM_STR, 10);
                $stmt->bindParam(':supervisorId', $this->supervisor, PDO::PARAM_STR, 10);
                $stmt->bindParam(':lchgUserId', $userId, PDO::PARAM_STR, 10);
                
                $stmt->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR, 10);
                if($stmt->execute())
                {
                                    

                                    for ($i=0; $i < sizeof($this->rawMaterial); $i++) 
                                    {
                                        $qtyChange=$this->rawMaterial[$i]->quantity - $this->rawMaterial[$i]->prevQuantity;
                                        $stmt2 = $dbh->prepare("select count(1) as count from inventory where materialid=:material");
                                        $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                        $stmt2 ->execute();
                                        $result=$stmt2->fetch(PDO::FETCH_ASSOC);
                                        $count=$result['count'];
                                        //echo "count:".$count."\n";
                                        if($count == 1)
                                        {
                                            $stmt2= $dbh->prepare("UPDATE inventory SET totalquantity=totalquantity + :quantity where materialid=:material");
                                            $stmt2->bindParam(':quantity', $qtyChange, PDO::PARAM_STR,10);
                                            $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                            $stmt2->execute();
                                        }
                                        else
                                        {
                                            //echo "not done yar";
                                            return 0;
                                        }

                                        $stmt1= $dbh->prepare("select count(1) as count from production_raw_materials_details where materialid=:materailId and productionbatchmasterid=:prodMasterId");
                                        $stmt1->bindParam(':materailId', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                        $stmt1->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR, 10);
                                        $stmt1->execute();
                                        //echo("raw mat: ".$this->rawMaterial[$i]->material."\n");
                                        $result=$stmt1->fetch(PDO::FETCH_ASSOC);
                                        //echo (json_encode($count));
                                        $count=$result['count'];
                                        //echo ($count);
                                        //echo (json_encode($stmt1->fetch(PDO::FETCH_ASSOC)));

                                        if($count!=0)
                                        {
                                                //echo "m here";
                                                $stmt1=$dbh->prepare("UPDATE  production_raw_materials_details SET materialid=:materialId,quantity=:quantity,lchnguserid=:lchngUserId,lchngtime=now() where productionbatchmasterid=:prodMasterId AND materialid=:materialId");
                                               
                                                $stmt1->bindParam(':materialId', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':quantity', $this->rawMaterial[$i]->quantity, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':lchngUserId', $userId, PDO::PARAM_STR, 10);
                                                $stmt1->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR,10);
                                                
                                               //echo(json_encode( $this->rawMaterial[$i]->material)) ;

                                               //echo("while update: ".$stmt1->execute()."\n");
                                                if(!$stmt1->execute())
                                                    break;
                                            

                                        }
                                        else
                                        {
                                                $stmt2 = $dbh->prepare("select count(1) as count from inventory where materialid=:material");
                                                $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                                $stmt2 ->execute();
                                                $result=$stmt2->fetch(PDO::FETCH_ASSOC);
                                                $count=$result['count'];
                                                //echo "count:".$count."\n";
                                                if($count == 1)
                                                {
                                                    $stmt2= $dbh->prepare("UPDATE inventory SET totalquantity=totalquantity- :quantity where materialid=:material");
                                                    $stmt2->bindParam(':quantity', $this->rawMaterial[$i]->quantity, PDO::PARAM_STR,10);
                                                    $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                                    $stmt2->execute();
                                                }
                                                else
                                                {
                                                    //echo "not done yar";
                                                    $dbh->rollBack();
                                                    return 0;
                                                }


                                                $stmt1 = $dbh->prepare("INSERT INTO production_raw_materials_details (productionbatchmasterid,materialid,quantity,lchnguserid,lchngtime,creuserid,cretime)
                                                  values (:prodMasterId,:material,:quantity,:lchnguserid,now(),:creuserid,now())");
                                                
                                                $stmt1->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':quantity', $this->rawMaterial[$i]->quantity, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                                                $stmt1->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                                                //echo("while insert:".$stmt1->execute());
                                                //echo("while insert".$stmt1->execute());
                                                if(!$stmt1->execute())
                                                    break;
                                        }

                                        //$count=0;
                                    }
                                   
                                    if ($i!=(sizeof($this->rawMaterial)))
                                    {
                                         $dbh->rollBack();
                                            return 0;
                                    }
                                    else{
                                        $dbh->commit();
                                        return 1;
                                    }

                } 
                else{
                    $dbh->commit();
                    return 1;                   
                }


    }
    public function modifyDetails($dbh,$userId)
    {
        try{
                 $dbh->beginTransaction();
                //BATCHNO,BATCHCODENAME,DATEOFENTRY,PRODUCTIONSTARTDATE,PRODUCTIONENDDATE,PRODUCTIONSUPERVISORID,LCHNGUSERID,LCHNGTIME,CREUSERID,CRETIME
                $stmt = $dbh->prepare("UPDATE production_batch_master set BATCHCODENAME=:batchCodeName,PRODUCTIONSTARTDATE=:prodStartDate,PRODUCTIONENDDATE=:prodEndDate,PRODUCTIONSUPERVISORID=:supervisorId,LCHNGUSERID=:lchgUserId,LCHNGTIME=now() where productionbatchmasterid=:prodMasterId  ");

                
                $stmt->bindParam(':batchCodeName', $this->batchCodeName, PDO::PARAM_STR, 10);
                $stmt->bindParam(':prodStartDate', $this->startDate, PDO::PARAM_STR, 10);
                $stmt->bindParam(':prodEndDate', $this->endDate, PDO::PARAM_STR, 10);
                $stmt->bindParam(':supervisorId', $this->supervisor, PDO::PARAM_STR, 10);
                $stmt->bindParam(':lchgUserId', $userId, PDO::PARAM_STR, 10);
                
                $stmt->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR, 10);
                if($stmt->execute())
                {
                                    //echo "First is done";
                                    for ($i=0; $i < sizeof($this->rawMaterial); $i++) 
                                    {
                                        $qtyChange=$this->rawMaterial[$i]->quantity - $this->rawMaterial[$i]->prevQuantity;

                                        $stmt2 = $dbh->prepare("select count(1) as count from inventory where materialid=:material");
                                        $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                        $stmt2 ->execute();
                                        $result=$stmt2->fetch(PDO::FETCH_ASSOC);
                                        $count=$result['count'];
                                        //echo "count:".$count."\n";
                                        if($count == 1)
                                        {
                                            $stmt2= $dbh->prepare("UPDATE inventory SET totalquantity=totalquantity + :quantity where materialid=:material");
                                            $stmt2->bindParam(':quantity', $qtyChange, PDO::PARAM_STR,10);
                                            $stmt2->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                            $stmt2->execute();
                                        }
                                        else
                                        {
                                            //echo "not done yar";
                                            $dbh->rollBack();
                                            return 0;
                                        }

                                        $stmt1= $dbh->prepare("select count(1) as count from production_raw_materials_details where materialid=:materailId and productionbatchmasterid=:prodMasterId");
                                        $stmt1->bindParam(':materailId', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                        $stmt1->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR, 10);
                                        $stmt1->execute();
                                        $result=$stmt1->fetch(PDO::FETCH_ASSOC);
                                        //echo (json_encode($count));
                                        $count=$result['count'];
                                       // $count=$stmt1->rowcount();
                                        //echo "count1:".$count;
                                        if($count!=0)
                                        {

                                                $stmt1=$dbh->prepare("UPDATE  production_raw_materials_details SET materialid=:materialId,quantity=:quantity,lchnguserid=:lchngUserId,lchngtime=now() where productionbatchmasterid=:prodMasterId AND materialid=:materailId");
                                               
                                                $stmt1->bindParam(':materialId', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':quantity', $this->rawMaterial[$i]->quantity, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':lchngUserId', $userId, PDO::PARAM_STR, 10);
                                                $stmt1->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':materailId', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                                if(!$stmt1->execute())
                                                    break;
                                            

                                        }
                                        else
                                        {

                                                $stmt1 = $dbh->prepare("INSERT INTO production_raw_materials_details (productionbatchmasterid,materialid,quantity,lchnguserid,lchngtime,creuserid,cretime)
                                                  values (:prodMasterId,:material,:quantity,:lchnguserid,now(),:creuserid,now())");
                                                
                                                $stmt1->bindParam(':prodMasterId', $this->prodMasterId, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':material', $this->rawMaterial[$i]->material, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':quantity', $this->rawMaterial[$i]->quantity, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                                                $stmt1->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                                                if(!$stmt1->execute())
                                                    break;
                                        }


                                    }
                                    //echo "value of $i";
                                    if ($i!=(sizeof($this->rawMaterial)))
                                    {
                                         $dbh->rollBack();
                                            return 0;
                                    }
                                    else
                                    {
                                         $stmt1=$dbh->prepare("UPDATE produced_good set materialproducedid=:materialproducedid,quantity=:quantity,packagedunits=:packagedunits, lchnguserid=:lchnguserid,lchngtime=now() where productionbatchmasterid=:productionbatchmasterid");
                                         $stmt1->bindParam(':materialproducedid', $this->prodcdMaterial, PDO::PARAM_STR,10);
                                         $stmt1->bindParam(':quantity', $this->quantityProdMat, PDO::PARAM_STR,10); 
                                         $stmt1->bindParam(':packagedunits', $this->pckgdUnits, PDO::PARAM_STR,10); 
                                         $stmt1->bindParam(':lchnguserid', $userId, PDO::PARAM_STR,10); 
               
                                         $stmt1->bindParam(':productionbatchmasterid', $this->prodMasterId, PDO::PARAM_STR,10); 
                                         if($stmt1->execute())
                                         {
                                                //echo "\n produced good is done";
                                             echo $this->wareHouse."\n";
                                                $stmt1=$dbh->prepare("UPDATE inhouse_inward_entry set warehouseid=:warehouseid,companyid=:companyid,dateofentry=:dateofentry,supervisorid=:supervisorid,lchnguserid=:lchnguserid,lchngtime=now() where productionbatchmasterid=:productionbatchmasterid"); 
                                                $stmt1->bindParam(':warehouseid', $this->wareHouse, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':companyid', $this->company, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':dateofentry', $this->dateOfEntryAftrProd, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':supervisorid', $this->supervisor, PDO::PARAM_STR,10);
                                                $stmt1->bindParam(':lchnguserid', $userId, PDO::PARAM_STR,10);

                                                $stmt1->bindParam(':productionbatchmasterid', $this->prodMasterId, PDO::PARAM_STR,10);

                                                if($stmt1->execute())
                                                {
                                                        //echo "\n in house inward is done";
                                                        if ($this->tranReq) 
                                                        {
                                                            $stmt1= $dbh->prepare("select count(1) from inhouse_transportation_details where inhouseinwardid=:inhouseinwardid");
                                                            $stmt1->bindParam(':inhouseinwardid', $this->inhouseInwardId, PDO::PARAM_STR,10);
                                                            $stmt1->execute();
                                                            $count=$stmt1->rowcount();

                                                            if($count !=0)
                                                            {
                                                                $stmt1=$dbh->prepare("UPDATE  inhouse_transportation_details SET transportationmode=:transportationmode,vehicleno=:vehicleno,drivername=:drivername,transportagency=:transportagency,cost=:cost,lchnguserid=:lchngUserId,lchngtime=now() where inhouseinwardid=:inhouseinwardid");
                                                                $stmt1->bindParam(':transportationmode', $this->modeOfTransport, PDO::PARAM_STR, 10);
                                                                $stmt1->bindParam(':vehicleno', $this->vehicleNo, PDO::PARAM_STR, 10);
                                                                $stmt1->bindParam(':drivername', $this->driver, PDO::PARAM_STR, 10);
                                                                $stmt1->bindParam(':transportagency', $this->TranspAgency, PDO::PARAM_STR, 10);
                                                                $stmt1->bindParam(':cost', $this->cost, PDO::PARAM_STR, 10);    
                                                                $stmt1->bindParam(':lchngUserId', $userId, PDO::PARAM_STR,10);
                                                                $stmt1->bindParam(':inhouseinwardid', $this->inhouseInwardId, PDO::PARAM_STR,10);

                                                                if($stmt1->execute())
                                                                {
                                                                    $dbh->commit();
                                                                    return 1;
                                                                }
                                                                else
                                                                {
                                                                    $dbh->rollBack();
                                                                    return 0;
                                                                }    

                                                            }
                                                            else
                                                            {
                                                                if($this->addToInhouseTransport($dbh,$userId))
                                                                 {
                                                                    $dbh->commit();
                                                                        return 1;
                                                                    }
                                                                else{
                                                                    $dbh->rollBack();
                                                                     return 0; 

                                                                }
                                                                       
                                                            }


                                                        }
                                                    return 1;
                                                }
                                                else
                                                {
                                                    $dbh->rollBack();
                                                    return 0;
                                                }

                                         }
                                         else
                                         {
                                            $dbh->rollBack();
                                            return 0;
                                         }  
                                      
                                      
                                    }





                }
                else
                {
                    $dbh->commit();
                    return 1;

                }



        }
        catch(Exception $e)
        {


        }




    }







}//for class

?>