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

    ///////////////////////////////////////////////////////////////////////////////////
    //For fetching ware house details
    ////////////////////////////////////////////////////////////////////////////////////
   public static function getWareHouseDetails($key)
   {
       try{
           $db = Database::getInstance();
           $conn = $db->getConnection();
           $key="%".$key."%";
           $stmt = $conn->prepare("SELECT `warehouseId`, `wareHouseName`, `warehouseAbbrevation`, `address`, `city`, `state`, `country`, `pincode`, `phoneNumber` FROM `warehousemaster` where wareHouseName like :key");
            $stmt->bindParam(':key',$key , PDO::PARAM_STR);

           if($stmt->execute()){

               $noOfRows=0;
               $json_response = array();
               while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
               {
                   $result_array = array();
                   $result_array['warehouseId'] = $result['warehouseId'];
                   $result_array['wareHouseName'] = $result['wareHouseName'];
                   $result_array['warehouseAbbrevation'] =$result['warehouseAbbrevation'];
                   $result_array['address'] =$result['address'];
                   $result_array['city'] =$result['city'];
                   $result_array['state'] =$result['state'];
                   $result_array['country'] =$result['country'];
                   $result_array['pincode'] =$result['pincode'];
                   $result_array['phoneNumber'] =$result['phoneNumber'];
                   array_push($json_response, $result_array); //push the values in the array
                   $noOfRows++;

               }
               if($noOfRows>0){

                   echo AppUtil::getReturnStatus("Successful",$json_response);}
               else {

                   echo AppUtil::getReturnStatus("NoRows", "No companies found");
               }
           }else{
               echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
           }






       }catch(Exception $e){

           echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching company details");
       }
   }

    public static function modifyWareHouseDetails($data,$userId)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();

            $stmt = $conn->prepare("UPDATE `warehousemaster` SET `wareHouseName`=:wareHouseName,`warehouseAbbrevation`=:abbrevation,`address`=:address,`city`=:city,`state`=:state,`country`=:country,`pincode`=:pincode,`phoneNumber`=:phoneNumber,`lastModifiedBy`=:userId,`lastModificationDate`=now() WHERE `warehouseId`=:warehouseId");

            $stmt->bindParam(':wareHouseName',$data->data->wareHouseName , PDO::PARAM_STR);
            $stmt->bindParam(':abbrevation', $data->data->warehouseAbbrevation, PDO::PARAM_STR);
            $stmt->bindParam(':address', $data->data->address, PDO::PARAM_STR);
            $stmt->bindParam(':city', $data->data->city, PDO::PARAM_STR);
            $stmt->bindParam(':state', $data->data->state, PDO::PARAM_STR);
            $stmt->bindParam(':country', $data->data->country, PDO::PARAM_STR);
            $stmt->bindParam(':pincode', $data->data->pincode, PDO::PARAM_STR);
            $stmt->bindParam(':phoneNumber', $data->data->phoneNumber, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':warehouseId', $data->data->warehouseId, PDO::PARAM_STR);

            if($stmt->execute()){

                echo AppUtil::getReturnStatus("Successful","Warehouse Modified successfully");

            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }

        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching company details");
        }


    }
    public static function modifyCompanyDetails($data,$userId)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();

            $stmt = $conn->prepare("UPDATE companymaster SET companyName=:companyName,companyAbbrevation=:abbrevation,startDate=:startdate,address=:address,city=:city,state=:state,country=:country,pincode=:pincode,emailId=:emailId,phoneNumber=:phoneNumber,lastModifiedBy=:userId,lastModificationDate=now() WHERE companyId=:companyId");

            $stmt->bindParam(':companyName',$data->data->companyName , PDO::PARAM_STR);
            $stmt->bindParam(':abbrevation', $data->data->companyAbbrevation, PDO::PARAM_STR);
            $stmt->bindParam(':startdate', $data->data->startDate, PDO::PARAM_STR);
            $stmt->bindParam(':address', $data->data->address, PDO::PARAM_STR);
            $stmt->bindParam(':city', $data->data->city, PDO::PARAM_STR);
            $stmt->bindParam(':state', $data->data->state, PDO::PARAM_STR);
            $stmt->bindParam(':country', $data->data->country, PDO::PARAM_STR);
            $stmt->bindParam(':pincode', $data->data->pincode, PDO::PARAM_STR);
            $stmt->bindParam(':emailId', $data->data->emailId, PDO::PARAM_STR);
            $stmt->bindParam(':phoneNumber', $data->data->phoneNumber, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':companyId', $data->data->companyId, PDO::PARAM_STR);

            if($stmt->execute()){

                echo AppUtil::getReturnStatus("Successful","Company Modified successfully");

            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }

        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching company details");
        }



    }

    public static function modifyUser($data,$userId)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();

            $stmt = $conn->prepare("UPDATE `userroleinfo` SET `designation`=:designation,`roleId`=:roleId,`userType`=:userType,`lastModifiedBy`=:userId,`lastModificationDate`=now() WHERE userid=:dataUserId");

            $stmt->bindParam(':designation',$data->designation , PDO::PARAM_STR);
            $stmt->bindParam(':roleId', $data->roleId, PDO::PARAM_STR);
            $stmt->bindParam(':userType', $data->userType, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':dataUserId', $data->userId, PDO::PARAM_STR);

            if($stmt->execute()){
                $conn->commit();
                echo AppUtil::getReturnStatus("Successful","User Modified successfully");

            }else{

                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }

        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception",$e);
        }

    }
    public static function deleteUser($key,$userId)
    {
        $delFlg='1';
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();
            $stmt = $conn->prepare("UPDATE `usermaster` SET `isDeleted`=:flag,`deletedBy`=:deletedBy,`deletionDate`=now() WHERE userid=:key");

            $stmt->bindParam(':flag',$delFlg , PDO::PARAM_STR);
            $stmt->bindParam(':deletedBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':key', $key, PDO::PARAM_STR);

            if($stmt->execute()){
                $stmt = $conn->prepare("DELETE FROM `logindetails` WHERE `userId`=:userid");
                $stmt->bindParam(':userId', $key, PDO::PARAM_STR);
                if($stmt->execute()){
                    $conn->commit();
                    echo AppUtil::getReturnStatus("Successful","User Deleted successfully");
                }else{
                    $conn->rollBack();
                    echo AppUtil::getReturnStatus("Unsuccessful","Can not delete user");
                }


            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }

        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching company details");
        }
    }

    public static function getUserDetails($keyword,$searchBy,$userId)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();

            if($searchBy=="userId")
                $keyword=$userId;
            else
                $keyword= "%".$keyword."%";

