<?php

	    require_once ("../../php/Database.php");

		include_once ("ApplicatorClassLib.php");

        if (!isset($_SESSION['token'])) {
            session_start();
        }
        $userId=$_SESSION['token'];

        $db = Database::getInstance();
        $connect = $db->getConnection();

        $data=json_decode($_GET["data"]);
		$operationObject=new Applicator();

        $operation=$data->operation;

		switch($operation){

			case 'createPackage' :

                $connect->beginTransaction();
				if(Applicator::isPackageAvailable($data->package_name)) {
					if ($operationObject->createPackage($data, $userId)) {
						$connect->commit();
						$message = "Package Created Successfully...!!!";
						$arr = array('msg' => $message, 'error' => '');
						$jsn = json_encode($arr);
						echo($jsn);
					} else {
						$connect->rollBack();
						$message = "Unable to Create Package.Please try again...!!!";
						$arr = array('msg' => '', 'error' => $message);
						$jsn = json_encode($arr);
						echo($jsn);
					}
				}
				else
				{
					$message = "Package Name Is already Available";
					$arr = array('msg' => '', 'error' => $message);
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

                        $connect->beginTransaction();

					if(Applicator::isApplicatorAvailable($data->firmname)) {

						if ($data->packageEdited == "true") {

							if ($operationObject->createPackage($data, $userId)) {

								if ($operationObject->createApplicator($data, $userId)) {

									$connect->commit();
									$message = "Applicator Created Successfully...!!!";
									$arr = array('msg' => $message, 'error' => '');
									$jsn = json_encode($arr);
									echo($jsn);
								} else {
									$connect->rollBack();
									$message = "Unable to Create Applicator.Please try again...!!!";
									$arr = array('msg' => '', 'error' => $message);
									$jsn = json_encode($arr);
									echo($jsn);
								}
							} else {

								$connect->rollBack();
								$message = "Unable to Create Applicator.Please try again...!!!";
								$arr = array('msg' => '', 'error' => $message);
								$jsn = json_encode($arr);
								echo($jsn);
							}
						}
						if ($data->packageEdited == "false") {

							if ($operationObject->createApplicator($data, $userId)) {
								$connect->commit();
								$message = "Applicator Created Successfully...!!!";
								$arr = array('msg' => $message, 'error' => '');
								$jsn = json_encode($arr);
								echo($jsn);
							} else {
								$connect->rollBack();
								$message = "Unable to Create Applicator.Please try again...!!!";
								$arr = array('msg' => '', 'error' => $message);
								$jsn = json_encode($arr);
								echo($jsn);
							}
						}
					}
					else
					{
						$message = "Applicator Already Exists";
						$arr = array('msg' => "", 'error' => $message);
						$jsn = json_encode($arr);
						echo($jsn);

					}
				break;

			case 'viewTentativeApplicators':


                    if(!$operationObject->viewTentativeApplicators($data)){
                        $message = "Applicator Details Not Available...!!!";
                        echo AppUtil::getReturnStatus("fail",$message);
                    }

				break;


			case 'viewPermanentApplicators':

				if(!$operationObject->viewPermanentApplicators($data)){
                        $message = "Applicator Details Not Available...!!!";
                        echo AppUtil::getReturnStatus("fail",$message);
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

                            $connect->beginTransaction();
                            if($operationObject->savePaymentDetails($data,$userId))
                             {
                                 $connect->commit();
								 $message = "Payment Details Updated Successfully...!!!";
								 $arr = array('msg' => $message, 'error' => '');
								 $jsn = json_encode($arr);
								 echo($jsn);
                            }
                            else{
                                $connect->rollBack();
                                $message = "Unable to update Payment Details...!!!";
                                $arr = array('msg' => '', 'error' => $message);
                                $jsn = json_encode($arr);
                                echo($jsn);

                            }
				break;

			case 'modifyApplicatorDetails':

                            $connect->beginTransaction();
							if($operationObject->modifyApplicatorDetails($data,$userId)){

                                $connect->commit();
								$message = "Applicator Details Updated Successfully...!!!";
								$arr = array('msg' => $message, 'error' => '');
								$jsn = json_encode($arr);
								echo($jsn);
							}
							else{
                                $connect->rollBack();
								$message = "Could not Update Applicator Details...!!!";
								$arr = array('msg' => '', 'error' => $message);
								$jsn = json_encode($arr);
								echo($jsn);
							}
					break;

			case 'deletePackage':

                            if($operationObject->deletePackage($data,$userId)){
                                $message = "Package Deleted Successfully...!!!";
                                $arr = array('msg' => $message, 'error' => '');
                                $jsn = json_encode($arr);
                                echo($jsn);
                            }
                            else{
                                $message = "Could not delete Package";
                                $arr = array('msg' => '', 'error' => $message);
                                $jsn = json_encode($arr);
                                echo($jsn);
                            }

               break;
			default :

				   echo "Please provide correct operation  to do .";
				break;
		}

?>