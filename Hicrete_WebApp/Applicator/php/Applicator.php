<?php
	
	  include_once("ApplicatorClassLib.php");	
	 
	  $applicatorDetails = json_decode($_GET["applicatorDetails"]);
	  $applicator= new Applicator($applicatorDetails);
	  $operation=$applicatorDetails->operation;
	 

	  switch ($operation) {
	   	case 'createApplicator':
	   		          
	   		           if($applicatorDetails->received=='Yes'){

	   		           		paymentReceived($applicatorDetails);
	   		           } 
	   		           else if ($applicatorDetails->received=='No') {
	   		            	
	   		            	noPaymentReceived($applicatorDetails);
	   		            } 
	   		break;
	   	
	   	case 'viewApplicator':
	   				
	   				 	if(!$applicator->viewApplicator($applicatorDetails->applicator)){

	   				 		echo "No Applicator Details to show";
	   				 	}

		  case 'savePaymentInfo':


	   	default:
	   		
	   		#code...
	   		break;
	   } 

	   function paymentReceived($applicatorDetails){

	   		global $applicator;
	   		$paymentStatus=$applicatorDetails->paymentStatus;
	   		switch ($paymentStatus) {
	   			case 'Full':


	   					if($applicator->createApplicator()){
	 									
				 			if($applicator->createPointOfContact()){

				 				if($applicator->enrollApplicator()){

				 					if($applicator->insertApplicatorPaymentInfo()){

				 						if($applicatorDetails->mode !="cash"){	
				 													
				 							if($applicator->insertPaymentModeDetails()){
				 														
				 								echo "Applicator Created Successfully..!!";
				 							}
				 							else{
				 									
				 								echo "Something went wrong..!!";
				 							}
				 						}
				 						else{
													
											echo "Applicator Created Successfully..!!";
				 						}			
				 					}
				 					else{
												
											echo "Something went wrong while payment info";
				 					}
				 				}
				 				else{

				 						echo "Something went wrong while enrollment";	
				 				}

					 		}
				 			else{
									echo "Something Went wrong while point of contact";
				 				}
				 			}
				 		else{
				 					
				 				echo "Applicator could not created";
				 		}
	   						 
	   				break;
	   			
	   			case 'Partial':
	   				
	   					if($applicator->createApplicator()){

	 						if($applicator->createPointOfContact()){

	 							if($applicator->enrollApplicator()){

	 								if($applicator->insertApplicatorPaymentInfo()){

	 									if($applicatorDetails->mode!="cash"){

	 										if($applicator->insertPaymentModeDetails()){

	 											}
	 										else{

	 												echo "Something went wrong while payMode";
	 											
	 											}
	 									}

	 									if($applicator->insertFollowUpDetails()){

	 										if($applicator->insertFollowupEmployeeDetails()){

	 											echo "Applicator Created Successfully...!!!";

	 										}
	 										else{

	 											echo "Something went wrong while followupEmp";
	 										
	 										}
	 																	
	 									}
	 									else{

	 											echo "Something went wrong while followup";
	 									}

	 								}
	 								else{

	 										echo "Something went wrong while paymentInfo ";
	 								}

	 							}
	 							else{

	 									echo "Something went wrong while enrollment";
	 							}

	 						}
	 						else{

	 								echo "Something went wrong while point of contact";
	 						}
	 					}
	 					else{

	 							echo "Could not create applicator";
	 					}

	   				break;
	   			
	   			default:
	   				

	   			break;
	   		}

	   }
	   function noPaymentReceived($applicatorDetails){
	   		global $applicator;
	   		 if($applicator->createApplicator()){
	 									
	 			if($applicator->createPointOfContact()){

	 				if($applicator->enrollApplicator()){

	 					if($applicator->insertFollowUpDetails()){

	 						if($applicator->insertFollowupEmployeeDetails()){

	 								echo "Applicator created Successfully..!!";
	 						}
	 						else{

	 								echo "Something went wrong Followup Employee";
	 						}
	 					}
	 					else{

	 							echo "Something went wrong followup";
	 					}
	 				
	 				}
	 				else{

	 						echo "Something went wrong while enrollment";
	 				}
	 			
	 			}
	 			else{

	 					echo "Something Went Wrong while point of contact";
	 			
	 			}
	 		
	 		}
	 		else{

	 				echo "Could not create Applicator";
	 		}		


	   }
	   
?>