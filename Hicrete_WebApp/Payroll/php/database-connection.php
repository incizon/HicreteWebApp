<?php

$hostname = 'localhost';
$dbname='hicrete';
$username = 'hicreteRoot';
$password = 'hicrete@123';

try{
    $connect= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password);
    $connect->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    //echo "connected Successfully";
}
catch(PDOException $e){
    echo $e->getMessage();
}
?>