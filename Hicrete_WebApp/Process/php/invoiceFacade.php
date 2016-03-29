<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 29-03-2016
 * Time: 22:43
 */
require_once '../../php/api/InvoiceController.php';
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
    case "getInvoicesByProjectId" :
        echo(json_encode(InvoiceController::loadInvoiceForProject($data->data)));
        break;
}

?>