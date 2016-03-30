<?php
require_once '/../../php/appUtil.php';
require_once '/../../php/Database.php';

Class Quotation {
	protected $db;

	public function loadQuotationFollowup($id) {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		//$stmt = $conn->prepare("SELECT * from quotation q, quotation_details qd,quotation_followup_details qfd , quotation_followup qf where q.QuotationId = qd.QuotationId AND  q.QuotationId = qf.QuotationId AND qf.FollowupId = qfd.FollowupId AND  q.QuotationId =:id");
		$stmt = $conn->prepare("SELECT quotation_followup.`FollowupId`,`FollowupTitle`,`FollowupDate`,`Description`,`ConductDate`,`firstName`,`lastName` FROM quotation_followup ,quotation_followup_details  , usermaster  where quotation_followup.FollowupId = quotation_followup_details.FollowupId AND usermaster.userId = quotation_followup.AssignEmployee AND quotation_followup.QuotationId = :id");
		$stmt->bindparam(':id',$id,PDO::PARAM_STR);
		if($stmt->execute() === TRUE){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}else{
			return null;
		}


		return $object;
	}

	public function loadQuotationWithTax($id){
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * FROM quotation q JOIN quotation_details qd ON q.QuotationId = qd.QuotationId  JOIN  quotation_tax_details qtd ON qd.QuotationId = qtd.QuotationId where q.QuotationId =:id");
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
	public static function loadAllQuotationByProjId($id){
			$object= array();

			$db = Database:: getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT q.*,cm.`companyId`,cm.`companyName` from quotation q ,`companymaster` cm WHERE q.ProjectId =:id AND q.`companyId`=cm.`companyId`");
			$stmt->bindparam(':id',$id ,PDO::PARAM_STR);
				if($stmt->execute() === TRUE){
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
					}
				}
				else{
					return null;
				}

			$db= null;
			return $object;
		}

		public static function getQuotationDetails($qid){
		$object= array();

		$db = Database:: getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT * FROM quotation q JOIN quotation_details qd ON q.QuotationId = qd.QuotationId  where q.QuotationId =:id;");
		$stmt->bindparam(':id',$qid ,PDO::PARAM_STR);
		if($stmt->execute() === TRUE){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
			array_push($object, $row);
			}
		}
		else{
			return null;
		}

		$db= null;
		return $object;
	}

	public function getQuotationTaxDetails($qid){
			$object= array();

			$db = Database:: getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * FROM quotation_tax_details q  WHERE q.QuotationId =:id;");
			$stmt->bindparam(':id',$qid ,PDO::PARAM_STR);
				if($stmt->execute() === TRUE){
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
						$result_array = array();
						$result_array['TaxID'] = $row['TaxID'];
						$result_array['TaxAmount'] = $row['TaxAmount'];
						$result_array['TaxPercentage'] = $row['TaxPercentage'];
						$result_array['TaxName'] =$row['TaxName'];
						$stmt1 = $conn->prepare("SELECT `DetailNo` FROM `quotation_details` WHERE `DetailID` IN (SELECT `DetailsID` FROM `quotation_tax_applicable_to` WHERE `TaxID`=:taxId) order by `DetailNo` ASC");
						$stmt1->bindparam(':taxId',$row['TaxID'] ,PDO::PARAM_STR);
						if($stmt1->execute()){
							$tax_array =array();
							while ($row1 = $stmt1->fetch(PDO::FETCH_ASSOC)){
								array_push($tax_array,$row1['DetailNo']);
							}

						}else{
							return false;
						}
						$result_array['DetailsNo'] =$tax_array;

						array_push($object,$result_array);
					}
				}
				else{
					return false;
				}

			$db= null;
			return $object;
		}

public function reviseQuotation($qid,$data){
	
}
	
