<?php
require_once '/../../php/appUtil.php';
require_once '/../../php/Database.php';

Class Followup {
	
	public function getPaymentFollowup($id) {
			$object = array();

			$db = Database::getInstance();
			$conn = $db->getConnection();
			/*$stmt = $conn->prepare("SELECT * FROM payment_retention_followup prf ,project_payment_followup ppf where q.AssignEmployee = :id");*/
			$stmt = $conn->prepare("SELECT * FROM project_payment_followup ppf where ppf.AssignEmployee = :id AND ppf.FollowupId NOT IN (SELECT `FollowupId` FROM `project_payment_followup_details`)");

			$stmt->bindParam(':id', $id, PDO::PARAM_STR);
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
		$stmt = $conn->prepare("SELECT * FROM quotation_followup qf where qf.AssignEmployee = :id  AND qf.FollowupId NOT IN (SELECT `FollowupId` FROM `quotation_followup_details`)");
		//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
		$stmt->bindParam(':id', $id, PDO::PARAM_STR);
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
		$stmt = $conn->prepare("SELECT * FROM site_tracking_followup_schedule stf , site_tracking_followup_details stfd where stf.AssignEmployee = :id AND stf.FollowupId NOT IN (SELECT `FollowupId` FROM `site_tracking_followup_details`)");
		//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
		$stmt->bindParam(':id', $id, PDO::PARAM_STR);
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
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
			$stmt = $conn->prepare("INSERT INTO project_payment_followup_details (FollowupId, Description, ConductDate) VALUES(?,?,?)");
			if($stmt->execute([$followupId,$data->Description,$data->ConductDate]) === TRUE){
				$conn->commit();
				return "payment scheduled succesfully";
			}
			else{
				return " Error in payment scheduled";
			}

		}
		catch(PDOException $e){
			return "In Exception schedulePaymentFollowup".$e->getMessage();
		}
	}

	public function scheduleQuotationFollowup($followupId,$data){
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
			$stmt = $conn->prepare("INSERT INTO quotation_followup_details (FollowupId, Description, ConductDate) VALUES(?,?,?)");
			if($stmt->execute([$followupId,$data->Description,$data->ConductDate]) === TRUE){
				$conn->commit();
				return "quotation scheduled succesfully";
			}
			else{
				return " Error in quotation scheduled";
			}

		}
		catch(PDOException $e){
			return "In Exception scheduleQuotationFollowup".$e->getMessage();
		}
	}



	public function CreatePaymentFollowup($invoiceId,$data){
		$FollowupId = AppUtil::generateId();
		$t=time();
		$today =date("Y-m-d",$t);
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
			$stmt = $conn->prepare("INSERT INTO project_payment_followup(FollowupId, InvoiceId, AssignEmployee, FollowupDate, FollowupTitle, CreationDate, CreatedBy) VALUES(?,?,?,?,?,?,?);");
			if($stmt->execute([$FollowupId,$invoiceId,$data->AssignEmployee,$data->FollowupDate,$data->FollowupTitle,$today,$data->CreatedBy]) === TRUE){
				$conn->commit();
				return "Success in CreatePaymentFollowup";
			}
			else{
				$conn->rollBack();
				return "Error in CreatePaymentFollowup in stmt";
			}
		}
		catch(PDOException $e){
			return "Exception in CreateQuotationFollowup".$e->getMessage();
		}
		$db = null;
	}




}

