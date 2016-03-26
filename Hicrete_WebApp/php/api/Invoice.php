<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Invoice {
	

	public function loadInvoiceTax($id) {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();//DetailID, InvoiceId, DetailNo, Title, Description, Quantity, UnitRate, Amount

			$stmt = $conn->prepare("SELECT * from invoice i ,invoice_tax_details itd , invoice_tax_applicable_to at where (i.InvoiceNo = :id AND  itd.InvoiceId = :id AND itd.TaxId = at.TaxId)");
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
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();

			$stmt = $conn->prepare("SELECT * FROM project_payment_followup p,project_payment_followup_details pfd,user_master um WHERE p.FollowupId = pfd.FollowupId AND um.UserId = p.AssignEmployee AND p.InvoiceId = :id");
			$stmt->bindParam(':id', $invoiceid, PDO::PARAM_STR);
			
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



	public function saveInvoice($data,$userId){
		
		//$invoiceNum = AppUtil::generateId();
		
		//$detailNo = AppUtil::generateId();
		$InvoicebasicDetails = $data->Details;
		$invoiceTaxDetails = $data->taxDetails;

		$details = FALSE;
		$taxdetail = FALSE;
		$main = $data->Invoice;
		$detailIdArray = [];
		$invoiceIndex = [];
		//print_r($main);
		 	try{
		 		$db = Database::getInstance();
				$conn = $db->getConnection();
				$conn->beginTransaction();
				$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);//InvoiceNo, QuotationId, InvoiceDate, InvoiceTitle, TotalAmount, RoundingOffFactor, GrandTotal, InvoiceBLOB, isPaymentRetention, PurchasersVATNo, PAN, CreatedBy, ContactPerson
				$stmt = $conn->prepare("INSERT INTO invoice(InvoiceNo, QuotationId, InvoiceDate, InvoiceTitle, TotalAmount, RoundingOffFactor, GrandTotal, InvoiceBLOB, isPaymentRetention, PurchasersVATNo, PAN, CreatedBy,ContactPerson) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
			 			if($stmt->execute([$main->InvoiceNo, $main->QuotationId, $main->InvoiceDate, $main->InvoiceTitle, $main->TotalAmount, $main->RoundingOffFactor, $main->GrandTotal, $main->InvoiceBLOB, $main->isPaymentRetention, $main->PurchasersVATNo, $main->PAN, $userId,$main->ContactPerson]) === TRUE){
			 						
			 						for($i = 0;$i<sizeof($InvoicebasicDetails);$i++){
						#insert  all quotation detail 
								//print_r($quotationBasicDetails[$i]);
									//$DetailNo = AppUtil::generateId();
									$DetailId = AppUtil::generateId();
									$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
									$stmt1 = $conn->prepare("INSERT INTO invoice_details(DetailID, InvoiceId, DetailNo, Title, Description, Quantity, UnitRate, Amount) VALUES(?,?,?,?,?,?,?,?)");
										//print_r($InvoicebasicDetails[$i]);
										if($stmt1->execute([$DetailId,$main->InvoiceNo,$i + 1,$InvoicebasicDetails[$i]->quotationItem,$InvoicebasicDetails[$i]->quotationDescription,$InvoicebasicDetails[$i]->quotationQuantity,$InvoicebasicDetails[$i]->quotationUnitRate,$InvoicebasicDetails[$i]->amount]) === TRUE){
											//$detailIdArray.push($DetailId);	
											array_push($detailIdArray,$DetailId);
											array_push($invoiceIndex,$i+1);
										}
										else{
											return "ERROR in saveInvoice stmt1";
										}
							}

							for($tx=0;$tx<sizeof($invoiceTaxDetails);$tx++){
								$TaxId = AppUtil::generateId();
								$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
								$stmt2 = $conn->prepare("INSERT INTO invoice_tax_details(TaxId, InvoiceId, TaxName, TaxPercentage, TaxAmount) VALUES(?,?,?,?,?)");
									if($stmt2->execute([$TaxId,$main->InvoiceNo,$invoiceTaxDetails[$tx]->taxTitle,$invoiceTaxDetails[$tx]->taxPercentage,$invoiceTaxDetails[$tx]->amount]) === TRUE){
										for($s = 0;$s<sizeof($invoiceTaxDetails[$tx]->taxArray);$s++){
														
														for($qut = 0;$qut<sizeof($invoiceIndex);$qut++){
															if($invoiceTaxDetails[$tx]->taxArray[$s] === $invoiceIndex[$qut]){
																#tax is present for given item of quotation
																//echo "tax is present for object".$qut."\n";
																//echo "tax id will be".$TaxId."\n";
																//echo "detail no wii be ".$detailIdArray[$qut]."\n";
																$stmt3 = $conn->prepare("INSERT INTO invoice_tax_applicable_to(TaxId, DetailsId) VALUES(?,?)");
																if($stmt3->execute([$TaxId,$detailIdArray[$qut]]) === TRUE){
																	$return = TRUE;
																	//echo "inserted";
																}
																else{
																	$return = FALSE;
																	//echo "ERROR in saveQuotationDetailsAndTax stmt3";
																}
															}
															else{
																#tax is not present
															//echo "Tax is not present \n";
															}
														}
												}
									}
									else{
										return "Error in saveInvoice stmt2 ";
									}
						}

							/*echo "Printing values";
							print_r($detailIdArray);
							print_r($invoiceIndex);
*/
							}				
		 				else
		 				{
							$conn->rollBack();
							return "Error: <br>";
		 				}
		 					if($return === TRUE){
				#commit
				$conn->commit();
				return "Success";
			}
			else{
				#rollback
				$conn->rollback();
				return "Error ";
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

