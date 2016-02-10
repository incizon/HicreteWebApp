<?php
require_once 'database/Database.php';
class Expense
{
    

    public static function addSegment($data,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();
     
        foreach ($data->segments as $segment) {
            $uniqid=uniqid();
            $stmt = $conn->prepare("INSERT INTO `budget_segment`(`budgetsegmentid`,`segmentname`, `createdby`, `creationdate`, `lastmodifieddate`, `lastmodifiedby`) 
                VALUES (:segmentId,:segmentName,:createdBy,now(),now(),:lastModifiedBy)");
            $stmt->bindParam(':segmentName', $segment->name, PDO::PARAM_STR);
            $stmt->bindParam(':segmentId',$uniqid , PDO::PARAM_STR);
            $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
            if($stmt->execute()){
                if($segment->name==$data->materialSegment){
                    $uniqid=uniqid();
                     $stmt = $conn->prepare("INSERT INTO `material_segment`(`materialsegmentid`,`segmentname`) VALUES (:uniqid,:segmentName)");
                     $stmt->bindParam(':uniqid', $uniqid, PDO::PARAM_STR);
                     $stmt->bindParam(':segmentName', $segment->name, PDO::PARAM_STR);
                     $stmt->execute();
                             echo "0";
                }
            }else{
                        echo "1";
            }
        }


    }

    public static function createCostCenter($data,$segmentData,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $costCenterId=uniqid(); 
        $stmt = $conn->prepare("INSERT INTO `cost_center_master`(`costcenterid`,`projectid`, `costcentername`, `createdby`, `creationdate`, `lastmodifieddate`, `lastmodifiedby`) VALUES (:costCenterId,:projectId,:costCenterName,:createdBy,now(),now(),:lastModifiedBy)");
            $stmt->bindParam(':projectId', $data->projectId, PDO::PARAM_STR);
            $stmt->bindParam(':costCenterName', $data->costCenterName, PDO::PARAM_STR);
            $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':costCenterId', $costCenterId, PDO::PARAM_STR);
            $rollback=false;
            if($stmt->execute()){
                $cnt1=0;
            foreach ($segmentData as $segment) {
                $bufgetId=uniqid();
                $stmt = $conn->prepare("INSERT INTO `budget_details`(`budgetdetailsid`,`costcenterid`, `budgetsegmentid`, `allocatedbudget`, `alertlevel`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`) 
                    VALUES (:budgetId,:costCenterId,:segmentId,:allocatedBudget,:alertLevel,:createdBy,now(),now(),:lastModifiedBy)");
                $stmt->bindParam(':budgetId', $bufgetId, PDO::PARAM_STR);

                $stmt->bindParam(':costCenterId', $costCenterId, PDO::PARAM_STR);
                $stmt->bindParam(':segmentId', $segment->id, PDO::PARAM_STR);
                $stmt->bindParam(':allocatedBudget', $segment->allocatedBudget, PDO::PARAM_INT);
                $stmt->bindParam(':alertLevel', $segment->alertLevel, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);

                if(!$stmt->execute()){
                    $rollback=true;
                }
                $cnt1++;

            }

        }else{
            echo "at aloy";
            return;
        }    
        
        if($rollback){
            echo "1";
        }else{
            echo "0";
         }   

    }

    public static function addOtherExpense($data,$billData,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $expenseDetailsId=uniqid(); 
        $budget='5691e819829c3';
        $stmt = $conn->prepare("INSERT INTO `expense_details`(`expensedetailsid`, `costcenterid`, `budgetsegmentid`, `amount`, `description`, `creadtedby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
            VALUES (:expensedetailsid,:costcenterid,:budgetsegmentid,:amount,:description,:createdBy,now(),now(),:lastModifiedBy)");
            $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
            $stmt->bindParam(':costcenterid', $data->costCenter, PDO::PARAM_STR);
            $stmt->bindParam(':budgetsegmentid', $data->segmentName, PDO::PARAM_STR);
            $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
            $stmt->bindParam(':description', $data->desc, PDO::PARAM_STR);
            $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
            $rollback=false;
        if($stmt->execute()){
            
            if($data->isBillApplicable){
                $unapprovedExpenseBillsId=uniqid();
                $stmt = $conn->prepare("INSERT INTO `unapproved_expense_bills`(`billid`, `expensedetailsid`, `billno`, `billissueingentity`, `amount`, `dateofbill`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:billid,:expensedetailsid,:billno,:billissueingentity,:amount,:dateofbill,:createdBy,now(),now(),:lastModifiedBy)");
                $stmt->bindParam(':billid', $unapprovedExpenseBillsId, PDO::PARAM_STR);
                $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
                $stmt->bindParam(':billno', $billData->billNo, PDO::PARAM_STR);
                $stmt->bindParam(':billissueingentity', $billData->firmName, PDO::PARAM_INT);
                $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
                $stmt->bindParam(':dateofbill', $billData->dateOfBill, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);

                if($stmt->execute()){
                     echo "0";
                }else{

                }
            }
        }else{
            $rollback=true;
            echo "1";
            return;
        }    
        
        if($rollback){
            echo "1";
        }else{
            echo "0";
         }   
    }
    public static function addMaterialExpense($data,$billData,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $expenseDetailsId=uniqid();
        $budget='56b6e4bcf125c';
        $stmt = $conn->prepare("INSERT INTO `material_expense_details`(`materialexpensedetailsid`, `costcenterid`, `materialid`, `amount`, `description`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
        VALUES (:expensedetailsid,:costcenterid,:materialid,:amount,:description,:createdBy,now(),now(),:lastModifiedBy)");
        $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
        $stmt->bindParam(':costcenterid', $data->costCenter, PDO::PARAM_STR);
        //GET SEGMENTNAME FROM BUDGET SEGMENT TABLE WITH RESPECT TO THE MATERIAL SEGMENT
//        $stmtBudgetSegment=$conn->prepare("SELECT segmentname FROM material_segment");
//        if($stmtBudgetSegment->execute()){
//            $result2 = $stmt->fetch(PDO::FETCH_ASSOC)
//              $budget= $result2['segmentname'];
//        }
//        $stmt->bindParam(':budgetsegmentid', $budget, PDO::PARAM_STR);

        $stmt->bindParam(':materialid', $data->material, PDO::PARAM_STR);
        $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
        $stmt->bindParam(':description', $data->desc, PDO::PARAM_STR);
        $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
        $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
        $rollback=false;
        if($stmt->execute()){

            if($data->isBillApplicable){
                $billId=uniqid();
                echo "Added material expense";
                //Add billing  info here
                $stmt = $conn->prepare("INSERT INTO `material_expense_bills`(`billid`, `materialexpensedetailsid`, `billno`, `billissueingentity`, `amount`, `dateofbill`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:billid,:expensedetailsid,:billno,:billissueingentity,:amount,:dateofbill,:createdBy,now(),now(),:lastModifiedBy)");
                $stmt->bindParam(':billid', $billId, PDO::PARAM_STR);
                $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
                $stmt->bindParam(':billno', $billData->billNo, PDO::PARAM_STR);
                $stmt->bindParam(':billissueingentity', $billData->firmName, PDO::PARAM_INT);
                $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
                $stmt->bindParam(':dateofbill', $billData->dateOfBill, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);

                if($stmt->execute()){
                    echo "0";
                }else{
                    echo "fail";
                }
            }
        }else{
            $rollback=true;
            echo "1";
            return;
        }

        if($rollback){
            echo "1";
        }else{
            echo "0";
        }
    }

}

?>