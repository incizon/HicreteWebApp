<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 27-03-2016
 * Time: 16:03
 */
require_once 'CustomerController.php';
$data=json_decode($_GET['data'] );

if (!isset($_SESSION['token'])) {
    session_start();
}
$userId=$_SESSION['token'];

$opt = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);
//echo json_encode($data);


switch($data->operation)
{
    case 'addCustomer':
        CustomerController::saveCustomer(null,$data->data);
        break;
    case 'getCustomerDetails':
        CustomerController::getAllCustomerBySearch($data->searchKeyword,$data->searchBy);
        break;
    case 'modifyCustomer':
        //echo(json_encode($data->custId));
        CustomerController::updateCustomer($data->data->customer_id,$data->data);
        break;
    case "getCustomerList":
        CustomerController::getCustomerList();
        break;
}




?>