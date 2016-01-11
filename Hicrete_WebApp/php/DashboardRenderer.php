<?php
require_once 'Database.php';
require_once 'appUtil.php';

$data=json_decode($_GET['data'] );
if (!isset($_SESSION['token'])) {
	session_start();
}
$userId=$_SESSION['token'];

switch ($data->operation) {
    case "getAccessPermission":  getAccessPermission($userId);
    				    break;
}

function getAccessPermission($userId){

		$db = Database::getInstance();
        $conn = $db->getConnection();
    	$stmt = $conn->prepare("SELECT `ModuleName`,`accessType` FROM `accesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `useraccesspermission` WHERE `userId`=:userId)"); 
    	
    	$stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    	if($stmt->execute()){
    		$json_response=array();
	    	while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
    	    {      
        	    $result_array = array();
            	$result_array['ModuleName'] = $result['ModuleName'];        
              	$result_array['AccessType'] = $result['accessType'];
              	array_push($json_response, $result_array);
        	}

        	echo AppUtil::getReturnStatus("Successful",$json_response);
    	}else{
    		echo AppUtil::getReturnStatus("Unsuccessful","Unknown Database error occurred");
    	}
    	
}



?>