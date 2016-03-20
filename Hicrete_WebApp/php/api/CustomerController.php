<?php

use \Jacwright\RestServer\RestException;
require 'Customer.php';

class CustomerController
{
 
    /**
     * Gets the customer by id 
     *
     * @url GET /customer/$id
     */

    public function getCustomer($id = null){
        
         if ($id !=null) {
             $customer = Customer::loadCustomer($id); // possible user loading method
         } else {
             $customer = Customer::loadCustomer();
         }

         return $customer;
    }

    /**
     * Gets all customer  
     *
     * @url GET /customer
     */

    public function getAllCustomer()
    {
         
        $customer = Customer::loadAllCustomer();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $customer;
    }

    /**
     * Saves a customer to the database
     *
     * @url POST /customer
     * @url PUT /customer/$id
     */
    public function saveCustomer($id = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->id = $id;
        $userId=AppUtil::getLoggerInUserId();
        $customer = Customer::saveCustomer($data,$userId); // saving the user to the database
        
        return $customer; // returning the updated or newly created user object
    }

    /**
     * update customer
     *
     * @url POST /customer/update/$id
     * @url PUT /customer/update/$id
     */

    public function updateCustomer($id,$data){
        $customer = Customer::updateCustomer($id,$data);
        return $customer;
    }

     /**
     * delete customer using id
     *
     * @url GET /customer/delete/$id
     * 
     */

    public function deleteCustomer($id){
        $customer = Customer::deleteCustomer($id);
        return $customer;
    }


    /**
     * get Customer List
     *
     * @url GET /customerlist
     *@url POST /customerlist
     */

    public function getCustomerList(){
        $customer = Customer::getCustomerList();
        return $customer;
    }

    
}
