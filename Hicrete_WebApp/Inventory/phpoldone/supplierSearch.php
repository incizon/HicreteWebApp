<?php

// $supplier = json_decode($_GET["supplier"]);

// $searchString=$supplier->supplierName;
// $searchString='%'.$searchString.'%';

$hostname = 'localhost';
$dbname='inventory';
$username = 'admin';
$password = 'admin';

$opt = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);




$dbh= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password,$opt);

$stmt=$dbh->prepare("select * from supplier");

//$stmt->bindParam(':supplierName',$searchString, PDO::PARAM_STR,100);

	$stmt->execute();
	$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
	$result = $stmt->fetchAll();
	$json= json_encode($result);
	echo $json;


?>