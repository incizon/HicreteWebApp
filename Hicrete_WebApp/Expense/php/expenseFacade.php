<?php
    require_once 'expense.php';
    //$params = json_decode(file_get_contents('php://input'),false);
    $data = json_decode($_GET['data']);

    if (!isset($_SESSION['token'])) {
        session_start();
    }
    $userId = $_SESSION['token'];

    switch ($data->operation) {
        case "addSegment":
            Expense::addSegment($data, $userId);
            break;
        case "createCostCenter":
            Expense::createCostCenter($data->costCenterData, $data->segments,$data->materials, $userId);
            break;
        case "addOtherExpense":
            Expense::addOtherExpense($data->otherExpenseData, $data->billDetails, $userId);
            break;
        case "addMaterialExpense":
            Expense::addMaterialExpense($data->projectId, $data->materialsExpense, $userId);
            break;
        case 'getBillApproval':
            Expense::getBillApproval();
            break;
        case 'getBillDetails':
            Expense::getBillDetails($data);
            break;
        case 'updateBillStatus':
            Expense::updateBillStatus($data,$userId);
            break;
        case 'getProjectListForExpense':
            Expense::getProjectsForExpense();
            break;
        case 'deleteSegment':
            try{
                $status=Expense::deleteSegment($data->segmentId);
                if($status==2){
                    echo AppUtil::getReturnStatus("Unsuccessful", "Budget Segment is used in costcenter..Can not Delete");
                }else if($status==1){
                    echo AppUtil::getReturnStatus("Success", "Budget Segment deleted successfully");
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Budget Segment can not be deleted");
                }
            }catch(Exception $e){
                echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
            }

            break;

    }

?>