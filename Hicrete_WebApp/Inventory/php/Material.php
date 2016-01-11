<?php
require_once 'Database/Database.php';

$db = Database::getInstance();
	$dbh = $db->getConnection();

	try{

			$stmt = $dbh->prepare("select materialtypeid,materialtype from materialtype");
			$stmt->execute();
			$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
			#$types=$stmt->fetchAll(PDO::FETCH_COLUMN, 0);
			$types = $stmt->fetchAll();
			#echo $types;
			#$types=json_encode($types);
			$types= json_encode($types);
			echo $types;
	}catch(Exception $e){
		echo $e->getMessage();
	}
?>