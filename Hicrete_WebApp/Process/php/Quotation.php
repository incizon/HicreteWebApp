<?php
require_once '../../php/appUtil.php';
require_once '../../php/Database.php';

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

	public static function modifyQuotation($data,$qid){
		$QuotationId = $qid;
		$quotation = $data->Quotation;
		$quotationBasicDetails = $data->Details;
		$quotationTaxDetails = $data->taxDetails;
		$detailIdArray = [];
		$quotationIndex = [];

		$db = Database::getInstance();
		$conn = $db->getConnection();

		$date1 = new DateTime($quotation->DateOfQuotation);
		$quotationDate = $date1->format('Y-m-d');

		$stmt = $conn->prepare("UPDATE `quotation` SET `QuotationTitle`=:title,`RefNo`=:refNo,`DateOfQuotation`=:dateOfQuotation,`Subject`=:subject,`QuotationBlob`=:blob WHERE `QuotationId`=:quotationId");
		$stmt->bindparam(':title',$quotation->QuotationTitle ,PDO::PARAM_STR);
		$stmt->bindparam(':refNo',$quotation->RefNo ,PDO::PARAM_STR);
		$stmt->bindparam(':dateOfQuotation',$quotationDate ,PDO::PARAM_STR);
		$stmt->bindparam(':subject',$quotation->Subject ,PDO::PARAM_STR);
		$stmt->bindparam(':blob',$quotation->QuotationBlob ,PDO::PARAM_STR);
		$stmt->bindparam(':quotationId',$qid ,PDO::PARAM_STR);

		if($stmt->execute() === TRUE){

			for($i = 0;$i<sizeof($quotationBasicDetails);$i++){

				$DetailId = AppUtil::generateId();
				$stmt1 = $conn->prepare("INSERT INTO quotation_details(DetailID, QuotationId, Title, Description, Quantity, UnitRate, Amount, DetailNo,unit) VALUES(?,?,?,?,?,?,?,?,?)");
				if($stmt1->execute([$DetailId,$QuotationId,$quotationBasicDetails[$i]->quotationItem,$quotationBasicDetails[$i]->quotationDescription,$quotationBasicDetails[$i]->quotationQuantity,$quotationBasicDetails[$i]->quotationUnitRate,$quotationBasicDetails[$i]->amount,$i+1,$quotationBasicDetails[$i]->quotationUnit]) === TRUE){
					//$detailIdArray.push($DetailId);
					array_push($detailIdArray,$DetailId);
					array_push($quotationIndex,$i+1);
				}
				else{
					return false;
				}
			}


			for($tx=0;$tx<sizeof($quotationTaxDetails);$tx++){
				$TaxId = AppUtil::generateId();
				$stmt2 = $conn->prepare("INSERT INTO quotation_tax_details(TaxID, QuotationId, TaxName, TaxPercentage, TaxAmount) VALUES(?,?,?,?,?)");
				if($stmt2->execute([$TaxId,$QuotationId,$quotationTaxDetails[$tx]->taxTitle,$quotationTaxDetails[$tx]->taxPercentage,$quotationTaxDetails[$tx]->amount]) === TRUE){

					for($s = 0;$s<sizeof($quotationTaxDetails[$tx]->taxArray);$s++){

						for($qut = 0;$qut<sizeof($quotationIndex);$qut++){
							if($quotationTaxDetails[$tx]->taxArray[$s] === $quotationIndex[$qut]){
								$stmt3 = $conn->prepare("INSERT INTO quotation_tax_applicable_to(TaxID, DetailsID) VALUES(?,?)");
								if($stmt3->execute([$TaxId,$detailIdArray[$qut]]) ===FALSE){

									return false;
								}
							}
						}
					}
				}
				else{

					return false;
				}
			}
		}



		return true;


	}


	public static function isRefNoPresentInAnotherQuotation($refNo,$qid){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `RefNo` FROM `quotation` WHERE `RefNo`=:refNo AND `QuotationId`!=:qid");
		$stmt->bindParam(':refNo',$refNo, PDO::PARAM_STR);
		$stmt->bindParam(':qid',$qid, PDO::PARAM_STR);
		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}

	public static function isQuotationTitlePresentInAnotherQuotation($projectId,$title,$qid){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `QuotationTitle` FROM `quotation` WHERE `ProjectId`=:projectId AND `QuotationTitle`=:title AND `QuotationId`!=:qid");
		$stmt->bindParam(':projectId',$projectId, PDO::PARAM_STR);
		$stmt->bindParam(':title',$title, PDO::PARAM_STR);
		$stmt->bindParam(':qid',$qid, PDO::PARAM_STR);
		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}




	public function reviseQuotation($qid,$data){
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
		try {
			$stmt1 = $conn->prepare("DELETE FROM quotation_tax_applicable_to  WHERE TaxID IN (SELECT TaxID FROM quotation_tax_details  WHERE QuotationId = :qid)");
			$stmt1->bindParam(':qid',$qid,PDO::PARAM_STR);
			if($stmt1->execute() === TRUE){

				$stmt2 = $conn->prepare("DELETE FROM quotation_tax_details  WHERE QuotationId = :qid");
				$stmt2->bindParam(':qid',$qid,PDO::PARAM_STR);
				if($stmt2->execute() === TRUE){
					$stmt3 = $conn->prepare("DELETE FROM quotation_details  WHERE QuotationId = :qid");
					$stmt3->bindParam(':qid',$qid,PDO::PARAM_STR);

					if($stmt3->execute() ===TRUE){
							if(Quotation::isRefNoPresentInAnotherQuotation($data->Quotation->RefNo,$qid)){
								$conn->rollback();
								return 2;
							}
							if(Quotation::isQuotationTitlePresentInAnotherQuotation($data->Quotation->ProjectId,$data->Quotation->QuotationTitle,$qid)){
								$conn->rollback();
								return 3;
							}

							$result = Quotation::modifyQuotation($data,$qid);
								if ($result) {
									$conn->commit();
									return 1;
								}



					}
				}
			}
		}catch(Exception $exception){
			$conn->rollBack();
			throw $exception;
		}
		$conn->rollback;
		return 0;

	}

		/*------------------------------------------------*/


