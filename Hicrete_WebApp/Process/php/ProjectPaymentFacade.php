<?php
/**
 * Created by IntelliJ IDEA.
 * User: LENOVO
 * Date: 03/29/16
 * Time: 11:30 PM
 */
    require_once '../../php/api/PaymentController.php';
    $data = json_decode($_GET['data']);

    if (!isset($_SESSION['token'])) {
        session_start();
    }
    $userId = $_SESSION['token'];

    $opt = array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    );
    //echo json_encode($data);


    switch ($data->operation) {
        case 'getProjectPayment':
            PaymentController::getAllPayment($data->projectId);
            break;
        case 'saveProjectPayment':
            PaymentController::savePaymentAndDetails($data->data);
            break;
        case 'getPaymentPaidAndTotalAmount':
            PaymentController::getPaymentPaidAndTotalAmount($data->data);
            break;

        case 'getAllPaymentForProject':
            PaymentController::getAllPaymentForProject($data->projectId);
            break;

    }

?>