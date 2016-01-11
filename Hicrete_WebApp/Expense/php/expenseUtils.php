<?php
require_once 'database/Database.php';
//$params = json_decode(file_get_contents('php://input'),false);
$data=json_decode($_GET['data'] );

session_start();

switch ($data->operation) {
    case "getSegments":  getSegments(1);
    				      break;
   case "getSegmentsExceptMaterial" : getSegments(0);
                                        break;
    case "getCostCenters" : getCostCenters();
                                        break; 
    
}

function getCostCenters(){
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
        $stmt = $conn->prepare("SELECT `costcenterid`, `costcentername` FROM `cost_center_master`");
    if($stmt->execute()){
        $noOfRows=0;
        $json_response = array(); 
        while ( $result=$stmt->fetch(PDO::FETCH_ASSOC))
        {
           $result_array = array();
           $result_array['name'] = $result['costcentername'];        
           $result_array['id'] = $result['costcenterid'];
           array_push($json_response, $result_array); //push the values in the array
           $noOfRows++;
       }
       echo json_encode($json_response);
        /*if($noOfRows>0)   
            echo json_encode($json_response);
        else
            echo "1";*/
        
    }else{
        echo "0";
    }
}

function getSegments($data){
	$db = Database::getInstance();
    $conn = $db->getConnection();
    if($data==1)
    	$stmt = $conn->prepare("SELECT `budgetsegmentid`, `segmentname` FROM `budget_segment`");
    else
    	$stmt = $conn->prepare("SELECT `budgetsegmentid`, `segmentname` FROM `budget_segment` WHERE `segmentname` NOT IN (SELECT * FROM `material_segment`)");
    
    if($stmt->execute()){
    	$noOfRows=0;
		$json_response = array(); 
	    while (	$result=$stmt->fetch(PDO::FETCH_ASSOC))
	    {
	       $result_array = array();
	       $result_array['name'] = $result['segmentname'];        
	       $result_array['id'] = $result['budgetsegmentid'];
	       $result_array['allocatedBudget'] ="";
	       $result_array['alertLevel'] ="";
	       array_push($json_response, $result_array); //push the values in the array
	       $noOfRows++;
	   }
       echo json_encode($json_response);
		/*if($noOfRows>0)   
			echo json_encode($json_response);
    	else
    		echo "1";*/
    	
    }else{
    	echo "0";
    }
		
 }



?>