/*public function reviseQuotation($qid,$data){

	try{
			//print_r("Id is ".$qid);
			//print_r("data is ".$data);
			$data1 =$data->Quotation;
			$data2 = $data->QuotationDetails;
			//print_r($data1);
			//print_r("Size issss ".sizeOf($data2));
			$return = FALSE;
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();//QuotationId, QuotationTitle, RefNo, DateOfQuotation, Subject, ProjectId, CompanyId, QuotationBlob, isApproved, isDeleted
			$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
			$stmt = $conn->prepare("UPDATE quotation SET QuotationTitle = :quotationTitle, RefNo = :refNo, DateOfQuotation = :dateOfQuotation, Subject = :subject, CompanyId = :companyId , QuotationBlob = :quotationBlob WHERE QuotationId = :id");
			$stmt->bindParam(':quotationTitle', $data1->Title, PDO::PARAM_STR);
			//print_r($data1->QuotationTitle);
			$stmt->bindParam(':refNo', $data1->ReferenceNo, PDO::PARAM_STR);
			$stmt->bindParam(':dateOfQuotation', $data1->Date, PDO::PARAM_STR);
			$stmt->bindParam(':subject', $data1->Subject, PDO::PARAM_STR);
			$stmt->bindParam(':companyId', $data1->CompanyName, PDO::PARAM_STR);
			$stmt->bindParam(':quotationBlob', $data1->QuotationBlob, PDO::PARAM_STR);			
			$stmt->bindParam(':id', $qid, PDO::PARAM_STR);
			if($stmt->execute() === TRUE){
				
					$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);//DetailID, QuotationId, Title, Description, Quantity, UnitRate, Amount, DetailNo, Unit
					//print_r("Size is ".sizeOf($data2));
					//print_r("Size is ".sizeOf($data2->QuotationDetails));
					for($x = 0 ; $x < sizeOf($data2); $x++){
					$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
					$stmt1 = $conn->prepare("UPDATE quotation_details SET Title = :title, Description = :description, Quantity = :quantity, UnitRate = :unitRate, Amount = :amount  WHERE QuotationId = :id");
					//print_r("Title is ".$data->QuotationDetails[1]->title);
					$stmt1->bindParam(':title', $data->QuotationDetails[$x]->title, PDO::PARAM_STR);
					//print_r($data->QuotationDetails[$x]);
					$stmt1->bindParam(':description', $data->QuotationDetails[$x]->description, PDO::PARAM_STR);
					$stmt1->bindParam(':quantity', $data->QuotationDetails[$x]->quantity, PDO::PARAM_STR);
					$stmt1->bindParam(':unitRate', $data->QuotationDetails[$x]->unitRate, PDO::PARAM_STR);
					$stmt1->bindParam(':amount', $data->QuotationDetails[$x]->amount, PDO::PARAM_STR);
					//$stmt1->bindParam(':unit', $data->Unit, PDO::PARAM_STR);			
					//$stmt1->bindParam(':detailID', $data->DetailID, PDO::PARAM_STR);
					$stmt1->bindParam(':id', $qid, PDO::PARAM_STR);

					if($stmt1->execute() === TRUE){

								$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);//TaxID, QuotationId, TaxName, TaxPercentage, TaxAmount
								$conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
								$stmt2 = $conn->prepare("UPDATE quotation_tax_details SET TaxName = :taxName, TaxPercentage = :taxPercentage, TaxAmount = :taxAmount  WHERE QuotationId = :id");
								$stmt2->bindParam(':taxName', $data->QuotationDetails[$x]->taxName, PDO::PARAM_STR);
								//print_r($data->QuotationDetails[$x]->taxName);
								$stmt2->bindParam(':taxPercentage', $data->QuotationDetails[$x]->taxPercentage, PDO::PARAM_STR);
								$stmt2->bindParam(':taxAmount', $data->QuotationDetails[$x]->taxAmount, PDO::PARAM_STR);
								$stmt2->bindParam(':id', $qid, PDO::PARAM_STR);

								if($stmt2->execute() === TRUE){
										//$conn->commit();
									 $return = TRUE;
										//echo "Quotation updated succesfully";
								}else{
										$return = FALSE;
										return "Error in stmt2";
								}
							
					}else{
							return "Error in stmt1";
					}
				}

				
			}
			else{

				return "Error in updation of Quotation";
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
			return "exception in updation ".$e.getMessage();
		}
	
}*/

