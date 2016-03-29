<?php

use \Jacwright\RestServer\RestException;
require 'Payment.php';

class PaymentController
{
 
    /**
     * Gets payment amount paid for project by project id
     *
     * @url GET /payment/paid/Byproj/$projid
     */

    public function getPaymentPaid($projid = null){
        
         if ($projid !=null) {
             $payment = Payment::getPayment($projid); // possible user loading method
         } else {
            return "project id is null";
         }

         return $payment;
    }

     /**
     * Gets payment amount paid for project by project id
     *
     * @url GET /paymentDetails/Invoice/$InvoiceId
     */

    public function getPaymentPaidByInvoices($InvoiceId){
        
             $payment = Payment::getPaymentPaidByInvoices($InvoiceId); // possible user loading method
         return $payment;
    }

    /**
     * Gets payment amount assigned for project by project id
     *
     * @url GET /payment/assigned/Byproj/$projid
     */

    public function getPaymentAssigned($projid){
             $payment = Payment::getPaymentAssigned($projid); // possible user loading method
         return $payment;
    }

     /**
     * Gets all payment amount (assigned and paid)for project by project id
     *
     * @url GET /payment/allPayment/Byproj/$projid
     */

    public function getAllPayment($projid){
             $payment = Payment::getAllPayment($projid); // possible user loading method
         echo AppUtil::getReturnStatus("sucess",$payment);
    }

   /**
     * Gets payment by project id and invoice id
     *
     * @url GET /payment/ByInvoice/$invoiceId
     */

    public function getPaymentByInvoice($invoiceId = null){
        
         if ($invoiceId != null) {
             $payment = Payment::getPaymentByInvoice($invoiceId); // possible user loading method
         } else {
            return "Invoice id is null";
         }

         return $payment;
    }

    /**
     * Saves payment for given project in database
     *
     * @url POST /payment/$projid
     * @url PUT /payment/$projid
     */
    public function savePayment($projid = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->projid = $projid;
        $Payment = Payment::savePayment($data); // saving the user to the database
        
        return $Payment; // returning the updated or newly created user object
    }

    /**
     * Saves payment from add payment page for given project in database
     *
     * @url POST /savepayment
     * @url PUT /savepayment
     */
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