<?php
require_once "../../php/Database.php";
require_once 'utils/Common_Methods.php';
require_once "../../php/HicreteLogger.php";

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

    public function isAvailable($dbh)
    {

        $stmt = $dbh->prepare("SELECT productname FROM product_master WHERE productname =:productname");
        $productName = trim($this->productName);
        $stmt->bindParam(':productname', $productName, PDO::PARAM_STR, 10);
        $stmt->execute();

        $count = $stmt->rowcount();
        if ($count != 0) {
            return true;
        } else {
            return false;
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
            HicreteLogger::logInfo("Inserting product to db");

            $stmtProduct = $dbh->prepare("INSERT INTO product_master (productname,materialtypeid,unitofmeasure,lchnguserid,lchngtime,creuserid,cretime)
                                values (:productname,:materialtypeid,:unitofmeasure,:lchnguserid,now(),:creuserid,now())");
            $stmtProduct->bindParam(':productname', $this->productName, PDO::PARAM_STR, 10);
            $stmtProduct->bindParam(':materialtypeid', $this->productType, PDO::PARAM_STR, 10);
            $stmtProduct->bindParam(':unitofmeasure', $this->productUnitOfMeasure, PDO::PARAM_STR, 10);
            $stmtProduct->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
            $stmtProduct->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
            HicreteLogger::logDebug("Query: \n" . json_encode($stmtProduct));
            HicreteLogger::logDebug("DATA: \n" . json_encode($this));

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
                HicreteLogger::logDebug("Query: \n" . json_encode($stmtProductProductDetails));
                //HicreteLogger::logDebug("DATA: \n".json_encode($this));
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
                    HicreteLogger::logDebug("Query: \n" . json_encode($stmtProductProductPackaging));
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
                        HicreteLogger::logDebug("Query: \n" . json_encode($stmtProductProductMaster));
                        if ($stmtProductProductMaster->execute()) {
                            $lastMaterialId = $dbh->lastInsertId();

//                                $stmtInventory = $dbh->prepare("INSERT INTO inventory (materialid)
//                                                      values (:materialid)");

//                                $stmtInventory->bindParam(':materialid', $lastMaterialId);
//                                if ($stmtInventory->execute()) {
                            HicreteLogger::logInfo("Product added successfully");
                            $this->showAlert("success", "Product added Successfully!!!");
//                                } else {
//                                    $this->showAlert('Failure', "Error while adding 5");
////                                    $dbh->rollBack();
//                                }
                            if ($dbh->commit()) {

                                // $this->showAlert('success',"Product added Successfully!!!");
                            } else {
                                HicreteLogger::logError("Error while adding");
                                $this->showAlert('Failure', "Error while adding.Please check information you entered");
                                $dbh->rollBack();
                            }
                        } else {
                            HicreteLogger::logError("Error while adding material");
                            $this->showAlert('Failure', "Error while adding.Please check information you entered");
                            $dbh->rollBack();
                        }
                    } else {
                        HicreteLogger::logError("Error while adding product packaging");
                        $this->showAlert('Failure', "Error while adding.Please check information you entered");
                        $dbh->rollBack();
                    }

                } else {
                    HicreteLogger::logError("Error while adding product details");
                    $this->showAlert('Failure', "Error while adding.Please check information you entered");
                    $dbh->rollBack();
                }

            } else {
                HicreteLogger::logError("Error while adding product master");
                $this->showAlert('Failure', "Error while adding.Please check information you entered");
                $dbh->rollBack();
            }

        } catch (Exception $e) {
            HicreteLogger::logFatal("Exception occured \n" . $e->getMessage());
            echo $e->getMessage();
//                $dbh->rollBack();
        }
    }

    public function deleteProduct()
    {
    }


    public function updateProduct($dbh, $userId, $productDetails)
    {
        try {
            //BEGIN THE TRANSACTION
            $dbh->beginTransaction();
            $flag = false;
            $updatedProductName = $productDetails->productname;
            $productmasterid = $productDetails->productmasterid;

            HicreteLogger::logInfo("Updating product");
            if ($productDetails->isProductMasterTable) {
                HicreteLogger::logInfo("Updating product master");
                $stmtMasterTable = $dbh->prepare("UPDATE product_master SET productname =:productname,materialtypeid=:materialtypeid,unitofmeasure=:unitofmeasure,lchnguserid=:lchnguserid,lchngtime=now()
          WHERE productmasterid = :productmasterid");
                $stmtMasterTable->bindParam(':productname', $updatedProductName, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':materialtypeid', $productDetails->materialtypeid, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':unitofmeasure', $productDetails->unitofmeasure, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtMasterTable->bindParam(':productmasterid', $productmasterid, PDO::PARAM_STR, 10);

                HicreteLogger::logDebug("Query: \n" . json_encode($stmtMasterTable));
                HicreteLogger::logDebug("DATA: \n" . json_encode($productDetails));

                if ($stmtMasterTable->execute()) {
                    // $this->showAlert('success',"Inward details updated Successfully!!!");
                    $flag = true;
                } else {
                    //$this->showAlert('Failure',"Error while adding");
                    $flag = false;
                }
            }
            if ($productDetails->isProductDetailsTable) {
                HicreteLogger::logInfo("Updating product details");
                $stmtDetailsTable = $dbh->prepare("UPDATE product_details SET color =:color,description=:description,alertquantity=:alertquantity,
          lchnguserid=:lchnguserid,lchngtime=now()
          WHERE productdetailsid = :productdetailsid");
                $stmtDetailsTable->bindParam(':color', $productDetails->color, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':description', $productDetails->description, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':alertquantity', $productDetails->alertquantity, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtDetailsTable->bindParam(':productdetailsid', $productDetails->productdetailsid, PDO::PARAM_STR, 10);
                HicreteLogger::logDebug("Query: \n" . json_encode($stmtDetailsTable));
                HicreteLogger::logDebug("DATA: \n" . json_encode($productDetails));
                if ($stmtDetailsTable->execute()) {
                    // $this->showAlert('success',"Inward details updated Successfully!!!");
                    $flag = true;
                } else {
                    //$this->showAlert('Failure',"Error while adding");
                    $flag = false;
                }
            }

            if ($productDetails->isProductPackagingTable) {
                HicreteLogger::logInfo("Updating product packaging");

                $stmtPackagingTable = $dbh->prepare("UPDATE product_packaging SET packaging =:packaging, lchnguserid=:lchnguserid,lchngtime=now()
          WHERE productpackagingid = :productpackagingid");
                $stmtPackagingTable->bindParam(':packaging', $productDetails->packaging, PDO::PARAM_STR, 10);
                $stmtPackagingTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtPackagingTable->bindParam(':productpackagingid', $productDetails->productpackagingid, PDO::PARAM_STR, 10);
                HicreteLogger::logDebug("Query: \n" . json_encode($stmtPackagingTable));
                HicreteLogger::logDebug("DATA: \n" . json_encode($productDetails));
                if ($stmtPackagingTable->execute()) {
                    // $this->showAlert('success',"Inward details updated Successfully!!!");
                    $flag = true;
                } else {
                    // $this->showAlert('Failure',"Error while adding");
                    $flag = false;

                }
            }

            if ($productDetails->isProductMaterialTable) {
                HicreteLogger::logInfo("Updating material");
                $stmtMaterialTable = $dbh->prepare("UPDATE material SET abbrevation =:abbrevation, lchnguserid=:lchnguserid,lchngtime=now()
          WHERE materialid = :materialid");
                $stmtMaterialTable->bindParam(':abbrevation', $productDetails->abbrevation, PDO::PARAM_STR, 10);
                $stmtMaterialTable->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                $stmtMaterialTable->bindParam(':materialid', $productDetails->materialid, PDO::PARAM_STR, 10);
                HicreteLogger::logDebug("Query: \n" . json_encode($stmtMaterialTable));
                HicreteLogger::logDebug("DATA: \n" . json_encode($productDetails));
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
                    HicreteLogger::logInfo("Product updated successfully");
                    $this->showAlert('success', "Product Updated Successfully!!!");
                } else {
                    $this->showAlert('success', "Commit failed!!");
                }
            } else {
                HicreteLogger::logError("Error while updating product");
                $this->showAlert('Failure', "Error while Updating");
                $dbh->rollBack();
            }

        } catch (Exception $e) {
            HicreteLogger::logFatal("Exception occured :\n" . $e->getMessage());
            $this->showAlert('Failure', "Exception occured please contact admin");
        }

    }
}

?>