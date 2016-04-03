<?php
require_once '../../php/appUtil.php';
require_once '../../php/Database.php';

Class User {
	
	public function loadUser($id) {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from usermaster um where um.UserId = :id AND um.isDeleted = 0");
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

	public function loadAllUsers(){
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from usermaster um WHERE um.isDeleted = 0");
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



	public function saveUser($data){
		
		$usernum = AppUtil::generateId();
	
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$stmt = $conn->prepare("INSERT INTO usermaster(UserId, FirstName, LastName, isDeleted) VALUES(?,?,?,?)");
				if($stmt->execute([$usernum,$data->FirstName,$data->LastName,0]) === TRUE){
						$conn->commit();
						return "User created succesfully ";
				}
				else{
						return "Error in user creation";
				}
			
		} catch (PDOException $e) {
            echo $e->getMessage();
            $conn->rollBack();
        }
		$conn = null;
	}



	public function deleteUser($id) {

		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			$stmt = $conn->prepare("UPDATE usermaster um SET um.isDeleted = 1 WHERE um.UserId = :id");
			$stmt->bindParam(':id',$id,PDO::PARAM_STR);
				if($stmt->execute() === TRUE){
					$conn->commit();
					return "User delete succefully";
				}
				else{
					return "Error in user deletion ";
				}
		}
		catch(PDOException $e){
			return "in exception during user delletion ".$e->getMessage();
		
		}
	$conn =null;
	}
}

