<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Payment {
	
	public function getPayment($projid) {
			$object = array();
			try {
				$db = Database::getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("SELECT * FROM project_payment p where p.InvoiceNo in(SELECT i.InvoiceNo FROM invoice i where i.QuotationId in(SELECT q.QuotationId FROM quotation q where q.ProjectId = :projid));");
				
				$stmt->bindParam(':projid', $projid, PDO::PARAM_STR);
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

	public function getPaymentPaidByInvoices($InvoiceId){
		$object = array();
		try{

			$db = Database::getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("SELECT p.PaymentDate,p.AmountPaid,pd.InstrumentOfPayment,pd.IDOfInstrument,pd.BankName,pd.BranchName,pd.city,um.FirstName,um.LastName,i.GrandTotal FROM project_payment p ,project_payment_mode_details pd, usermaster um,invoice i WHERE i.	InvoiceNo=p.InvoiceNo AND p.PaymentId = pd.PaymentId AND p.InvoiceNo = :invoiceId AND um.UserId=p.PaidTo");
				//$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd WHERE p.InvoiceNo = :invoiceId  AND p.PaymentId = pd.PaymentId");
				$stmt->bindParam(':invoiceId', $InvoiceId, PDO::PARAM_STR);
				if($result = $stmt->execute()){
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						array_push($object, $row);
					}
				}
				else{
					return "Error in stmt in getPaymentPaidByInvoices";
				}


		}
		catch(PDOException $e){
			return "Exception in getPaymentPaidByInvoices ".$e->getMessage();
		}
		$db = null;
		return $object;
	}

	public function getAllPayment($projId){
		$object1 = array();
		$paymentDetails = array();
		$TotalpaidAmount = 0;
		$finaleObj = array();
		$FinalObject = array();
		$quotationObject = array();
		$quotationObject2 = array();
		
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			/*$stmt = $conn->prepare("SELECT q.QuotationId , p.ProjectId ,p.ProjectName FROM quotation q,project_master p WHERE q.CompanyId = (SELECT w.CompanyId FROM work_order w where w.ProjectId = :projId) AND q.ProjectId = :projId AND p.ProjectId = :projId");*/
			$stmt = $conn->prepare("SELECT q.QuotationId , p.ProjectId ,p.ProjectName FROM quotation q,project_master p WHERE q.CompanyId IN (SELECT w.CompanyId FROM work_order w where w.ProjectId = :projId) AND q.ProjectId = :projId AND p.ProjectId = :projId");
				$stmt->bindParam(':projId',$projId,PDO::PARAM_STR);
					if($stmt->execute() === TRUE){
						while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
								array_push($object1, $row);
						}
							$ProjectId = $object1[0]['ProjectId'];
							$ProjectName = $object1[0]['ProjectName'];
							$FinalObject['project_id'] = $ProjectId;
							$FinalObject['project_name'] = $ProjectName;
						for($q = 0 ; $q<sizeof($object1) ;$q++ ){
							$quotationObject = [];
							//print_r(sizeof($object1));
							$qid = $object1[$q]['QuotationId'];
								$quotationObject['quotation_id'] = $qid;
								$stmt2 = $conn->prepare("SELECT qd.Amount FROM quotation_details qd where qd.QuotationId = :qid");
									$stmt2->bindParam(':qid',$qid,PDO::PARAM_STR);	
										if($stmt2->execute() === TRUE){
												$row2Total = $stmt2->fetch(PDO::FETCH_ASSOC);
												$ProjectAmount = $row2Total['Amount'];
												$quotationObject['total_project_amount'] = $ProjectAmount;
													$stmt3 = $conn->prepare("SELECT i.InvoiceNo,i.InvoiceDate,i.GrandTotal,u.FirstName,u.LastName,i.InvoiceTitle FROM invoice i,user_master u WHERE i.QuotationId = :qid AND u.UserId=i.CreatedBy ;");
													$stmt3->bindParam(':qid',$qid,PDO::PARAM_STR);
														if($stmt3->execute() === TRUE){
															$paymentDetails = [];
															while ($row3 = $stmt3->fetch(PDO::FETCH_ASSOC)) {
																array_push($paymentDetails, $row3);
																//print_r($paymentDetails);
															}
															$TotalpaidAmount = 0;
															for($i = 0;$i<sizeof($paymentDetails);$i++){
																$TotalpaidAmount =$TotalpaidAmount+$paymentDetails[$i]['GrandTotal'];
																//print_r("paid amount "+$paymentDetails[$i]['GrandTotal']);
															}
															$quotationObject['total_paid_amount'] =$TotalpaidAmount;
															$quotationObject['paymentDetails'] =$paymentDetails;
															//print_r($quotationObject);
														}
														array_push($quotationObject2, $quotationObject);
											}
											else{
												return "Error in stmt2";
											}
							//print_r($qid);
						}
						$FinalObject['Quotation'] = $quotationObject2;
						return $FinalObject;
					}
					else{
						return "Error in geting quotation id in stmt";
					}
						
		}
		catch(PDOException $e){
			return "Exception in getAllPayment ".$e->getMessage();
		}

	}

	public function getPaymentAssigned($projid){
		$object = array();
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * FROM invoice i where i.QuotationId = (SELECT q.QuotationId FROM quotation q where q.ProjectId =:projid AND q.CompanyId = (SELECT w.CompanyId  FROM work_order w WHERE w.ProjectId =:projid))");
			$stmt->bindParam(':projid',$projid,PDO::PARAM_STR);
				if($stmt->execute() === TRUE){
					while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						array_push($object,$row);
					}
				}
				else{
						return "Error in getPaymentAssigned";
				}
		}
		catch(PDOException $e){
			return "Exceptin in getPaymentAssigned".$e->getMessage();
		}
	$db = null;
	return $object;

	}



