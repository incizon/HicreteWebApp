<?php
	require_once 'Database/Database.php';
    require_once "../../php/HicreteLogger.php";


	$db = Database::getInstance();
	$dbh = $db->getConnection();
	$mData = json_decode($_GET["data"]);

	if(isset($mData->keyword)) {
		$keyword = "%" . $mData->keyword . "%";
	}
	$selectStatement="SELECT product_master.productmasterid,product_master.`productname`,product_master.`unitofmeasure`,product_details.`color`,product_details.`description`, product_details.`alertquantity`,product_packaging.`packaging`,material.`materialid`,material.`abbrevation`,materialtype.`materialtypeid`,materialtype.`materialtype` FROM product_master JOIN product_details ON product_master.productmasterid=product_details.productmasterid JOIN product_packaging ON product_master.productmasterid=product_packaging.productmasterid JOIN material ON product_master.productmasterid=material.productmasterid JOIN materialtype ON materialtype.materialtypeid=product_master.materialtypeid ";

	if(isset($mData->SearchTerm)) {
		switch ($mData->SearchTerm) {
			case 'productName':
				$selectStatement = $selectStatement . " WHERE product_master.productname like :keyword ORDER BY product_master.`productname`,product_details.`color`,product_master.`unitofmeasure` DESC";
				break;
			case 'materialType':
				$selectStatement = $selectStatement . " WHERE materialtype.materialtype like :keyword ORDER BY product_master.`productname`,product_details.`color`,product_master.`unitofmeasure` DESC";
				break;
		}
	}
	//echo $selectStatement;
	$stmt=$dbh->prepare($selectStatement);
	HicreteLogger::logInfo("Searching Products");
	HicreteLogger::logDebug("Query: ".json_encode($stmt));
	HicreteLogger::logDebug("Data: ".json_encode($mData));
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