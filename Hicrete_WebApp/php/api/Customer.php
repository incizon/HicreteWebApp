<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Customer {

	public function loadCustomer($id) {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from customer_master cm where (cm.CustomerId = :id) AND cm.isDeleted = 0");
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

	public static function loadAllCustomerBySearch($searchTerm,$searchBy) {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$searchTerm='%'.$searchTerm.'%';
		$searchBy=strtolower($searchBy);
		$queryStmt=self::getCustomerSearchQuery($searchBy);

		$stmt = $conn->prepare($queryStmt);
		$stmt->bindParam(':data', $searchTerm, PDO::PARAM_STR);

		//$stmt->bindParam(':id', $id, PDO::PARAM_STR);

		if($result = $stmt->execute()){
			$noOfRows=0;
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
				$noOfRows++;
			}

		}

		$db = null;
		return $object ;
		//return "i m in";
	}

	public static function getCustomerSearchQuery($searchBy){
		if($searchBy=='city'){
			return "SELECT * from customer_master cm where cm.isDeleted = 0 AND  cm.City LIKE :data" ;
		}else if($searchBy=='state'){
			return "SELECT * from customer_master cm where cm.isDeleted = 0 AND  cm.State LIKE :data" ;
		}
	}


	public function loadAllCustomer(){
		$object = array();

			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from customer_master cm WHERE cm.isDeleted = 0");
			if($result = $stmt->execute()) {
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
				}
			}

		$db = null;
		return $object;
	}


	public function saveCustomer($data,$userId ) {
		$custnum = AppUtil::generateId();
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("INSERT INTO customer_master (CustomerId,CustomerName,Address,City,State,Country,Pincode,Mobileno,Landlineno,FaxNo,EmailId,isDeleted,CreationDate,CreatedBy,LastModificationDate,LastModifiedBy,VATNo,CSTNo,PAN,ServiceTaxNo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

			if ($stmt->execute([$custnum, $data->CustomerName,$data->Address,$data->City,$data->State,$data->Country,$data->Pincode,$data->Mobileno,$data->Landlineno,$data->FaxNo,$data->EmailId,$data->isDeleted,$data->CreationDate,$userId,$data->LastModificationDate,$userId,$data->VATNo,$data->CSTNo,$data->PAN,$data->ServiceTaxNo]) === TRUE) {
				return "success";

			}
			else {
				return "Error: " . $conn->error;
			}
		} catch (PDOException $e) {
			echo $e->getMessage();
		}
		$conn = null;
	}


	public static function updateCustomer($id,$data,$userId){

			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$stmt = $conn->prepare("UPDATE customer_master SET CustomerName = :customerName, Address=:address, City=:city, State=:state, Country=:country, Mobileno=:mobileno, Landlineno=:landlineno, FaxNo=:faxno, EmailId=:email, LastModificationDate=now(), LastModifiedBy=:modBy ,VATNo=:vatno, CSTNo=:cstno, PAN=:pan, ServiceTaxNo=:servicetNo WHERE CustomerId = :id");
			$stmt->bindParam(':customerName', $data->CustomerName, PDO::PARAM_STR);
			$stmt->bindParam(':address', $data->Address, PDO::PARAM_STR);
			$stmt->bindParam(':city', $data->City, PDO::PARAM_STR);
			$stmt->bindParam(':state', $data->State, PDO::PARAM_STR);
			$stmt->bindParam(':country', $data->Country, PDO::PARAM_STR);
			$stmt->bindParam(':mobileno', $data->Mobileno, PDO::PARAM_STR);
			$stmt->bindParam(':landlineno', $data->Landlineno, PDO::PARAM_STR);
			$stmt->bindParam(':faxno', $data->FaxNo, PDO::PARAM_STR);
			$stmt->bindParam(':email', $data->EmailId, PDO::PARAM_STR);
			$stmt->bindParam(':modBy', $userId, PDO::PARAM_STR);
			$stmt->bindParam(':vatno', $data->VATNo, PDO::PARAM_STR);
			$stmt->bindParam(':cstno', $data->CSTNo, PDO::PARAM_STR);
			$stmt->bindParam(':pan', $data->PAN, PDO::PARAM_STR);
			$stmt->bindParam(':servicetNo', $data->ServiceTaxNo, PDO::PARAM_STR);
			$stmt->bindParam(':id', $id, PDO::PARAM_STR);

			if($stmt->execute() === TRUE){
				$conn->commit();
				return true;
			}
			else{
				return false;
			}
	}

	public function deleteCustomer($id) {
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			//$stmt = $conn->prepare("DELETE FROM customer_master WHERE CustomerId = :id");
			$stmt = $conn->prepare("UPDATE customer_master SET isDeleted = 1 WHERE CustomerId = :id");
			$stmt->bindParam(':id',$id,PDO::PARAM_STR);
			if($stmt->execute() ===TRUE){
				$conn->commit();
				return "Customer deleted succesfully";
			}
			else{
				return "Error in cutstomer deletion";
			}
		}
		catch(PDOException $e){
			return "Exception in deletion of customer ".$e->getMessage();
		}

	}

	public static function getCustomerList() {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `CustomerId`,`CustomerName` FROM `customer_master` WHERE `isDeleted`!=1 ");
		if($result = $stmt->execute()) {
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}

		$db = null;
		return $object;


	}

}

