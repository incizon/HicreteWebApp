<?php

use \Jacwright\RestServer\RestException;
require 'Invoice.php';

class InvoiceController
{
 
    /**
     * Gets the invoice and tax by id
     *
     * @url GET /invoice/tax/$id
     */

    public function getInvoiceTax($id = null){

        try{
            if ($id !=null) {
                $invoice = Invoice::loadInvoiceTax($id); // possible user loading method
            } else {
                $invoice = Invoice::loadAllInvoiceTax();
            }

            if($invoice!=null){
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

    /**
     * Gets the invoice followups by invoice id
     *
     * @url GET /invoice/followup/$invoiceid
     */

    public function getInvoiceFollowups($invoiceid = null){

        try{
            if ($invoiceid !=null) {
                $invoice = Invoice::loadInvoiceFollowups($invoiceid); // possible user loading method
            } else {
                $invoice = Invoice::loadInvoiceFollowups();
            }

            if($invoice!=null){
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


   /**
     * Gets the invoice and for project by projid
     *
     * @url GET /invoice/project/$projid
     */

    public function loadInvoiceForProject($projid = null){
        
         if ($projid !=null) {
             $invoice = Invoice::loadInvoiceForProject($projid); // possible user loading method
         } else {
             $invoice = Invoice::loadInvoiceForProject();
         }

         return $invoice;
    }
     
    /**
     * Gets the projects by id or current user
     *
     * @url GET /invoice
     */

    public function getAllInvoice()
    {
         
        $invoice = Invoice::loadAllInvoice();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $invoice;
    }

    /**
     * Saves a user to the database
     *
     * @url POST /invoice
     * @url PUT /invoice/$id
     */
    public function saveInvoice($data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
       // $data->id = $id;
        $invoice = Invoice::saveInvoice($data); // saving the user to the database
        
        return $invoice; // returning the updated or newly created user object
    }


    public function updateInvoice($id,$data){
        $invoice = Invoice::updateInvoice($id,$data);
        return $invoice;
    }

    /**
     * delete customer using id
     *
     * @url POST /invoicelist/$id
     *
     */

    public static function getInvoiceList($id){
        try{
            $invoice = Invoice::getInvoiceListForProject($id);
            echo AppUtil::getReturnStatus("Successful",$invoice);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }
  
}