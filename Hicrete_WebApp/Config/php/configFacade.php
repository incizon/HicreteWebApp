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

	case "addSuperUser":  Config::addSuperUser($data,$userId);
						break;

    case "uploadProfilePicture":Config::uploadProfilePicture();
                        break;
    case "addCompany":  Config::addCompany($data->data,$userId);
    				    break;
    case "addWarehouse":  Config::addWarehouse($data->data,$userId);
    				    break;
    case "getAccessPermission":  ConfigUtils::getAllAccessPermissions();
    				    break;
    case "addRole":  Config::addRole($data,$userId);
    				    break;
    case "modifyRole":  ConfigUtils::modifyRole($data->roleId,$data->roleName,$data->accessList,$userId);
                        break;
    case "getRoles":  ConfigUtils::getAllRoles();
    				    break;
    case "getCompanyDetails": ConfigUtils::getCompanyDetails($data->keyword);
                        break;
    case "modifyCompanyDetails":ConfigUtils::modifyCompanyDetails($data,$userId);
                        break;
    case "getUserDetails" : ConfigUtils:: getUserDetails($data->keyword,$data->searchBy,$userId);
                        break;
    case "getWareHouseDetails" :ConfigUtils:: getWareHouseDetails($data->key);
                        break;
    case "modifyWareHouseDetails" : ConfigUtils::modifyWareHouseDetails($data,$userId);
                        break;
    case "deleteUser" : ConfigUtils::deleteUser($data->key,$userId);
                        break;
    case "modifyUser" : ConfigUtils::modifyUser($data->userInfo,$userId);
                        break;

    case "getAccessForRole" : ConfigUtils::getAccessForRole($data->roleId);
    				    break;
    case "addUser" :Config::addUser($data,$userId);
    				    break;
    case "modifyUserDetails" :Config::modifyUserDetails($data,$userId);
                        break;
    case "ChangePassword" : ConfigUtils::ChangePassword($data,$userId);
                        break;
    case "getRoleDetails" : ConfigUtils::getRoleDetails($data->key,$userId);
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
    case "CheckAccess": ConfigUtils::doesUserHasAccess($data->moduleName,$userId,$data->accessType);
        break;
    case "getCompanyList" : Config::getCompanyList($userId);
        break;
    case "getAllProcessUser" : ConfigUtils::getAllProcessUser($userId);
        break;

    case "getAccessApprovals" : if(appUtil::isSuperUser($userId)){
                                    ConfigUtils::getAccessApprovals();
                                }else{
                                    echo appUtil::getReturnStatus("Unsuccessful","You Do not have authority to view");
                                }


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