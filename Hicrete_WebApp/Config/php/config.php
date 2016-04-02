<?php
require_once '../../php/Database.php';
require_once '../../php/appUtil.php';

class Config
{


    public static function isCompanyAvailable($companyName)
    {
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("select count(1) as count from companymaster where companyName=:companyName");
            $stmt->bindParam(':companyName', $companyName, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $result['count'];

            if ($count != 0) {
                return 0;
            } else
                return 1;
        }
        catch(Exception $e)
        {

        }

    }


    public static function addCompany($data, $userId)
    {

        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();

            if(config::isCompanyAvailable($data->name)) {
                $conn->beginTransaction();
                $companyId = AppUtil::generateId();


                $stmt = $conn->prepare("INSERT INTO `companymaster`(`companyId`, `companyName`, `companyAbbrevation`, `startDate`, `address`, `city`, `state`, `country`, `pincode`, `emailId`, `phoneNumber`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`)
                VALUES (:id,:name,:abbrevation,:startDate,:address,:city,:state,:country,:pincode,:email,:phone,:createdBy,now(),:lastModifiedBy,now())");

                $date = new DateTime($data->startdate);
                $startdate = $date->format('Y-m-d');
                $stmt->bindParam(':id', $companyId, PDO::PARAM_STR);
                $stmt->bindParam(':name', $data->name, PDO::PARAM_STR);
                $stmt->bindParam(':abbrevation', $data->abbrevation, PDO::PARAM_STR);
                $stmt->bindParam(':startDate', $startdate, PDO::PARAM_STR);
                $stmt->bindParam(':address', $data->address, PDO::PARAM_STR);
                $stmt->bindParam(':city', $data->city, PDO::PARAM_STR);
                $stmt->bindParam(':state', $data->state, PDO::PARAM_STR);
                $stmt->bindParam(':country', $data->country, PDO::PARAM_STR);
                $stmt->bindParam(':pincode', $data->pincode, PDO::PARAM_STR);
                $stmt->bindParam(':email', $data->email, PDO::PARAM_STR);
                $stmt->bindParam(':phone', $data->phone, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
                if ($stmt->execute()) {
                    $stmt = $conn->prepare("INSERT INTO `company_bank_details`(`companyId`, `BankName`, `BankBranch`, `AccountName`, `AccountNo`, `AccountType`, `IFSCCode`)
                        VALUES (:id,:bankName,:bankBranch,:accountName,:accountNo,:accountType,:ifscCode)");
                    $stmt->bindParam(':id', $companyId, PDO::PARAM_STR);
                    $stmt->bindParam(':bankName', $data->bankName, PDO::PARAM_STR);
                    $stmt->bindParam(':bankBranch', $data->bankBranch, PDO::PARAM_STR);
                    $stmt->bindParam(':accountName', $data->accountName, PDO::PARAM_STR);
                    $stmt->bindParam(':accountNo', $data->accountNo, PDO::PARAM_STR);
                    $stmt->bindParam(':accountType', $data->accountType, PDO::PARAM_STR);
                    $stmt->bindParam(':ifscCode', $data->IFSCCode, PDO::PARAM_STR);
                    if ($stmt->execute()) {
                        $conn->commit();
                        echo AppUtil::getReturnStatus("Successful", "Company Created Successfully");
                    } else {
                        $conn->rollBack();
                        echo AppUtil::getReturnStatus("Unsuccessful", "Cannot Add Bank Details");
                    }


                } else {

                    echo AppUtil::getReturnStatus("Unsuccessful", "Cannot Create Company");

                }
            }
            else
            {
                echo AppUtil::getReturnStatus("Unsuccessful", "Company is already available");
            }

        } catch (Exception $e) {

            echo AppUtil::getReturnStatus("Exception", "Exception Occurred while creating company");

        }

    }


    public static function addWarehouse($data, $userId)
    {

        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $warehouseId = AppUtil::generateId();


            $stmt = $conn->prepare("INSERT INTO `warehousemaster`(`warehouseId`, `wareHouseName`, `warehouseAbbrevation`, `address`, `city`, `state`, `country`, `pincode`, `phoneNumber`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) 
                VALUES (:id,:name,:abbrevation,:address,:city,:state,:country,:pincode,:phone,:createdBy,now(),:lastModifiedBy,now())");

            $stmt->bindParam(':id', $warehouseId, PDO::PARAM_STR);
            $stmt->bindParam(':name', $data->name, PDO::PARAM_STR);
            $stmt->bindParam(':abbrevation', $data->abbrevation, PDO::PARAM_STR);
            $stmt->bindParam(':address', $data->address, PDO::PARAM_STR);
            $stmt->bindParam(':city', $data->city, PDO::PARAM_STR);
            $stmt->bindParam(':state', $data->state, PDO::PARAM_STR);
            $stmt->bindParam(':country', $data->country, PDO::PARAM_STR);
            $stmt->bindParam(':pincode', $data->pincode, PDO::PARAM_STR);
            $stmt->bindParam(':phone', $data->phone, PDO::PARAM_STR);
            $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
            if ($stmt->execute()) {
                echo AppUtil::getReturnStatus("Successful", "");


            } else {

                echo AppUtil::getReturnStatus("Unsuccessful", "Insert failed");

            }


        } catch (Exception $e) {

            echo AppUtil::getReturnStatus("Exception", "Exception Occurred while creating warehouse");

        }

    }

    public static function isRoleAvailable($roleName)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("select count(1) as count from rolemaster where roleName=:roleName");
            $stmt->bindParam(':roleName', $roleName, PDO::PARAM_STR);
            $stmt ->execute();
            $result=$stmt->fetch(PDO::FETCH_ASSOC);
            $count=$result['count'];

            if($count!=0)
            {
                return 0;
            }
            else
                return 1;


        }
        catch(Exception $e)
        {

        }

    }


