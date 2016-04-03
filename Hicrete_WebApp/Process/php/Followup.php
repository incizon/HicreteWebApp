<?php
require_once '../../php/appUtil.php';
require_once '../../php/Database.php';

Class Followup {
	
	public function getPaymentFollowup($id) {
			$object = array();

			$db = Database::getInstance();
			$conn = $db->getConnection();

		$t=time();
		$current =date("Y-m-d",$t);
			$stmt = $conn->prepare("SELECT * FROM project_payment_followup ppf where ppf.AssignEmployee = :id AND ppf.`FollowupDate`<=:currentDate AND ppf.FollowupId NOT IN (SELECT `FollowupId` FROM `project_payment_followup_details`)");
			//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
			$stmt->bindParam(':id', $id, PDO::PARAM_STR);
			$stmt->bindParam(':currentDate', $current, PDO::PARAM_STR);

			if($stmt->execute()){
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
				}
			}else{

				return null;
			}


			$db = null;
			return $object ;
		//return "i m in";
	}


	public function getApplicatorFollowup($id) {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();

		$t=time();
		$current =date("Y-m-d",$t);
		/*$stmt = $conn->prepare("SELECT * FROM payment_retention_followup prf ,project_payment_followup ppf where q.AssignEmployee = :id");*/
		$stmt = $conn->prepare("SELECT * FROM `applicator_follow_up` af WHERE `assignEmployeeId`= :id AND af.`date_of_follow_up`<=:currentDate AND af.`follow_up_id` NOT IN (SELECT `follow_up_id` FROM `applicator_payment_follow_up_info`)");
		//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
		$stmt->bindParam(':id', $id, PDO::PARAM_STR);
		$stmt->bindParam(':currentDate', $current, PDO::PARAM_STR);

		if($stmt->execute()){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}else{

			return null;
		}


		$db = null;
		return $object ;
		//return "i m in";
	}


	public function getQuotationFollowup($id){
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();//SELECT * FROM project_payment_followup ppf ,project_payment_followup_details ppfd where ppf.FollowupId = ppfd.FollowupId  AND ppf.AssignEmployee = :id");

		$t=time();
		$current =date("Y-m-d",$t);

		$stmt = $conn->prepare("SELECT * FROM quotation_followup qf where qf.AssignEmployee = :id AND qf.`FollowupDate`<=:currentDate AND qf.FollowupId NOT IN (SELECT `FollowupId` FROM `quotation_followup_details`)");
		//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
		$stmt->bindParam(':id', $id, PDO::PARAM_STR);
		$stmt->bindParam(':currentDate', $current, PDO::PARAM_STR);

		if($stmt->execute()){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}
		else{
			return null;
		}

		$db = null;
		return $object;
	}


public function getSitetrackingFollowup($id){
		$object = array();
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$t=time();
		$current =date("Y-m-d",$t);
		$stmt = $conn->prepare("SELECT * FROM site_tracking_followup_schedule stf  where stf.AssignEmployee = :id AND stf.`FollowupDate`<=:currentDate AND stf.FollowupId NOT IN (SELECT `FollowupId` FROM `site_tracking_followup_details`)");
		//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
		$stmt->bindParam(':id', $id, PDO::PARAM_STR);
		$stmt->bindParam(':currentDate', $current, PDO::PARAM_STR);
		if($stmt->execute()){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}
		else{
			return null;
		}


		$db = null;
		return $object;
	}


public function UpdatePaymentFollowup($Followupid,$data){
	try{
			$db = Database::getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("UPDATE project_payment_followup SET AssignEmployee = :AssignEmp, FollowupDate = :FollowDate, FollowupTitle = :Followtitle WHERE FollowupId = :id");
					$stmt->bindParam(':id', $Followupid, PDO::PARAM_STR);
					$stmt->bindParam(':AssignEmp', $data->AssignTask, PDO::PARAM_STR);
					$stmt->bindParam(':FollowDate', $data->FollowupDate, PDO::PARAM_STR);
					$stmt->bindParam(':Followtitle' , $data->FollowupTitle,PDO::PARAM_STR);
					if($stmt->execute() === TRUE){
						return "Success in updation of payment folllowup";
					}
					else{
						return "Erro in payment followup updation in UpdatePaymentFollowup ";
					}
				
	}
	catch(PDOException $e){
		return "Exception in UpdatePaymentFollowup".$e->getMessage();
	}
}

public function UpdateQuotationFollowup($Followupid,$data){
	try{
			$db = Database::getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("UPDATE quotation_followup SET AssignEmployee = :AssignEmp , FollowupTitle = :Followtitle , FollowupDate = :FollowDate WHERE FollowupId = :id;");
					$stmt->bindParam(':id', $Followupid, PDO::PARAM_STR);
					$stmt->bindParam(':AssignEmp', $data->AssignTask, PDO::PARAM_STR);
					$stmt->bindParam(':FollowDate', $data->FollowupDate, PDO::PARAM_STR);
					$stmt->bindParam(':Followtitle' , $data->FollowupTitle,PDO::PARAM_STR);
					if($stmt->execute() === TRUE){
						return "Success in Quotation of payment folllowup";
					}
					else{
						return "Erro in Quotation followup updation in UpdatePaymentFollowup ";
					}
				
	}
	catch(PDOException $e){
		return "Exception in UpdateQuotationFollowup".$e->getMessage();
	}
}

