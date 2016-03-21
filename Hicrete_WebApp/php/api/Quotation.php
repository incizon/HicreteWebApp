<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php'; 

Class Quotation {
	protected $db;

	public function loadQuotationFollowup($id) {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			//$stmt = $conn->prepare("SELECT * from quotation q, quotation_details qd,quotation_followup_details qfd , quotation_followup qf where q.QuotationId = qd.QuotationId AND  q.QuotationId = qf.QuotationId AND qf.FollowupId = qfd.FollowupId AND  q.QuotationId =:id");
			$stmt = $conn->prepare("SELECT * FROM quotation_followup qf ,quotation_followup_details qfd , user_master um where qf.FollowupId = qfd.FollowupId AND um.UserID = qf.AssignEmployee AND qf.QUotationId = :id");
				$stmt->bindparam(':id',$id,PDO::PARAM_STR);
				if($stmt->execute() === TRUE){
						while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
							array_push($object, $row);
						}
				}
				else{
					return "Error in fetching quotation folowup";
				}
		}
		catch(PDOException $e){
			return "Exception in loading quotation with Followup".$e->getMessage();
		}
		$db = null;
		return $object;
	}

	public function loadQuotationWithTax($id){
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from quotation q, quotation_details qd,quotation_tax_details qtd where q.QuotationId = qd.QuotationId AND  q.QuotationId = qtd.QuotationId  AND  q.QuotationId =:id");
				$stmt->bindparam(':id',$id,PDO::PARAM_STR);
				if($stmt->execute() === TRUE){
						while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
							array_push($object, $row);
						}
				}
				else{
					return "Error in fetching quotation folowup";
				}
		}
		catch(PDOException $e){
			return "Exception in loading quotation with Followup".$e->getMessage();
		}
		$db = null;
		return $object;
		//return "i m in";
	}

	public function loadAllQuotation() {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from quotation q,quotation_details qd where q.QuotationId AND qd.QuotationId AND q.isDeleted = 0");
			//$stmt->bindParam(':QuotationId', $QuotationId, PDO::PARAM_STR);
			
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

	/*Get quotation by Project Id*/
	public function loadAllQuotationByProjId($id){
			$object= array();
			try{
				$db = Database:: getInstance();
				$conn = $db->getConnection();
				$stmt = $conn->prepare("SELECT * from quotation q ,project_master pm WHERE q.ProjectId = pm.ProjectId AND q.ProjectId=:id");
				$stmt->bindparam(':id',$id ,PDO::PARAM_STR);
					if($stmt->execute() === TRUE){
						while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						array_push($object, $row);
						}
					}
					else{
						return "error in loadAllQuotationByProjId";
					}
			}
			catch(PDOException $e){
					return "Exception in loadAllQuotationByProjId".$e->getMessage();
		    }
			$db= null;
			return $object;
		}

		/*Insert quotation ,quotation details ,quotation tax details and qoutation tax applicable*/

	/*	public function saveQuotationDetailsAndTax($data) {
			$QuotationId = AppUtil::generateId();
			$DetailId = AppUtil::generateId();
			$TaxId = AppUtil::generateId();
			$Detailno = AppUtil::generateId();
					try{
						$db = Database::getInstance();
						$conn = $db->getConnection();
						$conn->beginTransaction();
						//print_r($data);
						$stmt = $conn->prepare("INSERT INTO quotation(QuotationId,QuotationTitle,RefNo,DateOfQuotation,Subject,ProjectId,CompanyId,QuotationBlob,isDeleted) VALUES(?,?,?,?,?,?,?,?,?);");
								if($stmt->execute([$QuotationId, $data->QuotationTitle,$data->RefNo,$data->DateOfQuotation,$data->Subject,$data->ProjectId,$data->CompanyId,$data->QuotationBlob,0]) === TRUE){
										for($x = 0 ; $x < sizeOf($data->Quotation); $x++){
											$stmt2 = $conn->prepare("INSERT INTO quotation_details(DetailID,QuotationId,Title,Description,Quantity,UnitRate,Amount,DetailNo) VALUES(?,?,?,?,?,?,?,?);");
												if($stmt2->execute([$DetailId, $QuotationId ,$data->Quotation[$x]->Title,$data->Quotation[$x]->Description,$data->Quotation[$x]->Quantity,$data->Quotation[$x]->UnitRate,$data->Quotation[$x]->Amount,$Detailno]) === TRUE){
													for($y = 0; $y<sizeOf($data->TaxJson);$y++){
															$stmt3 = $conn->prepare("INSERT INTO quotation_tax_details(TaxID,QuotationId,TaxName,TaxPercentage,TaxAmount) VALUES(?,?,?,?,?);");
																if($stmt3->execute([$TaxId ,$QuotationId, $data->TaxJson[$y]->taxTitle,$data->TaxJson[$y]->taxPercentage,$data->TaxJson[$y]->amount]) === TRUE){
																		$stmt4 = $conn->prepare("INSERT INTO quotation_tax_applicable_to(TaxID,DetailsID) VALUES(?,?);");
																			if($stmt4->execute([$TaxId,$DetailId]) === TRUE){
																					$stmt5 = $conn->prepare("INSERT INTO companies_involved_in_project(ProjectID,COmpanyID) VALUES(?,?);");
																						if($stmt5->execute([$data->ProjectId,$data->CompanyId]) === TRUE){
																								$conn->commit();
																								return "Quotation adde succesfully";
																						}
																						else{
																							$conn->rollBack();
																							return "Error in saveQuotationDetailsAndTax in stmt5";
																						}
																					
																			}
																			else{
																				$conn->rollBack();
																				return "error in stmt4";
																			}
																}
																else{
																	$conn->rollBack();
																	return "Error in stmt3";
																}
													}
											}
											else{
													$conn->rollBack();
													return "Error in stmt2";
											}
										}
								}
								else{
										$conn->rollBack();
										return "Error in stmt ";
								}
				}		
				catch(PDOException $e){
					$conn->rollBack();
					return "Inexception in saveQuotationDetailsAndTax".$e->getMessage();
				}
			$db = null;

			}*/

				public function saveQuotationDetailsAndTax($data) {
			$QuotationId = AppUtil::generateId();
			
			
			$Detailno = AppUtil::generateId();
			$details = FALSE;
			$taxdetail = FALSE;
					try{
						$db = Database::getInstance();
						$conn = $db->getConnection();
						$conn->beginTransaction();
						//print_r($data);
						//print_r($QuotationId);
						$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
						$stmt = $conn->prepare("INSERT INTO quotation(QuotationId,QuotationTitle,RefNo,DateOfQuotation,Subject,ProjectId,CompanyId,QuotationBlob,isDeleted) VALUES(?,?,?,?,?,?,?,?,?);");
							//print_r($data->Quotation);
							$main = $data->Quotation;	
							//print_r($main);	
							//echo "in here".$main->QuotationBlob;
							//echo $QuotationId+""+$main->QuotationTitle+","+$main->RefNo+","+$main->DateOfQuotation+","+$main->Subject+","+$main->ProjectId+","+$main->CompanyId+","+$main->QuotationBlob;					
								if($stmt->execute([$QuotationId, $main->QuotationTitle,$main->RefNo,$main->DateOfQuotation,$main->Subject,$main->ProjectId,$main->CompanyId,null,0]) === TRUE){
										foreach ($data->Details as $quotation) {
											echo "in foreach quotation";
											//print_r($data->Details);
											$DetailId = AppUtil::generateId();
											$stmt2 = $conn->prepare("INSERT INTO quotation_details(DetailID, QuotationId, Title, Description, Quantity, UnitRate, Amount, DetailNo) VALUES(?,?,?,?,?,?,?,?);");
													//print_r($conn->errorInfo());
												if($stmt2->execute([$DetailId, $QuotationId ,$quotation->quotationItem,$quotation->quotationDescription,$quotation->quotationQuantity,$quotation->quotationUnitRate,$quotation->amount,$Detailno]) === TRUE){
													$details = TRUE;
												}
												else{
													$conn->rollBack();
													$details = FALSE;
													print_r($conn->errorInfo());
													return "Error in stmt2";
												}	
						
										}
										if($details){
											//print_r($data->TaxJson);
											//return "i m details".$data->TaxJson;
											print_r($data->taxDetails);
												foreach ($data->taxDetails as $taxjsn) {
													echo "in for each taxjson";
													print_r($data->taxDetails);
													$TaxId = AppUtil::generateId();
													$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
													$stmt3 = $conn->prepare("INSERT INTO quotation_tax_details(TaxID,QuotationId,TaxName,TaxPercentage,TaxAmount) VALUES(?,?,?,?,?);");
																	//print_r($conn->errorInfo());
																	if($stmt3->execute([$TaxId ,$QuotationId, $taxjsn->taxTitle,$taxjsn->taxPercentage,$taxjsn->amount]) === TRUE){
																		$taxdetail = TRUE;
																		//return $taxdetail;
																	}
																	else{
																		//$conn->rollBack();
																		$taxdetail = FALSE;
																		return "Error in stmt 3";
																	}
												}
												//return $taxdetail;
											if($taxdetail){
												$stmt4 = $conn->prepare("INSERT INTO quotation_tax_applicable_to(TaxID,DetailsID) VALUES(?,?);");
																			if($stmt4->execute([$TaxId,$DetailId]) === TRUE){
																					$stmt5 = $conn->prepare("INSERT INTO companies_involved_in_project(ProjectID,COmpanyID) VALUES(?,?);");
																						if($stmt5->execute([$main->ProjectId,$main->CompanyId]) === TRUE){
																								$conn->commit();
																								return "Quotation adde succesfully";
																						}
																						else{
																							$conn->rollBack();
																							return "Error in saveQuotationDetailsAndTax in stmt5";
																						}
																					
																			}
											}
											else{
												$conn->rollBack();
												return " taxdetail = false";
											}
										}
										else{
											$conn->rollBack();
											return "error in stmt2 details  = false";
										}
								}
								else{
										$conn->rollBack();
										return "Error in stmt ";
								}
				}		
				catch(PDOException $e){
					$conn->rollBack();
					return "Inexception in saveQuotationDetailsAndTax".$e->getMessage();
				}
			$db = null;

			}






		/**/
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
	/*Get quotation details and tax by quotation ID*/
	public function getQuotationDetailsAndTax($id){
		$object= array();
		try{
			$db = Database:: getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from quotation q ,quotation_details qd , quotation_tax_details qtd WHERE q.QuotationId = qd.QuotationId AND q.QuotationId = qtd.QuotationId AND q.QuotationId=:id");
			$stmt->bindparam(':id',$id ,PDO::PARAM_STR);
				if($stmt->execute() === TRUE){
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
					}
				}
				else{
					return "error in  getQuotationDetailsAndTax";
				}
		}
		catch(PDOException $e){
				return "Exception in getQuotationDetailsAndTax".$e->getMessage();
	    }
		$db= null;
		return $object;
	}


	public function deleteQuotation($id) {
		try{
				$db = Database::getInstance();
				$conn = $db->getConnection();
				$conn->beginTransaction();
				//$stmt = $conn->prepare("DELETE FROM quotation WHERE QuotationId = :id");
				$stmt = $conn->prepare("UPDATE quotation SET isDeleted = 1 WHERE QuotationId = :id");
				$stmt->bindParam(':id',$id,PDO::PARAM_STR);
				if($stmt->execute() ===TRUE){
					$conn->commit();
					return "Quotation deleted succesfully";
				}
				else{
					return "Error in quotation deletion";
				}
		}
		catch(PDOException $e){
				return "Exception in deletion of Quotation ".$e->getMessage();
		}

	}
}