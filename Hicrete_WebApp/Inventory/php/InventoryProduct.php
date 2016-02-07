<?php
require_once 'Database/Database.php';
include_once 'crud/ProductCrud.php';
include_once 'models/Product_Model.php';
require_once 'utils/Common_Methods.php';

	/*********************************************
	*	Get connection to the Database
	**********************************************/

	$db = Database::getInstance();
	$dbh = $db->getConnection();
	$opt = array(
		PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		);
	// Get Data From ANgular Service
	$productDetails = json_decode($_GET["product"]);

	 /****************************************************************
	 *Get Data into variables 
	 *
	 *****************************************************************/
	if (!isset($_SESSION['token'])) {
		session_start();
	}
	$userId = $_SESSION['token'];
	$showAlerts=new CommonMethods();
	$productModel=new ProductModel();
	$productModel->_setProductName($productDetails->productname);
	$productModel->_setProductAbbrevations($productDetails->abbrevation);
	$productModel->_setProductUnitOfMeasure($productDetails->unitofmeasure);
	$productModel->_setProductAlertQty($productDetails->alertquantity);
	$productModel->_setProductColor($productDetails->color);
	$productModel->_setProductDescription($productDetails->description);
	$productModel->_setProductPackaging($productDetails->packaging);
	$productModel->_setProductType($productDetails->materialtypeid);
	$productModel->_setProductOperation($productDetails->opertaion);

	$productObj = new Product($productModel);
	switch ($productDetails->opertaion) {
	 	case 'insert':
				# code...
//			if($productObj->isAvailable($dbh)){
				$productObj->insertProductInToDb($dbh,$userId);
//			}else{
//				echo "Product you are trying to add is already added";
//			}

	 	break;
	 	case 'delete':
				# code...
				//$productObj = new Product();
	 	$productObj->deleteProduct($dbh,$userId,$productDetails);
	 	break;
	 	case 'modify':
	 		if($productDetails->isProductMasterTable || $productDetails->isProductDetailsTable 
	 			||$productDetails->isProductPackagingTable || $productDetails->isProductMaterialTable){
	 			$productObj->updateProduct($dbh,$userId,$productDetails);
	 		}else{
	 			$showAlerts->showAlert('Failure',"Nothing to update");
	 		}
	 			
	 	break;
	 	default:
				# code...
	 	break;
	}
?>