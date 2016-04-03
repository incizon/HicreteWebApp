<?php

require_once ("../../php/appUtil.php");

include_once ("PayrollClassLib.php");


if (!isset($_SESSION['token'])) {
    session_start();
}

$db = Database::getInstance();
$connect = $db->getConnection();

$userId=$_SESSION['token'];

$data = json_decode($_GET["details"]);

$operationObject=new Payroll();

 switch($data->operation){

       case 'createYear':

                        $connect->beginTransaction();

                        $status=$operationObject->createYear($data,$userId);
                        if($status==1){
                            $connect->commit();
                            echo AppUtil::getReturnStatus("success","Year Created Successfully...!!!");
                        }
                        else if($status==0){

                            $connect->rollBack();
                            echo AppUtil::getReturnStatus("failure","Could Not Create Year");
                        }
                        else{
                            echo AppUtil::getReturnStatus("failure","Year with Same Date Range Already Exist");
                        }

           break;
     case "getCurrentYearHolidayDetails":

                      $operationObject->getCurrentYearHolidayDetails();

            break;


     case "createHoliday":

            $connect->beginTransaction();

             if($operationObject->createHoliday($data,$userId)){
                 $connect->commit();
                 echo AppUtil::getReturnStatus("success","Holiday Created Successfully...!!!");
             }
             else{
                 $connect->rollBack();
                 echo AppUtil::getReturnStatus("failure","Could Not Create Holiday");
             }

         break;
     case 'removeHoliday':
         $connect->beginTransaction();
         if($operationObject->removeHoliday($data,$userId)){
             $connect->commit();
             echo AppUtil::getReturnStatus("success","Holiday Removed Successfully...!!!");
         }
         else{
             $connect->rollBack();
             echo AppUtil::getReturnStatus("failure","Holiday Could Not Remove");
         }
         break;

     case 'getEmployeeDetailsForLeave':

                    $operationObject->getEmployeeDetailsForLeave($userId);
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

       case 'addEmployeeToPayroll':

           $connect->beginTransaction();
           if($operationObject->addEmployeeToPayroll($data,$userId)){
               $connect->commit();
               $message = "Employee Added Successfully";
               $arr = array('msg' => $message, 'error' => '');
               $jsn = json_encode($arr);
               echo($jsn);
           }
           else{
               $connect->rollBack();
               $message = "Could Not Add Employeee...!!!";
               $arr = array('msg' => '', 'error' => $message);
               $jsn = json_encode($arr);
               echo($jsn);
           }

           break;
       case 'searchLeave':

           if(!$operationObject->getLeaveDetails($data,$userId)){
               $message = "Leave Details Not Available...!!!";
               echo AppUtil::getReturnStatus("fail",$message);
           }

           break;

     case 'changeLeaveStatus':

                if(!$operationObject->changeLeaveStatus($data)){
                    $message = "Could not Cancel Leave...!!!";
                    echo AppUtil::getReturnStatus("fail",$message);
                }

            break;
       case 'searchLeaveByDate':
            if(!$operationObject->searchLeaveByDate($data)){
                $message = "Leave details not available...!!!";
                echo AppUtil::getReturnStatus("fail",$message);
            }

           break;
     case 'getYears':

         if(!$operationObject->getYears()){
             $message = "Year Details Not Available...!!!";
             echo AppUtil::getReturnStatus("fail",$message);
         }

         break;

     case 'getEmployees':

             $operationObject->getEmployees();

         break;

       case 'searchLeaveByEmployee':

           if(!$operationObject->searchLeaveByEmployee($data)){
               $message = "Leave details not available...!!!";
               echo AppUtil::getReturnStatus("fail",$message);
           }


           break;

     case 'getEmployeeDetails':
            $operationObject->getEmployeeDetails();
         break;


     case 'getNoOfLeaves':

           $operationObject->getNoOfLeaves($data);
         break;

     case 'getLeavesApproval':

            if(!$operationObject->getLeavesApproval($userId)){
                $message = "Leave Approval details not available...!!!";
                echo AppUtil::getReturnStatus("fail",$message);
            }
         break;
     case 'LeaveApprovalAction':

         if(!$operationObject->updateLeaveApprovalStatus($userId,$data)){
             $message = "Could not update status...!!!";
             echo AppUtil::getReturnStatus("fail",$message);
         }
         break;

 }
?>







