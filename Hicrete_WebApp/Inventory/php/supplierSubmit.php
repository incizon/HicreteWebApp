<?php
require_once('Supplier.php');
//require_once('Database.php');


$supplier = json_decode($_GET["supplier"]); # from angular js 

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

//$arr = array('supplierName' => 'abcd', 'contactNo' => "123123",'address' => "ithe",'city' => "Ithech",'country' => "hich",'pinCode' => "123123");
//$suppObj = json_encode($arr);
$supplierVar = new Supplier($supplier);
//echo $supplierVar->supplierName;

if(!$supplierVar->isAvailable($dbh))
{
    $messge = $supplierVar->addSupplierToDb($dbh,$userId);
    $arr = array('msg' => $messge, 'error' => '');
    $jsn = json_encode($arr);
    echo($jsn);
}
else
{
    $arr = array('msg' => "", 'error' => "Supplier already exists");
    $jsn = json_encode($arr);
    echo($jsn);
}    

/*echo $this->supplierVar->contactNo;
echo $this->supplierVar->address;
echo $this->supplierVar->city;
echo $this->supplierVar->country;
echo $this->supplierVar->pinCode;*/
/*$supplierName = $supplier->supplierName;
$contactNo = $supplier->contactNo;
$address = $supplier->address;
$city = $supplier->city;
$country = $supplier->country;
$pinCode = $supplier->pinCode;*/




#end of initialization
###################################################################

#for checking error while DB operations
/*$opt = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);*/
##################################################################
/*if($supplierName!=""){
$dbh= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password,$opt);

    $stmt = $dbh->prepare("INSERT INTO supplier (SUPPLIER_NAME,CONTACT_NO,ADDRESS,CITY,COUNTRY,PINCODE,LCHG_USERID,LCHG_TIME,RCRE_USERID,RCRE_TIME) 
			  values (:supplierName,:contactNo,:address,:city,:country,:pincode,:lchgUserId,now(),:rcreUserId,now())");

    $stmt->bindParam(':supplierName', $supplierName, PDO::PARAM_STR,10);
    $stmt->bindParam(':contactNo', $contactNo, PDO::PARAM_STR, 10);
    $stmt->bindParam(':address', $address, PDO::PARAM_STR, 10);
    $stmt->bindParam(':city', $city, PDO::PARAM_STR, 10);
    $stmt->bindParam(':country', $country, PDO::PARAM_STR, 10);
    $stmt->bindParam(':pincode', $pinCode, PDO::PARAM_STR, 10);
    $stmt->bindParam(':lchgUserId', $userId, PDO::PARAM_STR, 10);
    $stmt->bindParam(':rcreUserId', $userId, PDO::PARAM_STR, 10);


     $stmt->execute();
    if($stmt)
    {
        $arr = array('msg' => "User Created Successfully!!!", 'error' => '');
        $jsn = json_encode($arr);
        echo($jsn);
    
    }
    else
    {
        $arr = array('msg' => '', 'error' => "Supplier not added due to technical reasons Please try after some time ");
        $jsn = json_encode($arr);
        echo($jsn);
    }

}*/
?>