public function UpdateSiteTrackingFollowup($Followupid,$data){
	try{
			$db = Database::getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("UPDATE site_tracking_followup_schedule SET AssignEmployee = :AssignEmp , FollowupTitle = :Followtitle , FollowupDate = :FollowDate WHERE FollowupId = :id;");
					$stmt->bindParam(':id', $Followupid, PDO::PARAM_STR);
					$stmt->bindParam(':AssignEmp', $data->AssignTask, PDO::PARAM_STR);
					$stmt->bindParam(':FollowDate', $data->FollowupDate, PDO::PARAM_STR);
					$stmt->bindParam(':Followtitle' , $data->FollowupTitle,PDO::PARAM_STR);
					if($stmt->execute() === TRUE){
						return "Success in Quotation of payment folllowup";
					}
					else{
						return "Erro in Quotation followup updation in UpdatePaymentFollowup ";
					}
				
	}
	catch(PDOException $e){
		return "Exception in UpdateQuotationFollowup".$e->getMessage();
	}
}



public function CreateQuotationFollowup($quotationId,$data,$userId){
	$FollowupId = AppUtil::generateId();
	$t=time();
	$current =date("Y-m-d",$t);

	$db = Database::getInstance();
	$conn = $db->getConnection();
	$conn->beginTransaction();
	$stmt = $conn->prepare("INSERT INTO quotation_followup(FollowupId, QuotationId, AssignEmployee, FollowupDate, FollowupTitle, CreationDate, CreatedBy) VALUES(?,?,?,?,?,?,?);");
	if($stmt->execute([$FollowupId,$quotationId,$data->AssignEmployee,$data->FollowupDate,$data->FollowupTitle,$current,$userId]) === TRUE){
			$conn->commit();
			return true;
	}
	else{
		$conn->rollBack();
		return false;
	}


}

	public function schedulePaymentFollowup($followupId,$data){

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();

		$stmt = $conn->prepare("INSERT INTO project_payment_followup_details (FollowupId, Description, ConductDate) VALUES(?,?,?)");
		if($stmt->execute([$followupId,$data->Description,$data->ConductDate]) === TRUE){
			$conn->commit();
			return true;
		}
		else{
			return false;
		}


	}

	public function scheduleQuotationFollowup($followupId,$data){

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();

		$stmt = $conn->prepare("INSERT INTO quotation_followup_details (FollowupId, Description, ConductDate) VALUES(?,?,?)");
		if($stmt->execute([$followupId,$data->Description,$data->ConductDate]) === TRUE){
			$conn->commit();
			return true;
		}
		else{
			return false;
		}

	}


	public function scheduleSiteTrackingFollowup($followupId,$data){

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();

		$stmt = $conn->prepare("INSERT INTO `site_tracking_followup_details`(`FollowupId`, `Description`, `ConductDate`) VALUES (?,?,?)");
		if($stmt->execute([$followupId,$data->Description,$data->ConductDate]) === TRUE){
			$conn->commit();
			return true;
		}
		else{
			return false;
		}

	}




	public function CreatePaymentFollowup($invoiceId,$data,$userId){
		$FollowupId = AppUtil::generateId();
		$t=time();
		$today =date("Y-m-d",$t);
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();

		$stmt = $conn->prepare("INSERT INTO project_payment_followup(FollowupId, InvoiceId, AssignEmployee, FollowupDate, FollowupTitle, CreationDate, CreatedBy) VALUES(?,?,?,?,?,?,?);");
		if($stmt->execute([$FollowupId,$invoiceId,$data->AssignEmployee,$data->FollowupDate,$data->FollowupTitle,$today,$userId]) === TRUE){
			$conn->commit();
			return true;
		}
		else{
			$conn->rollBack();
			return false;
		}

		$db = null;
	}


	public function CreateSiteTrackingFollowup($projectId,$data,$userId){
		$FollowupId = AppUtil::generateId();
		$t=time();
		$current =date("Y-m-d",$t);

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();
		$stmt = $conn->prepare("INSERT INTO `site_tracking_followup_schedule`(`FollowupId`, `ProjectId`, `AssignEmployee`, `FollowupDate`, `FollowupTitle`, `CreationDate`, `CreatedBy`) VALUES (?,?,?,?,?,?,?)");
		if($stmt->execute([$FollowupId,$projectId,$data->AssignEmployee,$data->FollowupDate,$data->FollowupTitle,$current,$userId]) === TRUE){
			$conn->commit();
			return true;
		}
		else{
			$conn->rollBack();
			return false;
		}


	}


	public function CreateApplicatorFollowup($ApplicatorId,$data,$userId){
		$FollowupId = AppUtil::generateId();
		$t=time();
		$current =date("Y-m-d",$t);

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();
		$stmt = $conn->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id, `followup_title`,`assignEmployeeId`)
                                  VALUES (:followupDate,NOW(),:lastModifiedBy,:createdBy,NOW(),:lastEnrollmentId ,:followupTitle ,:assignEmployeeId)");

		$stmt->bindParam(':followupDate', $data->FollowupDate);
		$stmt->bindParam(':lastEnrollmentId', $ApplicatorId);
		$stmt->bindParam(':lastModifiedBy', $userId);
		$stmt->bindParam(':createdBy', $userId);
		$stmt->bindParam(':followupTitle', $data->FollowupTitle);
		$stmt->bindParam(':assignEmployeeId',$data->AssignEmployee);

		if($stmt->execute()){
			$conn->commit();
			return true;
		}
		else{
			$conn->rollBack();
			return false;
		}
	}


	public function ConductApplicatorFollowup($followupId,$data){

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();

		$stmt = $conn->prepare("INSERT INTO `applicator_payment_follow_up_info`(`follow_up_id`, `desciption`, `conductDate`) VALUES (?,?,?)");
		if($stmt->execute([$followupId,$data->Description,$data->ConductDate]) === TRUE){
			$conn->commit();
			return true;
		}
		else{
			return false;
		}

	}


}

