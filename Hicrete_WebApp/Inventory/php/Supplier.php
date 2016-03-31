<?php
class Supplier
{
    public $supplierName;
    public $contactNo; //The single instance
    public $address;
    public $city;
    public $country;
    public $pinCode;
    public $pointOfContact;
    public $officeNo;
    public $vatNo;
    public $cstNo;

    /*
    Get an instance of the Database
    @return Instance
    */
     function setSupplierName($supplierName){
         $this->supplierName = $supplierName;
      }
      
      function getSupplierName(){
         return $this->supplierName;
      }
      

    public function __construct($supplier){
        //echo $supplier->supplierName;
        $this->supplierName=$supplier->supplierName;
        $this->contactNo=$supplier->contactNo;
        $this->address=$supplier->address;
        $this->city=$supplier->city;
        $this->country=$supplier->country;
        $this->pinCode=$supplier->pinCode;
        $this->pointOfContact=$supplier->pointOfContact;
        $this->officeNo=$supplier->officeNo;
        if(isset($supplier->VATNo))
        $this->vatNo=$supplier->VATNo;
        else
         $this->vatNo="";
        if(isset($supplier->CSTNo)) {
            $this->cstNo = $supplier->CSTNo;
        }else
            $this->cstNo="";

    }
    public function isAvailable($dbh)
    {
         $stmt = $dbh->prepare("SELECT supplierName FROM SUPPLIER WHERE contactno =:contactNo AND delflg!='Y'");
         $stmt->bindParam(':contactNo', $this->contactNo, PDO::PARAM_STR, 10);
         $stmt->execute();
         $count=$stmt->rowcount();
         if($count!=0)
         {return 1;}
         else
         {return 0;}

    }

    public function addSupplierToDb($dbh,$userId,$supplier)
    {

        $delFlgDflt='N';
        try{

        $stmt = $dbh->prepare("INSERT INTO supplier (SUPPLIERNAME,CONTACTNO,POINTOFCONTACT,OFFICENO,CSTNO,VATNO,ADDRESS,CITY,COUNTRY,PINCODE,DELFLG,LCHNGUSERID,LCHNGTIME,CREUSERID,CRETIME)
              values (:supplierName,:contactNo,:pointofcontact,:officeno,:cstno,:vatno,:address,:city,:country,:pincode,:delflg,:lchngUserId,now(),:creUserId,now())");

            $stmt->bindParam(':supplierName', $supplier->supplierName);
            $stmt->bindParam(':contactNo', $supplier->contactNo);
            $stmt->bindParam(':pointofcontact', $supplier->pointOfContact);
            $stmt->bindParam(':officeno', $supplier->officeNo);
            $stmt->bindParam(':cstno', $supplier->CSTNo);
            $stmt->bindParam(':vatno', $supplier->VATNo);
            $stmt->bindParam(':address', $supplier->address);
            $stmt->bindParam(':city', $supplier->city);
            $stmt->bindParam(':country', $supplier->country);
            $stmt->bindParam(':pincode', $supplier->pinCode);
            $stmt->bindParam(':delflg', $delFlgDflt);
            $stmt->bindParam(':lchngUserId', $userId);
            $stmt->bindParam(':creUserId', $userId);

            if($stmt->execute())
            {
                $message="Supplier Created successfully";
                $arr = array('msg' => $message, 'error' => '');
                $jsn = json_encode($arr);
                echo($jsn);
             //   return $message;
            }
            else
            {
                $message="Issues while adding supplier.Please contact administrator :P";
                $arr = array('msg' => $message, 'error' => '');
                $jsn = json_encode($arr);
                echo($jsn);
               // return $message;
            }
        }catch(Exception $e)
        {
            $message="Exception thrown";
            return $message;

        }

            
    }
  
}

?>