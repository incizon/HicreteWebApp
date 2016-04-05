<?php


require 'Invoice.php';

class InvoiceController
{
 


    public function getInvoiceTax($id = null){

        try{
            if ($id !=null) {
                $invoice = Invoice::loadInvoiceTax($id); // possible user loading method
            } else {
                $invoice = Invoice::loadAllInvoiceTax();
            }

            if($invoice!==null){
                echo AppUtil::getReturnStatus("Successful",$invoice);
            }
            else {
                echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

         return $invoice;
    }



    public static function getInvoiceDetails($qid){

        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($qid != null) {
                    $Quotation = Invoice::getInvoiceDetails($qid);
                    if($Quotation!==null) {
                        echo AppUtil::getReturnStatus("Successful", $Quotation);
                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Invoice value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


    }


    public static function getInvoiceTaxDetails($qid){
        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($qid != null) {
                    $Quotation = Invoice::getInvoiceTaxDetails($qid); // possible user loading method
                    if($Quotation!==null) {
                        echo AppUtil::getReturnStatus("Successful", $Quotation);
                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Invoice value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }



    public static function getInvoiceFollowups($invoiceid){

        try{
            if ($invoiceid !=null) {
                $invoice = Invoice::loadInvoiceFollowups($invoiceid); // possible user loading method
            } else {
                $invoice = Invoice::loadInvoiceFollowups($invoiceid);
            }

            if($invoice!==null){
                echo AppUtil::getReturnStatus("Successful",$invoice);
            }
            else {
                echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

         return $invoice;
    }


    public function loadInvoiceForProject($projid = null){

        try{
            if ($projid !=null) {
                $invoice = Invoice::loadInvoiceForProject($projid); // possible user loading method
            } else {
                $invoice = Invoice::loadInvoiceForProject();
            }

            if($invoice!==null) {
                echo AppUtil::getReturnStatus("Successful", $invoice);
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }




    }
     

    public function getAllInvoice()
    {
         
        $invoice = Invoice::loadAllInvoice();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $invoice;
    }

    public static function saveInvoice($data)
    {
        try{

            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($data != null) {

                    if(Invoice::isInvoiceNumberPresent($data->Invoice->InvoiceNo)){
                        echo AppUtil::getReturnStatus("Unsuccessful","Invoice number is already present");
                        return;
                    }
                    if(Invoice::isInvoiceTitlePresent($data->Invoice->QuotationId,$data->Invoice->InvoiceTitle)){
                        echo AppUtil::getReturnStatus("Unsuccessful","Invoice Title already used for another invoice");
                        return;
                    }

                    $invoice = Invoice::saveInvoice($data,$loggedInUserId);

                    if($invoice) {
                        echo AppUtil::getReturnStatus("Successful", "Invoice created successfully");
                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Data value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    public function updateInvoice($id,$data){
        $invoice = Invoice::updateInvoice($id,$data);
        return $invoice;
    }


    public static function getInvoiceList($id){
        try{
            $invoice = Invoice::getInvoiceListForProject($id);
            echo AppUtil::getReturnStatus("Successful",$invoice);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }
  
}