<?php
    require_once 'Database/Database.php';
    include_once 'crud/InwardCrud.php';
    include_once 'crud/OutwardCrud.php';
    require_once 'utils/DatabaseCommonOperations.php';

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
        global $dbhHicret;
        global $userId;
        switch ($pOperation) {
            case 'insert':
                # code...
                $productObj = new InwardData($pData);
//                if($productObj->isAvailable($dbh)){
                $productObj->insertInwardInToDb($dbh, $userId, $pData);
//                }else{
//                    echo "Inward number that you are trying to insert is already present";
//                }

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
                $productObjSearch->getInwardEntries($dbh,$dbhHicret);
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
                if($productObj->isAvailable($dbh)){
                    $productObj->insertOutwardInToDb($dbh, $userId, $pData);
                }else{
                    echo "Outward number that you are trying to insert is already present";
                }

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
        if($stmt->execute()){
            $json_array=array();
            while ($result2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $inventoryData = array();
                $inventoryData['abbrevation']=$result2['abbrevation'];
                $inventoryData['warehouseid']=$result2['warehouseid'];
                $inventoryData['companyid']=$result2['companyid'];
                $inventoryData['inventoryid']=$result2['inventoryid'];
                $inventoryData['materialid']=$result2['materialid'];
                $inventoryData['materialtype']=$result2['materialtype'];
                $inventoryData['productname']=$result2['productname'];
                $inventoryData['totalquantity']=$result2['totalquantity'];
                $warehouseId=$result2['warehouseid'];
                $companyId=$result2['companyid'];
                $inventoryData['companyName']=DatabaseCommonOperations::getCompanyName($companyId);
                $inventoryData['warehouseName']=DatabaseCommonOperations::getWarehouseName($warehouseId);

                array_push($json_array,$inventoryData);
            }
            $json = json_encode($json_array);
            echo $json;
        }else{

        }



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