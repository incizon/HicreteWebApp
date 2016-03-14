<?php
require_once 'Database.php';
class AppUtil
{
    
    
    public static function getReturnStatus($status,$message){
        $returnVal=array('status' => $status, 'message' => $message );
         return json_encode($returnVal);          
    }


    public static function generateId(){
         $id=uniqid();
         $rand=mt_rand(1000,9999);
         return $id.$rand;
    }

    public static function doesUserHasAccess($moduleName,$userId,$accessType){
        try{

            $db = Database::getInstance();
            $conn = $db->getConnection();
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




}


?>