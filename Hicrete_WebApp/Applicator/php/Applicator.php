<?php

		include_once ("ApplicatorClassLib.php");

		$data=json_decode($_GET["data"]);
		$operationObject=new Applicator($data);

        $operation=$data->operation;

		switch($operation){

			case 'createPackage' :

				if($operationObject->createPackage($data))
					{
						echo "Package Created Successfully";
					}
				else
					{
						echo "Could not create package";
					}
				break;

			case 'viewPackages'	:

				if(!$operationObject->viewPackages())
					{
						echo "Could not view package details";
					}
				break;

			case 'createApplicator':

				       if($data->packageEdited=="true") {

						   if($operationObject->createPackage($data)) {

							    if ($operationObject->createApplicator($data)) {

								   echo "Created successfully";

							   }
						   }
					   }
					   if($data->packageEdited=="false"){

						   if ($operationObject->createApplicator($data)) {

							   echo "Created successfully";
						   }
						}
				break;

			case 'viewApplicators':

					if(!$operationObject->viewApplicator($data->applicator)){

						echo "No Applicator Details to show";
					}
				break;

			case 'getPaymentDetails':

                        if(!$operationObject->getApplicatorPaymentDetails()){
                            echo "Not Applicator Payment Details to Display";
                        }
                        else{}
				break;

			case 'savePaymentDetails' :

                            if($operationObject->savePaymentDetails($data))
                             {
                                echo "Payment Updated Successfully";
                            }
				break;
			default :

				   echo "Please provide correct operation  to do .";
				break;
		}

?>