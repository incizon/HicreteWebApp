<?php

    require_once 'Database/Database.php';
    $db = Database::getInstance();
    $dbh = $db->getConnection();
    $materialType = json_decode(file_get_contents('php://input'));

    session_start();


$userId = $_SESSION['token'];



    //echo $materialType[0]->type;
    $dfltDelFlg = 'N';
    $count=0;

    //echo sizeof($materialType);
    for ($i = 0; $i < sizeof($materialType); $i++) {
        # code...

        $stmt = $dbh->prepare("INSERT INTO materialtype (materialtype,delflg,lchnguserid,lchngtime,creuserid,cretime)
                  values (:materialtype,:delflg,:lchnguserid,now(),:creuserid,now())");

        $stmt->bindParam(':materialtype', $materialType[$i]->type, PDO::PARAM_STR, 10);
        $stmt->bindParam(':delflg', $dfltDelFlg, PDO::PARAM_STR, 10);
        $stmt->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
        $stmt->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

        if($stmt->execute())
        {
            $count++;
        }


    }
    if ($count == sizeof($materialType)) {
        $arr = array('msg' => "Material type added Successfully!!!", 'error' => '');
        $jsn = json_encode($arr);
        echo($jsn);

    } else {
        $arr = array('msg' => '', 'error' => "Material Type not added due to technical reasons Please try after some time ");
        $jsn = json_encode($arr);
        echo($jsn);
    }

?>