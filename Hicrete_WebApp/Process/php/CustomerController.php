<?php

require 'Customer.php';

class CustomerController
{


    public function getCustomer($id = null){

        if ($id !=null) {
            $customer = Customer::loadCustomer($id); // possible user loading method
        } else {
            $customer = Customer::loadCustomer();
        }

        return $customer;
    }


    public function getAllCustomer()
    {
        try{
        $customer = Customer::loadAllCustomer();
        if(sizeof($customer)>0){
            echo AppUtil::getReturnStatus("Successful",$customer);
        }
        else {
            echo AppUtil::getReturnStatus("NoRows", "No Customer found");
        }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }


        // return array("id" => $id, "name" => null); // serializes object into JSON
        return $customer;
    }




    public static function getAllCustomerBySearch($searchterm,$searchBy)
    {

        try{
            $customer = Customer::loadAllCustomerBySearch($searchterm,$searchBy);
            if(sizeof($customer)>0){
                echo AppUtil::getReturnStatus("Successful",$customer);
            }
            else {
                echo AppUtil::getReturnStatus("NoRows", "No Customer found");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

        // return array("id" => $id, "name" => null); // serializes object into JSON
        //   return $customer;
    }



    public static function saveCustomer($id = null, $data){

        try{
            //echo(json_encode($data));
            $userId=AppUtil::getLoggerInUserId();
            //$customer = Customer::saveCustomer($data,$userId); // saving the user to the database
            //Customer::saveCustomer($data,$userId); // saving the user to the database
            $status=Customer::saveCustomer($data,$userId);
            if($status==1){
                echo AppUtil::getReturnStatus("Successful","Customer created successfully");
            }
            else if($status==0) {
                echo AppUtil::getReturnStatus("Unsuccessful", "Unknown error occurred");
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Customer with same name already exist");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }
    }


    public static function updateCustomer($id,$data){

        try{
            $userId=AppUtil::getLoggerInUserId();
            $customer = Customer::updateCustomer($id, $data,$userId);
            if($customer==1){
                echo AppUtil::getReturnStatus("Successful","Customer updated successfully");
            }
            else if($customer==0) {
                echo AppUtil::getReturnStatus("Unsuccessful", "Unknown error occurred");
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Customer With Same Name Already Exist");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }


    public function deleteCustomer($id){
        $customer = Customer::deleteCustomer($id);
        return $customer;
    }

    public static function getCustomerList(){
        try{
            $customer = Customer::getCustomerList();
            echo AppUtil::getReturnStatus("Successful",$customer);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }


}
