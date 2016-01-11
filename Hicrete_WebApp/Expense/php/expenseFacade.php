<?php
require_once 'expense.php';
//$params = json_decode(file_get_contents('php://input'),false);
$data=json_decode($_GET['data'] );

session_start();

switch ($data->operation) {
    case "addSegment":  Expense::addSegment($data,"admin");
    				    break;
    case "createCostCenter":  Expense::createCostCenter($data->costCenterData,$data->segments,"admin");
    				    		break;
   	case "addOtherExpense":   Expense::addOtherExpense($data->otherExpenseData,$data->billDetails,"admin");
    				    		break;
   	case "addMaterialExpense":  Expense::addMaterialExpense($data->materialExpenseData,"admin");
    				    		break;
    
}

	/*	$opt = array(
		   PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
		   PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		);

		try{

				$stmt = $conn->prepare("select * from userlogin where username=:username and password=:password");

			     $stmt->bindParam(':username', $params->username, PDO::PARAM_STR);
			    $stmt->bindParam(':password', $params->password, PDO::PARAM_STR);
			  
			    $stmt->execute();
	    		$result=$stmt->fetchAll();
			    $json;
				if (count($result) > 0) {
				    // output data of each row
					$json = array(
				        'result' => "true");
					session_start();
					$_SESSION['user']=$params->username;	
					
				} else {
				   $json = array('result' => "false");		
				}
				
				$jsonstring = json_encode($json);
				echo $jsonstring;


			}catch(Exception $e){
				echo $e->getMessage();
			}*/

?>