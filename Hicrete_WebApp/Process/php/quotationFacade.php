<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 29-03-2016
 * Time: 00:36
 */

require_once 'QuotationController.php';
$data=json_decode($_GET['data'] );

if (!isset($_SESSION['token'])) {
    session_start();
}
$userId=$_SESSION['token'];



switch($data->operation)
{
    case "createQuotation":
        QuotationController::saveQuotationDetailsAndTax($data->data);
        break;
    case "getQuotationByProjectId":
        QuotationController::getQuotationByProjectId($data->data);
        break;
    case "getQuotationList":
        QuotationController::getQuotationList($data->data);
        break;
    case "getQuotationTaxDetails":
        QuotationController::getQuotationTaxDetails($data->data);
        break;
    case "modifyQuotation":
        QuotationController::reviseQuotation($data->quotationId,$data->data);
        break;
    case "getQuotationDetails":
        QuotationController::getQuotationDetails($data->data);
        break;
    case "isQuotationAlreadyUploadedForOtherQuotation":
        QuotationController::isQuotationAlreadyUploadedForAnotherQuotation($data->quotationId,$data->QuotationBlob);
        break;
    case "isQuotationAlreadyUploaded":
        QuotationController::isQuotationAlreadyUploaded($data->QuotationBlob);
        break;


}


?>