public static function isRefNoPresent($refNo){
	$db = Database::getInstance();
	$conn = $db->getConnection();
	$stmt = $conn->prepare("SELECT `RefNo` FROM `quotation` WHERE `RefNo`=:refNo ");
	$stmt->bindParam(':refNo',$refNo, PDO::PARAM_STR);

	$stmt->execute();
	$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
	if (count($result) > 0) {
		return true;
	}
	return false;
}

	public static function isQuotationTitlePresent($projectId,$title){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `QuotationTitle` FROM `quotation` WHERE `ProjectId`=:projectId AND `QuotationTitle`=:title");
		$stmt->bindParam(':projectId',$projectId, PDO::PARAM_STR);
		$stmt->bindParam(':title',$title, PDO::PARAM_STR);
		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}



public static  function saveQuotationDetailsAndTax($data){
	$QuotationId = AppUtil::generateId();
	$quotation = $data->Quotation;
	$quotationBasicDetails = $data->Details;
	$quotationTaxDetails = $data->taxDetails;
	 $detailIdArray = [];
	 $quotationIndex = [];

	$db = Database::getInstance();
	$conn = $db->getConnection();
	$conn->beginTransaction();

	$date1 = new DateTime($quotation->DateOfQuotation);
	$quotationDate = $date1->format('Y-m-d');
		$stmt = $conn->prepare("INSERT INTO quotation(QuotationId, QuotationTitle, RefNo, DateOfQuotation, Subject, ProjectId, CompanyId, QuotationBlob, isApproved, isDeleted) VALUES(?,?,?,?,?,?,?,?,?,?);");
		if($stmt->execute([$QuotationId,$quotation->QuotationTitle,$quotation->RefNo,$quotationDate,$quotation->Subject,$quotation->ProjectId,$quotation->CompanyId,$quotation->QuotationBlob,0,0]) === TRUE){

			for($i = 0;$i<sizeof($quotationBasicDetails);$i++){

					$DetailId = AppUtil::generateId();
					$stmt1 = $conn->prepare("INSERT INTO quotation_details(DetailID, QuotationId, Title, Description, Quantity, UnitRate, Amount, DetailNo,unit) VALUES(?,?,?,?,?,?,?,?,?)");
						if($stmt1->execute([$DetailId,$QuotationId,$quotationBasicDetails[$i]->quotationItem,$quotationBasicDetails[$i]->quotationDescription,$quotationBasicDetails[$i]->quotationQuantity,$quotationBasicDetails[$i]->quotationUnitRate,$quotationBasicDetails[$i]->amount,$i+1,$quotationBasicDetails[$i]->quotationUnit]) === TRUE){
							//$detailIdArray.push($DetailId);
							array_push($detailIdArray,$DetailId);
							array_push($quotationIndex,$i+1);
						}
						else{
							$conn->rollBack();
							return false;
						}
			}


			for($tx=0;$tx<sizeof($quotationTaxDetails);$tx++){
				$TaxId = AppUtil::generateId();
				$stmt2 = $conn->prepare("INSERT INTO quotation_tax_details(TaxID, QuotationId, TaxName, TaxPercentage, TaxAmount) VALUES(?,?,?,?,?)");
				if($stmt2->execute([$TaxId,$QuotationId,$quotationTaxDetails[$tx]->taxTitle,$quotationTaxDetails[$tx]->taxPercentage,$quotationTaxDetails[$tx]->amount]) === TRUE){

					for($s = 0;$s<sizeof($quotationTaxDetails[$tx]->taxArray);$s++){

						for($qut = 0;$qut<sizeof($quotationIndex);$qut++){
							if($quotationTaxDetails[$tx]->taxArray[$s] === $quotationIndex[$qut]){
								$stmt3 = $conn->prepare("INSERT INTO quotation_tax_applicable_to(TaxID, DetailsID) VALUES(?,?)");
								if($stmt3->execute([$TaxId,$detailIdArray[$qut]]) ===FALSE){
									$conn->rollBack();
									return false;
								}
							}
						}
					}
				}
				else{
					$conn->rollBack();
					return false;
				}
			}
		}


		$conn->commit();
		return true;
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

	public static function isQuotationAlreadyUploaded($quotationBlob){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `QuotationBlob` FROM `quotation` WHERE `QuotationBlob`=:quotationBlob");
		$stmt->bindParam(':quotationBlob',$quotationBlob, PDO::PARAM_STR);

		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}


	public static function isQuotationAlreadyUploadedForAnotherQuotation($quotationBlob,$quotationId){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `QuotationBlob` FROM `quotation` WHERE `QuotationBlob`=:quotationBlob AND `QuotationId`!=:quotationId");
		$stmt->bindParam(':quotationBlob',$quotationBlob, PDO::PARAM_STR);
		$stmt->bindParam(':quotationId',$quotationId, PDO::PARAM_STR);
		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}



}