<?php

            include_once ("database_connection.php");

            class Applicator
            {


                var $lastInsertedApplicatorId;
                var $lastInsertedEnrollmentId;
                var $lastInsertedPaymentId;
                var $lastInsertedFollowupId;

                var $lastInsertedPackageId;

                /*
                 * createPackage() input : package details .
                 *                 output : return true if created successfully.
                 *
                 */
                public function createPackage($data)
                {

                    global $connect;

                    $packageName = $data->package_name;
                    $packageDescription = $data->package_description;
                    $isCustomized=$data->packageEdited;



                    $stmt = $connect->prepare("INSERT INTO payment_package_master(package_name,package_description,package_customized,package_dateof_creation,created_by,creation_date)
						     VALUES (:packageName,:packageDescription,:isCustomized,NOW(),'Namdev',NOW())");

                    $stmt->bindParam(':packageName', $packageName);
                    $stmt->bindParam(':packageDescription', $packageDescription);
                    $stmt->bindParam(':isCustomized', $isCustomized);

                    if ($stmt->execute()) {
                        $this->lastInsertedPackageId = $connect->lastInsertId();

                        for ($index = 0; $index < sizeof($data->elementDetails); $index++) {

                            $packageElementName = $data->elementDetails[$index]->element_name;
                            $packageElementQuantity = $data->elementDetails[$index]->element_quantity;
                            $packageElementRate = $data->elementDetails[$index]->element_rate;
                            $packageElementAmount = $packageElementQuantity * $packageElementRate;

                            $stmt1 = $connect->prepare("INSERT INTO payment_package_details(package_element_name,package_element_quantity,package_element_rate,package_element_amount,created_by,creation_date, payment_package_id)
							  VALUES (:packageElementName ,:packageElementQuantity ,:packageElementRate ,:packageElementAmount ,'Namdev',NOW(),:lastPackageId)");

                            $stmt1->bindParam(':packageElementName', $packageElementName);
                            $stmt1->bindParam(':packageElementQuantity', $packageElementQuantity);
                            $stmt1->bindParam(':packageElementRate', $packageElementRate);
                            $stmt1->bindParam(':packageElementAmount', $packageElementAmount);

                            $stmt1->bindParam(':lastPackageId', $this->lastInsertedPackageId);


                            if (!$stmt1->execute()) {

                                return false;
                            }
                        }

                    }
                    else {
                        return false;
                    }

                    return true;

                }

                /*
                 * viewPackages() :
                 *                 input : Nothing
                 *                 output : Json array which contains all the available packages.
                 */
                public function viewPackages()
                {

                    global $connect;

                    $stmt1 = $connect->prepare("SELECT * FROM payment_package_master WHERE package_customized='false'");

                    if ($stmt1->execute()) {

                        $json_response = array();
                        while ($result1 = $stmt1->fetch(PDO::FETCH_ASSOC)) {
                            $result1_array = array();
                            $result1_array['payment_package_id'] = $result1['payment_package_id'];
                            $result1_array['package_name'] = $result1['package_name'];
                            $result1_array['package_description'] = $result1['package_description'];
                            $result1_array['package_total_amount'] = 0;
                            $result1_array['elementType'] = array();
                            $payment_package_id = $result1['payment_package_id'];

                            $stmt2 = $connect->prepare("SELECT * FROM payment_package_details WHERE payment_package_id=:payment_package_id");
                            $stmt2->bindParam(':payment_package_id', $payment_package_id);
                            $stmt2->execute();
                            while ($result2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                                $result1_array['elementType'][] = array(
                                    'element_name' => $result2['package_element_name'],
                                    'element_quantity' => $result2['package_element_quantity'],
                                    'element_rate' => $result2['package_element_rate'],
                                    'element_amount' => $result2['package_element_amount']
                                );
                                $result1_array['package_total_amount'] += $result2['package_element_amount'];
                            }
                            array_push($json_response, $result1_array); //push the values in the array
                        }
                        echo json_encode($json_response);
                    } else {

                        return false;
                    }

                    return true;
                }


                /*
                 * createApplicator() :
                 *                      input: Applicators details.
                 *                      output :return true if applicator created successfully.
                 *
                 */

                public function createApplicator($data)
                {
                    global $connect;

                   $companyId=1;
                    $firmName = $data->firmname;
                    $applicatorAddressLine1 = $data->addressline1;
                    $applicatorAddressLine2 = $data->addressline2;
                    $applicatorCountry = $data->country;
                    $applicatorState = $data->state;
                    $applicatorCity = $data->city;
                    $applicatorContactNo = $data->contactno;
                    $applicatorVatNumber = $data->vatnumber;
                    $applicatorCstNumber = $data->cstnumber;
                    $applicatorServiceTaxNumber = $data->servicetaxnumber;
                    $applicatorPanNumber = $data->pannumber;

                    $pointOfContact = $data->pointofcontact;
                    $pointContactNo = $data->pointcontactno;

                    if($data->packageEdited=="false") {
                        $MasterPackageId = $data->packageID;
                    }
                    else{
                        $MasterPackageId=$this->lastInsertedPackageId;
                    }

                    $paymentReceived = $data->received;
                    $paymentStatus = $data->paymentStatus;

                    if (($paymentReceived == 'Yes' && $paymentStatus == 'Yes') ||  ($paymentReceived == 'Yes' && $paymentStatus == 'No')) {

                        $paymentMode = $data->mode;
                        $amountPaid = $data->amountpaid;
                        $amountPaidTo = $data->paidto;

                        $date1 = new DateTime($data->paymentDate);
                        $dateOfPayment = $date1->format('Y-m-d');


                        if ($paymentMode != "cash") {

                            $bankName = $data->bankname;
                            $branchName = $data->branchname;
                            $instrumentOfPayment = $data->mode;
                            $numberOfInstrument = $data->uniquenumber;
                        }




                    }
                    if (($paymentReceived == 'No' && $paymentStatus == 'No')|| ($paymentReceived == 'Yes' && $paymentStatus == 'No')) {

                        $date2 = new DateTime($data->followupdate);
                        $followupDate = $date2->format('Y-m-d');

                        $followupEmployeeId = $data->followupemployeeId;


                    }


                    $stmt1 = $connect->prepare("INSERT INTO applicator_master(applicator_name,applicator_contact,applicator_address_line1,applicator_address_line2,applicator_city,applicator_state,applicator_country,applicator_vat_number,applicator_cst_number,applicator_stax_number,applicator_pan_number,last_modification_date,last_modified_by,created_by,creation_date)
	                 VALUES (:firmName,:applicatorContactNo,:applicatorAddressLine1,:applicatorAddressLine2,:applicatorCity,:applicatorState,:applicatorCountry,:applicatorVatNumber,:applicatorCstNumber,:applicatorServiceTaxNumber,:applicatorPanNumber,NOW(),'Namdev','Atul',NOW())");

                    $stmt1->bindParam(':firmName', $firmName);
                    $stmt1->bindParam(':applicatorContactNo', $applicatorContactNo);
                    $stmt1->bindParam(':applicatorAddressLine1', $applicatorAddressLine1);
                    $stmt1->bindParam(':applicatorAddressLine2', $applicatorAddressLine2);
                    $stmt1->bindParam(':applicatorCity', $applicatorCity);
                    $stmt1->bindParam(':applicatorState', $applicatorState);
                    $stmt1->bindParam(':applicatorCountry', $applicatorCountry);
                    $stmt1->bindParam(':applicatorVatNumber', $applicatorVatNumber);
                    $stmt1->bindParam(':applicatorCstNumber', $applicatorCstNumber);
                    $stmt1->bindParam(':applicatorServiceTaxNumber', $applicatorServiceTaxNumber);
                    $stmt1->bindParam(':applicatorPanNumber', $applicatorPanNumber);


                    $stmt2 = $connect->prepare("INSERT INTO applicator_pointof_contact(point_of_contact, point_of_contact_no, last_modification_date, last_modified_by, created_by, creation_date, applicator_master_id)
	       			VALUES (:pointOfContact , :pointContactNo , NOW(), 'Namdev', 'Atul', NOW(), :lastApplicatorId)");

                    $stmt2->bindParam(':pointOfContact', $pointOfContact);
                    $stmt2->bindParam(':pointContactNo', $pointContactNo);
                    $stmt2->bindParam(':lastApplicatorId', $this->lastInsertedApplicatorId);

                    $stmt3 = $connect->prepare("INSERT INTO applicator_enrollment(applicator_master_id,company_id,payment_package_id,payment_status,created_by,creation_date)
	                                          VALUES (:lastApplicatorId,:companyId ,:MasterPackageId,:paymentStatus,'Atul', NOW())");

                    $stmt3->bindParam(':lastApplicatorId', $this->lastInsertedApplicatorId);
                    $stmt3->bindParam(':companyId', $companyId);
                    $stmt3->bindParam(':MasterPackageId', $MasterPackageId);
                    $stmt3->bindParam(':paymentStatus', $paymentStatus);


                    $stmt4 = $connect->prepare("INSERT INTO applicator_payment_info(enrollment_id,amount_paid,date_of_payment,paid_to,payment_mode,created_by,creation_date)
	       								VALUES (:lastEnrollmentId,:amountPaid,:dateOfPayment,:amountPaidTo,:paymentMode,'Atul', NOW())");

                    $stmt4->bindParam(':lastEnrollmentId', $this->lastInsertedEnrollmentId);
                    $stmt4->bindParam(':amountPaid', $amountPaid);
                    $stmt4->bindParam(':dateOfPayment', $dateOfPayment);
                    $stmt4->bindParam(':amountPaidTo', $amountPaidTo);
                    $stmt4->bindParam(':paymentMode', $paymentMode);


                    $stmt5 = $connect->prepare("INSERT INTO payment_mode_details(instrument_of_payment,number_of_instrument,bank_name,branch_name,created_by,creation_date,payment_id)
	       								VALUES (:instrumentOfPayment,:numberOfInstrument,:bankName,:branchName,'Atul', NOW(),:lastPaymentId)");

                    $stmt5->bindParam(':instrumentOfPayment', $instrumentOfPayment);
                    $stmt5->bindParam(':numberOfInstrument', $numberOfInstrument);
                    $stmt5->bindParam(':bankName', $bankName);
                    $stmt5->bindParam(':branchName', $branchName);
                    $stmt5->bindParam(':lastPaymentId', $this->lastInsertedPaymentId);


                    $stmt6 = $connect->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id)
									  VALUES (:followupDate,NOW(),'Ajit','Namdev',NOW(),:lastEnrollmentId)");

                    $stmt6->bindParam(':followupDate', $followupDate);
                    $stmt6->bindParam(':lastEnrollmentId', $this->lastInsertedEnrollmentId);

                    $stmt7=$connect->prepare("INSERT INTO follow_up_employee(employee_id,date_of_assignment,last_modification_date,last_modified_by,created_by,creation_date,follow_up_id)
									  VALUES(:followupEmployeeId,NOW(),NOW(),'Ajit','Namdev',NOW(),:lastFollowupId)");

                    $stmt7->bindParam(':followupEmployeeId',$followupEmployeeId);
                    $stmt7->bindParam(':lastFollowupId', $this->lastInsertedFollowupId);



                    if($stmt1->execute()){

                        $this->lastInsertedApplicatorId=$connect->lastInsertId();

                        if($stmt2->execute()){

                            if($stmt3->execute()){

                                $this->lastInsertedEnrollmentId=$connect->lastInsertId();

                                if ($paymentReceived == 'Yes' && $paymentStatus == 'Yes'){

                                    if($stmt4->execute()){

                                        if($paymentMode!='cash'){

                                            $this->lastInsertedPaymentId=$connect->lastInsertId();
                                            if($stmt5->execute()){

                                                return true;
                                            }
                                            else{

                                                echo "Roll Back";
                                            }
                                        }

                                        return true;
                                    }
                                    else{

                                        echo "Roll Back";
                                    }
                                }
                                if($paymentReceived == 'No' && $paymentStatus == 'No'){

                                    if($stmt6->execute()){

                                        $this->lastInsertedFollowupId=$connect->lastInsertId();

                                        if($stmt7->execute()){

                                            return true;
                                        }
                                        else{

                                            echo "Roll Back";
                                        }
                                    }
                                    else{
                                        echo "Roll Back";
                                    }

                                }
                                if($paymentReceived == 'Yes' && $paymentStatus == 'No'){


                                    if($stmt4->execute()){


                                        if($paymentMode!='cash'){

                                            $this->lastInsertedPaymentId=$connect->lastInsertId();

                                            if($stmt5->execute()){

                                                if($stmt6->execute()){

                                                    $this->lastInsertedFollowupId=$connect->lastInsertId();

                                                    if($stmt7->execute()){

                                                        return true;
                                                    }
                                                    else{

                                                        echo "Roll Back";
                                                    }
                                                }
                                                else{

                                                    echo "Roll Back";
                                                }

                                            }
                                            else{

                                                echo "Roll Back";
                                            }
                                        }
                                        else{

                                            if($stmt6->execute()){

                                                $this->lastInsertedFollowupId=$connect->lastInsertId();

                                                if($stmt7->execute()){

                                                    return true;
                                                }
                                                else{

                                                    echo "Roll Back";
                                                }
                                            }
                                            else{

                                                echo "Roll Back";
                                            }

                                        }
                                    }
                                    else{

                                        echo "Roll Back";
                                    }


                                }
                            }
                            else{

                                echo "Roll Back";
                            }
                        }
                        else{

                            echo "Roll Back";
                        }

                    }
                    else{

                        echo "Roll Back";
                    }


                }

                /**
                 * @param $toSearch
                 * @return bool
                 */
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

							WHERE applicator_enrollment.payment_status='No'");

                    }
                    else if ($toSearch=='permanent') {

                        $stmt1=$connect->prepare("SELECT * FROM applicator_enrollment
							JOIN applicator_master ON
							applicator_enrollment.applicator_master_id=applicator_master.applicator_master_id
							JOIN applicator_pointof_contact ON
							applicator_master.applicator_master_id=applicator_pointof_contact.applicator_master_id
							JOIN payment_package_master ON
							applicator_enrollment.payment_package_id=payment_package_master.payment_package_id

							WHERE applicator_enrollment.payment_status='Yes'");

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
                            $applicator['total_paid_amount']=0;

                            $payment_package_id=$result1['payment_package_id'];
                            $stmt2=$connect->prepare("SELECT * FROM payment_package_details WHERE payment_package_id=:payment_package_id");
                            $stmt2->bindParam(':payment_package_id',$payment_package_id);
                            $stmt2->execute();
                            while ($result2 =$stmt2->fetch(PDO::FETCH_ASSOC))
                            {
                                $applicator['elementDetails'][] = array(
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

                            if($toSearch=='tentetive'){
                                $stmt4=$connect->prepare("SELECT * FROM applicator_follow_up WHERE enrollment_id=:enrollment_id");
                                $stmt4->bindParam(':enrollment_id',$enrollment_id);
                                $stmt4->execute();

                                $result4=$stmt4->fetch(PDO::FETCH_ASSOC);
                                $applicator['date_of_follow_up']=$result4['date_of_follow_up'];
                            }
                            else{
                                $applicator['date_of_follow_up']='NA';
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
							WHERE applicator_enrollment.payment_status='No'");

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

                public function savePaymentDetails($data){

                    global $connect;

                    $enrollment_id=$data->enrollmentID;
                    $paymentStatus=$data->paymentStatus;
                    $paymentMode=$data->mode;
                    $amountPaid=$data->amountpaid;
                    $dateOfPayment=$data->paymentDate;
                    $amountPaidTo=$data->paidto;


                    if ($paymentMode != "cash") {

                        $bankName = $data->bankname;
                        $branchName = $data->branchname;
                        $instrumentOfPayment = $data->mode;
                        $numberOfInstrument = $data->uniquenumber;

                    }
                    if($data->pendingAmount!=0){

                        $followupDate=$data->followupdate;
                        $followupEmployeeId=$data->followupemployeeId;
                    }


                    $stmt1 = $connect->prepare("UPDATE applicator_enrollment SET payment_status=:paymentStatus WHERE enrollment_id=:enrollment_id");
                    $stmt1->bindParam(':enrollment_id', $enrollment_id);
                    $stmt1->bindParam(':paymentStatus', $paymentStatus);


                    $stmt2=$connect->prepare("INSERT INTO applicator_payment_info(enrollment_id,amount_paid,date_of_payment,paid_to,payment_mode,created_by,creation_date)
	       								VALUES (:enrollment_id,:amountPaid,:dateOfPayment,:amountPaidTo,:paymentMode,'Atul', NOW())");

                    $stmt2->bindParam(':enrollment_id',$enrollment_id);
                    $stmt2->bindParam(':amountPaid',$amountPaid);
                    $stmt2->bindParam(':dateOfPayment', $dateOfPayment);
                    $stmt2->bindParam(':amountPaidTo', $amountPaidTo);
                    $stmt2->bindParam(':paymentMode', $paymentMode);


                    $stmt3 = $connect->prepare("INSERT INTO payment_mode_details(instrument_of_payment,number_of_instrument,bank_name,branch_name,created_by,creation_date,payment_id)
	       								VALUES (:instrumentOfPayment,:numberOfInstrument,:bankName,:branchName,'Atul', NOW(),:lastPaymentId)");

                    $stmt3->bindParam(':instrumentOfPayment', $instrumentOfPayment);
                    $stmt3->bindParam(':numberOfInstrument', $numberOfInstrument);
                    $stmt3->bindParam(':bankName', $bankName);
                    $stmt3->bindParam(':branchName', $branchName);
                    $stmt3->bindParam(':lastPaymentId', $this->lastInsertedPaymentId);

                    $stmt4=$connect->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id)
									  VALUES (:followupDate,NOW(),'Ajit','Namdev',NOW(),:enrollment_id)");

                    $stmt4->bindParam(':followupDate', $followupDate);
                    $stmt4->bindParam(':enrollment_id', $enrollment_id);


                    $stmt5=$connect->prepare("INSERT INTO follow_up_employee(employee_id,date_of_assignment,last_modification_date,last_modified_by,created_by,creation_date,follow_up_id)
									  VALUES(:followupEmployeeId,NOW(),NOW(),'Ajit','Namdev',NOW(),:lastFollowupId)");

                    $stmt5->bindParam(':followupEmployeeId',$followupEmployeeId);
                    $stmt5->bindParam(':lastFollowupId', $this->lastInsertedFollowupId);

                    if($paymentStatus=='Yes') {

                        if($stmt1->execute()){

                            if($stmt2->execute()){

                                $this->lastInsertedPaymentId=$connect->lastInsertId();

                                if($paymentMode!='cash'){

                                    if($stmt3->execute()){

                                       return true;

                                    }
                                    else{

                                        echo "Roll Back";
                                    }

                                }
                                else{

                                     return true;
                                }

                            }
                            else{

                                echo "Roll Back";
                            }
                        }
                        else{


                            echo "Roll Back";
                        }

                    }


                if($paymentStatus=='No'){

                        if($stmt1->execute()){

                            if($stmt2->execute()){

                                $this->lastInsertedPaymentId=$connect->lastInsertId();

                                if($paymentMode!='cash'){

                                    if($stmt3->execute()){

                                        if($stmt4->execute()){

                                            $this->lastInsertedFollowupId=$connect->lastInsertId();

                                             if($stmt5->execute()){

                                                  return true;
                                             }
                                            else{

                                                echo "Roll Back";
                                            }

                                        }
                                        else{

                                            echo "Roll Back";
                                        }

                                    }
                                    else{

                                        echo "Roll Back";
                                    }

                                }
                                else{

                                    if($stmt4->execute()){

                                        $this->lastInsertedFollowupId=$connect->lastInsertId();

                                        if($stmt5->execute()){

                                            return true;
                                        }
                                        else{

                                            echo "Roll Back";
                                        }

                                    }
                                    else{

                                        echo "Roll Back";

                                    }

                                }


                            }
                            else{

                                echo "Roll Back";
                            }
                        }
                       else{

                           echo "Roll Back";
                       }
                    }
                }


            }





?>