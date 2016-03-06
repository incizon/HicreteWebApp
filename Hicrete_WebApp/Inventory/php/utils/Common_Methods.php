<?php

class CommonMethods
{
   //Create instance of common method

   public function showAlert($messageType,$message) { 
      if($messageType=='success'){
          $arr = array('msg' => $message, 'error' => '');
          $jsn = json_encode($arr);
          echo($jsn);
      }else{
          $arr = array('msg' => '', 'error' => $message);
          $jsn = json_encode($arr);
          echo($jsn);
      }

  }

}

?>