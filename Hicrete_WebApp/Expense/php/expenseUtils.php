<?php
require_once 'database/Database.php';

//$params = json_decode(file_get_contents('php://input'),false);
$data = json_decode($_GET['data']);

session_start();

switch ($data->operation) {
    case "getSegments":
        getSegments(1);
        break;
    case "getSegmentsExceptMaterial" :
        getSegments(0);
        break;
    case "getCostCenters" :
        getCostCenters();
        break;
    case "getExpenseDetails":
        getExpenseDetails($data->projectId);
        break;
    case "getProjectWiseSegments":
        getProjectWiseSegments($data->projectId);
        break;

}

function getProjectWiseSegments($projectId)
{
    $db = Database::getInstance();
    $conn = $db->getConnection();
    $stmt = $conn->prepare("SELECT `budgetsegmentid`, `segmentname` FROM `budget_segment` WHERE `budgetsegmentid`  IN (SELECT budgetsegmentid FROM `budget_details` WHERE budget_details.projectid='$projectId')");

    if($stmt->execute()){
        $json_response = array();
        while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result_array = array();
            $result_array['name'] = $result['segmentname'];
            $result_array['id'] = $result['budgetsegmentid'];

            array_push($json_response, $result_array); //push the values in the array
        }
        echo json_encode($json_response);
    }
}

function getExpenseDetails($projectId)
{
    $db = Database::getInstance();
    $conn = $db->getConnection();
    $json_response = array();
    $result_array = array();
    $otherExpense = 0;
    $materialExpense = 0;
    $fail = false;
    $totlaAllocatedBudget = 0;
    $segmentId = "";
    $segmentName = "";
    $totalSegmentExpense = 0;
    $result_array['SegmentExpenseDetails'] = array();
    $stmtBudgetAllocated = $conn->prepare("SELECT SUM(`budget_details`.`allocatedbudget`) AS totalAllocatedBudget FROM `budget_details` WHERE `budget_details`.`projectid`='$projectId'");
    if ($stmtBudgetAllocated->execute()) {
        $resultAllocatedBudget=$stmtBudgetAllocated->Fetch(PDO::FETCH_ASSOC);
        $totlaAllocatedBudget=$resultAllocatedBudget['totalAllocatedBudget'];
    }else{
        $totlaAllocatedBudget=0;
    }
    $stmt = $conn->prepare("SELECT `budget_details`.`projectid`,`budget_details`.`budgetsegmentid`,`budget_details`.`allocatedbudget`,`budget_details`.`alertlevel`,`segmentname`,SUM(`amount`) AS totalExpense FROM `budget_details` INNER JOIN `expense_details` ON `expense_details`.`budgetsegmentid`=`budget_details`.`budgetsegmentid` AND `budget_details`.`projectid`='$projectId' JOIN `budget_segment` ON `budget_segment`.`budgetsegmentid`=`budget_details`.`budgetsegmentid` GROUP BY `budget_details`.`budgetsegmentid`");
    if ($stmt->execute()) {
        while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result_array['projectName'] = $result['projectid'];

            $segmentWiseExpense = array();
            $segmentWiseExpense['segmentId'] = $result['budgetsegmentid'];
            $segmentWiseExpense['segmentName'] = $result['segmentname'];
            $segmentWiseExpense['allocatedBudget'] = $result['allocatedbudget'];

            if ($result['totalExpense'] != "")
                $segmentWiseExpense['totalSegmentExpense'] = $result['totalExpense'];
            else
                $segmentWiseExpense['totalSegmentExpense'] = 0;

            $segmentWiseExpense['alertLevel'] = $result['alertlevel'];
          //  $totlaAllocatedBudget = $totlaAllocatedBudget + $result['allocatedbudget'];
            $stmt1 = $conn->prepare("SELECT expensedetailsid,`projectid`,budgetsegmentid,amount,description  FROM `expense_details` WHERE projectid='$projectId' AND budgetsegmentid='$result[budgetsegmentid]'");
            if ($stmt1->execute()) {
                $segmentWiseExpense['SegmentExpense'] = array();

                while ($expenseResult = $stmt1->fetch(PDO::FETCH_ASSOC)) {
                    $billId = "--";
                    $billno = "--";
                    $amount = "--";
                    $billissueingentity = "--";
                    $dateofbill = "--";
                    $stmtBillDetails = $conn->prepare("select * FROM unapproved_expense_bills WHERE expensedetailsid='$expenseResult[expensedetailsid]'");
                    if ($stmtBillDetails->execute()) {
                        $resultBillDetails = $stmtBillDetails->fetch(PDO::FETCH_ASSOC);
                        $billId = $resultBillDetails['billid'];
                        if ($billId == "")
                            $billId = "--";
                        $billno = $resultBillDetails['billno'];
                        if ($billno == "")
                            $billno = "--";
                        $amount = $resultBillDetails['amount'];
                        if ($amount == "")
                            $amount = "--";
                        $billissueingentity = $resultBillDetails['billissueingentity'];
                        if ($billissueingentity == "")
                            $billissueingentity = "--";

                        $dateofbill =$resultBillDetails['dateofbill'];
                        if ($dateofbill == "")
                            $dateofbill = "--";
                        else{
                            $newDate = date("d-m-Y", strtotime( $resultBillDetails['dateofbill']));
                            $dateofbill=$newDate;
                        }

                    }

                    $segmentWiseExpense['SegmentExpense'][] = array(
                        'segmentName' => $result['segmentname'],
                        'budgetsegmentidExpenseDetails' => $expenseResult['budgetsegmentid'],
                        'amountExpenseDetails' => $expenseResult['amount'],
                        'descriptionExpenseDetails' => $expenseResult['description'],
                        'billId' => $billId,
                        'billNo' => $billno,
                        'billAmount' => $amount,
                        'billissueingentity' => $billissueingentity,
                        'dateofbill' => $dateofbill
                    );
                    $otherExpense = $otherExpense + $expenseResult['amount'];
                }
            }
            array_push($result_array['SegmentExpenseDetails'], $segmentWiseExpense);
        }
    } else {

    }


