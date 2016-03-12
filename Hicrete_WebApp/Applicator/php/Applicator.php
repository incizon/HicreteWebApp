<?php

		include_once ("ApplicatorClassLib.php");

		$data=json_decode($_GET["data"]);
		$operationObject=new Applicator($data);

        $operation=$data->operation;

		switch($operation){

			case 'createPackage' :

				if($operationObject->createPackage($data))
					{
						$message = "Package Created Successfully...!!!";
						$arr = array('msg' => $message, 'error' => '');
						$jsn = json_encode($arr);
						echo($jsn);
					}
				else
					{
						$message = "Unable to Create Package.Please try again...!!!";
						$arr = array('msg' => '' , 'error' => $message);
						$jsn = json_encode($arr);
						echo($jsn);
					}
				break;

			case 'viewPackages'	:

				if(!$operationObject->viewPackages())
					{
						$message = "No Package Details Available...!!!";
						$arr = array('msg' => '', 'error' => $message);
						$jsn = json_encode($arr);
						echo($jsn);
					}
				break;

			case 'createApplicator':

				       if($data->packageEdited=="true") {

						   if($operationObject->createPackage($data)) {

							    if ($operationObject->createApplicator($data)) {

									$message = "Applicator Created Successfully...!!!";
									$arr = array('msg' => $message, 'error' => '');
									$jsn = json_encode($arr);
									echo($jsn);

							   }
						   }
					   }
					   if($data->packageEdited=="false"){

						   if ($operationObject->createApplicator($data)) {

							   $message = "Applicator Created Successfully...!!!";
							   $arr = array('msg' => $message, 'error' => '');
							   $jsn = json_encode($arr);
							   echo($jsn);
						   }
						}
				break;

			case 'viewTentativeApplicators':

					if(!$operationObject->viewTentativeApplicators($data)){

						$message = "Applicator Details Not Available...!!!";
						$arr = array('msg' => '', 'error' => $message);
						$jsn = json_encode($arr);
						echo($jsn);
					}
				break;


			case 'viewPermanentApplicators':

				if(!$operationObject->viewPermanentApplicators($data)){

					$message = "Applicator Details Not Available...!!!";
					$arr = array('msg' => '', 'error' => $message);
					$jsn = json_encode($arr);
					echo($jsn);
				}
				break;

			case 'getTentativeApplicatorDetails':

                      $operationObject->getApplicatorDetails($data);
                break;

			case 'getPermanentApplicatorDetails':

				$operationObject->getApplicatorDetails($data);

				break;
			case 'getPaymentDetails':

                        if(!$operationObject->getApplicatorPaymentDetails()){
							$message = "Applicator Payment Details Not Available...!!!";
							$arr = array('msg' => '', 'error' => $message);
							$jsn = json_encode($arr);
							echo($jsn);
                        }
                        else{}
				break;

			case 'savePaymentDetails' :

                            if($operationObject->savePaymentDetails($data))
                             {
								 $message = "Payment Details Updated Successfully...!!!";
								 $arr = array('msg' => $message, 'error' => '');
								 $jsn = json_encode($arr);
								 echo($jsn);
                            }
				break;
			default :

				   echo "Please provide correct operation  to do .";
				break;
		}

?>