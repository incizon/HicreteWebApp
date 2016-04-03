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
                    echo"0";
            }else{
                        echo "1";
            }
        }


    }

    public static function createCostCenter($data,$segmentData,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();
//        $costCenterId=uniqid();
//        $stmt = $conn->prepare("INSERT INTO `cost_center_master`(`costcenterid`,`projectid`, `costcentername`, `createdby`, `creationdate`, `lastmodifieddate`, `lastmodifiedby`) VALUES (:costCenterId,:projectId,:costCenterName,:createdBy,now(),now(),:lastModifiedBy)");
//            $stmt->bindParam(':projectId', $data->projectId, PDO::PARAM_STR);
//            $stmt->bindParam(':costCenterName', $data->costCenterName, PDO::PARAM_STR);
//            $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
//            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
//            $stmt->bindParam(':costCenterId', $costCenterId, PDO::PARAM_STR);
            $rollback=false;
//            if($stmt->execute()){
                $cnt1=0;

            foreach ($segmentData as $segment) {
                $bufgetId=uniqid();
                $stmt = $conn->prepare("INSERT INTO `budget_details`(`budgetdetailsid`,`projectid`, `budgetsegmentid`, `allocatedbudget`, `alertlevel`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:budgetId,:projectId,:segmentId,:allocatedBudget,:alertLevel,:createdBy,now(),now(),:lastModifiedBy)");

                $stmt->bindParam(':budgetId', $bufgetId, PDO::PARAM_STR);

                $stmt->bindParam(':projectId', $data->projectId, PDO::PARAM_STR);
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

//        }else{
//            echo "at aloy";
//            return;
//        }
        
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
        $stmt = $conn->prepare("INSERT INTO `expense_details`(`expensedetailsid`, `projectid`, `budgetsegmentid`, `amount`, `description`, `creadtedby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
            VALUES (:expensedetailsid,:projectid,:budgetsegmentid,:amount,:description,:createdBy,now(),now(),:lastModifiedBy)");
            $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
            $stmt->bindParam(':projectid', $data->project, PDO::PARAM_STR);
            $stmt->bindParam(':budgetsegmentid', $data->segmentName, PDO::PARAM_STR);
            $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
            $stmt->bindParam(':description', $data->desc, PDO::PARAM_STR);
            $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
            $rollback=false;
        if($stmt->execute()){
            
            if($data->isBillApplicable){
                $unapprovedExpenseBillsId=uniqid();
                $date = new DateTime($billData->dateOfBill);
                $bilDate = $date->format('Y-m-d');

                $stmt = $conn->prepare("INSERT INTO `unapproved_expense_bills`(`billid`, `expensedetailsid`, `billno`, `billissueingentity`, `amount`, `dateofbill`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:billid,:expensedetailsid,:billno,:billissueingentity,:amount,:dateofbill,:createdBy,now(),now(),:lastModifiedBy)");
                $stmt->bindParam(':billid', $unapprovedExpenseBillsId, PDO::PARAM_STR);
                $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
                $stmt->bindParam(':billno', $billData->billNo, PDO::PARAM_STR);
                $stmt->bindParam(':billissueingentity', $billData->Issueing, PDO::PARAM_INT);
                $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
                $stmt->bindParam(':dateofbill', $bilDate, PDO::PARAM_STR);
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
        $stmt = $conn->prepare("INSERT INTO `material_expense_details`(`materialexpensedetailsid`, `projectid`, `materialid`, `amount`, `description`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
        VALUES (:expensedetailsid,:projectid,:materialid,:amount,:description,:createdBy,now(),now(),:lastModifiedBy)");
        $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
        $stmt->bindParam(':projectid', $data->project, PDO::PARAM_STR);
        $stmt->bindParam(':materialid', $data->material, PDO::PARAM_STR);
        $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
        $stmt->bindParam(':description', $data->desc, PDO::PARAM_STR);
        $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
        $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
        $rollback=false;

        if($stmt->execute()){

            if($data->isBillApplicable){
                $billId=uniqid();
//                echo "Added material expense";
                $date = new DateTime($billData->dateOfBill);
                $bilDate = $date->format('Y-m-d');
                //Add billing  info here
                $stmt = $conn->prepare("INSERT INTO `material_expense_bills`(`billid`, `materialexpensedetailsid`, `billno`, `billissueingentity`, `amount`, `dateofbill`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:billid,:expensedetailsid,:billno,:billissueingentity,:amount,:dateofbill,:createdBy,now(),now(),:lastModifiedBy)");
                $stmt->bindParam(':billid', $billId, PDO::PARAM_STR);
                $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
                $stmt->bindParam(':billno', $billData->billNo, PDO::PARAM_STR);
                $stmt->bindParam(':billissueingentity', $billData->Issueing, PDO::PARAM_INT);
                $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
                $stmt->bindParam(':dateofbill', $bilDate, PDO::PARAM_STR);
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
            echo "fail first";
            return;
        }

//        if($rollback){
//            echo "1";
//        }else{
//            echo "0";
//        }

    }
    public static function getBillApproval(){


        $db = Database::getInstance();
        $conn = $db->getConnection();

        $json_response=array();

        try{
            $stmt1=$conn->prepare("select expense_details.`expensedetailsid`,expense_details.`budgetsegmentid`,expense_details.projectid,expense_details.description,unapproved_expense_bills.amount,unapproved_expense_bills.createdby FROM expense_details JOIN unapproved_expense_bills ON expense_details.expensedetailsid=unapproved_expense_bills.`expensedetailsid` WHERE unapproved_expense_bills.bill_status='pending' ");
            $stmt1->execute();

            while($result=$stmt1->fetch(PDO::FETCH_ASSOC)){

                    $result_array=array();

                    $projectId=$result['projectid'];

                    $result_array['expensedetailsid']=$result['expensedetailsid'];

                    $result_array['description']=$result['description'];
                    $result_array['amount']=$result['amount'];
                    $result_array['created_by']=$result['createdby'];

                    $stmt2=$conn->prepare("SELECT projectName from project_master WHERE projectId=:projectId");
                    $stmt2->bindParam(':projectId',$projectId);
                    $stmt2->execute();
                    $result2=$stmt2->fetch(PDO::FETCH_ASSOC);
                    $result_array['projectName']=$result2['projectName'];

                    array_push($json_response,$result_array);
            }

            echo json_encode($json_response);
        }
        catch(Exception $e){
            echo "Exception Occur while getting bill approval";
        }

    }
    public static function getBillDetails($data){

        $db = Database::getInstance();
        $conn = $db->getConnection();

        $expenseDetailsId=$data->expenseDetailsId;

        $result_array=array();

        try{

            $stmt1=$conn->prepare("SELECT `projectid`,`budgetsegmentid` FROM expense_details WHERE expensedetailsid=:expenseDetailsId");
            $stmt1->bindParam(':expenseDetailsId',$expenseDetailsId);
            $stmt1->execute();
            $result1=$stmt1->fetch(PDO::FETCH_ASSOC);
            $projectId=$result1['projectid'];
            $budgetSegmentId=$result1['budgetsegmentid'];

            $stmt2=$conn->prepare("SELECT projectName FROM project_master WHERE ProjectId=:projectId");
            $stmt2->bindParam(':projectId',$projectId);
            $stmt2->execute();
            $result2=$stmt2->fetch(PDO::FETCH_ASSOC);
            $result_array['projectName']=$result2['projectName'];

            $stmt3=$conn->prepare("SELECT segmentname FROM budget_segment WHERE budgetsegmentid=:budgetSegmentId");
            $stmt3->bindParam(':budgetSegmentId',$budgetSegmentId);
            $stmt3->execute();
            $result3=$stmt3->fetch(PDO::FETCH_ASSOC);
            $result_array['budgetSegmentName']=$result3['segmentname'];

            $stmt4=$conn->prepare("select `billid`,`billno`,`billissueingentity`,`amount`,`dateofbill`from unapproved_expense_bills WHERE expensedetailsid=:expenseDetailsId");
            $stmt4->bindParam(':expenseDetailsId',$expenseDetailsId);
            $stmt4->execute();
            $result4=$stmt4->fetch(PDO::FETCH_ASSOC);
            $result_array['billid']=$result4['billid'];
            $result_array['billNo']=$result4['billno'];
            $result_array['billissueingentity']=$result4['billissueingentity'];
            $result_array['amount']=$result4['amount'];
            $result_array['dateofbill']=$result4['dateofbill'];

            if(sizeof($result_array)>0){

                echo json_encode($result_array);
            }
            else{

                echo "Bill Details Not available";
            }
        }
        catch(Exception $e){

            echo "Exception occur while getting bill details";
        }
    }

    public static function updateBillStatus($data,$userId){

        $db = Database::getInstance();
        $conn = $db->getConnection();

        $billId=$data->billId;
        $status=$data->status;

        try {
            $stmt = $conn->prepare("UPDATE unapproved_expense_bills SET
                               lastmodificationdate=NOW(),
                               lastmodifiedby=:modifiedBy,
                               bill_status=:status
                               WHERE
                               billid=:billId
                            ");

            $stmt->bindParam(':modifiedBy', $userId);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':billId', $billId);

            if($stmt->execute()){

                echo json_encode("Updated successfully");
            }

        }
        catch(Exception $e){

            echo json_encode("Could not update status of Bill Approval"+$e->getMessage());
        }
    }
}

?>