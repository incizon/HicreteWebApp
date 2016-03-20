<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Company {

	public function getAllCompanies() {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT cm.CompanyID,cm.CompanyName FROM company_master cm WHERE cm.isDeleted = 0");
			
			if($result = $stmt->execute()){
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
				}
			}

		 } catch (PDOException $e) {
            echo $e->getMessage();
        }

		$db = null;
		//print_r($object);
		return $object ;
	}




}

