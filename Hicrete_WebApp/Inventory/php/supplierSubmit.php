<?php
    require_once('Supplier.php');
require_once 'Database/Database.php';
require_once '../../KLogger.php';

    //require_once('Database.php');


    $supplier = json_decode($_GET["supplier"]); # from angular js

    /* $db = Database::getInstance();
     $this->_dbh = $db->getConnection();
    $hostname = 'localhost';
    $dbname='inventory';
    $username = 'admin';
    $password = 'admin';
    $userId="Pranav";

    $dbh= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password);*/
$db = Database::getInstance();
$dbh = $db->getConnection();
session_start();
$userId = $_SESSION['token'];
    #fetching veriables from front end and initializing
    ###################################################################

    //$arr = array('supplierName' => 'abcd', 'contactNo' => "123123",'address' => "ithe",'city' => "Ithech",'country' => "hich",'pinCode' => "123123");
    //$suppObj = json_encode($arr);
$log = new KLogger ( "../../logs/log.txt" , KLogger::INFO );
    $supplierVar = new Supplier($supplier);
    //echo $supplierVar->supplierName;
    $log->LogFATAL("[".$userId."] Inside supplier submit");
    if(!$supplierVar->isAvailable($dbh))
    {
        $supplierVar->addSupplierToDb($dbh,$userId);
        $log->LogFATAL("36 [".$userId."] Its done");
    }
    else
    {
        $arr = array('msg' => "", 'error' => "Supplier already exists");
        $jsn = json_encode($arr);
        echo($jsn);
    }

?>