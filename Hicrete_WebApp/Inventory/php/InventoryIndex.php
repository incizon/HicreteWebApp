<?php
require_once 'Database/Database.php';
include_once 'crud/InwardCrud.php';
include_once 'crud/OutwardCrud.php';

//1.
/*Get Data from Html files
	1. Inward Details
	2. Outward Details 
	3. Inventory Search 
*/
//2.
//Get Db connection

//3.
//According to the call i.e. insert,update for inward or outward
/********************************************************
 * Get connection to the Database
 **********************************************************/
$db = Database::getInstance();
$dbh = $db->getConnection();
if (!isset($_SESSION['token'])) {
    session_start();
}
$userId = $_SESSION['token'];

// Get Data From ANgular Service
$mData = json_decode($_GET["data"]);

$opt = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);

switch ($mData->module) {
    case 'inward':
        # code...
        inwardOperations($mData->operation, $mData);
        break;
    case 'outward':
        # code...
        outwardOperations($mData->operation, $mData);
        break;
    case 'inventorySearch':
        getInventory();
        break;
    case 'getProducts':
        getProducts();
        break;

    default:
        # code...
        break;
}

function inwardOperations($pOperation, $pData)
{
    global $dbh;
    global $userId;
    switch ($pOperation) {
        case 'insert':
            # code...
            $productObj = new InwardData($pData);
            $productObj->insertInwardInToDb($dbh, $userId, $pData);
            break;
        case 'delete':
            # code...

            break;
        case 'update':
            # code...
            $productObjUpdate = new InwardData($pData);
            $productObjUpdate->updateInwardDetails($dbh, $userId, $pData);
            break;
        case 'search':
            # code...
            $productObjSearch = new InwardData($pData);
            $productObjSearch->getInwardEntries($dbh);
            break;

        default:
            # code... return with error msg
            break;
    }
}

function outwardOperations($pOperation, $pData)
{
    global $dbh;
    global $userId;
    switch ($pOperation) {
        case 'insert':
            # code...
            $productObj = new OutwardData($pData);
            $productObj->insertOutwardInToDb($dbh, $userId, $pData);
            break;
        case 'delete':
            # code...

            break;
        case 'modify':
            # code...
            $productObjUpdate = new OutwardData($pData);
            $productObjUpdate->updateOutwardDetails($dbh, $userId, $pData);
            break;
        case 'search':
            # code...
            $productObjSearch = new OutwardData($pData);
            $productObjSearch->getOutwardEntries($dbh);
            break;

        default:
            # code... return with error msg
            break;
    }
}

function getInventory()
{
    global $dbh;
    $stmt = $dbh->prepare(
        "SELECT * FROM inventory
			JOIN material ON 
			inventory.materialid=material.materialid
			JOIN product_master ON
			product_master.productmasterid=material.productmasterid
			JOIN materialtype ON
			materialtype.materialtypeid=product_master.materialtypeid
			");

    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    $json = json_encode($result);
    echo $json;

}

function getProducts()
{
    global $dbh;
    $stmt = $dbh->prepare("SELECT * FROM product_master
            JOIN product_details ON
            product_master.productmasterid=product_details.productmasterid
            JOIN product_packaging ON
            product_master.productmasterid=product_packaging.productmasterid
            JOIN material ON 
            product_master.productmasterid=material.productmasterid");

    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    $json = json_encode($result);
    echo $json;

}

?>