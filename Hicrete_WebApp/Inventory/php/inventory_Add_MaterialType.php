<?php

    require_once 'Database/Database.php';
include_once "../../php/HicreteLogger.php";
    $db = Database::getInstance();
    $dbh = $db->getConnection();
    //$materialType = json_decode(file_get_contents('php://input'));
    $data = json_decode($_GET["data"]);
    session_start();

    //echo json_encode($data);

$userId = $_SESSION['token'];



    //echo $materialType[0]->type;
    $dfltDelFlg = 'N';
    $count=0;

    switch($data->operation) {
        case 'Add':
                 try{
                        //echo sizeof($materialType);
                    for ($i = 0;
                    $i < sizeof($data->data);
                    $i++) {
                        # code...
                    HicreteLogger::logInfo("Adding material type");
                    $stmt = $dbh->prepare("INSERT INTO materialtype (materialtype,delflg,lchnguserid,lchngtime,creuserid,cretime)
                                  values (:materialtype,:delflg,:lchnguserid,now(),:creuserid,now())");

                    $stmt->bindParam(':materialtype', $data->data[$i]->type, PDO::PARAM_STR, 10);
                    $stmt->bindParam(':delflg', $dfltDelFlg, PDO::PARAM_STR, 10);
                    $stmt->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
                    $stmt->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);
                    HicreteLogger::logDebug("Query: \n" . json_encode($stmt));
                    HicreteLogger::logDebug("DATA: \n" . json_encode($data->data[$i]->type));
                    if ($stmt->execute()) {
                    $count++;
                    }


                }
                if ($count == sizeof($data->data)) {
                    HicreteLogger::logInfo("Material type Added successfully");
                    $arr = array('msg' => "Material type added Successfully!!!", 'error' => '');
                    $jsn = json_encode($arr);
                    echo($jsn);

                } else {
                    HicreteLogger::logError("Material type Not added successfully");
                    $arr = array('msg' => '', 'error' => "Material Type not added due to technical reasons Please try after some time ");
                    $jsn = json_encode($arr);
                    echo($jsn);
                }
                }
                catch
                (Exception $e)
                    {
                        HicreteLogger::logFatal("Exception occured :\n" . $e->getMessage());
                        $arr = array('msg' => '', 'error' => "Exception occured Please contact administrator");
                        $jsn = json_encode($arr);
                        echo($jsn);
                    }
        break;
        case 'fetch':
            try {
                $dfltDelFlg = 'Y';
                $stmt = $dbh->prepare("Select materialtypeid,materialtype from materialtype where delflg!=:delflg");
                $stmt->bindParam(':delflg', $dfltDelFlg, PDO::PARAM_STR, 10);
                if ($stmt->execute()) {
                    $json_array = array();
                    while ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $materialTypes['materialtypeid'] = $result['materialtypeid'];
                        $materialTypes['materialtype'] = $result['materialtype'];
                        array_push($json_array, $materialTypes);
                    }

                }
                //$json = json_encode($json_array);

                $arr = array('msg' => 'success', 'error' => "", 'data' => $json_array);
                $jsn = json_encode($arr);
                echo($jsn);
            }catch(Exception $e)
            {
                $arr = array('msg' => 'success', 'error' => "Exception Occured");
                $jsn = json_encode($arr);
                echo($jsn);
            }
            break;
        case 'Modify':
            try {
                //echo(json_encode($data));
                $stmt = $dbh->prepare("Update materialtype set materialtype=:materialtype where materialtypeid=:materialtypeid");
                $stmt->bindParam(':materialtype', $data->data->materialtype, PDO::PARAM_STR, 10);
                $stmt->bindParam(':materialtypeid', $data->data->materialtypeid, PDO::PARAM_STR, 10);
                if ($stmt->execute()) {
                    $arr = array('msg' => 'Material Type modified successfully', 'error' => "");
                    $jsn = json_encode($arr);
                    echo($jsn);
                } else {
                    $arr = array('msg' => '', 'error' => "Material Type updation failed");
                    $jsn = json_encode($arr);
                    echo($jsn);
                }
            }catch(Exception $e)
            {
                $arr = array('msg' => '', 'error' => "Exception Occured");
                $jsn = json_encode($arr);
                echo($jsn);
            }
            break;
        case 'Delete':
            $dfltDelFlg='Y';
            try {
                $stmt = $dbh->prepare("select count(1) as count from product_master where materialtypeid=:materialtypeid");
                $stmt->bindParam(':materialtypeid', $data->data->materialtypeid, PDO::PARAM_STR, 10);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $count = $result['count'];
                //echo $count;
                if ($count == 0) {
                    $stmt = $dbh->prepare("Update materialtype set delflg=:delflg where materialtypeid=:materialtypeid");
                    $stmt->bindParam(':delflg', $dfltDelFlg, PDO::PARAM_STR, 10);
                    $stmt->bindParam(':materialtypeid', $data->data->materialtypeid, PDO::PARAM_STR, 10);
                    if ($stmt->execute()) {
                        $arr = array('msg' => 'Material Deleted successfully', 'error' => "");
                        $jsn = json_encode($arr);
                        echo($jsn);
                    } else {
                        $arr = array('msg' => '', 'error' => "Error while deleting material");
                        $jsn = json_encode($arr);
                        echo($jsn);
                    }

                } else {


                    $arr = array('msg' => '', 'error' => "Material type is already used in one Product. Cant be deleted");
                    $jsn = json_encode($arr);
                    echo($jsn);


                }
            }catch(Exception $e)
            {
                $arr = array('msg' => '', 'error' => "Exception Occured Contact admin");
                $jsn = json_encode($arr);
                echo($jsn);
            }
            break;
}
?>