//            echo $keyword;
            $selectStmt=self::getSearchQueryForUser($searchBy);
//            $selectStmt="SELECT `userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`, `isDeleted`, `deletedBy`, `deletionDate` FROM `usermaster` WHERE `userId`=:keyword";
            $stmt = $conn->prepare($selectStmt);
            $stmt->bindParam(':keyword',$keyword, PDO::PARAM_STR);

            if($stmt->execute()){

                $noOfRows=0;
                $json_response = array();
                while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $result_array = array();
                    $result_array['userId'] = $result['userId'];
                    $result_array['firstName'] = $result['firstName'];
                    $result_array['lastName'] =$result['lastName'];
//                    $result_array['dateOfBirth'] =$result['dateOfBirth'];
                    $date = date('m-d-Y', strtotime($result['dateOfBirth']));
                    $result_array['dateOfBirth'] =$date;
                    $result_array['address'] =$result['address'];
                    $result_array['city'] =$result['city'];
                    $result_array['state'] =$result['state'];
                    $result_array['country'] =$result['country'];
                    $result_array['pincode'] =$result['pincode'];
                    $result_array['emailId'] =$result['emailId'];
                    $result_array['mobileNumber'] =$result['mobileNumber'];

                    $stmt1 = $conn->prepare("SELECT a.designation ,a.userType,b.rolename,b.roleId  from userroleinfo a,rolemaster b where a.userid=:userid AND a.roleid=b.roleid");
                    $stmt1->bindParam(':userid', $result['userId'], PDO::PARAM_STR);
                    if($stmt1->execute()) {
                        while($result1 = $stmt1->fetch(PDO::FETCH_ASSOC)) {
                            $result_array['designation'] = $result1['designation'];
                            $result_array['role'] = $result1['rolename'];
                            $result_array['userType'] = $result1['userType'];
                            $result_array['roleId'] = $result1['roleId'];
                        }

                    }
                    else
                    {}

                    array_push($json_response, $result_array); //push the values in the array
                    $noOfRows++;

                }
                if($noOfRows>0){

                    echo AppUtil::getReturnStatus("Successful",$json_response);}
                else {

                    echo AppUtil::getReturnStatus("NoRows", "No User found");
                }
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }

        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching User details");
        }


    }

    private static function getSearchQueryForUser($searchBy){
        $searchBy=strtolower($searchBy);

        if($searchBy == 'name')
        {
            return self::getQueryForSearchUserByName();

        }
        else if($searchBy == 'city')
        {
           return self::getQueryForUserByCity();
        }

        else if($searchBy == 'designation')
        {
            return self::getQueryForSearchUserByDesignation();
        }
        else if($searchBy == 'type')
        {
           return self::getQueryForUserByUserType();
        }
        else if($searchBy=='userid')
        {

            return self::getQueryForUserByUserID();
        }else{

        }

    }

    private static function getQueryForSearchUserByName(){
        return "SELECT `userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId` FROM `usermaster` where `isDeleted`!=1 AND (firstname like :keyword or lastname like :keyword)";
    }

    private static function getQueryForSearchUserByDesignation(){
        return "SELECT `userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId` FROM `usermaster` where `isDeleted`!=1 AND `userId` IN (SELECT `userId` FROM `userroleinfo` WHERE `designation` like :keyword)";
    }

    private static function getQueryForUserByUserType(){
        return "SELECT `userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId` FROM `usermaster` where `isDeleted`!=1 AND `userId` IN (SELECT `userId` FROM `userroleinfo` WHERE `userType` like :keyword)";
    }

    private static function getQueryForUserByCity(){
        return "SELECT `userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId` FROM `usermaster` where `isDeleted`!=1 AND city like :keyword";
    }

    public static function getRoleDetails($key,$userId)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $key="%".$key."%";

            $stmt = $conn->prepare("SELECT roleId,roleName,createdBy,creationDate from rolemaster where roleName like :keyword");
            $stmt->bindParam(':keyword', $key, PDO::PARAM_STR);
            if($stmt->execute()){

                $noOfRows=0;
                $json_response = array();

                while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $result_array = array();
                    $result_array['roleId'] = $result['roleId'];
                    $result_array['roleName'] = $result['roleName'];
                    $date = new DateTime($result['creationDate']);
                    $dob = $date->format('Y-m-d');

                    $result_array['creationDate'] =$dob;

                    $stmt1 = $conn->prepare("select firstname from usermaster where userid=:userId");
                    $stmt1->bindParam(':userId', $result['createdBy'], PDO::PARAM_STR);
                    if($stmt1->execute()){
                        while ( $result1=$stmt1->fetch(PDO::FETCH_ASSOC))
                        {

                            $result_array['createdBy']= $result1['firstname'];
                        }
                    }

                    array_push($json_response, $result_array); //push the values in the array
                    $noOfRows++;

                }
                if($noOfRows>0){

                    echo AppUtil::getReturnStatus("Successful",$json_response);}
                else {

                    echo AppUtil::getReturnStatus("NoRows", "No Role found");
                }
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }






        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching company details");
        }

    }

    private static function getQueryForUserByUserID(){
        return "SELECT `userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`, `isDeleted`, `deletedBy`, `deletionDate` FROM `usermaster` WHERE `userId`=:keyword";
    }
    public static function ChangePassword($data,$userId)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();

            $stmt = $conn->prepare("SELECT count(1) as count FROM `logindetails` WHERE `userid`=:username AND `password`=:password");

            $stmt->bindParam(':username', $userId, PDO::PARAM_STR);
            //echo $userId."\n";
            $pass=sha1($data->data->oldPass);
            //echo $pass;
            //echo $pass;
            $stmt->bindParam(':password',$pass , PDO::PARAM_STR);

            if($stmt->execute()){

                //$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
                $result=$stmt->fetch(PDO::FETCH_ASSOC);
                $count=$result['count'];
                //echo "\n".$count;
                if($count > 0)
                {
                    $stmt = $conn->prepare("UPDATE logindetails set password=:password where userid=:username");
                    $stmt->bindParam(':username', $userId, PDO::PARAM_STR);
                    $pass=sha1($data->data->newPass);
                    //echo $pass;
                    $stmt->bindParam(':password',$pass , PDO::PARAM_STR);
                    if($stmt->execute())
                    {
                        $conn->commit();
                        echo AppUtil::getReturnStatus("Successful","Password Changed successfully");
                    }
                    else{

                        echo AppUtil::getReturnStatus("Unsuccessful","Problems in changing password");
                    }
                }
                else
                {
                    echo AppUtil::getReturnStatus("WrongPass","Entered password is wrong ");
                }

            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }


        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception","Exception Occurred while getting access permission");
        }

    }

    public static function getCompanyDetails()
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT `companyId`, `companyName`, `companyAbbrevation`, `startDate`, `address`, `city`, `state`, `country`, `pincode`, `emailId`, `phoneNumber` FROM `companymaster`");

            if($stmt->execute()){

                $noOfRows=0;
                $json_response = array();
                while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $result_array = array();
                    $result_array['companyId'] = $result['companyId'];
                    $result_array['companyName'] = $result['companyName'];
                    $result_array['companyAbbrevation'] =$result['companyAbbrevation'];
                    $result_array['startDate'] =$result['startDate'];
                    $result_array['address'] =$result['address'];
                    $result_array['city'] =$result['city'];
                    $result_array['state'] =$result['state'];
                    $result_array['country'] =$result['country'];
                    $result_array['pincode'] =$result['pincode'];
                    $result_array['emailId'] =$result['emailId'];
                    $result_array['phoneNumber'] =$result['phoneNumber'];
                    array_push($json_response, $result_array); //push the values in the array
                    $noOfRows++;

                }
                if($noOfRows>0){

                    echo AppUtil::getReturnStatus("Successful",$json_response);}
                else {

                    echo AppUtil::getReturnStatus("NoRows", "No companies found");
                }
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
            }






        }catch(Exception $e){

            echo AppUtil::getReturnStatus("Exception","Exception Occurred while fetching company details");
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
          $stmt = $conn->prepare("SELECT `accessId`, `ModuleName`, `accessType` FROM `accesspermission` WHERE `accessId` NOT IN (SELECT `accessId` FROM `roleaccesspermission` where `roleId` IN (SELECT `roleId` FROM `userroleinfo` WHERE `userId`=:userId))");
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
                 echo AppUtil::getReturnStatus("NoRows","User has All The Permissions");
          
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
            $fromDate= $date->format('Y-m-d H:i:s');

            $stmt->bindParam(':fromDate', $fromDate, PDO::PARAM_STR);
            $date = new DateTime($data->accessRequest->toDate);

           $toDate= $date->format('Y-m-d H:i:s');

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
            echo AppUtil::getReturnStatus("Exception","Exception Occurred while requesting access");
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

                         $stmt1 = $conn->prepare("INSERT INTO `tempaccesspermissions`(`requestId`, `userId`, `accessId`, `fromDate`, `toDate`)
                          VALUES (:requestId,:userId,:accessId,:fromDate,:toDate)");
                          $stmt1->bindParam(':requestId', $requestId, PDO::PARAM_STR);
                          $stmt1->bindParam(':userId', $requestedBy, PDO::PARAM_STR);
                          $stmt1->bindParam(':accessId', $result['accessId'], PDO::PARAM_STR);
                          $stmt1->bindParam(':fromDate', $fromDate, PDO::PARAM_STR);
                          $stmt1->bindParam(':toDate', $toDate, PDO::PARAM_STR);
                          if(!$stmt1->execute()){

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
                }else
                    $rollback=false;
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
            echo AppUtil::getReturnStatus("Exception",$e->getMessage());
        }

    }



    public static function modifyRole($roleId ,$roleName,$accessList, $userId)
    {

        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();

            $conn->beginTransaction();

            $stmt = $conn->prepare("SELECT * FROM `rolemaster` WHERE `roleId`=:roleId");
            $stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);

            $rollback = true;
            if ($stmt->execute()) {
                $result=$stmt->fetchAll(PDO::FETCH_ASSOC);

                if (count($result) <= 0) {
                    echo AppUtil::getReturnStatus("Unsuccessful", "Role not found");
                    return;
                }else{

                    $stmt = $conn->prepare("DELETE FROM `roleaccesspermission` WHERE `roleId`=:roleId");
                    $stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);
                    if($stmt->execute()){

                        $stmt= $conn->prepare("UPDATE `rolemaster` SET `roleName`=:roleName , `lastModifiedBy`=:userId,`lasModificationDate`=now() WHERE `roleId`=:roleId");
                        $stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);
                        $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                        $stmt->bindParam(':roleName', $roleName, PDO::PARAM_STR);

                        if($stmt->execute()){

                            $isBreak=false;
                            foreach ($accessList as $accessEntry) {
                                if ($accessEntry->read->val) {
                                    if (!Config::insertAccessPermissionForRole($stmt, $conn, $roleId, $userId, $accessEntry->read->accessId)) {
                                        $isBreak=true;
                                        break;
                                    }
                                }
                                if ($accessEntry->write->val) {
                                    if (!Config::insertAccessPermissionForRole($stmt, $conn, $roleId, $userId, $accessEntry->write->accessId)) {
                                        $isBreak=true;
                                        break;
                                    }
                                }
                            }
                            if(!$isBreak) {
                                $rollback = false;

                            }
                        }
                    }

                }

            }
            if ($rollback) {
                $conn->rollback();
                echo AppUtil::getReturnStatus("Unsuccessful", "Unknown database error occurred");
            } else {
                $conn->commit();
                echo AppUtil::getReturnStatus("Successful", "Role Modified successfully");
            }

        } catch (Exception $e) {
            echo AppUtil::getReturnStatus("Exception", "Exception Occurred while creating role");
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

    public static function getAllProcessUser($userId)
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        try {
            $stmt = $conn->prepare("SELECT `userId`,`firstName`,`lastName` FROM `usermaster` WHERE `userId` IN (SELECT `userId` FROM `userroleinfo` WHERE `roleId` IN (SELECT `roleId` FROM `roleaccesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `accesspermission` WHERE `ModuleName`=\"Business Process\")))");
            if ($stmt->execute()) {
                $result = $stmt->fetchAll();
                echo  AppUtil::getReturnStatus("Successful",$result);
            } else {
                echo AppUtil::getReturnStatus("Failure", "Database Error Occurred");
            }
        }catch(Exceptio $e){
            echo AppUtil::getReturnStatus("Exception",$e.getMessage());
        }
    }

    public static function getAccessApprovals()
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        try {
            $stmt = $conn->prepare("SELECT tempaccessrequest.`requestId`,`firstName`,`lastName`,tempaccessrequest.`description` FROM `usermaster`,`tempaccessrequest` where usermaster.userId=tempaccessrequest.requestedBy AND tempaccessrequest.`requestId` NOT IN (SELECT `requestId` FROM `tempaccessrequestaction`)");
            if ($stmt->execute()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo  AppUtil::getReturnStatus("Successful",$result);
            } else {
                echo AppUtil::getReturnStatus("Failure", "Database Error Occurred");
            }
        }catch(Exceptio $e){
            echo AppUtil::getReturnStatus("Exception",$e.getMessage());
        }
    }


}

?>