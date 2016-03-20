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


	public function loadAllCustomer(){
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from customer_master cm WHERE cm.isDeleted = 0");
			if($result = $stmt->execute()) {
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
				}
			}
		} catch (PDOException $e) {
            echo $e->getMessage();
        }
		$db = null;
		return $object;
	}

	
	public static function saveCustomer($data,$userId ) {
		$custnum = AppUtil::generateId();
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$t=time();
			$current =date("Y-m-d",$t);

			$stmt = $conn->prepare("INSERT INTO customer_master (CustomerId,CustomerName,Address,City,State,Country,Pincode,Mobileno,Landlineno,FaxNo,EmailId,isDeleted,CreationDate,CreatedBy,LastModificationDate,LastModifiedBy,VATNo,CSTNo,PAN,ServiceTaxNo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
			
			if ($stmt->execute([$custnum, $data->CustomerName,$data->Address,$data->City,$data->State,$data->Country,$data->Pincode,$data->Mobileno,$data->Landlineno,$data->FaxNo,$data->EmailId,$data->isDeleted,$current,$userId,$current,$userId,$data->VATNo,$data->CSTNo,$data->PAN,$data->ServiceTaxNo]) === TRUE) {
				return AppUtil::getReturnStatus("Successful","Customer Created Successfully");
			}
			else {
				return AppUtil::getReturnStatus("Unsccessful",$conn->error);
			}
		} catch (PDOException $e) {
			return AppUtil::getReturnStatus("Exception",$e->getMessage());
	    }
		$conn = null;
	}


	public function updateCustomer($id,$data){
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$stmt = $conn->prepare("UPDATE customer_master SET CustomerName = :customerName, Address=:address, City=:city, State=:state, Country=:country, Mobileno=:mobileno, Landlineno=:landlineno, FaxNo=:faxno, EmailId=:email, LastModificationDate=:modDate, LastModifiedBy=:modBy ,VATNo=:vatno, CSTNo=:cstno, PAN=:pan, ServiceTaxNo=:servicetNo WHERE CustomerId = :id");
			$stmt->bindParam(':customerName', $data->CustomerName, PDO::PARAM_STR);
			$stmt->bindParam(':address', $data->Address, PDO::PARAM_STR);
			$stmt->bindParam(':city', $data->City, PDO::PARAM_STR);
			$stmt->bindParam(':state', $data->State, PDO::PARAM_STR);
			$stmt->bindParam(':country', $data->Country, PDO::PARAM_STR);
			$stmt->bindParam(':mobileno', $data->Mobileno, PDO::PARAM_STR);
			$stmt->bindParam(':landlineno', $data->Landlineno, PDO::PARAM_STR);
			$stmt->bindParam(':faxno', $data->FaxNo, PDO::PARAM_STR);
			$stmt->bindParam(':email', $data->EmailId, PDO::PARAM_STR);
			$stmt->bindParam(':modDate', $data->LastModificationDate, PDO::PARAM_STR);
			$stmt->bindParam(':modBy', $data->LastModifiedBy, PDO::PARAM_STR);
			$stmt->bindParam(':vatno', $data->VATNo, PDO::PARAM_STR);
			$stmt->bindParam(':cstno', $data->CSTNo, PDO::PARAM_STR);
			$stmt->bindParam(':pan', $data->PAN, PDO::PARAM_STR);
			$stmt->bindParam(':servicetNo', $data->ServiceTaxNo, PDO::PARAM_STR);
			$stmt->bindParam(':id', $id, PDO::PARAM_STR);
			
			if($stmt->execute() === TRUE){
				$conn->commit();
				return "customer updated succesfully";
			}
			else{
				return "Error in updation of customer";
			}
		}
		catch(PDOException $e){
			return "exception in updation ".$e.getMessage();
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


	public function getCustomerList(){


		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();

			$stmt = $conn->prepare("SELECT `CustomerId`,`CustomerName` FROM `customer_master`");
			if ($stmt->execute()) {
				$result = $stmt->fetchAll();
				echo  AppUtil::getReturnStatus("Successful",$result);
			} else {
				echo AppUtil::getReturnStatus("Failure", "Database Error Occurred");
			}
		}catch(Exceptio $e){
			echo AppUtil::getReturnStatus("Exception",$e.getMessage());
		}
	}




}

