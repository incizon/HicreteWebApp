<?php

$details = json_decode($_GET["details"]);

   switch($details->operation){

       case 'createYear':

               $message = "Year Created Successfully";
               $arr = array('msg' => $message, 'error' => '');
               $jsn = json_encode($arr);
               echo($jsn);

           break;
       case 'createLeave':

           $message = "Applied Successfully";
           $arr = array('msg' => $message, 'error' => '');
           $jsn = json_encode($arr);
           echo($jsn);

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
   }




?>







