<?php
//require_once 'database/Database.php';
require_once ("../../php/appUtil.php");
require_once "../../php/HicreteLogger.php";

class Expense
{
    

    public static function addSegment($data,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        HicreteLogger::logInfo("Adding segment");

        $success=false;
        try {
            foreach ($data->segments as $segment) {
                $uniqid = AppUtil::generateId();
                $stmt = $conn->prepare("INSERT INTO `budget_segment`(`budgetsegmentid`,`segmentname`, `createdby`, `creationdate`, `lastmodifieddate`, `lastmodifiedby`)
                        VALUES (:segmentId,:segmentName,:createdBy,now(),now(),:lastModifiedBy)");
                $stmt->bindParam(':segmentName', $segment->name, PDO::PARAM_STR);
                $stmt->bindParam(':segmentId', $uniqid, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
                HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
                HicreteLogger::logDebug("Data: \n" . json_encode($data));
                if ($stmt->execute()) {
                    HicreteLogger::logInfo("Budget segment inserted successfully");
                    $success = true;
                } else {
                    HicreteLogger::logError("Error while inserting Budget segment");
                    $success = false;
                }
            }

            if ($success) {
                $message = "Segment added successfully..!!!";
                echo AppUtil::getReturnStatus("success", $message);
            } else {
                $message = "Could not add segment..!!!";
                echo AppUtil::getReturnStatus("failure", $message);
            }
        }catch(Exception $e)
        {
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
            $message = "Exception occured";
            echo AppUtil::getReturnStatus("failure", $message);
        }
}

    public static function createCostCenter($data,$segmentData,$costCentermaterials,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        try {
            $success = false;
            HicreteLogger::logInfo("Creating cost center");
            $conn->beginTransaction();
            foreach ($segmentData as $segment) {
                $budgetId =AppUtil::generateId();
                $stmt = $conn->prepare("INSERT INTO `budget_details`(`budgetdetailsid`,`projectid`, `budgetsegmentid`, `allocatedbudget`, `alertlevel`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:budgetId,:projectId,:segmentId,:allocatedBudget,:alertLevel,:createdBy,now(),now(),:lastModifiedBy)");

                $stmt->bindParam(':budgetId', $budgetId, PDO::PARAM_STR);

                $stmt->bindParam(':projectId', $data->projectId, PDO::PARAM_STR);
                $stmt->bindParam(':segmentId', $segment->id, PDO::PARAM_STR);
                $stmt->bindParam(':allocatedBudget', $segment->allocatedBudget, PDO::PARAM_INT);
                $stmt->bindParam(':alertLevel', $segment->alertLevel, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
                HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
                HicreteLogger::logDebug("Data: \n" . json_encode($data));
                if ($stmt->execute()) {
                    $success = true;
                } else {
                    $success = false;
                }

            }

            if($costCentermaterials!=null){
                foreach($costCentermaterials as $material){

                    $materialbudgetdetailsid=AppUtil::generateId();
                    $stmtCostCenterMaterial = $conn->prepare("INSERT INTO `material_budget_details`(`materialbudgetdetailsid`,`projectid`,`materialid` ,`allocatedbudget`, `alertlevel`, `creadtedby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:materialbudgetdetailsid,:projectId,:materialid,:allocatedBudget,:alertLevel,:creadtedby,now(),now(),:lastmodifiedby)");

                    $stmtCostCenterMaterial->bindParam(':materialbudgetdetailsid', $materialbudgetdetailsid, PDO::PARAM_STR);
                    $stmtCostCenterMaterial->bindParam(':projectId', $data->projectId, PDO::PARAM_STR);
                    $stmtCostCenterMaterial->bindParam(':materialid', $material->material, PDO::PARAM_STR);
                    $stmtCostCenterMaterial->bindParam(':allocatedBudget', $material->allocatedBudget, PDO::PARAM_INT);
                    $stmtCostCenterMaterial->bindParam(':alertLevel', $material->alertLevel, PDO::PARAM_STR);
                    $stmtCostCenterMaterial->bindParam(':creadtedby', $userId, PDO::PARAM_STR);
                    $stmtCostCenterMaterial->bindParam(':lastmodifiedby', $userId, PDO::PARAM_STR);

                    if ($stmtCostCenterMaterial->execute()) {
                        $success = true;
                    } else {
                        $success = false;
                    }
                }
            }

            if ($success) {
                $conn->commit();
                $message = "Cost Center Created successfully..!!!";
                HicreteLogger::logInfo("Cost center created  successfully");
                echo AppUtil::getReturnStatus("success", $message);
            } else {
                $conn->rollBack();
                $message = "Could not create cost center..!!!";
                HicreteLogger::logError("Error while creating cost center");
                echo AppUtil::getReturnStatus("failure", $message);
            }
        }catch(Exception $e)
        {
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
            echo AppUtil::getReturnStatus("failure", $e->getMessage());
        }
    }

    public static function addOtherExpense($data,$billData,$userId){

        $db = Database::getInstance();
        $conn = $db->getConnection();
        $expenseDetailsId=AppUtil::generateId();
        HicreteLogger::logInfo("Adding other expenses");

        try {

            $conn->beginTransaction();
            $stmt = $conn->prepare("INSERT INTO `expense_details`(`expensedetailsid`, `projectid`, `budgetsegmentid`, `amount`, `description`, `creadtedby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
            VALUES (:expensedetailsid,:projectid,:budgetsegmentid,:amount,:description,:createdBy,now(),now(),:lastModifiedBy)");

            $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
            $stmt->bindParam(':projectid', $data->project, PDO::PARAM_STR);
            $stmt->bindParam(':budgetsegmentid', $data->segmentName, PDO::PARAM_STR);
            $stmt->bindParam(':amount', $data->amount, PDO::PARAM_STR);
            $stmt->bindParam(':description', $data->desc, PDO::PARAM_STR);
            $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
            $success = false;
            HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
            HicreteLogger::logDebug("Data: \n" . json_encode($data));

            if ($stmt->execute()) {


                if ($data->isBillApplicable) {
                    $unapprovedExpenseBillsId = AppUtil::generateId();
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
                    HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
                    HicreteLogger::logDebug("Data: \n" . json_encode($data));
                    if ($stmt->execute()) {
                        $success = true;
                        $conn->commit();
                    } else {
                        $success = false;
                        HicreteLogger::logError("Error while adding to Unapproved expense bills");
                        $conn->rollBack();
                    }
                }else{
                    $success = true;
                    $conn->commit();
                }
            } else {
                $success = false;
                HicreteLogger::logError("Error while adding to Expense details");
                $conn->rollBack();
            }
        }
        catch(Exception $e){
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
            echo "Exception occur while adding other expense details";

        }
        if($success){
            $message="Other Expense Details Added successfully..!!!";
            HicreteLogger::logInfo("Other expense details added successfully");
            echo AppUtil::getReturnStatus("success", $message);
        }else{
            $message="Could not add other expense details..!!!";
            HicreteLogger::logError("Error while adding other expenses");
            echo AppUtil::getReturnStatus("failure", $message);
         }   
    }

    public static function addMaterialExpense($projectId,$materialsExpense,$userId){
        $db = Database::getInstance();
        $conn = $db->getConnection();

        HicreteLogger::logInfo("Adding Material expense");

        try {
            $conn->beginTransaction();
            foreach ($materialsExpense as $material) {
                $expenseDetailsId=AppUtil::generateId();
                $stmt = $conn->prepare("INSERT INTO `material_expense_details`(`materialexpensedetailsid`, `projectid`, `materialid`, `amount`, `description`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                                    VALUES (:expensedetailsid,:projectid,:materialid,:amount,:description,:createdBy,now(),now(),:lastModifiedBy)");
                $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
                $stmt->bindParam(':projectid', $projectId, PDO::PARAM_STR);
                $stmt->bindParam(':materialid', $material->material, PDO::PARAM_STR);
                $stmt->bindParam(':amount', $material->amount, PDO::PARAM_STR);
                $stmt->bindParam(':description', $material->description, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);

                $success = false;
                HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
                HicreteLogger::logDebug("Data: \n" . json_encode($material));
                if ($stmt->execute()) {
                    $billId = AppUtil::generateId();
                    if ($material->isBillApplicable==true) {
                        $date = new DateTime($material->billdate);
                        $bilDate = $date->format('Y-m-d');

                        $stmt = $conn->prepare("INSERT INTO `material_expense_bills`(`billid`, `materialexpensedetailsid`, `billno`, `billissueingentity`, `amount`, `dateofbill`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:billid,:expensedetailsid,:billno,:billissueingentity,:amount,:dateofbill,:createdBy,now(),now(),:lastModifiedBy)");
                        $stmt->bindParam(':billid', $billId, PDO::PARAM_STR);
                        $stmt->bindParam(':expensedetailsid', $expenseDetailsId, PDO::PARAM_STR);
                        $stmt->bindParam(':billno', $material->billno, PDO::PARAM_STR);
                        $stmt->bindParam(':billissueingentity', $material->billIssuingEntity, PDO::PARAM_INT);
                        $stmt->bindParam(':amount', $material->amount, PDO::PARAM_STR);
                        $stmt->bindParam(':dateofbill', $bilDate, PDO::PARAM_STR);
                        $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                        $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
                        HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
                        HicreteLogger::logDebug("Data: \n" . json_encode($material));
                        if ($stmt->execute()) {
                            $success=true;
                        } else {
                            $success=false;
                        }
                    }else{
                        $success=true;
                    }
                } else {

                    $success =false;
                }
            }

        }
        catch(Exception $e){
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
            echo "Exception occur while adding material expense".$e->getMessage();

        }
        if($success){
            $conn->commit();
            $message="Material Expense Details Added successfully..!!!";
            HicreteLogger::logInfo("Material expense details added successfully");
            echo AppUtil::getReturnStatus("success", $message);
        }else{
//            $conn->rollBack();
            $message="Could not add material expense details..!!!";
            HicreteLogger::logError("Error while adding Material expenses");
            echo AppUtil::getReturnStatus("failure", $message);
        }
    }
    public static function getBillApproval(){

        $db = Database::getInstance();
        $conn = $db->getConnection();

        $json_response=array();

        try{
            $stmt1=$conn->prepare("select expense_details.`expensedetailsid`,expense_details.`budgetsegmentid`,expense_details.projectid,expense_details.description,unapproved_expense_bills.amount,unapproved_expense_bills.createdby FROM expense_details JOIN unapproved_expense_bills ON expense_details.expensedetailsid=unapproved_expense_bills.`expensedetailsid` WHERE unapproved_expense_bills.bill_status='pending' ");

            HicreteLogger::logDebug("Query: \n" . json_encode($stmt1));

            if($stmt1->execute()){
                HicreteLogger::logDebug("Row count: \n" . json_encode($stmt1->rowCount()));
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
                if(sizeof($json_response)>0){
                  echo AppUtil::getReturnStatus("success", $json_response);
                }
                else{
                    HicreteLogger::logError("Bill Approval data not available");
                    echo AppUtil::getReturnStatus("failure", "Bill Approval Data Not Available");
                }
            }
            else{
                HicreteLogger::logError("Bill Approval data not available");
                echo AppUtil::getReturnStatus("failure", "Bill Approval Data Not Available");
            }

        }
        catch(Exception $e){
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
            echo "Exception Occur while getting bill approval";
        }

    }
    public static function getBillDetails($data){

        $db = Database::getInstance();
        $conn = $db->getConnection();

        $expenseDetailsId=$data->expenseDetailsId;
        HicreteLogger::logInfo("Fetching bill details");
        $result_array=array();

        try{

            $stmt1=$conn->prepare("SELECT `projectid`,`budgetsegmentid` FROM expense_details WHERE expensedetailsid=:expenseDetailsId");
            $stmt1->bindParam(':expenseDetailsId',$expenseDetailsId);
            HicreteLogger::logDebug("Query: \n" . json_encode($stmt1));
            $stmt1->execute();
            HicreteLogger::logDebug("Row count: \n" . json_encode($stmt1->rowCount()));
            $result1=$stmt1->fetch(PDO::FETCH_ASSOC);
            $projectId=$result1['projectid'];
            $budgetSegmentId=$result1['budgetsegmentid'];

            $stmt2=$conn->prepare("SELECT projectName FROM project_master WHERE ProjectId=:projectId");
            $stmt2->bindParam(':projectId',$projectId);
            HicreteLogger::logDebug("Query: \n" . json_encode($stmt2));
            $stmt2->execute();
            HicreteLogger::logDebug("Row count: \n" . json_encode($stmt2->rowCount()));
            $result2=$stmt2->fetch(PDO::FETCH_ASSOC);
            $result_array['projectName']=$result2['projectName'];

            $stmt3=$conn->prepare("SELECT segmentname FROM budget_segment WHERE budgetsegmentid=:budgetSegmentId");
            $stmt3->bindParam(':budgetSegmentId',$budgetSegmentId);
            HicreteLogger::logDebug("Query: \n" . json_encode($stmt3));
            $stmt3->execute();
            HicreteLogger::logDebug("Row count: \n" . json_encode($stmt3->rowCount()));
            $result3=$stmt3->fetch(PDO::FETCH_ASSOC);
            $result_array['budgetSegmentName']=$result3['segmentname'];

            $stmt4=$conn->prepare("select `billid`,`billno`,`billissueingentity`,`amount`,`dateofbill`from unapproved_expense_bills WHERE expensedetailsid=:expenseDetailsId");
            $stmt4->bindParam(':expenseDetailsId',$expenseDetailsId);
            HicreteLogger::logDebug("Query: \n" . json_encode($stmt4));
            $stmt4->execute();
            HicreteLogger::logDebug("Row count: \n" . json_encode($stmt4->rowCount()));
            $result4=$stmt4->fetch(PDO::FETCH_ASSOC);
            $result_array['billid']=$result4['billid'];
            $result_array['billNo']=$result4['billno'];
            $result_array['billissueingentity']=$result4['billissueingentity'];
            $result_array['amount']=$result4['amount'];
            $result_array['dateofbill']=$result4['dateofbill'];

            if(sizeof($result_array)>0){

                echo AppUtil::getReturnStatus("success", $result_array);
            }
            else{

                echo AppUtil::getReturnStatus("failure", "Bill Details Not Available");
            }
        }
        catch(Exception $e){
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
            echo "Exception occur while getting bill details";
        }
    }
    public static function getProjectsForExpense()
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $json_response=array();
        try {
            $stmt = $conn->prepare("SELECT ProjectId,ProjectName from project_master where ProjectId IN (SELECT ProjectId from budget_details)");
            HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
            if ($stmt->execute()) {
                HicreteLogger::logDebug("Row count: \n" . json_encode($stmt->rowCount()));
                while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $result_array = array();
                    $result_array['ProjectId'] = $result['ProjectId'];
                    $result_array['ProjectName'] = $result['ProjectName'];
                    array_push($json_response, $result_array);
                }
                if (sizeof($json_response) > 0) {
                    echo AppUtil::getReturnStatus("success", $json_response);
                } else {
                    HicreteLogger::logError("No projects have cost center created");
                    echo AppUtil::getReturnStatus("failure", "No Projects have cost center created");
                }


                //echo AppUtil::getReturnStatus("success","Bill Status Updated Successfully");
            } else {
                echo AppUtil::getReturnStatus("failure", "Fetcging projects failed");
            }
        }catch(Exception $e)
        {
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
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
            HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
            if($stmt->execute()){
                HicreteLogger::logDebug("Row count: \n" . json_encode($stmt->rowCount()));
                echo AppUtil::getReturnStatus("success","Bill Status Updated Successfully");
            }
            else{
                echo AppUtil::getReturnStatus("failure","Bill Status Could Not Update");
            }
        }
        catch(Exception $e){
            HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
            echo "Exception Occur While Updating Bill Status";
        }
    }

    public static function deleteSegment($segmentId)
    {
        $db = Database::getInstance();
        $connect = $db->getConnection();

        $stmt1 = $connect->prepare("SELECT `budgetsegmentid` FROM `budget_details` where budgetsegmentid=:segmentId");
        $stmt1->bindParam(':segmentId', $segmentId);
        $stmt1->execute();
        $result1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);

        if (count($result1) > 0)
            return 2;


        $stmt = $connect->prepare("DELETE FROM `budget_segment` WHERE `budgetsegmentid`=:segmentId");
        $stmt->bindParam(':segmentId', $segmentId);
        if ($stmt->execute()) {
            return 1;
        } else {
            return 0;
        }
    }
    public static function modifyCostCenter($projectId,$segmentData,$costCentermaterials,$userId)
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $conn->beginTransaction();
        try{
            $stmt1 = $conn->prepare("DELETE FROM `budget_details` where projectid=:projectid");
            $stmt1->bindParam(':projectid', $projectId);
            if($stmt1->execute()){
                $stmt2 = $conn->prepare("DELETE FROM `material_budget_details` where projectid=:projectid");
                $stmt2->bindParam(':projectid', $projectId);
                if($stmt2->execute()){

                    $success = false;
                    HicreteLogger::logInfo("Creating cost center");

                    foreach ($segmentData as $segment) {
                        $budgetId = AppUtil::generateId();
                        $stmt = $conn->prepare("INSERT INTO `budget_details`(`budgetdetailsid`,`projectid`, `budgetsegmentid`, `allocatedbudget`, `alertlevel`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:budgetId,:projectId,:segmentId,:allocatedBudget,:alertLevel,:createdBy,now(),now(),:lastModifiedBy)");

                        $stmt->bindParam(':budgetId', $budgetId, PDO::PARAM_STR);

                        $stmt->bindParam(':projectId',$projectId, PDO::PARAM_STR);
                        $stmt->bindParam(':segmentId', $segment->budgetsegmentid, PDO::PARAM_STR);
                        $stmt->bindParam(':allocatedBudget', $segment->allocatedbudget, PDO::PARAM_INT);
                        $stmt->bindParam(':alertLevel', $segment->alertlevel, PDO::PARAM_STR);
                        $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                        $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
                        HicreteLogger::logDebug("Query: \n" . json_encode($stmt));

                        if ($stmt->execute()) {
                            $success = true;
                        } else {
                            $success = false;
                        }
                    }
                    if($costCentermaterials!=null){

                        foreach($costCentermaterials as $material){

                            $materialbudgetdetailsid=uniqid();
                            $stmtCostCenterMaterial = $conn->prepare("INSERT INTO `material_budget_details`(`materialbudgetdetailsid`,`projectid`,`materialid` ,`allocatedbudget`, `alertlevel`, `creadtedby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`)
                    VALUES (:materialbudgetdetailsid,:projectId,:materialid,:allocatedBudget,:alertLevel,:creadtedby,now(),now(),:lastmodifiedby)");

                            $stmtCostCenterMaterial->bindParam(':materialbudgetdetailsid', $materialbudgetdetailsid, PDO::PARAM_STR);
                            $stmtCostCenterMaterial->bindParam(':projectId', $projectId, PDO::PARAM_STR);
                            $stmtCostCenterMaterial->bindParam(':materialid', $material->materialid, PDO::PARAM_STR);
                            $stmtCostCenterMaterial->bindParam(':allocatedBudget', $material->allocatedbudget, PDO::PARAM_INT);
                            $stmtCostCenterMaterial->bindParam(':alertLevel', $material->alertlevel, PDO::PARAM_STR);
                            $stmtCostCenterMaterial->bindParam(':creadtedby', $userId, PDO::PARAM_STR);
                            $stmtCostCenterMaterial->bindParam(':lastmodifiedby', $userId, PDO::PARAM_STR);

                            if ($stmtCostCenterMaterial->execute()) {
                                $success = true;
                            } else {
                                $success = false;
                            }
                        }
                    }

                    if ($success) {
                        $conn->commit();
                        $message = "Cost Center Updated successfully..!!!";
                        HicreteLogger::logInfo("Cost center Updated  successfully");
                        echo AppUtil::getReturnStatus("success", $message);
                    } else {
                        $conn->rollBack();
                        $message = "Could not create cost center..!!!";
                        HicreteLogger::logError("Error while creating cost center");
                        echo AppUtil::getReturnStatus("failure", $message);
                    }

                }

            }
            else{
                $conn->rollBack();
                $message = "Could not update cost center..!!!";
                HicreteLogger::logError("Error while updating cost center");
                echo AppUtil::getReturnStatus("failure", $message);
            }

        }catch(Exception $e){
            $conn->rollBack();
            HicreteLogger::logError("Exception while updating cost center");
            echo AppUtil::getReturnStatus("failure", $e->getMessage());
        }
    }

}

?>