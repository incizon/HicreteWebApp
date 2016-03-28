<?php
require_once '/../../php/appUtil.php';
require_once '/../Database.php';

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


	public static function saveCustomer($data,$userId ) {
		$custnum = AppUtil::generateId();
		$object = array();
		$t=time();
		$current =date("Y-m-d",$t);
		$isDeleted='0';
		$pincode="";
		//echo "nside save customer";
		//echo json_encode($data);
		//echo json_encode($data);
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("INSERT INTO customer_master (CustomerId,CustomerName,Address,City,State,Country,Pincode,Mobileno,Landlineno,FaxNo,EmailId,isDeleted,CreationDate,CreatedBy,LastModificationDate,LastModifiedBy,VATNo,CSTNo,PAN,ServiceTaxNo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		if ($stmt->execute([$custnum, $data->customer_name,$data->customer_address,$data->customer_city,$data->customer_state,$data->customer_country,$pincode,$data->customer_phone,$data->customer_landline,$data->customer_faxNo,$data->customer_emailId,$isDeleted,$current,$userId,$current,$userId,$data->customer_vatNo,$data->customer_cstNo,$data->customer_panNo,$data->customer_serviceTaxNo]) === TRUE) {
			//echo "\nit true";
			return true;

		}
		else {
			//echo "\n its false";
			return false;
		}

		$conn = null;
	}


	public static function updateCustomer($id,$data,$userId){

			//echo json_encode($data);
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$stmt = $conn->prepare("UPDATE customer_master SET CustomerName = :customerName, Address=:address, City=:city, State=:state, Country=:country, Mobileno=:mobileno, Landlineno=:landlineno, FaxNo=:faxno, EmailId=:email, LastModificationDate=now(), LastModifiedBy=:modBy ,VATNo=:vatno, CSTNo=:cstno, PAN=:pan, ServiceTaxNo=:servicetNo WHERE CustomerId = :id");
			$stmt->bindParam(':customerName', $data->customer_name, PDO::PARAM_STR);
			$stmt->bindParam(':address', $data->customer_address, PDO::PARAM_STR);
			$stmt->bindParam(':city', $data->customer_city, PDO::PARAM_STR);
			$stmt->bindParam(':state', $data->customer_state, PDO::PARAM_STR);
			$stmt->bindParam(':country', $data->customer_country, PDO::PARAM_STR);
			$stmt->bindParam(':mobileno', $data->customer_phone, PDO::PARAM_STR);
			$stmt->bindParam(':landlineno', $data->customer_landline, PDO::PARAM_STR);
			$stmt->bindParam(':faxno', $data->customer_faxNo, PDO::PARAM_STR);
			$stmt->bindParam(':email', $data->customer_emailId, PDO::PARAM_STR);
			$stmt->bindParam(':modBy', $userId, PDO::PARAM_STR);
			$stmt->bindParam(':vatno', $data->customer_vatNo, PDO::PARAM_STR);
			$stmt->bindParam(':cstno', $data->customer_cstNo, PDO::PARAM_STR);
			$stmt->bindParam(':pan', $data->customer_panNo, PDO::PARAM_STR);
			$stmt->bindParam(':servicetNo', $data->customer_serviceTaxNo, PDO::PARAM_STR);
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

