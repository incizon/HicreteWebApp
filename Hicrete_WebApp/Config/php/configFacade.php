<?php
require_once 'config.php';
require_once 'ConfigUtils.php';
//$params = json_decode(file_get_contents('php://input'),false);
$data=json_decode($_GET['data'] );

if (!isset($_SESSION['token'])) {
    session_start();
}
$userId=$_SESSION['token'];

switch ($data->operation) {
    case "addCompany":  Config::addCompany($data->data,$userId);
    				    break;
    case "addWarehouse":  Config::addWarehouse($data->data,$userId);
    				    break;
    case "getAccessPermission":  ConfigUtils::getAllAccessPermissions();
    				    break;
    case "addRole":  Config::addRole($data,$userId);
    				    break;
    case "getRoles":  ConfigUtils::getAllRoles();
    				    break;
    case "getAccessForRole" :ConfigUtils::getAccessForRole($data->roleId);
    				    break;
    case "addUser" :Config::addUser($data,"admin");
    				    break;
    case "getExemptedAccessList" :ConfigUtils::getExemptedAccessList($userId);
    				    break;
    case "addTempAcccessRequest" :ConfigUtils::addTempAcccessRequest($data,$userId);
    				    break;
    case "getTempAccessRequestDetails" :ConfigUtils::getTempAccessRequestDetails($data->requestId,$userId);
    				    break;		

    case "TempAccessRequestAction" :ConfigUtils::addTempAccessRequestAction($data,$userId);
    				    break;
    case "getCompanys" :Config::getCompanys($userId);
                        break;
    case "getWarehouses": Config::getWarehouse($userId);
                        break;



}

	/*	$opt = array(
		   PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
		   PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		);

		try{

				$stmt = $conn->prepare("select * from userlogin where username=:username and password=:password");

			     $stmt->bindParam(':username', $params->username, PDO::PARAM_STR);
			    $stmt->bindParam(':password', $params->password, PDO::PARAM_STR);
			  
			    $stmt->execute();
	    		$result=$stmt->fetchAll();
			    $json;
				if (count($result) > 0) {
				    // output data of each row
					$json = array(
				        'result' => "true");
					session_start();
					$_SESSION['user']=$params->username;	
					
				} else {
				   $json = array('result' => "false");		
				}
				
				$jsonstring = json_encode($json);
				echo $jsonstring;


			}catch(Exception $e){
				echo $e->getMessage();
			}*/

?>