public function getPaymentByInvoice($invoiceId) {
			$object = array();
			try {
				$db = Database::getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("SELECT * FROM project_payment p ,project_payment_mode_details pd ,user_master u where u.UserId = p.PaidTo AND p.paymentId = pd.paymentId AND p.InvoiceNo  =:invoiceId ;");
				$stmt->bindParam(':invoiceId', $invoiceId, PDO::PARAM_STR);
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

public function savePaymentAndDetails($data){
		//$invoiceNo = AppUtil::generateId();
		$paymentId = AppUtil::generateId();
		$instruId = AppUtil::generateId();
		//print_r($invoiceNo);
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();			
			$stmt = $conn->prepare("INSERT INTO project_payment VALUES(?,?,?,?,?,?)");
			//echo "payment mode is "+$data->IsCashPayment;
			if($data->IsCashPayment == 1){
				$idOfInstru = $instruId;
			}
			else{
					$idOfInstru = $data->IDOfInstrument;
			}
			if($stmt->execute([$paymentId,$data->InvoiceNo,$data->AmountPaid,$data->PaymentDate,$data->IsCashPayment,$data->PaidTo]) === TRUE){
				$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
				$stmt2 = $conn->prepare("INSERT INTO project_payment_mode_details (PaymentId, InstrumentOfPayment, IDOfInstrument, BankName,BranchName, City) VALUES(?,?,?,?,?,?)");
				if($stmt2->execute([$paymentId,$data->InstrumentOfPayment,$idOfInstru,$data->BankName,$data->BranchName,$data->City]) === TRUE){
					$conn->commit();
					return "success ";
				}
				else{
					$conn->rollBack();
					return "Error in stmt2";
				}
			}
			else{
				$conn->rollBack();
				return "Error in stmt1";
			}
		}
		catch(PDOException $e){
			$conn->rollBack();
			return "IN Exception savePaymentAndDetails ".$e->getMessage();

		}

}



	public function savePayment($data){
		
		$invoiceNo = AppUtil::generateId();
		$paymentId = AppUtil::generateId();
		
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
				$stmt = $conn->prepare("INSERT INTO invoice(InvoiceNo, QuotationId, InvoiceDate, InvoiceTitle, TotalAmount, RoundingOffFactor, GrandTotal, InvoiceBLOB, isPaymentRetention, PurchasersVATNo, PAN, CreatedBy) VALUES(?,?,?,?,?,?,?,?,?,?,?,?);");
				if($stmt->execute([$invoiceNo,$data->QuotationId,$data->InvoiceDate,$data->InvoiceTitle,$data->TotalAmount,$data->RoundingOffFactor,$data->GrandTotal,$data->InvoiceBLOB,$data->isPaymentRetention,$data->PurchasersVATNo,$data->PAN,$data->CreatedBy]) === TRUE)
				{
					$stmt2 = $conn->prepare("INSERT INTO project_payment(PaymentId, InvoiceNo, AmountPaid, PaymentDate, IsCashPayment, PaidTo) VALUES(?,?,?,?,?,?)");
						if($stmt2->execute([$paymentId,$invoiceNo,$data->AmountPaid,$data->PaymentDate,$data->IsCashPayment,$data->PaidTo]) === TRUE)
						{
							$stmt3 = $conn->prepare("INSERT INTO project_payment_mode_details(PaymentId, InstrumentOfPayment, IDOfInstrument, BankName, City) VALUES(?,?,?,?,?)");
								if($stmt3->execute([$paymentId,$data->InstrumentOfPayment,$data->IDOfInstrument,$data->BankName,$data->City]) === TRUE)
								{
										$conn->commit();
										return "Payment creted succcesfully..";
								}
								else
								{
									$conn->rollBack();
									return "Error while creating payment in stmt3";
								}
						}
						else
						{
							$conn->rollBack();
							return "ERROR i cration of payment in stmt2";
						}

				}
				else
				{
						$conn->rollBack();
						return "Error in creation of invoice ";
				}


		} catch (PDOException $e) {
            echo $e->getMessage();
            $conn->rollBack();
        }
		$conn = null;
	}



/*	public function updateProject($id,$data) {

		$db  = mysqli_connect('localhost','root','root','hicrete');
		if($db == null)
		return "Error..DB not cinnected";
		//$sql = "SELECT * from customer_master ;";

		//$sql = "UPDATE table_name SET column1=value, column2=value2 WHERE some_column=some_value "
		
		$result = mysqli_query($db,$sql);
		if(!$result){
			return "error";
		}
		else{

			$object = array();
			if($result = mysqli_query($db,$sql)){
				while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
					array_push($object, $row);
				}
			}
		}
		mysqli_close($db);
		return $object;

	}
*/
	public function deleteProject() {


	}
}

