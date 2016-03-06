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
        $this->vatNo=$supplier->VATNo;
        $this->cstNo=$supplier->CSTNo;

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

    public function addSupplierToDb($dbh,$userId)
    {
        $delFlgDflt='N';
        try{

        $stmt = $dbh->prepare("INSERT INTO supplier (SUPPLIERNAME,CONTACTNO,POINTOFCONTACT,OFFICENO,CSTNO,VATNO,ADDRESS,CITY,COUNTRY,PINCODE,DELFLG,LCHNGUSERID,LCHNGTIME,CREUSERID,CRETIME)
              values (:supplierName,:contactNo,:pointofcontact,:officeno,:cstno,:vatno,:address,:city,:country,:pincode,:delflg,:lchngUserId,now(),:creUserId,now())");

        $stmt->bindParam(':supplierName', $this->supplierName, PDO::PARAM_STR,10);
        $stmt->bindParam(':contactNo', $this->contactNo, PDO::PARAM_STR, 10);
        $stmt->bindParam(':pointofcontact', $this->pointOfContact, PDO::PARAM_STR, 10);
        $stmt->bindParam(':officeno', $this->officeNo, PDO::PARAM_STR, 10);
        $stmt->bindParam(':vatno', $this->vatNo, PDO::PARAM_STR, 10);
        $stmt->bindParam(':cstno', $this->cstNo, PDO::PARAM_STR, 10);
        $stmt->bindParam(':address', $this->address, PDO::PARAM_STR, 10);
        $stmt->bindParam(':city', $this->city, PDO::PARAM_STR, 10);
        $stmt->bindParam(':country', $this->country, PDO::PARAM_STR, 10);
        $stmt->bindParam(':pincode', $this->pinCode, PDO::PARAM_STR, 10);
        $stmt->bindParam(':delflg', $delFlgDflt, PDO::PARAM_STR, 10);
        $stmt->bindParam(':lchngUserId', $userId, PDO::PARAM_STR, 10);
        $stmt->bindParam(':creUserId', $userId, PDO::PARAM_STR, 10);

        $stmt->execute();

            if($stmt)
            {
                $message="User Created successfully";
                return $message;
            }
            else
            {
                $message="Issues while adding supplier.Please contact administrator :P";
                return $message;
            }
        }catch(Exception $e)
        {
            $message="Exception thrown";
            return $message;

        }

            
    }
  
}

?>