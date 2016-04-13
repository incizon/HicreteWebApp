<?php
/**
 * Created by IntelliJ IDEA.
 * User: Ajit
 * Date: 03/12/16
 * Time: 10:13 PM
 */
    require_once 'Database/Database.php';

    class InventoryUtils
    {

        public static  function getProductById($materialId)
        {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            try{

                $stmt=$conn->prepare("SELECT productname FROM product_master,material WHERE material.materialid='$materialId' AND product_master.productmasterid=material.productmasterid");
//                $stmt=$dbh->prepare("SELECT productname FROM product_master");
                if($stmt->execute()){
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    $material=$result['productname'];
                  return $material;
                }else{
                    return "no material";
                }
            }catch(Exception $e){

            }

        }
        public static function getCriticalStock(){
            $db = Database::getInstance();
            $conn = $db->getConnection();
            try{

                $stmt=$conn->prepare("SELECT productname,inventory.totalquantity ,product_details.alertquantity FROM product_master JOIN product_details ON product_details.productmasterid=product_master.productmasterid JOIN material On material.productmasterid=product_master.productmasterid JOIN inventory ON material.materialid=inventory.materialid WHERE inventory.totalquantity<=product_details.alertquantity");
//                $stmt=$dbh->prepare("SELECT productname FROM product_master");
                if($stmt->execute()){
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
//                    $material=$result['productname'];
                    return $result;
                }else{
                    return "no material";
                }
            }catch(Exception $e){

            }
        }
    }
?>