public function saveQuotationDetailsAndTax($data){
	$QuotationId = AppUtil::generateId();
	$quotation = $data->Quotation;
	$quotationBasicDetails = $data->Details;
	$quotationTaxDetails = $data->taxDetails;
	 $detailIdArray = [];
	 $quotationIndex = [];
	 $return = FALSE;

	//print_r($quotation);
	//print_r($quotationBasicDetails);
	//print_r($quotationTaxDetails);
	try{
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();
		$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
		$stmt = $conn->prepare("INSERT INTO quotation(QuotationId, QuotationTitle, RefNo, DateOfQuotation, Subject, ProjectId, CompanyId, QuotationBlob, isApproved, isDeleted) VALUES(?,?,?,?,?,?,?,?,?,?);");
			if($stmt->execute([$QuotationId,$quotation->QuotationTitle,$quotation->RefNo,$quotation->DateOfQuotation,$quotation->Subject,$quotation->ProjectId,$quotation->CompanyId,$quotation->QuotationBlob,0,0]) === TRUE){
				/*foreach ($quotation as $quot) {*/
						for($i = 0;$i<sizeof($quotationBasicDetails);$i++){
						#insert  all quotation detail 
							//print_r($quotationBasicDetails[$i]);
								$DetailNo = AppUtil::generateId();
								$DetailId = AppUtil::generateId();
								$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
								$stmt1 = $conn->prepare("INSERT INTO quotation_details(DetailID, QuotationId, Title, Description, Quantity, UnitRate, Amount, DetailNo,unit) VALUES(?,?,?,?,?,?,?,?,?)");
									if($stmt1->execute([$DetailId,$QuotationId,$quotationBasicDetails[$i]->quotationItem,$quotationBasicDetails[$i]->quotationDescription,$quotationBasicDetails[$i]->quotationQuantity,$quotationBasicDetails[$i]->quotationUnitRate,$quotationBasicDetails[$i]->amount,$i+1,$quotationBasicDetails[$i]->quotationUnit]) === TRUE){
										//$detailIdArray.push($DetailId);	
										array_push($detailIdArray,$DetailId);
										array_push($quotationIndex,$i+1);
									}
									else{
										return "ERROR in saveQuotationDetailsAndTax stmt1";
									}
						}
//echo"index array is ";
//print_r($quotationIndex);
//print_r($detailIdArray);
						if(sizeof($quotationTaxDetails) === 0){
							//echo "size 0";
							$return = TRUE;
						}
						else{
							//echo "size more";
							for($tx=0;$tx<sizeof($quotationTaxDetails);$tx++){
								$TaxId = AppUtil::generateId();
								$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
								$stmt2 = $conn->prepare("INSERT INTO quotation_tax_details(TaxID, QuotationId, TaxName, TaxPercentage, TaxAmount) VALUES(?,?,?,?,?)");
									if($stmt2->execute([$TaxId,$QuotationId,$quotationTaxDetails[$tx]->taxTitle,$quotationTaxDetails[$tx]->taxPercentage,$quotationTaxDetails[$tx]->amount]) === TRUE){
										for($s = 0;$s<sizeof($quotationTaxDetails[$tx]->taxArray);$s++){
														
														for($qut = 0;$qut<sizeof($quotationIndex);$qut++){
															if($quotationTaxDetails[$tx]->taxArray[$s] === $quotationIndex[$qut]){
																#tax is present for given item of quotation
																//echo "tax is present for object".$qut."\n";
																//echo "tax id will be".$TaxId."\n";
																//echo "detail no wii be ".$detailIdArray[$qut]."\n";
																$stmt3 = $conn->prepare("INSERT INTO quotation_tax_applicable_to(TaxID, DetailsID) VALUES(?,?)");
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
										return "Error in saveQuotationDetailsAndTax stmt2 ";
									}
						}
						}
						

					
			}
			else{
				return "Error in saveQuotationDetailsAndTax in stmt";
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
		//print_r($data);
	}
	catch(PDOException $e){
		return "Exception in saveQuotationDetailsAndTax".$e->getMessage();
	}
}





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

	public static function getQuotationListForProject($projectId) {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `QuotationId`,`QuotationTitle`,`RefNo` FROM `quotation` WHERE `ProjectId`=:projectId");
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