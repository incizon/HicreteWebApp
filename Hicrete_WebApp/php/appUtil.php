<?php

class AppUtil
{
    
    
    public static function getReturnStatus($status,$message){
        $returnVal=array('status' => $status, 'message' => $message );
         return json_encode($returnVal);          
    }


    public static function generateId(){
         $id=uniqid();
         $rand=mt_rand(1000,9999);
         return $id.$rand;
    }



}


?>