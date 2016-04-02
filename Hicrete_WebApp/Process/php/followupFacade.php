<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 27-03-2016
 * Time: 16:03
 */
require_once '../../php/api/FollowupController.php';
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
    case 'getPaymentFollowup':
        FollowupController::getPaymentFollowup($userId);
        break;
    case 'getQuotationFollowup':
        FollowupController::getQuotationFollowup($userId);
        break;
    case 'getSitetrackingFollowup':
        FollowupController::getSitetrackingFollowup($userId);
        break;
    case 'getApplicatorFollowup':
        FollowupController::getApplicatorFollowup($userId);
        break;
    case 'UpdatePaymentFollowup':
        //echo(json_encode($data->custId));
        FollowupController::UpdatePaymentFollowup($data->id,$data->data);
        break;
    case 'UpdatePaymentFollowup':
        //echo(json_encode($data->custId));
        FollowupController::UpdateQuotationFollowup($data->id,$data->data);
        break;
    case 'UpdateSiteTrackingFollowup':
        //echo(json_encode($data->custId));
        FollowupController::UpdateSiteTrackingFollowup($data->id,$data->data);
        break;
    case 'CreateQuotationFollowup':
        //echo(json_encode($data->custId));
        FollowupController::CreateQuotationFollowup($data->id,$data->data);
        break;
    case 'ConductPaymentFollowup':
        //echo(json_encode($data->custId));
        FollowupController::schedulePaymentFollowup($data->id,$data->data);
        break;
    case 'ConductQuotationFollowup':
        //echo(json_encode($data->custId));
        FollowupController::scheduleQuotationFollowup($data->id,$data->data);
        break;
    case 'ConductSiteTrackingFollowup':
        //echo(json_encode($data->custId));
        FollowupController::schedulesiteTrackingFollowup($data->id,$data->data);
        break;
    case 'ConductApplicatorFollowup':
        //echo(json_encode($data->custId));
        FollowupController::ConductApplicatorFollowup($data->id,$data->data);
        break;
    case 'CreatePaymentFollowup':
        //echo(json_encode($data->custId));
        //createndmasmds
        FollowupController::CreatePaymentFollowup($data->id,$data->data,$userId);
        break;
    case 'CreateSiteTrackingFollowup':
        //echo(json_encode($data->custId));
        FollowupController::CreateSiteTrackingFollowup($data->id,$data->data,$userId);
        break;
    case 'CreateApplicatorFollowup':
        //echo(json_encode($data->custId));
        FollowupController::CreateApplicatorFollowup($data->id,$data->data,$userId);
        break;

}

?>