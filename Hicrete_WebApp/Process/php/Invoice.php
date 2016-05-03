<?php
require_once '../../php/appUtil.php';
require_once '../../php/Database.php';

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

			$stmt = $conn->prepare("SELECT * FROM project_payment_followup p,project_payment_followup_details pfd,usermaster um WHERE p.FollowupId = pfd.FollowupId AND um.UserId = p.AssignEmployee AND p.InvoiceId = :id");
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

	$db = Database::getInstance();
	$conn = $db->getConnection();//SELECT * FROM invoice i , quotation q WHERE i.quotationId = q.quotationId AND i.QuotationId in (SELECT q.QuotationId FROM quotation q  WHERE q.ProjectId = :projid)
	$stmt = $conn->prepare("SELECT * FROM invoice i , quotation q ,`work_order` w WHERE  q.ProjectId = :projid  AND  i.QuotationId = q.QuotationId AND i.QuotationId = w.`quotationId`");
	$stmt->bindParam(':projid',$projid,PDO::PARAM_STR);
	if($stmt->execute() === TRUE){
			while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
	}
	else{
			return null;
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




	public static function isInvoiceNumberPresent($invoiceNo){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `InvoiceNo` FROM `invoice` where `InvoiceNo`=:invoiceNo");
		$stmt->bindParam(':invoiceNo',$invoiceNo, PDO::PARAM_STR);

		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}

	public static function isInvoiceTitlePresent($quotationId,$title){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `InvoiceTitle` FROM `invoice` where `InvoiceTitle`=:title AND `QuotationId` IN (SELECT `QuotationId` FROM `quotation` WHERE `quotation`.`ProjectId` IN ( SELECT `ProjectId` FROM `quotation` WHERE `QuotationId`=:quotationId))");
		$stmt->bindParam(':title',$title, PDO::PARAM_STR);
		$stmt->bindParam(':quotationId',$quotationId, PDO::PARAM_STR);

		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}

	public static function isInvoiceAlreadyUploaded($invoiceBlob){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `InvoiceBLOB` FROM `invoice` WHERE `InvoiceBLOB`=:invoiceBlob");
		$stmt->bindParam(':invoiceBlob',$invoiceBlob, PDO::PARAM_STR);

		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}


	public static function saveInvoice($data,$userId){

		$main = $data->Invoice;
		$InvoicebasicDetails = $data->Details;
		$invoiceTaxDetails = $data->taxDetails;
		$detailIdArray = [];
		$invoiceIndex = [];
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();

		$date1 = new DateTime($main->InvoiceDate);
		$invoiceDate = $date1->format('Y-m-d');

		$stmt = $conn->prepare("INSERT INTO invoice(InvoiceNo, QuotationId, InvoiceDate, InvoiceTitle, TotalAmount, RoundingOffFactor, GrandTotal, InvoiceBLOB,  PurchasersVATNo, PAN, CreatedBy,ContactPerson) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)");

		if($stmt->execute([$main->InvoiceNo, $main->QuotationId, $invoiceDate, $main->InvoiceTitle, $main->TotalAmount, $main->RoundingOffFactor, $main->GrandTotal, $main->InvoiceBLOB, $main->PurchasersVATNo, $main->PAN, $userId,$main->ContactPerson]) === TRUE){
			for($i = 0;$i<sizeof($InvoicebasicDetails);$i++){
				$DetailId = AppUtil::generateId();

				$stmt1 = $conn->prepare("INSERT INTO invoice_details(DetailID, InvoiceId, DetailNo, Title, Description, Quantity, UnitRate, Amount,unit) VALUES(?,?,?,?,?,?,?,?,?)");
					if($stmt1->execute([$DetailId,$main->InvoiceNo,$i + 1,$InvoicebasicDetails[$i]->quotationItem,$InvoicebasicDetails[$i]->quotationDescription,$InvoicebasicDetails[$i]->quotationQuantity,$InvoicebasicDetails[$i]->quotationUnitRate,$InvoicebasicDetails[$i]->amount,$InvoicebasicDetails[$i]->quotationUnit]) === TRUE){
						array_push($detailIdArray,$DetailId);
						array_push($invoiceIndex,$i+1);
					}
					else{
						$conn->rollBack();
						return false;
					}
			}

			for($tx=0;$tx<sizeof($invoiceTaxDetails);$tx++){
				$TaxId = AppUtil::generateId();
				$stmt2 = $conn->prepare("INSERT INTO invoice_tax_details(TaxId, InvoiceId, TaxName, TaxPercentage, TaxAmount) VALUES(?,?,?,?,?)");
					if($stmt2->execute([$TaxId,$main->InvoiceNo,$invoiceTaxDetails[$tx]->taxTitle,$invoiceTaxDetails[$tx]->taxPercentage,$invoiceTaxDetails[$tx]->amount]) === TRUE){
						for($s = 0;$s<sizeof($invoiceTaxDetails[$tx]->taxArray);$s++){
							for($qut = 0;$qut<sizeof($invoiceIndex);$qut++){
								if($invoiceTaxDetails[$tx]->taxArray[$s] === $invoiceIndex[$qut]){

									$stmt3 = $conn->prepare("INSERT INTO invoice_tax_applicable_to(TaxId, DetailsId) VALUES(?,?)");
									if($stmt3->execute([$TaxId,$detailIdArray[$qut]]) === FALSE){
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


		} else {
			$conn->rollBack();
			return false;
		}

		$conn->commit();
		return true;
		$conn = null;
	}


	public static function modifyInvoice($conn,$data,$invoiceNo){

		$main = $data->Invoice;
		$InvoicebasicDetails = $data->Details;
		$invoiceTaxDetails = $data->taxDetails;
		$detailIdArray = [];
		$invoiceIndex = [];
		$date1 = new DateTime($main->InvoiceDate);
		$invoiceDate = $date1->format('Y-m-d');


		$stmt = $conn->prepare("UPDATE `invoice` SET `InvoiceNo`=:newInvoiceNo ,`InvoiceDate`=:invoiceDate,`InvoiceTitle`=:title,`TotalAmount`=:totalAmount,`RoundingOffFactor`=:roundOff,`GrandTotal`=:grandTotal,`InvoiceBLOB`=:invoiceBlob,`PurchasersVATNo`=:purchaserVatNo,`PAN`=:pan,`ContactPerson`=:contactPerson WHERE `InvoiceNo`=:oldInvoiceNo");
		$stmt->bindparam(':invoiceDate',$invoiceDate ,PDO::PARAM_STR);
		$stmt->bindparam(':title',$main->InvoiceTitle ,PDO::PARAM_STR);
		$stmt->bindparam(':totalAmount',$main->TotalAmount ,PDO::PARAM_STR);
		$stmt->bindparam(':roundOff',$main->RoundingOffFactor ,PDO::PARAM_STR);
		$stmt->bindparam(':grandTotal',$main->GrandTotal ,PDO::PARAM_STR);
		$stmt->bindparam(':invoiceBlob',$main->InvoiceBLOB ,PDO::PARAM_STR);
		$stmt->bindparam(':purchaserVatNo',$main->PurchasersVATNo ,PDO::PARAM_STR);
		$stmt->bindparam(':pan',$main->PAN ,PDO::PARAM_STR);
		$stmt->bindparam(':contactPerson',$main->ContactPerson ,PDO::PARAM_STR);
		$stmt->bindparam(':newInvoiceNo',$main->InvoiceNo ,PDO::PARAM_STR);
		$stmt->bindparam(':oldInvoiceNo',$invoiceNo ,PDO::PARAM_STR);

		if($stmt->execute() === TRUE){
			for($i = 0;$i<sizeof($InvoicebasicDetails);$i++){
				$DetailId = AppUtil::generateId();

				$stmt1 = $conn->prepare("INSERT INTO invoice_details(DetailID, InvoiceId, DetailNo, Title, Description, Quantity, UnitRate, Amount,unit) VALUES(?,?,?,?,?,?,?,?,?)");
				if($stmt1->execute([$DetailId,$main->InvoiceNo,$i + 1,$InvoicebasicDetails[$i]->quotationItem,$InvoicebasicDetails[$i]->quotationDescription,$InvoicebasicDetails[$i]->quotationQuantity,$InvoicebasicDetails[$i]->quotationUnitRate,$InvoicebasicDetails[$i]->amount,$InvoicebasicDetails[$i]->quotationUnit]) === TRUE){
					array_push($detailIdArray,$DetailId);
					array_push($invoiceIndex,$i+1);
				}
				else{

					return false;
				}
			}

			for($tx=0;$tx<sizeof($invoiceTaxDetails);$tx++){
				$TaxId = AppUtil::generateId();
				$stmt2 = $conn->prepare("INSERT INTO invoice_tax_details(TaxId, InvoiceId, TaxName, TaxPercentage, TaxAmount) VALUES(?,?,?,?,?)");
				if($stmt2->execute([$TaxId,$main->InvoiceNo,$invoiceTaxDetails[$tx]->taxTitle,$invoiceTaxDetails[$tx]->taxPercentage,$invoiceTaxDetails[$tx]->amount]) === TRUE){
					for($s = 0;$s<sizeof($invoiceTaxDetails[$tx]->taxArray);$s++){
						for($qut = 0;$qut<sizeof($invoiceIndex);$qut++){
							if($invoiceTaxDetails[$tx]->taxArray[$s] === $invoiceIndex[$qut]){

								$stmt3 = $conn->prepare("INSERT INTO invoice_tax_applicable_to(TaxId, DetailsId) VALUES(?,?)");
								if($stmt3->execute([$TaxId,$detailIdArray[$qut]]) === FALSE){

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


		} else {

			return false;
		}


		return true;


	}


	public static function isInvoiceNoPresentInAnotherInvoice($oldInvoiceNo,$newInvoiceNo){
		if($oldInvoiceNo==$newInvoiceNo)
			return false;

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `InvoiceNo` FROM `invoice` where `InvoiceNo`=:newInvoiceNo ");
		$stmt->bindParam(':invoiceNo',$newInvoiceNo, PDO::PARAM_STR);

		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}

	public static function isInvoiceTitlePresentInAnotherInvoice($quotationId,$title,$invoiceNo){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `InvoiceTitle` FROM `invoice` where `InvoiceNo`!=:invoiceNo AND `InvoiceTitle`=:title AND `QuotationId` IN (SELECT `QuotationId` FROM `quotation` WHERE `quotation`.`ProjectId` IN ( SELECT `ProjectId` FROM `quotation` WHERE `QuotationId`=:quotationId))");
		$stmt->bindParam(':title',$title, PDO::PARAM_STR);
		$stmt->bindParam(':invoiceNo',$invoiceNo, PDO::PARAM_STR);
		$stmt->bindParam(':quotationId',$quotationId, PDO::PARAM_STR);

		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}

	public static function isInvoiceAlreadyUploadedForAnotherInvoice($invoiceBlob,$invoiceNo){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `InvoiceBLOB` FROM `invoice` WHERE `InvoiceBLOB`=:invoiceBlob and `InvoiceNo`!=:invoiceNo");
		$stmt->bindParam(':invoiceBlob',$invoiceBlob, PDO::PARAM_STR);
		$stmt->bindParam(':invoiceNo',$invoiceNo, PDO::PARAM_STR);

		$stmt->execute();
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($result) > 0) {
			return true;
		}
		return false;
	}




	public static function reviseInvoice($oldInvoiceNo, $data){
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$conn->beginTransaction();
		try {
			$stmt1 = $conn->prepare("DELETE FROM `invoice_tax_applicable_to` WHERE `TaxId` IN (SELECT `TaxId` FROM `invoice_tax_details` WHERE `InvoiceId`=:invoiceNo)");
			$stmt1->bindParam(':invoiceNo',$oldInvoiceNo,PDO::PARAM_STR);
			if($stmt1->execute() === TRUE){

				$stmt2 = $conn->prepare("DELETE FROM `invoice_tax_details` WHERE `InvoiceId`=:invoiceNo");
				$stmt2->bindParam(':invoiceNo',$oldInvoiceNo,PDO::PARAM_STR);
				if($stmt2->execute() === TRUE){
					$stmt3 = $conn->prepare("DELETE FROM `invoice_details` WHERE `InvoiceId`= :invoiceNo");
					$stmt3->bindParam(':invoiceNo',$oldInvoiceNo,PDO::PARAM_STR);

					if($stmt3->execute() ===TRUE){
						$result = Invoice::modifyInvoice($conn,$data,$oldInvoiceNo);
						if ($result) {
							$conn->commit();
							return true;
						}
					}
				}
			}
		}catch(Exception $exception){
			$conn->rollBack();
			throw $exception;
		}
		$conn->rollback;
		return false;

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


	public static function getInvoiceDetails($qid){
		$object= array();

		$db = Database:: getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT * FROM `invoice` i,`invoice_details` id WHERE i.`InvoiceNo`=id.`InvoiceId` AND i.`InvoiceNo`=:id ");
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

	public function getInvoiceTaxDetails($qid){
		$object= array();

		$db = Database:: getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT * FROM `invoice_tax_details` WHERE `InvoiceId`=:id;");
		$stmt->bindparam(':id',$qid ,PDO::PARAM_STR);
		if($stmt->execute() === TRUE){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				$result_array = array();
				$result_array['TaxID'] = $row['TaxId'];
				$result_array['TaxAmount'] = $row['TaxAmount'];
				$result_array['TaxPercentage'] = $row['TaxPercentage'];
				$result_array['TaxName'] =$row['TaxName'];
				$stmt1 = $conn->prepare("SELECT `DetailNo` FROM `invoice_details` WHERE `DetailID` IN (SELECT `DetailsId` FROM `invoice_tax_applicable_to` WHERE `TaxID`=:taxId) order by `DetailNo` ASC");
				$stmt1->bindparam(':taxId',$row['TaxId'] ,PDO::PARAM_STR);
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






}

