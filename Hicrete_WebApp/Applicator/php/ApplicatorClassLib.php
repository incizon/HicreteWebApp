<?php

            require_once ("../../php/Database.php");
            require_once ("../../php/appUtil.php");

            class Applicator
            {

                var $lastInsertedApplicatorId;
                var $lastInsertedEnrollmentId;
                var $lastInsertedPaymentId;
                var $lastInsertedFollowupId;

                var $lastInsertedPackageId;



                public static function isPackageAvailable($packageName)
                {

                    try {
                        $db = Database::getInstance();
                        $conn = $db->getConnection();
                        $stmt = $conn->prepare("select count(1) as count from payment_package_master where package_name=:packageName");
                        $stmt->bindParam(':packageName', $packageName, PDO::PARAM_STR);
                        $stmt->execute();
                        $result = $stmt->fetch(PDO::FETCH_ASSOC);
                        $count = $result['count'];

                        if ($count != 0) {
                            return 0;
                        } else
                            return 1;
                    }
                    catch(Exception $e)
                    {

                    }

                }
                /*
                 * createPackage() input : package details .
                 *                 output : return true if created successfully.
                 *
                 */

                public function createPackage($data,$userId)
                {

                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $packageName = $data->package_name;
                    $packageDescription = $data->package_description;
                    $isCustomized=$data->packageEdited;

                    $stmt = $connect->prepare("INSERT INTO payment_package_master(package_name,package_description,package_customized,package_dateof_creation,created_by,creation_date)
						     VALUES (:packageName,:packageDescription,:isCustomized,NOW(),:createdBy,NOW())");

                    $stmt->bindParam(':packageName', $packageName);
                    $stmt->bindParam(':packageDescription', $packageDescription);
                    $stmt->bindParam(':isCustomized', $isCustomized);
                    $stmt->bindParam(':createdBy', $userId);

                    if ($stmt->execute()) {
                        $this->lastInsertedPackageId = $connect->lastInsertId();

                        for ($index = 0; $index < sizeof($data->elementDetails); $index++) {

                            $packageElementName = $data->elementDetails[$index]->element_name;
                            $packageElementQuantity = $data->elementDetails[$index]->element_quantity;
                            $packageElementRate = $data->elementDetails[$index]->element_rate;
                            $packageElementAmount = $packageElementQuantity * $packageElementRate;

                            $stmt1 = $connect->prepare("INSERT INTO payment_package_details(package_element_name,package_element_quantity,package_element_rate,package_element_amount,created_by,creation_date, payment_package_id)
							  VALUES (:packageElementName ,:packageElementQuantity ,:packageElementRate ,:packageElementAmount ,:createdBy,NOW(),:lastPackageId)");

                            $stmt1->bindParam(':packageElementName', $packageElementName);
                            $stmt1->bindParam(':createdBy',$userId);
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

                    $stmt1 = $connect->prepare("SELECT * FROM payment_package_master WHERE package_customized='false' AND is_deleted='0'");

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

                public static function isApplicatorAvailable($applicatorName)
                {
                    try {
                        $db = Database::getInstance();
                        $conn = $db->getConnection();
                        $stmt = $conn->prepare("select count(1) as count from applicator_master where applicator_name=:applicatorName");
                        $stmt->bindParam(':applicatorName', $applicatorName, PDO::PARAM_STR);
                        $stmt->execute();
                        $result = $stmt->fetch(PDO::FETCH_ASSOC);
                        $count = $result['count'];

                        if ($count != 0) {
                            return 0;
                        } else
                            return 1;
                    }
                    catch(Exception $e)
                    {

                    }
                }

                /*
                 * createApplicator() :
                 *                      input: Applicators details.
                 *                      output :return true if applicator created successfully.
                 *
                 */

                public function createApplicator($data,$userId)
                {
                    global $connect;

                    $companyId=0;
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
                    if(isset($data->pointofcontact)) {
                        $pointOfContact = $data->pointofcontact;
                    }
                    else
                        $pointOfContact="";
                    if(isset($data->pointcontactno)) {
                        $pointContactNo = $data->pointcontactno;
                    }else
                        $pointContactNo="";

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
	                 VALUES (:firmName,:applicatorContactNo,:applicatorAddressLine1,:applicatorAddressLine2,:applicatorCity,:applicatorState,:applicatorCountry,:applicatorVatNumber,:applicatorCstNumber,:applicatorServiceTaxNumber,:applicatorPanNumber,NOW(),:lastModifiedBy,:createdBy,NOW())");

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

                    $stmt1->bindParam(':lastModifiedBy', $userId);
                    $stmt1->bindParam(':createdBy', $userId);


                    $stmt2 = $connect->prepare("INSERT INTO applicator_pointof_contact(point_of_contact, point_of_contact_no, last_modification_date, last_modified_by, created_by, creation_date, applicator_master_id)
	       			VALUES (:pointOfContact , :pointContactNo , NOW(), :lastModifiedBy, :createdBy, NOW(), :lastApplicatorId)");

                    $stmt2->bindParam(':pointOfContact', $pointOfContact);
                    $stmt2->bindParam(':pointContactNo', $pointContactNo);
                    $stmt2->bindParam(':lastApplicatorId', $this->lastInsertedApplicatorId);

                    $stmt2->bindParam(':lastModifiedBy', $userId);
                    $stmt2->bindParam(':createdBy', $userId);

                    $stmt3 = $connect->prepare("INSERT INTO applicator_enrollment(applicator_master_id,company_id,payment_package_id,payment_status,created_by,creation_date)
	                                          VALUES (:lastApplicatorId,:companyId ,:MasterPackageId,:paymentStatus,:createdBy, NOW())");

                    $stmt3->bindParam(':lastApplicatorId', $this->lastInsertedApplicatorId);
                    $stmt3->bindParam(':companyId', $companyId);
                    $stmt3->bindParam(':MasterPackageId', $MasterPackageId);
                    $stmt3->bindParam(':paymentStatus', $paymentStatus);
                    $stmt3->bindParam(':createdBy', $userId);

                    $stmt4 = $connect->prepare("INSERT INTO applicator_payment_info(enrollment_id,amount_paid,date_of_payment,paid_to,payment_mode,created_by,creation_date)
	       								VALUES (:lastEnrollmentId,:amountPaid,:dateOfPayment,:amountPaidTo,:paymentMode,:createdBy, NOW())");

                    $stmt4->bindParam(':lastEnrollmentId', $this->lastInsertedEnrollmentId);
                    $stmt4->bindParam(':amountPaid', $amountPaid);
                    $stmt4->bindParam(':dateOfPayment', $dateOfPayment);
                    $stmt4->bindParam(':amountPaidTo', $amountPaidTo);
                    $stmt4->bindParam(':paymentMode', $paymentMode);
                    $stmt4->bindParam(':createdBy', $userId);

                    $stmt5 = $connect->prepare("INSERT INTO payment_mode_details(instrument_of_payment,number_of_instrument,bank_name,branch_name,created_by,creation_date,payment_id)
	       								VALUES (:instrumentOfPayment,:numberOfInstrument,:bankName,:branchName,:createdBy, NOW(),:lastPaymentId)");

                    $stmt5->bindParam(':instrumentOfPayment', $instrumentOfPayment);
                    $stmt5->bindParam(':numberOfInstrument', $numberOfInstrument);
                    $stmt5->bindParam(':bankName', $bankName);
                    $stmt5->bindParam(':branchName', $branchName);
                    $stmt5->bindParam(':lastPaymentId', $this->lastInsertedPaymentId);
                    $stmt5->bindParam(':createdBy', $userId);


                    $stmt6 = $connect->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id, `followup_title`,`assignEmployeeId`)
                                  VALUES (:followupDate,NOW(),:lastModifiedBy,:createdBy,NOW(),:lastEnrollmentId ,:followupTitle ,:assignEmployeeId)");

                    $stmt6->bindParam(':followupDate', $followupDate);
                    $stmt6->bindParam(':lastEnrollmentId', $this->lastInsertedEnrollmentId);
                    $stmt6->bindParam(':lastModifiedBy', $userId);
                    $stmt6->bindParam(':createdBy', $userId);
                    $stmt6->bindParam(':followupTitle', $data->followTitle);
                    $stmt6->bindParam(':assignEmployeeId', $data->followupemployeeId);



                    /* Update status of applicator */
                    $stmt8=$connect->prepare("UPDATE applicator_master set applicator_status='permanent' WHERE applicator_master_id=:lastCreatedApplicator");
                    $stmt8->bindParam(':lastCreatedApplicator',$this->lastInsertedApplicatorId);

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

                                                if($stmt8->execute()){
                                                    return true;
                                                }
                                                else{
                                                    return false;
                                                }
                                            }
                                            else{
                                                return false;
                                            }
                                        }
                                        if($stmt8->execute()){
                                            return true;
                                        }
                                        else{
                                            return false;
                                        }
                                    }
                                    else{
                                        return false;
                                    }
                                }
                                if($paymentReceived == 'No' && $paymentStatus == 'No'){

                                    if($data->isFollowup){
                                        if($stmt6->execute()){
                                            return true;

                                        }
                                        else{
                                            return false;
                                        }
                                    }else
                                        return true;

                                }
                                if($paymentReceived == 'Yes' && $paymentStatus == 'No'){


                                    if($stmt4->execute()){


                                        if($paymentMode!='cash'){

                                            $this->lastInsertedPaymentId=$connect->lastInsertId();

                                            if($stmt5->execute()){
                                                if($data->isFollowup){
                                                    if($stmt6->execute()){
                                                        return true;
                                                    }
                                                    else{
                                                        return false;
                                                    }
                                                }else
                                                    return true;

                                            }
                                            else{
                                                return false;
                                            }
                                        }
                                        else{

                                            if($data->isFollowup){
                                                if($stmt6->execute()){
                                                    return true;
                                                }
                                                else{
                                                    return false;
                                                }
                                            }

                                        }
                                    }
                                    else{
                                        return false;
                                    }
                                }
                            }
                            else{
                                return false;
                            }
                        }
                        else{
                           return false;
                        }
                    }
                    else{
                        return false;
                    }
                }


                public function viewTentativeApplicators($data){

                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $searchKeyword="";
                    $searchExpression="";
                    $json_response=array();

                    if(isset($data->searchExpression)) {
                        $searchExpression = $data->searchExpression;
                    }
                    if(isset($data->searchKeyword)) {
                        $searchKeyword = '%' . $data->searchKeyword . '%';
                    }
                    else{
                        $searchKeyword='%'."".'%';
                    }


                    if($searchExpression=='applicator_name'){

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='tentative' AND  applicator_name LIKE :searchKeyword");

                        $stmt1->bindParam(':searchKeyword',$searchKeyword);

                    }
                    else if ($searchExpression==='applicator_city'){

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='tentative' AND  applicator_city LIKE :searchKeyword");

                        $stmt1->bindParam(':searchKeyword',$searchKeyword);
                    }
                    else if($searchExpression=='applicator_state'){

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='tentative' AND  applicator_state LIKE :searchKeyword");

                        $stmt1->bindParam(':searchKeyword',$searchKeyword);
                    }
                    else{

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='tentative'");
                    }


                    if($stmt1->execute()){

                        while($result1=$stmt1->fetch()){

                            $applicator=array();
                            $applicator['applicator_master_id']=$result1['applicator_master_id'];
                            $applicator['applicator_name']=$result1['applicator_name'];
                            $applicator['applicator_contact']=$result1['applicator_contact'];
                            $applicator['applicator_city']=$result1['applicator_city'];
                            $applicator['applicator_state']=$result1['applicator_state'];

                            array_push($json_response, $applicator);
                        }

                        if(sizeof($json_response)>0){

                           echo AppUtil::getReturnStatus("success",$json_response);
                            return true;
                        }
                    }
                    else{

                        return false;
                    }


                }

                function getApplicatorDetails($data){


                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $applicator_master_id=$data->applicator_master_id;
                    $purpose=$data->purpose;

                    $applicator=array();


                    $stmt1=$connect->prepare("SELECT * FROM applicator_master JOIN applicator_pointof_contact ON
							applicator_master.applicator_master_id=applicator_pointof_contact.applicator_master_id
							WHERE applicator_master.applicator_master_id=:applicator_id");

                    $stmt1->bindParam(':applicator_id',$applicator_master_id);

                    if($stmt1->execute()){

                            $result1=$stmt1->fetch();

                            if($purpose==='toView'){

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
                                        $applicator['package_total_amount']=0;
                                        $applicator['total_paid_amount']=0;


                                        $stmt2=$connect->prepare("SELECT * FROM applicator_enrollment WHERE applicator_master_id=:applicator_id");
                                        $stmt2->bindParam(':applicator_id',$applicator_master_id);
                                        $stmt2->execute();
                                        $result2=$stmt2->fetch();

                                        $enrollment_id=$result2['enrollment_id'];
                                        $payment_package_id=$result2['payment_package_id'];


                                        $stmt3=$connect->prepare("SELECT * FROM payment_package_master WHERE payment_package_id=:payment_package_id");
                                        $stmt3->bindParam(':payment_package_id',$payment_package_id);
                                        $stmt3->execute();
                                        $result3 = $stmt3->fetch();

                                        $applicator['package_name'] = $result3['package_name'];
                                        $applicator['package_description'] = $result3['package_description'];

                                        $stmt4 = $connect->prepare("SELECT * FROM payment_package_details WHERE payment_package_id=:payment_package_id");
                                        $stmt4->bindParam(':payment_package_id', $payment_package_id);
                                        $stmt4->execute();

                                            while ($result4 = $stmt4->fetch(PDO::FETCH_ASSOC)) {

                                                    $applicator['elementDetails'][] = array(
                                                                                            'element_name' => $result4['package_element_name'],
                                                                                            'element_quantity' => $result4['package_element_quantity'],
                                                                                            'element_rate' => $result4['package_element_rate'],
                                                                                            'element_amount' => $result4['package_element_amount']
                                                                                         );
                                                $applicator['package_total_amount'] += $result4['package_element_amount'];

                                            }

                                        $stmt5=$connect->prepare("SELECT * FROM applicator_payment_info WHERE enrollment_id=:enrollment_id");
                                        $stmt5->bindParam(':enrollment_id',$enrollment_id);
                                        $stmt5->execute();

                                         $affectedRow = $stmt5->rowCount();

                                        if($affectedRow!=0){

                                            while($result5=$stmt5->fetch(PDO::FETCH_ASSOC)){

                                                $stmt6=$connect->prepare("SELECT number_of_instrument, bank_name,branch_name FROM payment_mode_details WHERE payment_id=:paymentId");
                                                $stmt6->bindParam(':paymentId',$result5['payment_id']);

                                                if($stmt6->execute()) {

                                                    $affectedRow1=$stmt6->rowCount();
                                                    if($affectedRow1!=0){

                                                        $result6=$stmt6->fetch();
                                                        $applicator['paymentDetails'][] = array(
                                                            'amount_paid' => $result5['amount_paid'],
                                                            'date_of_payment' => $result5['date_of_payment'],
                                                            'paid_to' => $result5['paid_to'],
                                                            'payment_mode' => $result5['payment_mode'],
                                                            'bank_name'=>$result6['bank_name'],
                                                            'branch_name'=>$result6['branch_name'],
                                                            'unique_number'=>$result6['number_of_instrument']
                                                        );
                                                    }
                                                    else{

                                                        $applicator['paymentDetails'][] = array(
                                                            'amount_paid' => $result5['amount_paid'],
                                                            'date_of_payment' => $result5['date_of_payment'],
                                                            'paid_to' => $result5['paid_to'],
                                                            'payment_mode' => $result5['payment_mode'],
                                                            'bank_name'=>'-',
                                                            'branch_name'=>'-',
                                                            'unique_number'=>'-'
                                                        );
                                                    }
                                                    $applicator['total_paid_amount']+=$result5['amount_paid'];
                                                }
                                            }
                                        }
                                        else{

                                            $applicator['paymentDetails'][] = array(
                                                                            'amount_paid' =>'-',
                                                                            'date_of_payment' => '-',
                                                                            'paid_to' => '-',
                                                                            'payment_mode' => '-',
                                                                            'bank_name'=>'-',
                                                                            'branch_name'=>'-',
                                                                            'unique_number'=>'-'
                                                                        );
                                        }


                                    $stmt7=$connect->prepare("SELECT * FROM applicator_follow_up WHERE enrollment_id=:enrollment_id");
                                    $stmt7->bindParam(':enrollment_id',$enrollment_id);
                                    $stmt7->execute();
                                    $result7=$stmt7->fetch(PDO::FETCH_ASSOC);
                                    $applicator['date_of_follow_up']=$result7['date_of_follow_up'];
                                    $applicator['remaining_amount']=$applicator['package_total_amount']-$applicator['total_paid_amount'];

                                    echo json_encode($applicator);


                            }
                          else if($purpose==='toModify'){

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

                              echo json_encode($applicator);

                          }

                    }



                }
                public function viewPermanentApplicators($data){

                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $searchKeyword="";
                    $searchExpression="";
                    $json_response=array();

                    if(isset($data->searchExpression)) {
                        $searchExpression = $data->searchExpression;
                    }
                    if(isset($data->searchKeyword)) {
                        $searchKeyword = '%' . $data->searchKeyword . '%';
                    }
                    else{
                        $searchKeyword='%'."".'%';
                    }

                    if($searchExpression=='applicator_name'){

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='permanent' AND  applicator_name LIKE :searchKeyword");

                        $stmt1->bindParam(':searchKeyword',$searchKeyword);


                    }
                    else if ($searchExpression==='applicator_city'){

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='permanent' AND  applicator_city LIKE :searchKeyword");

                        $stmt1->bindParam(':searchKeyword',$searchKeyword);
                    }
                    else if($searchExpression=='applicator_state'){

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='permanent' AND  applicator_state LIKE :searchKeyword");

                        $stmt1->bindParam(':searchKeyword',$searchKeyword);
                    }
                    else{

                        $stmt1=$connect->prepare("SELECT * FROM applicator_master
							WHERE applicator_status='permanent'");
                    }

                    if($stmt1->execute()){

                        while($result1=$stmt1->fetch()){

                            $applicator=array();
                            $applicator['applicator_master_id']=$result1['applicator_master_id'];
                            $applicator['applicator_name']=$result1['applicator_name'];
                            $applicator['applicator_contact']=$result1['applicator_contact'];
                            $applicator['applicator_city']=$result1['applicator_city'];
                            $applicator['applicator_state']=$result1['applicator_state'];

                            array_push($json_response, $applicator);
                        }

                        if(sizeof($json_response)>0){
                            echo AppUtil::getReturnStatus("success",$json_response);
                            return true;
                        }
                        else{
                            return false;
                        }
                    }

                    return false;

                }
                public function getApplicatorPaymentDetails(){

                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $response_array=array();

                    $stmt1=$connect->prepare("SELECT * FROM applicator_enrollment
							JOIN applicator_master ON
							applicator_enrollment.applicator_master_id=applicator_master.applicator_master_id
							WHERE applicator_enrollment.payment_status='No' AND applicator_master.applicator_status='tentative'");

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

                public function savePaymentDetails($data,$userId){

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
	       								VALUES (:enrollment_id,:amountPaid,:dateOfPayment,:amountPaidTo,:paymentMode,:createdBy, NOW())");

                    $stmt2->bindParam(':enrollment_id',$enrollment_id);
                    $stmt2->bindParam(':amountPaid',$amountPaid);
                    $stmt2->bindParam(':dateOfPayment', $dateOfPayment);
                    $stmt2->bindParam(':amountPaidTo', $amountPaidTo);
                    $stmt2->bindParam(':paymentMode', $paymentMode);
                    $stmt2->bindParam(':createdBy', $userId);


                    $stmt3 = $connect->prepare("INSERT INTO payment_mode_details(instrument_of_payment,number_of_instrument,bank_name,branch_name,created_by,creation_date,payment_id)
	       								VALUES (:instrumentOfPayment,:numberOfInstrument,:bankName,:branchName,:createdBy, NOW(),:lastPaymentId)");

                    $stmt3->bindParam(':instrumentOfPayment', $instrumentOfPayment);
                    $stmt3->bindParam(':numberOfInstrument', $numberOfInstrument);
                    $stmt3->bindParam(':bankName', $bankName);
                    $stmt3->bindParam(':branchName', $branchName);
                    $stmt3->bindParam(':lastPaymentId', $this->lastInsertedPaymentId);
                    $stmt2->bindParam(':createdBy', $userId);



                    $stmt4 = $connect->prepare("INSERT INTO applicator_follow_up(date_of_follow_up,last_modification_date,last_modified_by,created_by,creation_date,enrollment_id, `followup_title`,`assignEmployeeId`)
                                  VALUES (:followupDate,NOW(),:lastModifiedBy,:createdBy,NOW(),:lastEnrollmentId ,:followupTitle ,:assignEmployeeId)");

                    $stmt4->bindParam(':followupDate', $followupDate);
                    $stmt4->bindParam(':lastEnrollmentId', $enrollment_id);
                    $stmt4->bindParam(':lastModifiedBy', $userId);
                    $stmt4->bindParam(':createdBy', $userId);
                    $stmt4->bindParam(':followupTitle', $data->followTitle);
                    $stmt4->bindParam(':assignEmployeeId', $data->followupemployeeId);


                    $stmt6=$connect->prepare("SELECT  applicator_master_id FROM applicator_enrollment WHERE enrollment_id=:enrollmentID ");
                    $stmt6->bindParam(':enrollmentID',$enrollment_id);

                    $stmt6->execute();
                    $result=$stmt6->fetch();
                    $applicator_master_id=$result['applicator_master_id'];

                    /* Update status of applicator */
                    $stmt7=$connect->prepare("UPDATE applicator_master set applicator_status='permanent',last_modified_by=:lastModifiedBy WHERE applicator_master_id=:applicator_id");
                    $stmt7->bindParam(':applicator_id',$applicator_master_id);
                    $stmt7->bindParam(':lastModifiedBy', $userId);

                    if($paymentStatus=='Yes') {

                        if($stmt1->execute()){

                            if($stmt2->execute()){

                                $this->lastInsertedPaymentId=$connect->lastInsertId();

                                if($paymentMode!='cash'){

                                    if($stmt3->execute()){


                                        if($stmt7->execute()){

                                            return true;
                                        }
                                        else{

                                            return false;
                                        }


                                    }
                                    else{

                                        return false;
                                    }

                                }
                                else{

                                    if($stmt7->execute()){

                                        return true;
                                    }
                                    else{

                                        return false;
                                    }
                                }

                            }
                            else{

                                return false;
                            }
                        }
                        else{

                            return false;
                        }

                    }


                if($paymentStatus=='No'){

                        if($stmt1->execute()){

                            if($stmt2->execute()){

                                $this->lastInsertedPaymentId=$connect->lastInsertId();

                                if($paymentMode!='cash'){

                                    if($stmt3->execute()){

                                        if($data->isFollowup){
                                            if($stmt4->execute()){
                                                return true;
                                            }
                                            else{
                                                return false;
                                            }

                                        }

                                                                            }
                                    else{
                                        return false;
                                    }
                                }
                                else{

                                    if($data->isFollowup){
                                        if($stmt4->execute()){
                                            return true;
                                        }
                                        else{
                                            return false;
                                        }
                                    }

                                }
                            }
                            else{
                                return false;
                            }
                        }
                       else{
                           return false;
                       }
                    }
                    return false;
                }

                public function modifyApplicatorDetails($data,$userId){

                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $applicatorMasterId=$data->applicator_master_id;
                    $applicatorName = $data->applicator_name;
                    $applicatorContactNo = $data->applicator_contact;
                    $applicatorAddressLine1 = $data->applicator_address_line1;
                    $applicatorAddressLine2 = $data->applicator_address_line2;
                    $applicatorCountry = $data->applicator_country;
                    $applicatorState = $data->applicator_state;
                    $applicatorCity = $data->applicator_city;
                    $applicatorVatNumber = $data->applicator_vat_number;
                    $applicatorCstNumber = $data->applicator_cst_number;
                    $applicatorServiceTaxNumber = $data->applicator_stax_number;
                    $applicatorPanNumber = $data->applicator_pan_number;
                    $pointOfContact = $data->point_of_contact;
                    $pointContactNo = $data->point_of_contact_no;

                    $stmt1=$connect->prepare("UPDATE applicator_master SET
                                              applicator_name=:applicatorName,
                                              applicator_contact=:applicatorContactNo,
                                              applicator_contact=:applicatorContactNo,
                                              applicator_address_line1=:applicatorAddressLine1,
                                              applicator_address_line2=:applicatorAddressLine2,
                                              applicator_city=:applicatorCity,
                                              applicator_state=:applicatorState,
                                              applicator_country=:applicatorCountry,
                                              applicator_vat_number=:vatNumber,
                                              applicator_cst_number=:cstNumber,
                                              applicator_stax_number=:staxNumber,
                                              applicator_pan_number=:panNumber,
                                              last_modified_by=:lastModifiedBy
                                              WHERE applicator_master_id=:applicatorMasterId");


                    $stmt1->bindParam(':applicatorMasterId', $applicatorMasterId);
                    $stmt1->bindParam(':applicatorName', $applicatorName);
                    $stmt1->bindParam(':applicatorContactNo', $applicatorContactNo);
                    $stmt1->bindParam(':applicatorAddressLine1', $applicatorAddressLine1);
                    $stmt1->bindParam(':applicatorAddressLine2', $applicatorAddressLine2);
                    $stmt1->bindParam(':applicatorCity', $applicatorCity);
                    $stmt1->bindParam(':applicatorState', $applicatorState);
                    $stmt1->bindParam(':applicatorCountry', $applicatorCountry);
                    $stmt1->bindParam(':vatNumber', $applicatorVatNumber);
                    $stmt1->bindParam(':cstNumber', $applicatorCstNumber);
                    $stmt1->bindParam(':staxNumber', $applicatorServiceTaxNumber);
                    $stmt1->bindParam(':panNumber', $applicatorPanNumber);
                    $stmt1->bindParam(':lastModifiedBy', $userId);


                    $stmt2=$connect->prepare("UPDATE applicator_pointof_contact SET
                                               point_of_contact=:pointOfContact,
                                               point_of_contact_no=:pointContactNo,
                                              last_modified_by=:lastModifiedBy
                                              WHERE applicator_master_id=:applicatorMasterId
                                             ");
                    $stmt2->bindParam(':applicatorMasterId', $applicatorMasterId);
                    $stmt2->bindParam(':pointOfContact', $pointOfContact);
                    $stmt2->bindParam(':pointContactNo', $pointContactNo);
                    $stmt2->bindParam(':lastModifiedBy', $userId);

                     if($stmt1->execute()){
                          if($stmt2->execute()){
                              return true;
                          }
                         else{
                              return false;
                         }
                     }
                    else{
                        return false;
                    }
                }
                public function deletePackage($data,$userId){


                    $db = Database::getInstance();
                    $connect = $db->getConnection();
                    $packageId=$data->package_id;

                    $stmt=$connect->prepare("UPDATE payment_package_master SET is_deleted='1',
                                              deleted_by=:deletedBy,
                                              deletion_date=NOW()
                                              WHERE payment_package_id=:packageId");
                    $stmt->bindParam(':packageId',$packageId);
                    $stmt->bindParam(':deletedBy',$userId);

                    if($stmt->execute()){
                        return true;
                    }
                    else{
                        return false;
                    }

                }
            }

?>