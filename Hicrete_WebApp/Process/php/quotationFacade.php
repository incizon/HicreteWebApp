<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 29-03-2016
 * Time: 00:36
 */

require_once '../../php/api/QuotationController.php';
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
    case "createQuotation":
        QuotationController::saveQuotationDetailsAndTax($data->data);
        break;
    case "getQuotationByProjectId":
        QuotationController::getQuotationByProjectId($data->data);
        break;
}


?>