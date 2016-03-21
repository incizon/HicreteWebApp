<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Followup {
	
	public function getPaymentFollowup($id) {
			$object = array();
			try {
				$db = Database::getInstance();
				$conn = $db->getConnection();
				/*$stmt = $conn->prepare("SELECT * FROM payment_retention_followup prf ,project_payment_followup ppf where q.AssignEmployee = :id");*/
				$stmt = $conn->prepare("SELECT * FROM project_payment_followup ppf ,project_payment_followup_details ppfd where ppf.FollowupId = ppfd.FollowupId  AND ppf.AssignEmployee = :id");
				
				$stmt->bindParam(':id', $id, PDO::PARAM_STR);
				if($result = $stmt->execute()){
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						array_push($object, $row);
					}
				}

			 } catch (PDOException $e) {
	            echo $e->getMessage();
	        }

			$db = null;
			return $object ;
		//return "i m in";
	}

	public function getQuotationFollowup($id){
		$object = array();
		try{

			$db = Database::getInstance();
				$conn = $db->getConnection();//SELECT * FROM project_payment_followup ppf ,project_payment_followup_details ppfd where ppf.FollowupId = ppfd.FollowupId  AND ppf.AssignEmployee = :id");
				$stmt = $conn->prepare("SELECT * FROM quotation_followup qf , quotation_followup_details qfd where qf.FollowupId = qfd.FollowupId AND qf.AssignEmployee = :id ");
				//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
				$stmt->bindParam(':id', $id, PDO::PARAM_STR);
				if($result = $stmt->execute()){
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						array_push($object, $row);
					}
				}
				else{
					return "Error in stmt in getQuotationFollowup";
				}
		}
		catch(PDOException $e){
			return "Exception in getQuotationFollowup ".$e->getMessage();
		}
		$db = null;
		return $object;
	}


public function getSitetrackingFollowup($id){
		$object = array();
		try{

			$db = Database::getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("SELECT * FROM site_tracking_followup_schedule stf , site_tracking_followup_details stfd where stf.FollowupId = stfd.FollowupId AND stf.AssignEmployee = :id");
				//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
				$stmt->bindParam(':id', $id, PDO::PARAM_STR);
				if($result = $stmt->execute()){
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						array_push($object, $row);
					}
				}
				else{
					return "Error in stmt in getSitetrackingFollowup";
				}


		}
		catch(PDOException $e){
			return "Exception in getSitetrackingFollowup ".$e->getMessage();
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

public function CreateQuotationFollowup($quotationId,$data){
	$FollowupId = AppUtil::generateId();
	try {
		$db = Database::getInstance();
				$conn = $db->getConnection();
				$conn->beginTransaction();
				$stmt = $conn->prepare("INSERT INTO quotation_followup(FollowupId, QuotationId, AssignEmployee, FollowupDate, FollowupTitle, CreationDate, CreatedBy) VALUES(?,?,?,?,?,?,?);");
						if($stmt->execute([$FollowupId,$quotationId,$data->AssignEmployee,$data->FollowupDate,$data->FollowupTitle,$data->CreationDate,$data->CreatedBy]) === TRUE){
								$conn->commit();
								return "Success in CreateQuotationFollowup";
						}
						else{
							$conn->rollBack();
							return "Error in CreateQuotationFollowup in stmt";
						}
	}
	catch(PDOException $e){
		return "Exception in CreateQuotationFollowup".$e->getMessage();
	} 
}




}

