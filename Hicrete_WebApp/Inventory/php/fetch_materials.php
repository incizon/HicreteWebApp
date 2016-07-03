<?php

//$hostname = 'localhost';
//$dbname='hicrete';
//$username = 'hicreteRoot';
//$password = 'hicrete@123';
//$userId="Pranav";

require_once 'Database/Database.php';
$db = Database::getInstance();
$dbh = $db->getConnection();
//$dbh= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password);
$opt = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);

$materialType="HICRETE RAW MATERIAL";
$stmt = $dbh->prepare("select a.materialid,b.productname from material a,product_master b where a.productmasterid=b.productmasterid
                      AND b.materialtypeid=(SELECT materialtypeid FROM materialtype WHERE UPPER(materialtype)=UPPER(:materialtype))");
$stmt->bindParam(':materialtype',$materialType);

$stmt->execute();
$result=$stmt->fetchAll();

$json=json_encode($result);
echo $json;


?>