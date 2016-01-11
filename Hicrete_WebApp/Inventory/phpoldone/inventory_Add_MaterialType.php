<?php



//$materialType = json_decode($_GET["materialType"]); # from angular js 


$materialType=json_decode(file_get_contents('php://input'));
/* $db = Database::getInstance();
 $this->_dbh = $db->getConnection();*/
$hostname = 'localhost';
$dbname='inventory';
$username = 'admin';
$password = 'admin';
$userId="Pranav";

$dbh= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password);
#fetching veriables from front end and initializing
###################################################################


//echo $materialType[0]->type;
$dfltDelFlg='N';
$userId="Pranav";
//echo sizeof($materialType);
for ($i=0; $i < sizeof($materialType); $i++) {
    # code...

    $stmt = $dbh->prepare("INSERT INTO materialtype (materialtype,delflg,lchnguserid,lchngtime,creuserid,cretime)
              values (:materialtype,:delflg,:lchnguserid,now(),:creuserid,now())");

    $stmt->bindParam(':materialtype', $materialType[$i]->type, PDO::PARAM_STR,10);
    $stmt->bindParam(':delflg', $dfltDelFlg, PDO::PARAM_STR, 10);
    $stmt->bindParam(':lchnguserid', $userId, PDO::PARAM_STR, 10);
    $stmt->bindParam(':creuserid', $userId, PDO::PARAM_STR, 10);

    $stmt->execute();


}
    if($stmt)
    {
        $arr = array('msg' => "Material type added Successfully!!!", 'error' => '');
        $jsn = json_encode($arr);
        echo($jsn);

    }
    else
    {
        $arr = array('msg' => '', 'error' => "Supplier not added due to technical reasons Please try after some time ");
        $jsn = json_encode($arr);
        echo($jsn);
    }

?>