//    array_push($result_array,$segmentWiseExpense);
    $totalMaterialExpense = 0;
    $stmt2 = $conn->prepare("SELECT materialexpensedetailsid,materialid,amount,description  FROM `material_expense_details` WHERE projectid='$projectId' ");
    if ($stmt2->execute()) {
        while ($result = $stmt2->fetch(PDO::FETCH_ASSOC)) {
            //GET BILL DETAILS
            $billId = "--";
            $billno = "--";
            $amount = "--";
            $billissueingentity = "--";
            $dateofbill = "--";

            $materialId = $result['materialid'];

            $material =getProductByID($materialId);
                //InventoryUtils::getProductById($materialId);

            $stmtBillDetails = $conn->prepare("select * FROM material_expense_bills WHERE materialexpensedetailsid='$result[materialexpensedetailsid]'");
            if ($stmtBillDetails->execute()) {
                $resultBillDetails = $stmtBillDetails->fetch(PDO::FETCH_ASSOC);
                $billId = $resultBillDetails['billid'];
                $billno = $resultBillDetails['billno'];
                if ($billno == "")
                    $billno = "--";
                $amount = $resultBillDetails['amount'];
                if ($amount == "")
                    $amount = "--";
                $billissueingentity = $resultBillDetails['billissueingentity'];
                if ($billissueingentity == "")
                    $billissueingentity = "--";

                $dateofbill =$resultBillDetails['dateofbill'];
                if ($dateofbill == "")
                    $dateofbill = "--";
                else{
                    $newDate = date("d-m-Y", strtotime( $resultBillDetails['dateofbill']));
                    $dateofbill=$newDate;
                }

            }
            $result_array['materialExpenseDetails'][] = array(
                'amountMaterialExpenseDetails' => $result['amount'],
                'descriptionMaterialExpenseDetails' => $result['description'],
                'billId' => $billId,
                'billNo' => $billno,
                'billAmount' => $amount,
                'billissueingentity' => $billissueingentity,
                'dateofbill' => $dateofbill,
                'materialID' => $materialId,
                'material' => $material
            );
            $totalMaterialExpense = $totalMaterialExpense + $result['amount'];
        }
        $result_array['materialExpense'] = $totalMaterialExpense;

    } else {
        $fail = true;
    }
    $totalExpense = $otherExpense + $totalMaterialExpense;
    $result_array['totalExpenditure'] = $totalExpense;
    $result_array['otherExpense'] = $otherExpense;
    $result_array['budgetAllocated'] = $totlaAllocatedBudget;
    array_push($json_response, $result_array);

    $json = json_encode($json_response);
    echo $json;

}
function getProductByID($materialId){
    $db = Database::getInstance();
    $conn = $db->getConnection();
    $stmt=$conn->prepare("SELECT productname FROM product_master,material WHERE material.materialid='$materialId' AND product_master.productmasterid=material.productmasterid");
//                $stmt=$dbh->prepare("SELECT productname FROM product_master");
    if($stmt->execute()){
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $material=$result['productname'];
        return $material;
    }else{
        return "no material";
    }
}
function getCostCenters()
{
    $db = Database::getInstance();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("SELECT `costcenterid`, `costcentername` FROM `cost_center_master`");
    if ($stmt->execute()) {
        $noOfRows = 0;
        $json_response = array();
        while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result_array = array();
            $result_array['name'] = $result['costcentername'];
            $result_array['id'] = $result['costcenterid'];
            array_push($json_response, $result_array); //push the values in the array
            $noOfRows++;
        }
        echo json_encode($json_response);

    } else {
        echo "0";
    }
}

function getSegments($data)
{
    $db = Database::getInstance();
    $conn = $db->getConnection();
    if ($data == 1)
        $stmt = $conn->prepare("SELECT `budgetsegmentid`, `segmentname` FROM `budget_segment`");
    else
        $stmt = $conn->prepare("SELECT `budgetsegmentid`, `segmentname` FROM `budget_segment` WHERE `segmentname` NOT IN (SELECT * FROM `material_segment`)");

    if ($stmt->execute()) {
        $noOfRows = 0;
        $json_response = array();
        while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result_array = array();
            $result_array['name'] = $result['segmentname'];
            $result_array['id'] = $result['budgetsegmentid'];
            $result_array['allocatedBudget'] = "";
            $result_array['alertLevel'] = "";
            array_push($json_response, $result_array); //push the values in the array
            $noOfRows++;
        }
        echo json_encode($json_response);
    } else {
        echo "0";
    }

}


?>