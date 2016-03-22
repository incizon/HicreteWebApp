<?php
	require_once 'Database/Database.php';


	$db = Database::getInstance();
	$dbh = $db->getConnection();
	$mData = json_decode($_GET["data"]);

	//echo $mData->keyword;
	//echo $mData->SearchTerm;
	if(isset($mData->keyword)) {
		$keyword = "%" . $mData->keyword . "%";
	}
	$selectStatement="SELECT * FROM product_master
            JOIN product_details ON
            product_master.productmasterid=product_details.productmasterid
            JOIN product_packaging ON
            product_master.productmasterid=product_packaging.productmasterid
            JOIN material ON
            product_master.productmasterid=material.productmasterid
            JOIN materialtype ON
            materialtype.materialtypeid=product_master.materialtypeid ";

	if(isset($mData->SearchTerm)) {
		switch ($mData->SearchTerm) {
			case 'productName':
				$selectStatement = $selectStatement . " WHERE product_master.productname like :keyword";
				break;
			case 'materialType':
				$selectStatement = $selectStatement . " WHERE materialtype.materialtype like :keyword";
				break;
		}
	}
	//echo $selectStatement;
	$stmt=$dbh->prepare($selectStatement);
if(isset($mData->SearchTerm)) {
	if ($mData->SearchTerm == 'productName' || $mData->SearchTerm == 'materialType') {
		$stmt->bindParam(':keyword', $keyword, PDO::PARAM_STR, 10);
	}
}

	$stmt->execute();
	//$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
	$result = $stmt->fetchAll();
	$json= json_encode($result);
	echo $json;

?>