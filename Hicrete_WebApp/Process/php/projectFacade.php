<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 28-03-2016
 * Time: 23:12
 */
require_once 'ProjectController.php';
$data=json_decode($_GET['data'] );

if (!isset($_SESSION['token'])) {
    session_start();
}
$userId=$_SESSION['token'];

$opt = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);

switch($data->operation) {

    case "createProject":
        ProjectController::saveProject(null,$data->data);
        break;
    case "searchProject":
        ProjectController::searchProject($data->searchBy,$data->searchKeyword);
        break;
    case "modifyProject":
        ProjectController::updateProject($data->data->projectDetails->projectId,$data->data);
        break;
    case "getCompaniesForProject":
        ProjectController::getCompaniesForProject($data->data);
        break;
    case "getExcludedCompaniesForProject":
        ProjectController::getExcludedCompaniesForProject($data->data);
        break;
    case "closeProject":
        echo(json_encode(ProjectController::closeProject($data->data)));
        break;
    case "getCompaniesForProject":
        ProjectController::getCompaniesForProject($data->data);
        break;
    case "getProjectList":
        ProjectController::getProjectList();
        break;
    case "getSiteTrackingProjectList":
        ProjectController::getSiteTrackingProjectList();
        break;
    case "getInvoiceOfProject":
        ProjectController::getInvoicesByProject($data->projectId);
        break;
    case "getProjectSiteFollowup":
        if(isset($data->projectId))
            ProjectController::getProjectSiteFollowup($data->projectId);
        else
            echo AppUtil::getReturnStatus("fail", "Please select project");
        break;
    case "getProjectListWithoutCostCenter":
        ProjectController::getProjectListWithoutCostCenter();
        break;
}


?>