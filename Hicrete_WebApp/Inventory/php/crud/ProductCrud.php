<?php
    require_once 'Database/Database.php';
    require_once 'utils/Common_Methods.php';

    class Product extends CommonMethods
    {
        public $productName;
        public $productAbbrevations; //The single instance
        public $productUnitOfMeasure;
        public $productAlertQty;
        public $productColor;
        public $productDescription;
        public $productPackaging;
        public $productType;
        public $userId = "1";
        private $dbh;
        private $db;
        private $qty = 0;

        function __construct($productModel)
        {
            // $this->dbh = $pDbh;
            $opt = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            );
            global $dbh;
            if ($productModel->getProductOperation() == 'insert') {
                $this->productAbbrevations = $productModel->getProductAbbrevations();
                $this->productName = $productModel->getProductName();
                $this->productUnitOfMeasure = $productModel->getProductUnitOfMeasure();
                $this->productAlertQty = $productModel->getProductAlertQty();
                $this->productColor = $productModel->getProductColor();
                $this->productDescription = $productModel->getProductDescription();
                $this->productPackaging = $productModel->getProductPackaging();
                $this->productType = $productModel->getProductType();

            } else {


            }

        }

        public function select()
        {
        }

        public function insertProductInToDb($dbh, $userId)
        {

            try {
                //BEGIN THE TRANSACTION
                $dbh->beginTransaction();
                $stmtProduct = $dbh->prepare("INSERT INTO product_master (productname,materialtypeid,unitofmeasure,lchnguserid,lchngtime,creuserid,cretime)
                                values (:productname,:materialtypeid,:unitofmeasure,:lchnguserid,now(),:creuserid,now())");
                $stmtProduct->bindParam(':productname', $this->productName, PDO::PARAM_STR, 10);
                $stmtProduct->bindParam(':materialtypeid', $this->productType, PDO::PARAM_STR, 10);
                $stmtProduct->bindParam(':unitofmeasure', $this->productUnitOfMeasure, PDO::PARAM_STR, 10);
                $stmtProduct->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtProduct->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

                if ($stmtProduct->execute()) {
                    $lastId = $dbh->lastInsertId();
                    //Fetch master id from product master table
                    $productMasterId = $lastId;

                    //Insert Data into product_Details table
                    $stmtProductProductDetails = $dbh->prepare("INSERT INTO product_details (productmasterid,color,description,alertquantity,lchnguserid,lchngtime,creuserid,cretime)
                                                  values (:productmasterid,:color,:description,:alertquantity,:lchnguserid,now(),:creuserid,now())");

                    $stmtProductProductDetails->bindParam(':productmasterid', $productMasterId, PDO::PARAM_STR, 10);
                    $stmtProductProductDetails->bindParam(':color', $this->productColor, PDO::PARAM_STR, 10);
                    $stmtProductProductDetails->bindParam(':description', $this->productDescription, PDO::PARAM_STR, 10);
                    $stmtProductProductDetails->bindParam(':alertquantity', $this->productAlertQty, PDO::PARAM_STR, 10);
                    $stmtProductProductDetails->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                    $stmtProductProductDetails->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

                    if ($stmtProductProductDetails->execute()) {
                        $lastProductDetailsId = $dbh->lastInsertId();

                        $productDetailsId = $lastProductDetailsId;

                        //Insert Data into Packge Table
                        $stmtProductProductPackaging = $dbh->prepare("INSERT INTO product_packaging (productmasterid,packaging,lchnguserid,lchngtime,creuserid,cretime)
                                                        values (:productmasterid,:packaging,:lchnguserid,now(),:creuserid,now())");

                        $stmtProductProductPackaging->bindParam(':productmasterid', $productMasterId, PDO::PARAM_STR, 10);
                        $stmtProductProductPackaging->bindParam(':packaging', $this->productPackaging, PDO::PARAM_STR, 10);
                        $stmtProductProductPackaging->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                        $stmtProductProductPackaging->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                        if ($stmtProductProductPackaging->execute()) {
                            $lastProductPackagingId = $dbh->lastInsertId();
                            $productPackagingId = $lastProductPackagingId;

                            //Insert Data into Material
                            $stmtProductProductMaster = $dbh->prepare("INSERT INTO material(productmasterid,productdetailsid,productpackagingid,abbrevation,lchnguserid,lchngtime,creuserid,cretime)
                                                        values (:productmasterid,:productdetailsid,:productpackagingid,:abbrevation,:lchnguserid,now(),:creuserid,now())");

                            $stmtProductProductMaster->bindParam(':productmasterid', $productMasterId, PDO::PARAM_STR, 10);
                            $stmtProductProductMaster->bindParam(':productdetailsid', $productDetailsId, PDO::PARAM_STR, 10);
                            $stmtProductProductMaster->bindParam(':productpackagingid', $productPackagingId, PDO::PARAM_STR, 10);
                            $stmtProductProductMaster->bindParam(':abbrevation', $this->productAbbrevations, PDO::PARAM_STR, 10);
                            $stmtProductProductMaster->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                            $stmtProductProductMaster->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                            if ($stmtProductProductMaster->execute()) {
                                $lastMaterialId = $dbh->lastInsertId();

                                $stmtInventory = $dbh->prepare("INSERT INTO inventory (materialid,warehouseid,companyid)
                                                      values (:materialid,:warehouseid,:companyid)");
                                $stmtInventory->bindParam(':materialid', $lastMaterialId, PDO::PARAM_STR, 10);
                                $stmtInventory->bindParam(':warehouseid', $userId, PDO::PARAM_STR, 10);
                                $stmtInventory->bindParam(':companyid', $userId, PDO::PARAM_STR, 10);

                                if ($stmtInventory->execute()) {
                                    $this->showAlert("success", "Product added Successfully!!!");
                                } else {
                                    $this->showAlert('Failure', "Error while adding 5");
                                    $dbh->rollBack();
                                }
                                if ($dbh->commit()) {

                                    // $this->showAlert('success',"Product added Successfully!!!");
                                } else {
                                    $this->showAlert('success', "Commit failed!!");
                                    $dbh->rollBack();
                                }
                            } else {
                                $this->showAlert('Failure', "Error while adding 4");
                                $dbh->rollBack();
                            }
                        } else {
                            $this->showAlert('Failure', "Error while adding 3");
                            $dbh->rollBack();
                        }

                    } else {
                        $this->showAlert('Failure', "Error while adding 2");
                        $dbh->rollBack();
                    }

                } else {
                    $this->showAlert('Failure', "Error while adding 1");
                    $dbh->rollBack();
                }

            } catch (Exception $e) {
                echo $e->getMessage();
//                $dbh->rollBack();
            }
        }

        public function deleteProduct()
        {
        }


        public function updateProduct($dbh, $userId, $productDetails)
        {

            //BEGIN THE TRANSACTION
            $dbh->beginTransaction();
            $flag = false;
            $updatedProductName = $productDetails->productname;
            $productmasterid = $productDetails->productmasterid;

            if ($productDetails->isProductMasterTable) {
                $stmtMasterTable = $dbh->prepare("UPDATE product_master SET productname =:productname,materialtypeid=:materialtypeid,unitofmeasure=:unitofmeasure,lchnguserid=:lchnguserid,lchngtime=now()
          WHERE productmasterid = :productmasterid");
                $stmtMasterTable->bindParam(':productname', $updatedProductName, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':materialtypeid', $productDetails->materialtypeid, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':unitofmeasure', $productDetails->unitofmeasure, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':productmasterid', $productmasterid, PDO::PARAM_STR, 10);
                if ($stmtMasterTable->execute()) {
                    // $this->showAlert('success',"Inward details updated Successfully!!!");
                    $flag = true;
                } else {
                    //$this->showAlert('Failure',"Error while adding");
                    $flag = false;
                }
            }
            if ($productDetails->isProductDetailsTable) {
                $stmtDetailsTable = $dbh->prepare("UPDATE product_details SET color =:color,description=:description,alertquantity=:alertquantity,
          lchnguserid=:lchnguserid,lchngtime=now()
          WHERE productdetailsid = :productdetailsid");
                $stmtDetailsTable->bindParam(':color', $productDetails->color, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':description', $productDetails->description, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':alertquantity', $productDetails->alertquantity, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':productdetailsid', $productDetails->productdetailsid, PDO::PARAM_STR, 10);
                if ($stmtDetailsTable->execute()) {
                    // $this->showAlert('success',"Inward details updated Successfully!!!");
                    $flag = true;
                } else {
                    //$this->showAlert('Failure',"Error while adding");
                    $flag = false;
                }
            }

            if ($productDetails->isProductPackagingTable) {

                $stmtPackagingTable = $dbh->prepare("UPDATE product_packaging SET packaging =:packaging, lchnguserid=:lchnguserid,lchngtime=now()
          WHERE productpackagingid = :productpackagingid");
                $stmtPackagingTable->bindParam(':packaging', $productDetails->packaging, PDO::PARAM_STR, 10);
                $stmtPackagingTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtPackagingTable->bindParam(':productpackagingid', $productDetails->productpackagingid, PDO::PARAM_STR, 10);
                if ($stmtPackagingTable->execute()) {
                    // $this->showAlert('success',"Inward details updated Successfully!!!");
                    $flag = true;
                } else {
                    // $this->showAlert('Failure',"Error while adding");
                    $flag = false;

                }
            }

            if ($productDetails->isProductMaterialTable) {
                $stmtMaterialTable = $dbh->prepare("UPDATE material SET abbrevation =:abbrevation, lchnguserid=:lchnguserid,lchngtime=now()
          WHERE materialid = :materialid");
                $stmtMaterialTable->bindParam(':abbrevation', $productDetails->abbrevation, PDO::PARAM_STR, 10);
                $stmtMaterialTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtMaterialTable->bindParam(':materialid', $productDetails->materialid, PDO::PARAM_STR, 10);
                if ($stmtMaterialTable->execute()) {
                    // $this->showAlert('success',"Inward details updated Successfully!!!");
                    $flag = true;
                } else {
                    // $this->showAlert('Failure',"Error while adding");
                    $flag = false;
                }
            }
            if ($flag) {
                // $this->showAlert('success',"Inward details updated Successfully!!!");
                if ($dbh->commit()) {
                    $this->showAlert('success', "Product Updated Successfully!!!");
                } else {
                    $this->showAlert('success', "Commit failed!!");
                }
            } else {
                $this->showAlert('Failure', "Error while adding");
                $dbh->rollBack();
            }
        }


    }

?>