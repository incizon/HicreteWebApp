<?php
    require_once 'Database/Database.php';
    include_once 'crud/InwardCrud.php';
    include_once 'crud/OutwardCrud.php';
    require_once 'utils/DatabaseCommonOperations.php';
    require_once 'utils/InventoryUtils.php';
    require_once 'utils/Common_Methods.php';


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

            getInventory($mData->searchBy,$mData->searchKeyword);
            break;
        case 'getProducts':
            getProducts();
            break;
        case 'getProductsForOutward':
	        getProductsForOutward();
	        break;
        case 'getProductsForInward':
            getProductsForInward();
            break;
        case 'getSuppliers':
            getSuppliers();
            break;
        case 'getCriticalStock':
            $result=InventoryUtils::getCriticalStock();
           echo json_encode($result);
            break;
        default:
            # code...
            break;
    }

    function getSuppliers(){
        global $dbh;
        $stmt = $dbh->prepare("SELECT supplierid,suppliername FROM supplier");

        if ($stmt->execute()) {
            if($stmt->rowCount()>0){
                $result = $stmt->fetchAll();
                echo json_encode($result);
            }

        } else {
            $returnVal=array('status' => "Fail", 'message' => "Suppliers not found" );
            echo json_encode($returnVal);
        }
    }
    function getProductsForInward(){
        global $dbh;
        $stmt = $dbh->prepare("SELECT product_master.productmasterid,product_master.productname,product_master.unitofmeasure,material.materialid FROM product_master JOIN material ON product_master.productmasterid=material.productmasterid");

        $stmt->execute();
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();
        $json = json_encode($result);
        echo $json;
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
                if(!$productObj->isAvailable($dbh)){
                    $productObj->insertInwardInToDb($dbh, $userId, $pData);
                }else{
                    //echo "Inward number that you are trying to insert is already present";
                    $productObj->showAlert('Failure', "Inward no already Exist Please insert new Inward Number");
                }

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
               // echo $pData->keyword;
               // echo $pData->SearchTerm;
                if(isset($pData->keyword))
                {
                    $keyword=$pData->keyword;
                }
                else
                {
                    $keyword="";
                }

                if(isset($pData->SearchTerm))
                {
                    $SearchTerm = $pData->SearchTerm;
                }
                else
                    $SearchTerm ="";
                        $productObjSearch->getInwardEntries($dbh,$keyword,$SearchTerm,$dbhHicret);
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
                if(!$productObj->isAvailable($dbh)){
                    $productObj->insertOutwardInToDb($dbh, $userId, $pData);
                }else{
                    //echo "Outward number that you are trying to insert is already present";
                    $productObj->showAlert('Failure', "Outward no already Exist Please insert new Inward Number");
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
                if(isset($pData->keyword))
                {
                    $keyword=$pData->keyword;
                }
                else
                {
                    $keyword="";
                }

                if(isset($pData->SearchTerm))
                {
                    $SearchTerm = $pData->SearchTerm;
                }
                else
                    $SearchTerm ="";
                $productObjSearch->getOutwardEntries($dbh,$keyword,$SearchTerm);
                break;
            case 'getProductAvailableQty':
//                echo json_encode($pData->materialId);
                getProductAvailableQty($pData->materialId);
                break;

            default:
                # code... return with error msg
                break;
        }
    }

    function getProductAvailableQty($materialId){
        $getReturnMessage = new CommonMethods();
        global $dbh;
        $stmt = $dbh->prepare(
            "SELECT * FROM inventory WHERE materialid=$materialId");
        if($stmt->execute()){
            $json_array=array();
            while ($result2 = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $inventoryData = array();
                $inventoryData['warehouseid']=$result2['warehouseid'];
                $inventoryData['companyid']=$result2['companyid'];
                $inventoryData['inventoryid']=$result2['inventoryid'];
                $inventoryData['totalquantity']=$result2['totalquantity'];
                $inventoryData['packagingtype']=$result2['packagingtype'];
                $inventoryData['packagingsize']=$result2['packagingsize'];
                $warehouseId=$result2['warehouseid'];
                $companyId=$result2['companyid'];
                $inventoryData['companyName']=DatabaseCommonOperations::getCompanyName($warehouseId);
                $inventoryData['warehouseName']=DatabaseCommonOperations::getWarehouseName($companyId);

                array_push($json_array,$inventoryData);
            }
            $json = json_encode($json_array);
            echo $json;
//            $getReturnMessage->showAlert('success',$json );
        }else{
            $getReturnMessage->showAlert('error',"No Data Found" );
        }



    }
    function getInventory($searchBy,$searchKeyword)
    {
        global $dbh;
        $keyword = "%" . $searchKeyword . "%";

        $stmt ="SELECT inventory.warehouseid,inventory.companyid,material.abbrevation,material.materialid,materialtype.materialtype,
                    product_master.productname,inventory.totalquantity,warehousemaster.wareHouseName,companymaster.companyName,inventory.inventoryid
                FROM inventory
                JOIN material ON
                inventory.materialid=material.materialid
                JOIN product_master ON
                product_master.productmasterid=material.productmasterid
                JOIN materialtype ON
                materialtype.materialtypeid=product_master.materialtypeid
                JOIN companymaster ON
                companymaster.companyid=inventory.companyid
                JOIN warehousemaster on
                warehousemaster.warehouseid=inventory.warehouseid ";

        switch ($searchBy) {
            case'ProductName':
                $stmt = $stmt . "WHERE product_master.productname LIKE :keyword";
                break;
            case'CompanyName':
                $stmt = $stmt . "WHERE companymaster.companyName like :keyword";
                break;
            case'WarehouseName':
                $stmt = $stmt . "WHERE warehousemaster.wareHouseName like :keyword";
                break;
        }

        $stmt=$dbh->prepare($stmt);
        $stmt->bindParam(':keyword', $keyword);
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
                $inventoryData['warehouseName']=$result2['wareHouseName'];
                $inventoryData['companyName']=$result2['companyName'];
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

    function getProductsForOutward(){
            global $dbh;
        $stmt = $dbh->prepare("SELECT product_master.productmasterid,product_master.productname,product_master.unitofmeasure,material.materialid,inventory.totalquantity FROM product_master JOIN material ON product_master.productmasterid=material.productmasterid JOIN inventory ON inventory. materialid=material.materialid GROUP BY inventory. materialid");
        $stmt->execute();
        $result = $stmt->fetchAll();
        $json = json_encode($result);
        echo $json;
    }

?>