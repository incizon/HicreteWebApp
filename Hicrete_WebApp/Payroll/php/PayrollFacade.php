<?php

require_once ("database-connection.php");

include_once ("PayrollClassLib.php");

if (!isset($_SESSION['token'])) {
    session_start();
}

global $connect;

$userId=$_SESSION['token'];

$data = json_decode($_GET["details"]);

$operationObject=new Payroll();

 switch($data->operation){

       case 'createYear':

                        $connect->beginTransaction();

                        if($operationObject->createYear($data,$userId)){

                            $connect->commit();
                            $message = "Year Created Successfully";
                            $arr = array('msg' => $message, 'error' => '');
                            $jsn = json_encode($arr);
                            echo($jsn);
                        }
                        else{

                            $connect->rollBack();
                            $message = "Could Not Create Year...!!!";
                            $arr = array('msg' => '', 'error' => $message);
                            $jsn = json_encode($arr);
                            echo($jsn);
                        }



           break;
     case "getCurrentYearHolidayDetails":

                      $operationObject->getYearDetails();

            break;


     case "createHoliday":

            $connect->beginTransaction();

             if($operationObject->createHoliday($data,$userId)){

                 $connect->commit();
                 $message = "Holiday Created Successfully";
                 $arr = array('msg' => $message, 'error' => '');
                 $jsn = json_encode($arr);
                 echo($jsn);
             }
             else{

                 $connect->rollBack();
                 $message = "Could Not Create Holiday...!!!";
                 $arr = array('msg' => '', 'error' => $message);
                 $jsn = json_encode($arr);
                 echo($jsn);
             }

         break;
     case 'removeHoliday':

         $connect->beginTransaction();

         if($operationObject->removeHoliday($data,$userId)){

             $connect->commit();
             $message = "Holiday removed Successfully";
             $arr = array('msg' => $message, 'error' => '');
             $jsn = json_encode($arr);
             echo($jsn);
         }
         else{

             $connect->rollBack();
             $message = "Could Not Remove Holiday...!!!";
             $arr = array('msg' => '', 'error' => $message);
             $jsn = json_encode($arr);
             echo($jsn);
         }

         break;
     case 'createLeave':

         $connect->beginTransaction();

         if($operationObject->createLeave($data)){
             $connect->commit();
             $message = "Applied For Leave Successfully";
             $arr = array('msg' => $message, 'error' => '');
             $jsn = json_encode($arr);
             echo($jsn);
         }
         else{
             $connect->rollBack();
             $message = "Could Not Apply For Leave...!!!";
             $arr = array('msg' => '', 'error' => $message);
             $jsn = json_encode($arr);
             echo($jsn);
         }
           break;

       case 'addEmployee':

           $message = "Added Successfully";
           $arr = array('msg' => $message, 'error' => '');
           $jsn = json_encode($arr);
           echo($jsn);

           break;
       case 'searchLeave':
           $message = "Leave Details";
           $arr = array('msg' => $message, 'error' => '');
           $jsn = json_encode($arr);
           echo($jsn);


           break;
       case 'searchLeaveByDate':
           $message = "Leave Details by Date";
           $arr = array('msg' => $message, 'error' => '');
           $jsn = json_encode($arr);
           echo($jsn);


           break;

       case 'searchLeaveByEmployee':
           $message = "Leave Details by Employee";
           $arr = array('msg' => $message, 'error' => '');
           $jsn = json_encode($arr);
           echo($jsn);


           break;

     case 'getEmployeeDetails':
            $operationObject->getEmployeeDetails();
         break;
   }




?>







