<?php
	require_once 'Database/Database.php';


	$db = Database::getInstance();
	$dbh = $db->getConnection();



	$stmt=$dbh->prepare("SELECT * FROM product_master  
            JOIN product_details ON
            product_master.productmasterid=product_details.productmasterid
            JOIN product_packaging ON
            product_master.productmasterid=product_packaging.productmasterid
            JOIN material ON 
            product_master.productmasterid=material.productmasterid
            JOIN materialtype ON
            materialtype.materialtypeid=product_master.materialtypeid");

	$stmt->execute();
	//$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
	$result = $stmt->fetchAll();
	$json= json_encode($result);
	echo $json;

?>