<?php


require 'Payment.php';

class PaymentController
{
 

    public function getPaymentPaid($projid = null){
        
         if ($projid !=null) {
             $payment = Payment::getPayment($projid); // possible user loading method
         } else {
            return "project id is null";
         }

         return $payment;
    }


    public function getPaymentPaidAndTotalAmount($projid){

        try{
            if($projid !== null){
                $payment = Payment::getPaymentPaidAndTotalAmount($projid); // possible user loading method

                if($payment!==null) {
                    echo AppUtil::getReturnStatus("Successful", $payment);
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                }

            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Project Value is empty");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


    }


    public function getProjectPayment($projid,$invoiceid){
        
             $payment = Payment::getProjectPayment($projid,$invoiceid); // possible user loading method
         return $payment;
    }



    public static function getPaymentPaidByInvoices($InvoiceId){
        
             $payment = Payment::getPaymentPaidByInvoices($InvoiceId); // possible user loading method

         echo AppUtil::getReturnStatus("Successful",$payment);
    }


    public function getPaymentAssigned($projid){
             $payment = Payment::getPaymentAssigned($projid); // possible user loading method
         return $payment;
    }


    public function getAllPayment($projid){
             $payment = Payment::getAllPayment($projid); // possible user loading method
         echo AppUtil::getReturnStatus("sucess",$payment);
    }

    public function getAllPaymentForProject($projid){
        $payment = Payment::getAllPaymentForProject($projid);
        echo AppUtil::getReturnStatus("sucess",$payment);
    }

    public function getPaymentByInvoice($invoiceId = null){
        
         if ($invoiceId != null) {
             $payment = Payment::getPaymentByInvoice($invoiceId); // possible user loading method
         } else {
            return "Invoice id is null";
         }

         return $payment;
    }
    public function savePayment($projid = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->projid = $projid;
        $Payment = Payment::savePayment($data); // saving the user to the database
        
        return $Payment; // returning the updated or newly created user object
    }

    public function savePaymentAndDetails($data)
    {
        $Payment = Payment::savePaymentAndDetails($data); // saving the user to the database
        echo AppUtil::getReturnStatus("sucess",$Payment); // returning the updated or newly created user object
    }


    public function updateProject($id,$data){
        $project = projedct::updateProject($id,$data);
        return $project;
    }

  
}