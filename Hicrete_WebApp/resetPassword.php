<?php
/**
 * Created by IntelliJ IDEA.
 * User: Pranav
 * Date: 11-03-2016
 * Time: 22:40
 */
require_once 'php/Database.php';
require_once 'php/appUtil.php';
$db = Database::getInstance();
$conn = $db->getConnection();


$params = json_decode(file_get_contents('php://input'),false);

$opt = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);

try{
    $date = new DateTime($params->dateOfBirth);
    $dob = $date->format('Y-m-d');

    $stmt = $conn->prepare("SELECT count(1) as count from usermaster where emailid=:email and dateofbirth=:DOB and `isDeleted`!=1 ");
    $stmt->bindParam(':email', $params->userName, PDO::PARAM_STR);
    $stmt->bindParam(':DOB', $dob, PDO::PARAM_STR);
    if($stmt->execute())
    {
        $result=$stmt->fetch(PDO::FETCH_ASSOC);
        $count=$result['count'];
        if($count != 0)
        {
            $password = mt_rand(1000000, 9999999);
            $hash = sha1($password);

            $stmt = $conn->prepare("UPDATE logindetails SET password=:password where userName=:email");
            $stmt->bindParam(':email', $params->userName, PDO::PARAM_STR);
            $stmt->bindParam(':password', $hash, PDO::PARAM_STR);
            if(!$stmt->execute())
            {
                echo AppUtil::getReturnStatus("unsuccessful", "Resetting password failed");
            }
            else
            {
                AppUtil::sendForgotPasswordMail($params->userName,$password);
                echo AppUtil::getReturnStatus("successful", $password);

            }

        }
        else
        {
            echo AppUtil::getReturnStatus("NotAvailable", "Username or date of birth not valid ");
        }
	}
    else {
        echo AppUtil::getReturnStatus("Unsuccessful", "Some Error Occured ");

    }


    /*$stmt = $conn->prepare("SELECT * FROM `logindetails` WHERE `userName`=:username AND `password`=:password");

    $stmt->bindParam(':username', $params->username, PDO::PARAM_STR);
    $pass=sha1($params->password);
    //echo $pass;
    $stmt->bindParam(':password',$pass , PDO::PARAM_STR);

    $stmt->execute();
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    $json;
    if (count($result) > 0) {
        // output data of each row
        $json = array(
            'result' => "true");
        $userId=$result[0]['userId'];
        $stmt = $conn->prepare("UPDATE `logindetails` SET `lastLoginDate`=now() WHERE `userId`=:userid");
        $stmt->bindParam(':userid', $userId, PDO::PARAM_STR);
        $stmt->execute();
        session_start();
        $_SESSION['token']=$userId;

    } else {
        $json = array('result' => "false");
    }
*/
   /* $jsonstring = json_encode($json);
    echo $jsonstring;*/


}catch(Exception $e){
    echo $e->getMessage();
}





?>