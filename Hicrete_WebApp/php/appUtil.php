<?php
require_once 'Database.php';
include_once 'PHPMailer/class.phpmailer.php';

class AppUtil
{
    
    
    public static function getReturnStatus($status,$message){
        $returnVal=array('status' => $status, 'message' => $message );
         return json_encode($returnVal);          
    }

    public static function getLoggerInUserId(){
        if (!isset($_SESSION['token'])) {
            session_start();
        }
        return $_SESSION['token'];
    }

    public static function generateId(){
         $id=uniqid();
         $rand=mt_rand(1000,9999);
         return $id.$rand;
    }

    public static function isSuperUser($userId){
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();

            $stmt = $conn->prepare("SELECT `isSuperUser` FROM `usermaster` WHERE `userId` =:userId");
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->execute();
            $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
            $isSuperUser=$result[0]['isSuperUser'];
            if ($isSuperUser) {
                return true;
            }

        }catch(Exception $e){
            return false;
        }
        return false;
    }



    public static function doesUserHasAccess($moduleName,$userId,$accessType){
        try{

            $db = Database::getInstance();
            $conn = $db->getConnection();

            $stmt = $conn->prepare("SELECT `isSuperUser` FROM `usermaster` WHERE `userId` =:userId");
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->execute();
            $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
            $isSuperUser=$result[0]['isSuperUser'];
            if ($isSuperUser) {
                return true;
            }

            $stmt = $conn->prepare("SELECT * FROM `roleaccesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `accesspermission` WHERE `ModuleName`=:moduleName AND `accessType`=:accessType) AND `roleId` IN (SELECT `roleId` FROM `userroleinfo` WHERE `userId`=:userId)");

            $stmt->bindParam(':moduleName', $moduleName, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':accessType', $accessType, PDO::PARAM_STR);
            if($stmt->execute()){
                $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
                if (count($result) > 0) {
                    return true;
                }else{
                    return false;
                }

            }else{
               return false;
            }

        }catch(Exception $e){
            return false;
        }
    return false;
    }

    public static function sendMail($userName,$Password,$userMail,$Name)
    {
        $email = new PHPMailer();

        $MailManager = 'info@hitechflooringindia.com';

        $userSubject = "User Credential";

        $userBody = "Dear $Name,
                    Following are the your account credentials.
                    User Name :$userName
                    Password  :$Password";


        $email->From      = $MailManager;
        $email->FromName  = 'Administrator';
        $email->Subject   = $userSubject;
        $email->Body      = $userBody;
        $email->AddAddress( $userMail );

        $email->Send();

    }

    public static function sendForgotPasswordMail($userName,$Password)
    {

        $email = new PHPMailer();

        $MailManager = 'info@hitechflooringindia.com';

        $userSubject = "Reset Hicrete WebApp Credential";

        $userBody = "Dear User,
                    Your new credentials for Hicrete Web Application is
                    User Name :".$userName."
                    Password  :".$Password;


        $email->From      = $MailManager;
        $email->FromName  = 'Administrator';
        $email->Subject   = $userSubject;
        $email->Body      = $userBody;
        $email->AddAddress( $userName );

        $email->Send();

    }

}


?>