<?php
require_once '../../php/Database.php';
require_once '../../php/appUtil.php';
class ConfigUtils
{
    

    public static function getAllAccessPermissions(){
  
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM `accesspermission`");
            if($stmt->execute()){
        
                $noOfRows=0;
                $json_response = array(); 
                while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                {
                   $result_array = array();
                   $result_array['ModuleName'] = $result['ModuleName'];        
                   $result_array['accessType'] = $result['accessType'];
                   $result_array['accessId'] =$result['accessId'];;
                   array_push($json_response, $result_array); //push the values in the array
                   $noOfRows++;
               }
                if($noOfRows>0)   
                    echo AppUtil::getReturnStatus("Successful",$json_response);
                else
                   echo AppUtil::getReturnStatus("NoRows","Access Permissions not defined");
            
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }    


        }catch(Exception $e){
     
                echo AppUtil::getReturnStatus("Exception","Exception Occurred while getting access permission");
        }
           
    }


     public static function getAllRoles (){
  
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT `roleId`, `roleName` FROM `rolemaster`");
            if($stmt->execute()){
        
                $noOfRows=0;
                $json_response = array(); 
                while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                {
                   $result_array = array();
                   $result_array['roleId'] = $result['roleId'];        
                   $result_array['roleName'] = $result['roleName'];
                   array_push($json_response, $result_array); //push the values in the array
                   $noOfRows++;
               }
                if($noOfRows>0)   
                    echo AppUtil::getReturnStatus("Successful",$json_response);
                else
                   echo AppUtil::getReturnStatus("NoRows","No Roles to define");
            
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }    


        }catch(Exception $e){
     
                echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching roles");
        }
           
    }

    public static function getAccessForRole($roleId){
  
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT `accessId`, `ModuleName`, `accessType` FROM `accesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `roleaccesspermission` WHERE `roleId`=:roleId)");
            $stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);

            if($stmt->execute()){
        
                $noOfRows=0;
                $json_response = array(); 
                while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                {
                   $result_array = array();
                 $result_array['ModuleName'] = $result['ModuleName'];        
                   $result_array['accessType'] = $result['accessType'];
                   $result_array['accessId'] =$result['accessId'];
                   array_push($json_response, $result_array); //push the values in the array
                   $noOfRows++;
               }
                if($noOfRows>0)   
                    echo AppUtil::getReturnStatus("Successful",$json_response);
                else
                   echo AppUtil::getReturnStatus("NoRows","Access Permissions not defined");
            
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }    


        }catch(Exception $e){
     
                echo AppUtil::getReturnStatus("Exception","Exception Occurred while getting access permission");
        }
           
    }


    public static function getExemptedAccessList($userId){
  
      try{
          $db = Database::getInstance();
          $conn = $db->getConnection();
          $stmt = $conn->prepare("SELECT `accessId`, `ModuleName`, `accessType` FROM `accesspermission` WHERE `accessId` NOT IN (SELECT `accessId` FROM `useraccesspermission` WHERE `userId`=:userId)");
          $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);

          if($stmt->execute()){
      
              $noOfRows=0;
              $json_response = array(); 
              while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
              {
                 $result_array = array();
                 $result_array['ModuleName'] = $result['ModuleName'];        
                 $result_array['accessType'] = $result['accessType'];
                 $result_array['accessId'] =$result['accessId'];;
                 array_push($json_response, $result_array); //push the values in the array
                 $noOfRows++;
             }
              if($noOfRows>0)   
                  echo AppUtil::getReturnStatus("Successful",$json_response);
              else
                 echo AppUtil::getReturnStatus("NoRows","Access Permissions not defined");
          
          }else{
              echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
          }    


        }catch(Exception $e){
     
                echo AppUtil::getReturnStatus("Exception","Exception Occurred while getting access permission");
        }
           
    }


    private static function insertRequestedAccess($conn,$requestId,$accessId){
        

        $stmt = $conn->prepare("INSERT INTO `accesserequested`(`requestId`, `accessId`) 
          VALUES (:requestId,:accessId)");
        $stmt->bindParam(':requestId', $requestId, PDO::PARAM_STR);
        $stmt->bindParam(':accessId', $accessId, PDO::PARAM_STR);

        return $stmt->execute();
    }
    public static function addTempAcccessRequest($data,$userId){
       try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            
            $conn->beginTransaction();
      
            
            $requestId=AppUtil::generateId(); 
            $stmt = $conn->prepare("INSERT INTO `tempaccessrequest`(`requestId`, `requestedBy`, `fromDate`, `toDate`, `description`, `status`, `requestDate`) 
              VALUES (:requestId,:requestedBy,:fromDate,:toDate,:description,'Pending',now())");
            
            $stmt->bindParam(':requestId', $requestId, PDO::PARAM_STR);
            $stmt->bindParam(':requestedBy', $userId, PDO::PARAM_STR);
            $date = new DateTime($data->accessRequest->fromDate);
            $fromDate= $date->format('Y-m-d');
            $stmt->bindParam(':fromDate', $fromDate, PDO::PARAM_STR);
            $date = new DateTime($data->accessRequest->toDate);
            $toDate= $date->format('Y-m-d');
            $stmt->bindParam(':toDate', $toDate, PDO::PARAM_STR);
            $stmt->bindParam(':description', $data->accessRequest->description, PDO::PARAM_STR);
                
                
            $rollback=false;
            if($stmt->execute()){
                 
              foreach ($data->accessList as $accessEntry) {
                  
                  if($accessEntry->read->val){
                      if(!ConfigUtils::insertRequestedAccess($conn,$requestId,$accessEntry->read->accessId)){
                        $rollback=true;
                      }

                  }

                  if($accessEntry->write->val){
                      if(!ConfigUtils::insertRequestedAccess($conn,$requestId,$accessEntry->write->accessId)){
                        $rollback=true;
                      }
                  }
              }
            }else{
              echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }    
          

            if($rollback){
              $conn->rollback();
              echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            } else{
              $conn->commit();
              echo AppUtil::getReturnStatus("Successful","Access Request Added");
            } 
          
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Exception","Exception Occurred while creating role");
        }

    }

    
    public static function getTempAccessRequestDetails($requestId,$userId){
  
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT  tempaccessrequest.requestedBy,tempaccessrequest.fromDate, tempaccessrequest.toDate, tempaccessrequest.description,userroleinfo.designation , usermaster.firstName, usermaster.lastName FROM `tempaccessrequest`, `userroleinfo`, `usermaster`
WHERE tempaccessrequest.requestId =:requestId AND usermaster.userId =tempaccessrequest.requestedBy  AND userroleinfo.userId =tempaccessrequest.requestedBy");
            $stmt->bindParam(':requestId',$requestId , PDO::PARAM_STR);

            if($stmt->execute()){

                $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
                if (count($result) <= 0) {
                  echo AppUtil::getReturnStatus("Unsuccessful","Invalid Temp Access Request");
                }else{
                    $requestDetails = array();
                    $requestDetails['username'] = $result[0]['firstName']." ".$result[0]['lastName'];        
                    $requestDetails['designation'] = $result[0]['designation'];
                    $requestDetails['fromDate'] =$result[0]['fromDate'];
                    $requestDetails['toDate'] = $result[0]['toDate'];
                    $requestDetails['description'] =$result[0]['description'];
                    $requestDetails['requestedBy'] =$result[0]['requestedBy'];
                    $stmt = $conn->prepare("SELECT `accessId`, `ModuleName`, `accessType` FROM `accesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `accesserequested` WHERE `requestId`=:requestId)");
                    $stmt->bindParam(':requestId',$requestId , PDO::PARAM_STR);
                    if($stmt->execute()){
                          $accessRequested = array(); 
                          while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                          {
                             $result_array = array();
                             $result_array['ModuleName'] = $result['ModuleName'];        
                             $result_array['accessType'] = $result['accessType'];
                             $result_array['accessId'] =$result['accessId'];
                             array_push($accessRequested, $result_array); //push the values in the array  
                          }
                         $returnVal=array('requestDetails' => $requestDetails, 'accessRequested' => $accessRequested );
                         echo AppUtil::getReturnStatus("Successful",$returnVal);   

                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");      
                    }
                }  
        
                
                    
                
            
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }    


        }catch(Exception $e){
     
                echo AppUtil::getReturnStatus("Exception","Exception Occurred while getting access permission");
        }
           
    }


    private static function addTemporaryAccessPermission($conn,$requestId){
        $stmt = $conn->prepare("SELECT `requestedBy`, `fromDate`, `toDate` FROM `tempaccessrequest` WHERE `requestId`=:requestId");
        $stmt->bindParam(':requestId', $requestId, PDO::PARAM_STR);
        if($stmt->execute()){

            $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
      
            if (count($result) > 0) {
                $requestedBy = $result[0]['requestedBy'];        
                $fromDate = $result[0]['fromDate'];
                $toDate = $result[0]['toDate'];
                $stmt = $conn->prepare("SELECT `accessId` FROM `accesserequested` WHERE `requestId`=:requestId");
                $stmt->bindParam(':requestId', $requestId, PDO::PARAM_STR);
                if($stmt->execute()){
                  
                  $flag=true;
                  while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                      {
                              
                         $stmt = $conn->prepare("INSERT INTO `tempaccesspermissions`(`requestId`, `userId`, `accessId`, `fromDate`, `toDate`) 
                          VALUES (:requestId,:userId,:accessId,:fromDate,:toDate)");
                          $stmt->bindParam(':requestId', $requestId, PDO::PARAM_STR);
                          $stmt->bindParam(':userId', $requestedBy, PDO::PARAM_STR);
                          $stmt->bindParam(':accessId', $result['accessId'], PDO::PARAM_STR);
                          $stmt->bindParam(':fromDate', $fromDate, PDO::PARAM_STR);
                          $stmt->bindParam(':toDate', $toDate, PDO::PARAM_STR);
                          if(!$stmt->execute()){
                            $flag=false;
                            break;
                          }

                      }
                   if($flag)
                      return true;   

                } 
            }    
        }
  
        return false; 
      
    }


    
    public static function addTempAccessRequestAction($data,$userId){
       try{
        
            $db = Database::getInstance();
            $conn = $db->getConnection();
            
            $conn->beginTransaction();
      
            
            
            $stmt = $conn->prepare("INSERT INTO `tempaccessrequestaction`(`requestId`, `actionBy`, `actionDate`, `remark`) 
              VALUES (:requestId,:actionBy,now(),:remark)");
            
            $stmt->bindParam(':requestId', $data->requestId, PDO::PARAM_STR);
            $stmt->bindParam(':actionBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':remark', $data->remark, PDO::PARAM_STR);
              
                
            $rollback=true;
            if($stmt->execute()){

              $stmt = $conn->prepare("UPDATE `tempaccessrequest` SET `status`=:status WHERE `requestId`=:requestId");
              $stmt->bindParam(':requestId', $data->requestId, PDO::PARAM_STR);
              $stmt->bindParam(':status', $data->status, PDO::PARAM_STR);
              if($stmt->execute()){
                
                if(strcasecmp($data->status,"Accepted")==0){
                    if(ConfigUtils::addTemporaryAccessPermission($conn,$data->requestId)){
                       $rollback=false;
                    }
                }
              } 
              
            }else{
              
              echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }    
          

            if($rollback){
              $conn->rollback();
              echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            } else{
              $conn->commit();
              echo AppUtil::getReturnStatus("Successful","Access Request Added");
            } 
          
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Exception","Exception Occurred while creating role");
        }

    }


    public static function doesUserHasAccess($moduleName,$userId,$accessType){
        try{

            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM `useraccesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `accesspermission` WHERE `ModuleName`=:moduleName AND `accessType`=:accessType) AND `userId`=:userId");

            $stmt->bindParam(':moduleName', $moduleName, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':accessType', $accessType, PDO::PARAM_STR);
            if($stmt->execute()){
                $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
                if (count($result) > 0) {
                    echo AppUtil::getReturnStatus("Successful","Has Permission ");
                }else{


                }

            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Exception","Exception Occurred while creating role");
        }

    }


}

?>