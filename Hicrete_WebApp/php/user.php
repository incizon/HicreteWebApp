<?php
require_once 'Database.php';
class User
{
    
    public $username;
    public $designation;
    public $emailId;

    public $isInventory=false;
    public $isApplicator=false;
    public $isBusinessProcess=false;
    public $isExpense=false;
    public $isReporting=true;
    public $isPayroll=true;
    public $isAdmin=false;
	public $isSuper=false;
    private function populateAccessRights($roleId,$userId){
    	$db = Database::getInstance();
        $conn = $db->getConnection();
    	$stmt = $conn->prepare("SELECT DISTINCT(`ModuleName`) FROM `accesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `roleaccesspermission` WHERE `roleId`=:roleId) OR `accessId` IN (SELECT `accessId` FROM `tempaccesspermissions` WHERE `userId`=:userId AND `fromDate` < now() AND `toDate` >  now())");
		$stmt->bindParam(':roleId', $roleId, PDO::PARAM_STR);
    	$stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    	$stmt->execute();
    	while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
        {
             $moduleName=$result['ModuleName'];        
             if($moduleName=="Inventory"){
             	$this->isInventory=true;
             }  else if($moduleName=="Applicator"){
             	$this->isApplicator=true;
             }else if($moduleName=="Expense"){
             	$this->isExpense=true;
             } else if($moduleName=="Business Process"){
             	$this->isBusinessProcess=true;
             } else if($moduleName=="Payroll"){
             	$this->isPayroll=true;
             }
        }

    }

	public function loadSuperUserDesignation($userId){
		$db = Database::getInstance();
		$conn = $db->getConnection();

		$stmt = $conn->prepare("SELECT `designation` FROM `superuserdesignation` WHERE `userId` =:userId");
		$stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);

		if (count($result) <= 0) {
			return false;
		}else {
			$this->designation = $result[0]['designation'];
			return true;
		}
		return false;


	}

    public function init($userId){
    
    	$db = Database::getInstance();
        $conn = $db->getConnection();

    	$stmt = $conn->prepare("SELECT  usermaster.firstName, usermaster.lastName, usermaster.emailId,`isSuperUser`,usermaster.profilePicPath FROM  `usermaster` where `userId`=:userId AND `isDeleted`=0");
    	$stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    	$stmt->execute();
    	$result=$stmt->fetchAll(PDO::FETCH_ASSOC);

		if (count($result) <= 0) {
			return false;
		}else{

			$this->username=$result[0]['firstName']." ".$result[0]['lastName'];
			$this->emailId=$result[0]['emailId'];
			$this->profilePicPath=$result[0]['profilePicPath'];
			if($this->profilePicPath==null){
				$this->profilePicPath="upload/ProfilePictures/no-image.jpg";
			}
			$this->isSuper=$result[0]['isSuperUser'];
			if($this->isSuper){
				return $this->loadSuperUserDesignation($userId);
			}else{
				$stmt = $conn->prepare("SELECT `designation`,`roleId`,`userType` FROM `userroleinfo` WHERE `userId`=:userId");
				$stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
				$stmt->execute();
				$this->designation=$result[0]['designation'];
				$userType=$result[0]['userType'];
				$roleId=$result[0]['roleId'];
				if(strcasecmp($userType,"Admin")==0){
					$this->isAdmin=true;
				}

				$this->populateAccessRights($roleId);
				return true;
			}

		}
    }




}


?>