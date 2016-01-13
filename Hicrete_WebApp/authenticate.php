<?php
require_once 'php/Database.php';
$db = Database::getInstance();
$conn = $db->getConnection();


$params = json_decode(file_get_contents('php://input'),false);

		$opt = array(
		   PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
		   PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		);

		try{

				$stmt = $conn->prepare("SELECT * FROM `logindetails` WHERE `userName`=:username AND `password`=:password");

				$username="super@mail.com";
			     $stmt->bindParam(':username', $params->username, PDO::PARAM_STR);
			     // $pass=sha1($params->password);
			     $pass="80e8e3c1e1a5f6e19b1ed24c1fff1d2a75ec43a2";
			    // echo $pass;
			     $stmt->bindParam(':password',$pass , PDO::PARAM_STR);
			  
			    $stmt->execute();
	    		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
			    $json;
			    $json = array(
				        'result' => "true");
			    	session_start();
					$_SESSION['token']="568bf524ab16f2627";	
				// if (count($result) > 0) {
				//     // output data of each row
				// 	$json = array(
				//         'result' => "true");
				// 	// $userId=$result[0]['userId']; 
				// 	// $stmt = $conn->prepare("UPDATE `logindetails` SET `lastLoginDate`=now() WHERE `userId`=:userid");
				// 	// $stmt->bindParam(':userid', $userId, PDO::PARAM_STR);
			 //  // 		$stmt->execute();
				// 	session_start();
				// 	$_SESSION['token']=$userId;	
					
				// } else {
				//    $json = array('result' => "false");		
				// }
				
				$jsonstring = json_encode($json);
				echo $jsonstring;


			}catch(Exception $e){
				echo $e->getMessage();
			}










?>