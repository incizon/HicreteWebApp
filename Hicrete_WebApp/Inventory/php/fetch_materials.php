<?php

$hostname = 'localhost';
$dbname='inventory';
$username = 'admin';
$password = 'admin';
$userId="Pranav";

$dbh= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password);
$opt = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);


$stmt = $dbh->prepare("select a.materialid,b.productname from material a,product_master b where a.productmasterid=b.productmasterid"); 
$stmt->execute();
$result=$stmt->fetchAll();

$json=json_encode($result);
echo $json;


?>