    public static function addRole($data, $userId)
    {

        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();

            if(config::isRoleAvailable($data->roleName)) {
                $conn->beginTransaction();


                $roleId = AppUtil::generateId();
                $stmt = $conn->prepare("INSERT INTO `rolemaster`(`roleId`, `roleName`, `createdBy`, `creationDate`)
                    VALUES (:roleId,:roleName,:createdBy,now())");
                $stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);
                $stmt->bindParam(':roleName', $data->roleName, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);

                $rollback = false;
                if ($stmt->execute()) {

                    foreach ($data->accessPermissions as $accessEntry) {

                        if ($accessEntry->read->val) {
                            if (!Config::insertAccessPermissionForRole($stmt, $conn, $roleId, $userId, $accessEntry->read->accessId)) {
                                $rollback = true;
                            }

                        }

                        if ($accessEntry->write->val) {
                            if (!Config::insertAccessPermissionForRole($stmt, $conn, $roleId, $userId, $accessEntry->write->accessId)) {
                                $rollback = true;
                            }
                        }
                    }
                } else {
                    echo AppUtil::getReturnStatus("Unsuccessful", "Unknown database error occurred");
                }


                if ($rollback) {
                    $conn->rollback();
                    echo AppUtil::getReturnStatus("Unsuccessful", "Unknown database error occurred");
                } else {
                    $conn->commit();
                    echo AppUtil::getReturnStatus("Successful", "Role created successfully");
                }
            }
            else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Role is Already Available");
            }
        } catch (Exception $e) {
            echo AppUtil::getReturnStatus("Exception", "Exception Occurred while creating role");
        }

    }

    public static function insertAccessPermissionForRole($stmt, $conn, $roleId, $userId, $accessId)
    {
        $permissionId = AppUtil::generateId();
        $stmt = $conn->prepare("INSERT INTO `roleaccesspermission`(`roleAccessId`, `roleId`, `accessId`, `createdBy`, `creationDate`)
              VALUES (:permissionId,:roleId,:accessId,:createdBy,now())");
        $stmt->bindParam(':permissionId', $permissionId, PDO::PARAM_STR);
        $stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);
        $stmt->bindParam(':accessId', $accessId, PDO::PARAM_STR);
        $stmt->bindParam(':createdBy', $userId, PDO::PARAM_STR);
        return $stmt->execute();
    }

    private static function insertRoleInfo($conn, $userId, $designation, $roleId, $userType, $requestUserId)
    {
        $stmt = $conn->prepare("INSERT INTO `userroleinfo`(`userId`, `designation`, `roleId`, `userType`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) 
        VALUES (:userId,:designation,:roleId,:userType,:createdBy,now(),:lastModifiedBy,now())");
        $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
        $stmt->bindParam(':designation', $designation, PDO::PARAM_STR);
        $stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);
        $stmt->bindParam(':userType', $userType, PDO::PARAM_STR);
        $stmt->bindParam(':lastModifiedBy', $requestUserId, PDO::PARAM_STR);
        $stmt->bindParam(':createdBy', $requestUserId, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public static function addSuperUser($data, $loggedInUserId)
    {

        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();

            $userId = AppUtil::generateId();
            $date = new DateTime($data->superUserInfo->dateOfBirth);
            $dob = $date->format('Y-m-d');

            $stmt = $conn->prepare("INSERT INTO `usermaster`(`userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`,`isSuperUser`)
                VALUES (:userId,:firstName,:lastName,:dob,:address,:city,:state,:country,:pincode,:mobileNumber,:emailId,:createdBy,now(),:lastModifiedBy,now(),1)");

            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
           // $stmt->bindParam(':designation', $data->superUserInfo->designation, PDO::PARAM_STR);
            $stmt->bindParam(':firstName', $data->superUserInfo->firstName, PDO::PARAM_STR);
            $stmt->bindParam(':lastName', $data->superUserInfo->lastName, PDO::PARAM_STR);
            $stmt->bindParam(':dob', $dob, PDO::PARAM_STR);
            $stmt->bindParam(':address', $data->superUserInfo->address, PDO::PARAM_STR);
            $stmt->bindParam(':city', $data->superUserInfo->city, PDO::PARAM_STR);
            $stmt->bindParam(':state', $data->superUserInfo->state, PDO::PARAM_STR);
            $stmt->bindParam(':country', $data->superUserInfo->country, PDO::PARAM_STR);
            $stmt->bindParam(':pincode', $data->superUserInfo->pincode, PDO::PARAM_STR);
            $stmt->bindParam(':mobileNumber', $data->superUserInfo->phone, PDO::PARAM_STR);
            $stmt->bindParam(':emailId', $data->superUserInfo->email, PDO::PARAM_STR);
            $stmt->bindParam(':createdBy', $loggedInUserId, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $loggedInUserId, PDO::PARAM_STR);


            if ($stmt->execute()) {
                $stmt = $conn->prepare("INSERT INTO `superuserdesignation`(`userId`, `designation`) VALUES (:userId,:designation)");
                $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':designation', $data->superUserInfo->designation, PDO::PARAM_STR);
                if($stmt->execute()){
                    $stmt = $conn->prepare("INSERT INTO `logindetails`(`userId`, `userName`, `password`)
                            VALUES (:userId,:userName,:password)");
                    $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                    $stmt->bindParam(':userName', $data->superUserInfo->email, PDO::PARAM_STR);
                    $password = mt_rand(1000000, 9999999);
                    $hash = sha1($password);
                    $stmt->bindParam(':password', $hash, PDO::PARAM_STR);
                    if($stmt->execute()){
                        echo AppUtil::getReturnStatus("Success","Super User created successfully. Username is :".$data->superUserInfo->email.
                            "  Password is:".$password);
                        $conn->commit();
                        AppUtil::sendMail($data->superUserInfo->email,$password,$data->superUserInfo->email,$data->superUserInfo->firstName);
                    }else{
                        echo AppUtil::getReturnStatus("fail","Database Error Occurred");
                        $conn->rollBack();
                    }

                }else{
                    echo AppUtil::getReturnStatus("fail","Database Error Occurred");
                    $conn->rollBack();
                }
            }else{
                echo AppUtil::getReturnStatus("fail","Database Error Occurred");
                $conn->rollBack();
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Exception","Exception Occurred");
        }
    }

    private static function insertUserAccessPermission($conn, $userId, $requestUserId, $accessId)
    {

        $permissionId = AppUtil::generateId();
        $stmt = $conn->prepare("INSERT INTO `useraccesspermission`(`permissionId`, `userId`, `accessId`, `createdBy`, `creationDate`)
                VALUES (:permissionId,:userId,:accessId,:createdBy,now())");
        $stmt->bindParam(':permissionId', $permissionId, PDO::PARAM_STR);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
        $stmt->bindParam(':accessId', $accessId, PDO::PARAM_STR);
        $stmt->bindParam(':createdBy', $requestUserId, PDO::PARAM_STR);
        return $stmt->execute();

    }


    public static function isUserAvailable($emailId)
    {
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("select count(1) as count from usermaster where emailId=:emailId");
            $stmt->bindParam(':emailId', $emailId, PDO::PARAM_STR);
            $stmt ->execute();
            $result=$stmt->fetch(PDO::FETCH_ASSOC);
            $count=$result['count'];

            if($count!=0)
            {
                return 0;
            }
            else
                return 1;


        }
        catch(Exception $e)
        {

        }

    }
    public static function addUser($data, $requestUserId)
    {

        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();



            if(Config::isUserAvailable($data->userInfo->email)) {
                $conn->beginTransaction();
                $password = "";
                $userId = AppUtil::generateId();
                $date = new DateTime($data->userInfo->dob);
                $dob = $date->format('Y-m-d');
                $stmt = $conn->prepare("INSERT INTO `usermaster`(`userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`)
                VALUES (:userId,:firstName,:lastName,:dob,:address,:city,:state,:country,:pincode,:mobileNumber,:emailId,:createdBy,now(),:lastModifiedBy,now())");
                $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                $stmt->bindParam(':firstName', $data->userInfo->firstName, PDO::PARAM_STR);
                $stmt->bindParam(':lastName', $data->userInfo->lastName, PDO::PARAM_STR);
                $stmt->bindParam(':dob', $dob, PDO::PARAM_STR);
                $stmt->bindParam(':address', $data->userInfo->address, PDO::PARAM_STR);
                $stmt->bindParam(':city', $data->userInfo->city, PDO::PARAM_STR);
                $stmt->bindParam(':state', $data->userInfo->state, PDO::PARAM_STR);
                $stmt->bindParam(':country', $data->userInfo->country, PDO::PARAM_STR);
                $stmt->bindParam(':pincode', $data->userInfo->pincode, PDO::PARAM_STR);
                $stmt->bindParam(':mobileNumber', $data->userInfo->mobile, PDO::PARAM_STR);
                $stmt->bindParam(':emailId', $data->userInfo->email, PDO::PARAM_STR);
                $stmt->bindParam(':createdBy', $requestUserId, PDO::PARAM_STR);
                $stmt->bindParam(':lastModifiedBy', $requestUserId, PDO::PARAM_STR);

                $rollback = false;
                if ($stmt->execute()) {

                    if (!Config::insertRoleInfo($conn, $userId, $data->userInfo->designation, $data->roleId, $data->userInfo->userType, $requestUserId)) {

                        $rollback = true;
                    } else {
//                    foreach ($data->accessPermissions as $accessEntry) {
//                        if ($accessEntry->read->ispresent) {
//                            if (!Config::insertUserAccessPermission($conn, $userId, $requestUserId, $accessEntry->read->accessId)) {
//                                $rollback = true;
//
//                                break;
//                            }
//
//                        }
//
//                        if ($accessEntry->write->ispresent) {
//                            if (!Config::insertUserAccessPermission($conn, $userId, $requestUserId, $accessEntry->write->accessId)) {
//                                $rollback = true;
//
//                                break;
//                            }
//                        }
//                    }


                        //if (!$rollback) {
                        $str = $data->userInfo->email . $userId;

                        $stmt = $conn->prepare("INSERT INTO `logindetails`(`userId`, `userName`, `password`) 
                            VALUES (:userId,:userName,:password)");
                        $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
                        $stmt->bindParam(':userName', $data->userInfo->email, PDO::PARAM_STR);
                        $password = mt_rand(1000000, 9999999);
                        $hash = sha1($password);
                        $stmt->bindParam(':password', $hash, PDO::PARAM_STR);
                        if (!$stmt->execute()) {

                            $rollback = true;
                        }
                        //}

                    }
                } else {
                    echo AppUtil::getReturnStatus("Unsuccessful", "Unknown database error occurred");
                }


                if ($rollback) {
                    $conn->rollback();
                    echo AppUtil::getReturnStatus("Unsuccessful", "Unknown database error occurred");
                } else {
                    $conn->commit();
                    echo AppUtil::getReturnStatus("Successful", $password);
                    AppUtil::sendMail($data->userInfo->email, $password, $data->userInfo->email, $data->userInfo->firstName);
                }
            }
            else
            {
                echo AppUtil::getReturnStatus("Unsuccessful", "User Already Available");
            }

        } catch (Exception $e) {
            echo AppUtil::getReturnStatus("Exception", "Exception Occurred while creating role");
        }

    }

    public static function modifyUserDetails($data)
    {
        try{

            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();
            $date = new DateTime($data->userInfo->newDate);
            $dob = $date->format('Y-m-d');
            $userId=$data->userInfo->userId;
            $stmt=$conn->prepare("UPDATE usermaster SET firstName=:firstName,
            lastName=:lastName,dateOfBirth=:dateOfBirth,address=:address,city=:city,state=:state,country=:country,pincode=:pincode,mobileNumber=:mobileNumber,lastModifiedBy=:lastModifiedBy,lastModificationDate=now(),profilePicPath=:profilePicPath WHERE userId = :userId");

            $stmt->bindParam(':firstName', $data->userInfo->firstName, PDO::PARAM_STR);
            $stmt->bindParam(':lastName', $data->userInfo->lastName, PDO::PARAM_STR);
            $stmt->bindParam(':dateOfBirth', $dob, PDO::PARAM_STR);
            $stmt->bindParam(':address', $data->userInfo->address, PDO::PARAM_STR);
            $stmt->bindParam(':city', $data->userInfo->city, PDO::PARAM_STR);
            $stmt->bindParam(':state', $data->userInfo->state, PDO::PARAM_STR);
            $stmt->bindParam(':country', $data->userInfo->country, PDO::PARAM_STR);
            $stmt->bindParam(':pincode', $data->userInfo->pincode, PDO::PARAM_STR);
            $stmt->bindParam(':mobileNumber', $data->userInfo->mobileNumber, PDO::PARAM_STR);
            $stmt->bindParam(':lastModifiedBy', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':profilePicPath', $data->userInfo->profilePic, PDO::PARAM_STR);

            if($stmt->execute()){
                $conn->commit();
                echo "Profile Modified successfully";
            }else{
                echo "Something went wrong.Please try again";
            }
        }catch(Exception $e) {
            echo $e->getMessage();
        }

    }
    public static function uploadProfilePicture(){
        $target_dir = "../../upload/Workorders/";
        $target_file = $target_dir . basename($_FILES["file"]["name"]);
        $file = $_FILES['file'];
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            echo "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
    public static function getCompanys($userId)
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("SELECT * FROM companymaster");
        $stmt->execute();
        $result = $stmt->fetchAll();
        $json = json_encode($result);
        echo $json;

    }

    public static function getWarehouse($userId)
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        $stmt1 = $conn->prepare("SELECT * FROM warehousemaster");
        $stmt1->execute();

        $result1 = $stmt1->fetchAll();
        $json = json_encode($result1);
        echo $json;
    }


    public static function getCompanyList($userId)
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        try {
            $stmt = $conn->prepare("SELECT `companyId` ,`companyName` FROM `companymaster`");
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


}


?>