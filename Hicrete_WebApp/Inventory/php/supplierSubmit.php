<?php
    require_once('Supplier.php');
require_once '../../php/Database.php';
//require_once '../../KLogger.php';

    //require_once('Database.php');


    $supplier = json_decode($_GET["supplier"]); # from angular js


$db = Database::getInstance();
$dbh = $db->getConnection();
session_start();
$userId = $_SESSION['token'];
    #fetching veriables from front end and initializing
    ###################################################################

    $supplierVar = new Supplier($supplier);

    if(!$supplierVar->isAvailable($dbh))
    {
        $supplierVar->addSupplierToDb($dbh,$userId,$supplier);

    }
    else
    {
        $arr = array('msg' => "", 'error' => "Supplier already exists");
        $jsn = json_encode($arr);
        echo($jsn);
    }

?>