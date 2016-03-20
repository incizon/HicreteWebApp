<?php

	include("database_connection.php");

	class Package 
	{
		
		var $lastPackageId;

		function __construct()
		{
			
		}
		
		public function createPackage($packageDetails){

			global $connect;
			
			$packageName=$packageDetails->packagename;
			$packageDescription=$packageDetails->packagedescription;


			$stmt=$connect->prepare("INSERT INTO payment_package_master(package_name,package_description,package_dateof_creation,created_by,creation_date)
						     VALUES (:packageName,:packageDescription,NOW(),'Namdev',NOW())");

			$stmt->bindParam(':packageName', $packageName, PDO::PARAM_STR,10);
   			 $stmt->bindParam(':packageDescription', $packageDescription, PDO::PARAM_STR, 10);
   
    			if($stmt->execute())
    			{	
    				$this->lastPackageId=$connect->lastInsertId(); 
    			
    				for($index=0;$index<sizeof($packageDetails->elementType);$index++){	

					$packageElementName=$packageDetails->elementType[$index]->type;
					$packageElementQuantity=$packageDetails->elementType[$index]->quantity;
    				$packageElementRate=$packageDetails->elementType[$index]->rate;
					$packageElementAmount=$packageElementQuantity * $packageElementRate;
	
					$stmt1=$connect->prepare("INSERT INTO payment_package_details(package_element_name,package_element_quantity,package_element_rate,package_element_amount,created_by,creation_date, payment_package_id)
							  VALUES (:packageElementName ,:packageElementQuantity ,:packageElementRate ,:packageElementAmount ,'Namdev',NOW(),:lastPackageId)");

					$stmt1->bindParam(':packageElementName', $packageElementName, PDO::PARAM_STR,10);
				    $stmt1->bindParam(':packageElementQuantity', $packageElementQuantity);
					$stmt1->bindParam(':packageElementRate', $packageElementRate);
				    $stmt1->bindParam(':packageElementAmount', $packageElementAmount);
					
				    $stmt1->bindParam(':lastPackageId', $this->lastPackageId);
				   

				    if(!$stmt1->execute()){

				    	return false;
				    }
				}

    		}
    		else{
    				return false;
    			}
    		
			return true;
		}

		public function viewPackages(){

			global $connect;	
			$stmt1 =$connect->prepare("SELECT * FROM payment_package_master");
			
			if($stmt1->execute()){
			
			    $json_response = array(); 
			    while (	$result1=$stmt1->fetch(PDO::FETCH_ASSOC))
			    {
			        $result1_array = array();
			        $result1_array['payment_package_id'] = $result1['payment_package_id'];
			        $result1_array['package_name'] = $result1['package_name'];        
			        $result1_array['package_description'] = $result1['package_description'];
			        $result1_array['package_total_amount']=0;
			        $result1_array['elementType'] = array();
			        $payment_package_id = $result1['payment_package_id'];  

			        $stmt2=$connect->prepare("SELECT * FROM payment_package_details WHERE payment_package_id=:payment_package_id");
					$stmt2->bindParam(':payment_package_id',$payment_package_id);
					$stmt2->execute();
			        while ($result2 =$stmt2->fetch(PDO::FETCH_ASSOC))
			        {
			            $result1_array['elementType'][] = array(
			                'element_name' => $result2['package_element_name'],
			                'element_quantity' => $result2['package_element_quantity'],
							'element_rate' => $result2['package_element_rate'],
							'element_amount' => $result2['package_element_amount']
			            );
			            $result1_array['package_total_amount']+=$result2['package_element_amount'];
			        }
			        array_push($json_response, $result1_array); //push the values in the array
			    }
			    echo json_encode($json_response);
			 }
			 else{

			 		return false;
			 }   
			
			return true;
		}

	}


	
?>