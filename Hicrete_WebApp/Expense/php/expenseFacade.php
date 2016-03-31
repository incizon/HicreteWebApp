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
            Expense::addSegment($data, "admin");
            break;
        case "createCostCenter":
            Expense::createCostCenter($data->costCenterData, $data->segments, "admin");
            break;
        case "addOtherExpense":
            Expense::addOtherExpense($data->otherExpenseData, $data->billDetails, "admin");
            break;
        case "addMaterialExpense":
            Expense::addMaterialExpense($data->materialExpenseData, $data->billDetails, $userId);
            break;
        case 'getBillApproval':
            Expense::getBillApproval();
            break;
    }

?>