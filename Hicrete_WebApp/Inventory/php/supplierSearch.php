<?php
require_once 'Database/Database.php';
require_once "../../php/HicreteLogger.php";

$db = Database::getInstance();
$dbh = $db->getConnection();

$opt = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);
$data = json_decode($_GET['data']);
session_start();
$userId = $_SESSION['token'];

switch ($data->operation) {
    case "search":
        try {
            HicreteLogger::logInfo("Searching suppliers");
            $supplierName="%".$data->data."%";
            $stmt = $dbh->prepare("select * from supplier where suppliername like :supplierName ORDER BY suppliername");
            $stmt->bindParam(':supplierName', $supplierName, PDO::PARAM_STR);
            HicreteLogger::logDebug("Query: ".json_encode($stmt));
            if ($stmt->execute()) {
                $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $result = $stmt->fetchAll();
                $json = json_encode($result);
                //HicreteLogger::logInfo("Data fetch successful:\n".$json);
                echo $json;
            } else {
                HicreteLogger::logInfo("Data fetch failed:\n");
                $arr = array('msg' => '', 'error' => 'Data fetching failed');
                $jsn = json_encode($arr);
                echo($jsn);
            }


        } catch (Exception $e) {
            HicreteLogger::logFatal("Exception occured :\n".$e->getMessage());
            $arr = array('msg' => '', 'error' => 'Exception occured');
            $jsn = json_encode($arr);
            echo($jsn);

        }
        break;
    case "modify":
        try {
            HicreteLogger::logInfo("Modifying suppliers");
            $stmt = $dbh->prepare("UPDATE `supplier` SET `suppliername`=:supplierName,`contactno`=:contactNo,`pointofcontact`=:pointofcontact,`officeno`=:officeno,`cstno`=:cstno,`vatno`=:vatno,`address`=:address,`city`=:city,`country`=:country,`pincode`=:pincode,`lchnguserid`=:userId,`lchngtime`=now() WHERE supplierid=:supplierId");
            $stmt->bindParam(':supplierName', $data->data->suppliername, PDO::PARAM_STR);
            $stmt->bindParam(':contactNo', $data->data->contactno, PDO::PARAM_STR);
            $stmt->bindParam(':pointofcontact', $data->data->pointofcontact, PDO::PARAM_STR);
            $stmt->bindParam(':officeno', $data->data->officeno, PDO::PARAM_STR);
            $stmt->bindParam(':cstno', $data->data->cstno, PDO::PARAM_STR);
            $stmt->bindParam(':vatno', $data->data->vatno, PDO::PARAM_STR);
            $stmt->bindParam(':address', $data->data->address, PDO::PARAM_STR);
            $stmt->bindParam(':city', $data->data->city, PDO::PARAM_STR);
            $stmt->bindParam(':country', $data->data->country, PDO::PARAM_STR);
            $stmt->bindParam(':pincode', $data->data->pincode, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
            $stmt->bindParam(':supplierId', $data->data->supplierid, PDO::PARAM_STR);

            HicreteLogger::logDebug("Query:\n ".json_encode($stmt));
            HicreteLogger::logDebug("Data:\n ".json_encode($data->data));
            if ($stmt->execute()) {
                HicreteLogger::logInfo("Supplier Modified . \n");
                $arr = array('msg' => 'Supplier modified successfully', 'error' => '');
                $jsn = json_encode($arr);
                echo($jsn);
            } else {
                HicreteLogger::logInfo("Error while modifying suppliers. \n");
                $arr = array('msg' => '', 'error' => 'Error occured while modifying supplier');
                $jsn = json_encode($arr);
                echo($jsn);
            }
        } catch (Exception $e) {
            HicreteLogger::logFatal("Exception occured\n".$e->getMessage());
            $arr = array('msg' => '', 'error' => 'Exception occured while modifying supplier');
            $jsn = json_encode($arr);
            echo($jsn);
        }

        break;
}


?>