<?php

	require_once("database_connection.php");

	class Applicator
	{
		
		var $firmName;
		var $applicatorAddressLine1;
		var $applicatorAddressLine2;
		var $applicatorCountry;
		var $applicatorState;
		var $applicatorCity;
		var $applicatorContactNo;
		var $applicatorVatNumber;
		var $applicatorCstNumber;
		var $applicatorServiceTaxNumber;
		var $applicatorPanNumber;

		var $pointOfContact;
		var $pointContactNo;

		var $MasterPackageId;

		var $paymentStatus;
		var $paymentReceived;
		var $companyId=1;
		var $amountPaid;
		var $dateOfPayment;
		var $amountPaidTo;
		var $paymentMode;

		var $instrumentOfPayment;
		var $numberOfInstrument;
		var $bankName;
 		var $branchName;

 		var $followupDate;
 		var $followupEmployeeId;

 		var $lastApplicatorId;
 		var $lastEnrollmentId;
 		var $lastPaymentId;
 		var $lastFollowupId;
        var $enrollment_id;

 		function __construct($applicatorDetails){

 			if($applicatorDetails->operation=='createApplicator'){

 				$this->firmName=$applicatorDetails->firmname;
				$this->applicatorAddressLine1=$applicatorDetails->addressline1;
				$this->applicatorAddressLine2=$applicatorDetails->addressline2;
				$this->applicatorCountry=$applicatorDetails->country;
				$this->applicatorState=$applicatorDetails->state;
				$this->applicatorCity=$applicatorDetails->city;
				$this->applicatorContactNo=$applicatorDetails->contactno;
				$this->applicatorVatNumber=$applicatorDetails->vatnumber;
				$this->applicatorCstNumber=$applicatorDetails->cstnumber;
				$this->applicatorServiceTaxNumber=$applicatorDetails->servicetaxnumber;
				$this->applicatorPanNumber=$applicatorDetails->pannumber;

				$this->pointOfContact=$applicatorDetails->pointofcontact;
				$this->pointContactNo=$applicatorDetails->pointcontactno;

				$this->MasterPackageId=$applicatorDetails->packageID;
				$this->paymentReceived=$applicatorDetails->received;
				$this->paymentStatus=$applicatorDetails->paymentStatus;
				if($this->paymentReceived=='Yes' && $this->paymentStatus=='Full'){
						
							$this->paymentMode=$applicatorDetails->mode;
							$this->amountPaid=$applicatorDetails->amountpaid;
							$this->amountPaidTo=$applicatorDetails->paidto;

							$date1=new DateTime($applicatorDetails->paymentDate);
							$this->dateOfPayment=$date1->format('Y-m-d');

							

							if($this->paymentMode!="cash"){

								$this->bankName=$applicatorDetails->bankname;
								$this->branchName=$applicatorDetails->branchname;
								$this->instrumentOfPayment=$applicatorDetails->mode;
								$this->numberOfInstrument=$applicatorDetails->uniquenumber;
							}
							
							
				}
				if($this->paymentReceived=='No'){

						$date2=new DateTime($applicatorDetails->followupdate);
						$this->followupDate=$date2->format('Y-m-d');
						
						$this->followupEmployeeId=$applicatorDetails->followupemployeeId;


						
				}
				if($this->paymentReceived=='Yes' && $this->paymentStatus=='Partial'){
							$this->paymentMode=$applicatorDetails->mode;
							$this->amountPaid=$applicatorDetails->amountpaid;
							$this->amountPaidTo=$applicatorDetails->paidto;
							
							$date1=new DateTime($applicatorDetails->paymentDate);
							$this->dateOfPayment=$date1->format('Y-m-d');
							
							$date2=new DateTime($applicatorDetails->followupdate);
							$this->followupDate=$date2->format('Y-m-d');
							
							$this->followupEmployeeId=$applicatorDetails->followupemployeeId;
							
							if($this->paymentMode!="cash"){

								$this->bankName=$applicatorDetails->bankname;
								$this->branchName=$applicatorDetails->branchname;
								$this->instrumentOfPayment=$applicatorDetails->mode;
								$this->numberOfInstrument=$applicatorDetails->uniquenumber;
							}		
				}
 			
 			}
			if($applicatorDetails->operation=='savePaymentDetails'){

				$this->paymentStatus=$applicatorDetails->paymentStatus;
				$this->enrollment_id=$applicatorDetails->enrollmentID;

				if($this->paymentStatus=='Full'){

					$this->paymentMode=$applicatorDetails->mode;
					$this->amountPaid=$applicatorDetails->amountpaid;
					$this->amountPaidTo=$applicatorDetails->paidto;

					$date1=new DateTime($applicatorDetails->paymentDate);
					$this->dateOfPayment=$date1->format('Y-m-d');



					if($this->paymentMode!="cash"){

						$this->bankName=$applicatorDetails->bankname;
						$this->branchName=$applicatorDetails->branchname;
						$this->instrumentOfPayment=$applicatorDetails->mode;
						$this->numberOfInstrument=$applicatorDetails->uniquenumber;
					}


				}
				if($this->paymentStatus=='Partial'){

					$this->paymentMode=$applicatorDetails->mode;
					$this->amountPaid=$applicatorDetails->amountpaid;
					$this->amountPaidTo=$applicatorDetails->paidto;

					$date1=new DateTime($applicatorDetails->paymentDate);
					$this->dateOfPayment=$date1->format('Y-m-d');

					$date2=new DateTime($applicatorDetails->followupdate);
					$this->followupDate=$date2->format('Y-m-d');

					$this->followupEmployeeId=$applicatorDetails->followupemployeeId;

					if($this->paymentMode!="cash"){

						$this->bankName=$applicatorDetails->bankname;
						$this->branchName=$applicatorDetails->branchname;
						$this->instrumentOfPayment=$applicatorDetails->mode;
						$this->numberOfInstrument=$applicatorDetails->uniquenumber;
					}

				}

			}

 		}

 		public function createApplicator()
		{

			global $connect;
			 $stmt1=$connect->prepare("INSERT INTO applicator_master(applicator_name,applicator_contact,applicator_address_line1,applicator_address_line2,applicator_city,applicator_state,applicator_country,applicator_vat_number,applicator_cst_number,applicator_stax_number,applicator_pan_number,last_modification_date,last_modified_by,created_by,creation_date)
	                 VALUES (:firmName,:applicatorContactNo,:applicatorAddressLine1,:applicatorAddressLine2,:applicatorCity,:applicatorState,:applicatorCountry,:applicatorVatNumber,:applicatorCstNumber,:applicatorServiceTaxNumber,:applicatorPanNumber,NOW(),'Namdev','Atul',NOW())");

			$stmt1->bindParam(':firmName', $this->firmName);
    		$stmt1->bindParam(':applicatorContactNo', $this->applicatorContactNo);
    		$stmt1->bindParam(':applicatorAddressLine1', $this->applicatorAddressLine1);
    		$stmt1->bindParam(':applicatorAddressLine2', $this->applicatorAddressLine2);
    		$stmt1->bindParam(':applicatorCity', $this->applicatorCity);
    		$stmt1->bindParam(':applicatorState', $this->applicatorState);
    		$stmt1->bindParam(':applicatorCountry', $this->applicatorCountry);
			$stmt1->bindParam(':applicatorVatNumber', $this->applicatorVatNumber);
    		$stmt1->bindParam(':applicatorCstNumber', $this->applicatorCstNumber);
    		$stmt1->bindParam(':applicatorServiceTaxNumber', $this->applicatorServiceTaxNumber);
    		$stmt1->bindParam(':applicatorPanNumber', $this->applicatorPanNumber);	
			

			 if($stmt1->execute()){

    		 		$this->lastApplicatorId=$connect->lastInsertId(); 
    		 		return true;    		 		    		 		
    		 }
    		 else{

    		 		return false;
    		 }

		}
		public function createPointOfContact()
		{

			global $connect;
			$stmt2=$connect->prepare("INSERT INTO applicator_pointof_contact(point_of_contact, point_of_contact_no, last_modification_date, last_modified_by, created_by, creation_date, applicator_master_id)
	       			VALUES (:pointOfContact , :pointContactNo , NOW(), 'Namdev', 'Atul', NOW(), :lastApplicatorId)");

			$stmt2->bindParam(':pointOfContact', $this->pointOfContact, PDO::PARAM_STR,10);
    		$stmt2->bindParam(':pointContactNo', $this->pointContactNo, PDO::PARAM_STR, 10);
    		$stmt2->bindParam(':lastApplicatorId',$this->lastApplicatorId);

			if($stmt2->execute()){

				 return true;
			}
			else{
				
				return false;
			}

		}
		public function enrollApplicator()
		{
			global $connect;
			$stmt3=$connect->prepare("INSERT INTO applicator_enrollment(applicator_master_id,company_id,payment_package_id,payment_status,created_by,creation_date)
	       VALUES (:lastApplicatorId,:companyId ,:MasterPackageId,:paymentStatus,'Atul', NOW())");

			$stmt3->bindParam(':lastApplicatorId', $this->lastApplicatorId);
    		$stmt3->bindParam(':companyId', $this->companyId);
    		$stmt3->bindParam(':MasterPackageId', $this->MasterPackageId);
    		$stmt3->bindParam(':paymentStatus', $this->paymentStatus);

			if($stmt3->execute()){

				$this->lastEnrollmentId=$connect->lastInsertId();
    			return true;
			
    		}
			else{

				return false;
			}
		}

		public function insertApplicatorPaymentInfo(){

			global $connect;
			$stmt4=$connect->prepare("INSERT INTO applicator_payment_info(enrollment_id,amount_paid,date_of_payment,paid_to,payment_mode,created_by,creation_date)
	       								VALUES (:lastEnrollmentId,:amountPaid,:dateOfPayment,:amountPaidTo,:paymentMode,'Atul', NOW())");

			$stmt4->bindParam(':lastEnrollmentId', $this->lastEnrollmentId);
    		$stmt4->bindParam(':amountPaid',$this->amountPaid);
    		$stmt4->bindParam(':dateOfPayment', $this->dateOfPayment);
    		$stmt4->bindParam(':amountPaidTo', $this->amountPaidTo);
    		$stmt4->bindParam(':paymentMode', $this->paymentMode);
    		
    		if($stmt4->execute()){

    			$this->lastPaymentId=$connect->lastInsertId();
    			return true;
    		}
    		else{
    			return false;
    		}

		}

		public function insertPaymentModeDetails(){
			global $connect;
			$stmt5=$connect->prepare("INSERT INTO payment_mode_details(instrument_of_payment,number_of_instrument,bank_name,branch_name,created_by,creation_date,payment_id)
	       								VALUES (:instrumentOfPayment,:numberOfInstrument,:bankName,:branchName,'Atul', NOW(),:lastPaymentId)");

			$stmt5->bindParam(':instrumentOfPayment', $this->instrumentOfPayment);
    		$stmt5->bindParam(':numberOfInstrument', $this->numberOfInstrument);
    		$stmt5->bindParam(':bankName', $this->bankName);
    		$stmt5->bindParam(':branchName', $this->branchName);
    		$stmt5->bindParam(':lastPaymentId', $this->lastPaymentId);
    		
    		if($stmt5->execute()){

    			return true;
    		}
    		else{
    			return false;
    		}

		}

		public function insertFollowUpDetails(){

			global $connect;

			$stmt6=$connect->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id) 
									  VALUES (:followupDate,NOW(),'Ajit','Namdev',NOW(),:lastEnrollmentId)");
		
			$stmt6->bindParam(':followupDate', $this->followupDate);
    		$stmt6->bindParam(':lastEnrollmentId', $this->lastEnrollmentId);

			if($stmt6->execute()){

				$this->lastFollowupId=$connect->lastInsertId();
				return true;
			}
			else{

				return false;
			}
		}
		public function insertFollowupEmployeeDetails(){

			global $connect;
			$stmt7=$connect->prepare("INSERT INTO follow_up_employee(employee_id,date_of_assignment,last_modification_date,last_modified_by,created_by,creation_date,follow_up_id)
									  VALUES(:followupEmployeeId,NOW(),NOW(),'Ajit','Namdev',NOW(),:lastFollowupId)");

			$stmt7->bindParam(':followupEmployeeId',$this->followupEmployeeId);
    		$stmt7->bindParam(':lastFollowupId', $this->lastFollowupId);

    		if($stmt7->execute()){

    			 return true;
    		}
    		else{


    			return false;
    		}

		}

		public function viewApplicator($toSearch){

			$json_response=array();
		    global $connect;
			
			if($toSearch=='tentetive'){
			$stmt1=$connect->prepare("SELECT * FROM applicator_enrollment  
							JOIN applicator_master ON 
							applicator_enrollment.applicator_master_id=applicator_master.applicator_master_id
							JOIN applicator_pointof_contact ON
							applicator_master.applicator_master_id=applicator_pointof_contact.applicator_master_id
							JOIN payment_package_master ON
							applicator_enrollment.payment_package_id=payment_package_master.payment_package_id
							
							WHERE applicator_enrollment.payment_status='No' OR applicator_enrollment.payment_status='Partial'");

			}
			else if ($toSearch=='permanent') {
				
				$stmt1=$connect->prepare("SELECT * FROM applicator_enrollment  
							JOIN applicator_master ON 
							applicator_enrollment.applicator_master_id=applicator_master.applicator_master_id
							JOIN applicator_pointof_contact ON
							applicator_master.applicator_master_id=applicator_pointof_contact.applicator_master_id
							JOIN payment_package_master ON
							applicator_enrollment.payment_package_id=payment_package_master.payment_package_id
							
							WHERE applicator_enrollment.payment_status='Full'");

			}



			if($stmt1->execute()){

				while($result1=$stmt1->fetch()){

						$applicator=array();
						$applicator['applicator_master_id']=$result1['applicator_master_id'];
						$applicator['applicator_name']=$result1['applicator_name'];
						$applicator['applicator_contact']=$result1['applicator_contact'];
						$applicator['applicator_address_line1']=$result1['applicator_address_line1'];
						$applicator['applicator_address_line2']=$result1['applicator_address_line2'];
						$applicator['applicator_city']=$result1['applicator_city'];
						$applicator['applicator_state']=$result1['applicator_state'];
						$applicator['applicator_country']=$result1['applicator_country'];
						$applicator['applicator_vat_number']=$result1['applicator_vat_number'];
						$applicator['applicator_cst_number']=$result1['applicator_cst_number'];
						$applicator['applicator_stax_number']=$result1['applicator_stax_number'];
						$applicator['applicator_pan_number']=$result1['applicator_pan_number'];
						$applicator['point_of_contact']=$result1['point_of_contact'];
						$applicator['point_of_contact_no']=$result1['point_of_contact_no'];
						$applicator['payment_package_id']=$result1['payment_package_id'];
						$applicator['package_name']=$result1['package_name'];
						$applicator['package_description']=$result1['package_description'];
						$applicator['enrollment_id']=$result1['enrollment_id'];
						$applicator['company_id']=$result1['company_id'];
					    $applicator['package_total_amount']=0;

					$payment_package_id=$result1['payment_package_id'];
					$stmt2=$connect->prepare("SELECT * FROM payment_package_details WHERE payment_package_id=:payment_package_id");
					$stmt2->bindParam(':payment_package_id',$payment_package_id);
					$stmt2->execute();
			        while ($result2 =$stmt2->fetch(PDO::FETCH_ASSOC))
			        {
			            $applicator['elementType'][] = array(
			                'element_name' => $result2['package_element_name'],
			                'element_quantity' => $result2['package_element_quantity'],
							'element_rate' => $result2['package_element_rate'],
							'element_amount' => $result2['package_element_amount']
			            );
			             $applicator['package_total_amount']+=$result2['package_element_amount'];

			        }
			       
			        $enrollment_id=$result1['enrollment_id'];
			        $stmt3=$connect->prepare("SELECT * FROM applicator_payment_info WHERE enrollment_id=:enrollment_id");
					$stmt3->bindParam(':enrollment_id',$enrollment_id);
					$stmt3->execute();

					$result3=$stmt3->fetch(PDO::FETCH_ASSOC);
					$applicator['amount_paid']=$result3['amount_paid'];
					$applicator['date_of_payment']=$result3['date_of_payment'];
					$applicator['paid_to']=$result3['paid_to'];
					$applicator['payment_mode']=$result3['payment_mode'];

					if($toSearch=='tentetive'){
			        	$stmt4=$connect->prepare("SELECT * FROM applicator_follow_up WHERE enrollment_id=:enrollment_id");
						$stmt4->bindParam(':enrollment_id',$enrollment_id);
						$stmt4->execute();

						$result4=$stmt4->fetch(PDO::FETCH_ASSOC);
						$applicator['date_of_follow_up']=$result4['date_of_follow_up'];
					}

					array_push($json_response, $applicator);	
				}	

				echo json_encode($json_response);
				 
				 return true;
			}		
			
			return false;
		}
		public function getApplicatorPaymentDetails(){

			global $connect;
			$response_array=array();
			$stmt1=$connect->prepare("SELECT * FROM applicator_enrollment
							JOIN applicator_master ON
							applicator_enrollment.applicator_master_id=applicator_master.applicator_master_id
							WHERE applicator_enrollment.payment_status='No' OR applicator_enrollment.payment_status='Partial'");

			if($stmt1->execute()) {

				while ($result1 = $stmt1->fetch()) {

					$applicator=array();
					$applicator['enrollment_id']=$result1['enrollment_id'];
					$applicator['applicator_name']=$result1['applicator_name'];
					$applicator['package_total_amount']=0;
					$applicator['total_paid_amount']=0;

					$payment_package_id=$result1['payment_package_id'];
					$stmt2=$connect->prepare("SELECT * FROM payment_package_details WHERE payment_package_id=:payment_package_id");
					$stmt2->bindParam(':payment_package_id',$payment_package_id);
					$stmt2->execute();
					while ($result2 =$stmt2->fetch(PDO::FETCH_ASSOC))
					{
//						        $applicator['elementType'][] = array(
//								'element_name' => $result2['package_element_name'],
//								'element_quantity' => $result2['package_element_quantity'],
//								'element_rate' => $result2['package_element_rate'],
//								'element_amount' => $result2['package_element_amount']
//						         );
						$applicator['package_total_amount']+=$result2['package_element_amount'];

					}
					$enrollment_id=$result1['enrollment_id'];
					$stmt3=$connect->prepare("SELECT * FROM applicator_payment_info WHERE enrollment_id=:enrollment_id");
					$stmt3->bindParam(':enrollment_id',$enrollment_id);
					$stmt3->execute();

					$affectedRow = $stmt3->rowCount();

					if($affectedRow!=0){
					while($result3=$stmt3->fetch(PDO::FETCH_ASSOC)){


							$applicator['paymentDetails'][] = array(
								'amount_paid' => $result3['amount_paid'],
								'date_of_payment' => $result3['date_of_payment'],
								'paid_to' => $result3['paid_to'],
								'payment_mode' => $result3['payment_mode']
						         );


						 $applicator['total_paid_amount']+=$result3['amount_paid'];

						}
					}
					else{

						$applicator['paymentDetails'][] = array(
								'amount_paid' => 0,
								'date_of_payment' => 'Not Available',
								'paid_to' => 'Not Available',
								'payment_mode' => 'Not Available'
						);
					}

					array_push($response_array, $applicator);
				}
				echo json_encode($response_array);

				return true;
			}
			return false;
		}

		public function savePaymentDetails(){

			global $connect;

			$stmt1 = $connect->prepare("UPDATE applicator_enrollment SET payment_status=:paymentStatus WHERE enrollment_id=:enrollment_id");
			$stmt1->bindParam(':enrollment_id', $this->enrollment_id);
			$stmt1->bindParam(':paymentStatus', $this->paymentStatus);


			$stmt2=$connect->prepare("INSERT INTO applicator_payment_info(enrollment_id,amount_paid,date_of_payment,paid_to,payment_mode,created_by,creation_date)
	       								VALUES (:enrollment_id,:amountPaid,:dateOfPayment,:amountPaidTo,:paymentMode,'Atul', NOW())");

			$stmt2->bindParam(':enrollment_id',$this->enrollment_id);
			$stmt2->bindParam(':amountPaid',$this->amountPaid);
			$stmt2->bindParam(':dateOfPayment', $this->dateOfPayment);
			$stmt2->bindParam(':amountPaidTo', $this->amountPaidTo);
			$stmt2->bindParam(':paymentMode', $this->paymentMode);


			$stmt3=$connect->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id)
									  VALUES (:followupDate,NOW(),'Ajit','Namdev',NOW(),:enrollment_id)");

			$stmt3->bindParam(':followupDate', $this->followupDate);
			$stmt3->bindParam(':enrollment_id', $this->enrollment_id);

			$stmt4=$connect->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id)
									  VALUES (:followupDate,NOW(),'Ajit','Namdev',NOW(),:enrollment_id)");

			$stmt4->bindParam(':followupDate', $this->followupDate);
			$stmt4->bindParam(':enrollment_id', $this->enrollment_id);

			if($this->paymentStatus=='Full') {

                  if($stmt1->execute()){

					  if($stmt2->execute()){

						  $this->lastPaymentId=$connect->lastInsertId();

						  	if($this->paymentMode!='cash'){

								if($this->insertPaymentModeDetails()){

									echo "Updated Successfully";

								}
							}
					  }
				  }

			}

			if($this->paymentStatus=='Partial'){

				if($stmt1->execute()){

					if($stmt2->execute()){

						$this->lastPaymentId=$connect->lastInsertId();

						if($this->paymentMode!='cash'){

							if($this->insertPaymentModeDetails()){


							}

						}

						if($stmt4->execute()){

							$this->lastFollowupId=$connect->lastInsertId();

							if($this->insertFollowupEmployeeDetails()){

									echo "Updated Successfully";
							}
						}
					}
				}
			}
		}

 	}	
?>