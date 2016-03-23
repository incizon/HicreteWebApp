<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Invoice {
	

	public function loadInvoiceTax($id) {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();

			$stmt = $conn->prepare("SELECT * from invoice i,invoice_tax_details id , invoice_tax_applicable_to at where (i.InvoiceNo = :id AND id.InvoiceId = :id AND id.TaxId = at.TaxId)");
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

	public function loadInvoiceFollowups($invoiceid){
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();

		$stmt = $conn->prepare("SELECT `project_payment_followup`.`FollowupId`,`FollowupTitle`,`FollowupDate`,`Description`,`ConductDate`,`firstName`,`lastName` FROM `project_payment_followup` ,`project_payment_followup_details`  , usermaster  where `project_payment_followup`.FollowupId = `project_payment_followup_details`.FollowupId AND usermaster.userId = `project_payment_followup`.AssignEmployee AND `project_payment_followup`.`InvoiceId` = :id");
		$stmt->bindParam(':id', $invoiceid, PDO::PARAM_STR);

		if($result = $stmt->execute()){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}else{
			return null;
		}

		$db = null;
		return $object ;
	}

public function loadInvoiceForProject($projid){
	$object = array();
	try{
		$db = Database::getInstance();
		$conn = $db->getConnection();//SELECT * FROM invoice i , quotation q WHERE i.quotationId = q.quotationId AND i.QuotationId in (SELECT q.QuotationId FROM quotation q  WHERE q.ProjectId = :projid)
			$stmt = $conn->prepare("SELECT * FROM invoice i , quotation q WHERE i.QuotationId = q.QuotationId AND i.QuotationId in (SELECT q.QuotationId FROM quotation q  WHERE q.ProjectId = :projid)");
			$stmt->bindParam(':projid',$projid,PDO::PARAM_STR);
			if($stmt->execute() === TRUE){
					while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						array_push($object, $row);
					}
			}
			else{
					return "Error in loadInvoiceForProject";
			}
		}
	catch(PDOException $e){
		return "Exception in loadInvoiceForProject ".$e->getMessage();
	}
	$db = null;
	return $object;
}
	

	public function loadAllInvoice(){
		$object = array();
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();

			$stmt = $conn->prepare("SELECT * from invoice i ,invoice_details id WHERE i.InvoiceNo = id.InvoiceId ;");
		
					
			if($result = $stmt->execute()){
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
				}
			}
		}
		catch(PDOException $e){
				echo $e->getMessage();
		}
			
		$db = null;
		return $object ;
	}



	public function saveInvoice($data){
		
		$invoiceNum = AppUtil::generateId();
		$detailId =  AppUtil::generateId();
		$detailNo = AppUtil::generateId();
		$taxid = AppUtil::generateId();
	
		 	try{
		 		$db = Database::getInstance();
				$conn = $db->getConnection();
				$conn->beginTransaction();
				$stmt = $conn->prepare("INSERT INTO invoice(InvoiceNo, QuotationId, InvoiceDate, InvoiceTitle, TotalAmount, RoundingOffFactor, GrandTotal, InvoiceBLOB, isPaymentRetention, PurchasersVATNo, PAN, CreatedBy) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)");
			 			if($stmt->execute([$data->InvoiceNo, $data->QuotationId, $data->InvoiceDate, $data->InvoiceTitle, $data->TotalAmount, $data->RoundingOffFactor, $data->GrandTotal, $data->InvoiceBLOB, $data->isPaymentRetention, $data->PurchasersVATNo, $data->PAN, $data->CreatedBy]) === TRUE)
			 			{
			 				for($x = 0 ; $x < sizeOf($data->Quotation); $x++){
			 				$stmt2 = $conn->prepare("INSERT INTO invoice_details(DetailID, InvoiceId, DetailNo, Title, Description, Quantity, UnitRate, Amount) VALUES(?,?,?,?,?,?,?,?)");
			 					if($stmt2->execute([$detailId, $data->InvoiceNo, $data->Quotation[$x]->DetailNo, $data->Quotation[$x]->Title, $data->Quotation[$x]->Description, $data->Quotation[$x]->Quantity, $data->Quotation[$x]->UnitRate, $data->Quotation[$x]->Amount]) === TRUE)
			 					{	
			 						for($y = 0; $y<sizeOf($data->TaxJson);$y++){															//TaxId, InvoiceId, TaxName, TaxAmount, TaxPercentage
			 						$stmt3  = $conn->prepare("INSERT INTO invoice_tax_details(TaxId, InvoiceId, TaxName, TaxAmount, TaxPercentage) VALUES(?,?,?,?,?)");
			 							if($stmt3->execute([$taxid, $data->InvoiceNo, $data->TaxJson[$y]->taxTitle, $data->TaxJson[$y]->amount, $data->TaxJson[$y]->taxPercentage]) === FALSE)
			 							{
			 								$stmt4 = $conn->prepare("INSERT INTO invoice_tax_applicable_to(TaxId, DetailsId) VALUES(?,?)");
			 									if($stmt4->execute([$taxid, $detailId]) === FALSE)
			 									{
			 										$conn->commit();
			 										return "Invoice created succesfully";
			 									}
			 									else {
			 										$conn->rollBack();
			 										return "Error: invoice_tax_applicable_to<br>" . $conn->errorInfo();
			 									}
			 							}
			 							else {
			 								$conn->rollBack();

			 								return "Error: invoice_tax_details<br>".print_r($conn->errorInfo());
			 							}
			 						}
			 					}
			 					else {
			 						$conn->rollBack();
			 						return "Error: invoice_details<br>";			
			 					}
			 				}
			 			}				
		 				else
		 				{
							$conn->rollBack();
							return "Error: <br>";
		 				}

		 	}
		 	catch(PDOException $e){
            	 $conn->rollBack();
            	 return "In exception in saveInvoice".$e->getMessage();
		 		 //echo $e->getMessage();
		 	}
		 	$db = null;
	}




	public function deleteProject() {


	}

	public static function getInvoiceListForProject($projectId) {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `InvoiceNo`,`InvoiceTitle` FROM `invoice` WHERE `QuotationId` IN (SELECT `QuotationId` FROM `quotation` WHERE `ProjectId`=:projectId)");
		$stmt->bindParam(':projectId',$projectId);
		if($result = $stmt->execute()) {
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}

		$db = null;
		return $object;


	}



}

