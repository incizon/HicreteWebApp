<?php
/**
 * Created by IntelliJ IDEA.
 * User: Ajit
 * Date: 03/12/16
 * Time: 10:13 PM
 */
require_once '../../php/Database.php';

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

        public static function getHistory($product)
        {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $json_array=array();
            $inward_array=array();
            $outward_array=array();
            //echo json_encode($product);
            $stmtGetHistry=$conn->prepare("SELECT a.inwardno as inwardno ,date_format(a.dateofentry,'%d-%m-%Y') as dateofentry,b.quantity as quantity,b.supplierid as supplierid from inward a,inward_details b where a.inwardid=b.inwardid and b.materialid = :materialid order by a.dateofentry desc");
            $stmtGetHistry->bindParam(':materialid', $product->materialid);
            if($stmtGetHistry->execute()) {
                while ($result2 = $stmtGetHistry->fetch(PDO::FETCH_ASSOC)) {
                    //$inventoryData = array();

                    $json_array['InwardMaterial'][]=  array(
                        'inwardno' => $result2['inwardno'],
                        'dateofentry' => $result2['dateofentry'],
                        'quantity'=> $result2['quantity']
                    );

                    /*$inventoryData['inwardno'] = $result2['inwardno'];
                    $inventoryData['dateofentry'] = $result2['dateofentry'];
                    $inventoryData['quantity'] = $result2['quantity'];
                    $inventoryData['supplierid'] = $result2['supplierid'];
                    array_push($json_array,$inventoryData);*/
                }
            }

            $stmtGetHistry=$conn->prepare("SELECT a.outwardno as outwardno ,date_format(a.dateofentry,'%d-%m-%Y') as dateofentry,b.quantity as quantity from outward a,outward_details b where a.outwardid=b.outwardid and b.materialid = :materialid order by a.dateofentry desc");
            $stmtGetHistry->bindParam(':materialid', $product->materialid);
            if($stmtGetHistry->execute()) {
                while ($result3 = $stmtGetHistry->fetch(PDO::FETCH_ASSOC)) {

                    $json_array['outwardMaterial'][]=  array(
                        'outwardno' => $result3['outwardno'],
                        'dateofentry' => $result3['dateofentry'],
                        'quantity'=> $result3['quantity']
                    );

                   /* $inventoryData = array();
                    $inventoryData['outwardno'] = $result3['outwardno'];
                    $inventoryData['dateofentry'] = $result3['dateofentry'];
                    $inventoryData['quantity'] = $result3['quantity'];

                    array_push($outward_array,$inventoryData);*/
                }
            }
            //array_push($json_array,$inward_array);
            //array_push($json_array,$outward_array);

            echo json_encode($json_array);


        }

        public static function getCriticalStock(){
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $json_array=array();
            try{
                $stmtGetCount=$conn->prepare("SELECT COUNT(*) AS totalCount FROM inventory ");
                if($stmtGetCount->execute()){
                    $result = $stmtGetCount->fetch(PDO::FETCH_ASSOC);
                    $json_array['totalCount']=$result['totalCount'];
                }
                $stmt=$conn->prepare("SELECT productname,inventory.totalquantity ,product_details.alertquantity FROM product_master JOIN product_details ON product_details.productmasterid=product_master.productmasterid JOIN material On material.productmasterid=product_master.productmasterid JOIN inventory ON material.materialid=inventory.materialid WHERE inventory.totalquantity<=product_details.alertquantity");

                if($stmt->execute()) {
                    while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $json_array['criticalMaterial'][] = array(
                        'productname' => $result['productname'],
                        'alertquantity' => $result['alertquantity'],
                        'totalquantity'=> $result['totalquantity']
                        );
                    }
                    $json_array['totalCriticalCount'] = $stmt->rowCount();
                }
//                    return $json_array;
                    $stmt1=$conn->prepare("SELECT productname,inventory.totalquantity ,product_details.alertquantity FROM product_master JOIN product_details ON product_details.productmasterid=product_master.productmasterid JOIN material On material.productmasterid=product_master.productmasterid JOIN inventory ON material.materialid=inventory.materialid WHERE inventory.totalquantity>=product_details.alertquantity");

                    if($stmt1->execute()){
                        while ($result = $stmt1->fetch(PDO::FETCH_ASSOC)) {
                            $json_array['availableMaterial'][] = array(
                                'productname' => $result['productname'],
                                'alertquantity' => $result['alertquantity'],
                                'totalquantity'=> $result['totalquantity']
                            );
                        }
                      return $json_array;
                }else{
                    return "no material";
                }

            }catch(Exception $e){

            }
        }
    }
?>