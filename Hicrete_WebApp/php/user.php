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
    public $isPayroll=false;
    public $isAdmin=false;

    private function populateAccessRights($userId){
    	$db = Database::getInstance();
        $conn = $db->getConnection();
    	$stmt = $conn->prepare("SELECT DISTINCT(`ModuleName`) FROM `accesspermission` WHERE `accessId` IN (SELECT `accessId` FROM `useraccesspermission` WHERE `userId`=:userId)"); 
    	
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

    public function init($userId){
    
    	$db = Database::getInstance();
        $conn = $db->getConnection();
    	$stmt = $conn->prepare("SELECT  usermaster.firstName, usermaster.lastName, usermaster.emailId,userroleinfo.designation,userroleinfo.userType
			FROM    `usermaster` INNER JOIN `userroleinfo` ON userroleinfo.userId=usermaster.userId
			WHERE   usermaster.userId =:userId"); 
    	$stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    	$stmt->execute();
    	$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		
		if (count($result) <= 0) {
			return false;
		}else{
			$this->username=$result[0]['firstName']." ".$result[0]['lastName'];
			$this->emailId=$result[0]['emailId'];
			$this->designation=$result[0]['designation'];
			$userType=$result[0]['userType'];
            
			if(strcasecmp($userType,"Admin")==0){
				$this->isAdmin=true;
			}
			
			$this->populateAccessRights($userId);
			return true;
		}
    }




}


?>