<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 29-03-2016
 * Time: 20:55
 */

require_once '../../php/api/PaymentController.php';
$data=json_decode($_GET['data'] );

if (!isset($_SESSION['token'])) {
    session_start();
}
$userId=$_SESSION['token'];

$opt = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);

switch($data->operation)
{
    case 'AllPaymentForProject':
        echo json_encode(PaymentController::getAllPayment($data->data));
        break;
    case 'getPaymentPaidByInvoices':
        PaymentController::getPaymentPaidByInvoices($data->invoiceId);
        break;
}