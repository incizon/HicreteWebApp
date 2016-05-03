<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 29-03-2016
 * Time: 21:43
 */
require_once 'WorkorderController.php';
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
    case "createWorkorder":
        WorkorderController::saveWorkOrder($data->data);
        break;
    case "getWorkorderByProjectId":
        WorkorderController::getWokrorderByProject($data->data);
        break;

    case "isWorkorderAlreadyUploaded":
        WorkorderController::isWorkorderAlreadyUploaded($data->workorderBlob);
        break;


}