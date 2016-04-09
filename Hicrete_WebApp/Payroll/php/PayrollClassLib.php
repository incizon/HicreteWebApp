<?php


        require_once ("../../php/Database.php");
        require_once ("../../php/appUtil.php");
        include_once "../../php/HicreteLogger.php";

        class Payroll{

                public function createYear($data,$userId){


                    $db = Database::getInstance();
                    $connect = $db->getConnection();
                    HicreteLogger::logInfo("creating Year");

                    $captionYear=$data->caption;

                    $date1 = new DateTime($data->startDate);
                    $fromDate = $date1->format('Y-m-d');

                    $date2 = new DateTime($data->endDate);
                    $toDate = $date2->format('Y-m-d');


                    $noOfPaidLeaves=$data->paidLeaves;
                    $weeklyOff=$data->weeklyOff;

                    if($weeklyOff){
                        $weeklyOffDay=$data->weeklyoffDay;
                    }
                    else{
                        $weeklyOffDay="null";
                    }
                    try {
                        $stmt = $connect->prepare(" Select count(*) from attendance_year WHERE to_date>=:toDate");
                        $stmt->bindParam(':toDate', $toDate);
                        HicreteLogger::logDebug("query: \n".json_encode($stmt));
                        $stmt->execute();
                        $result = $stmt->fetch();
                        $count = $result[0];
                        HicreteLogger::logDebug("Count fetched by query: ".$count);
                        if ($count > 0) {

                            return 2;
                        } else {
                            HicreteLogger::logInfo("inserting year");
                            $stmt1 = $connect->prepare("INSERT INTO attendance_year(caption_of_year,from_date,to_date,no_of_paid_leaves,weekly_off_day,created_by,creation_date)
						     VALUES (:captionYear,:fromDate,:toDate,:noOfPaidLeaves,:weeklyOffDay,:createdBy,NOW())");

                            $stmt1->bindParam(':captionYear', $captionYear);
                            $stmt1->bindParam(':fromDate', $fromDate);
                            $stmt1->bindParam(':toDate', $toDate);
                            $stmt1->bindParam(':noOfPaidLeaves', $noOfPaidLeaves);
                            $stmt1->bindParam(':weeklyOffDay', $weeklyOffDay);
                            $stmt1->bindParam(':createdBy', $userId);

                            HicreteLogger::logDebug("query: \n".json_encode($stmt1));
                            HicreteLogger::logDebug("Data: \n".json_encode($data));
                            if ($stmt1->execute()) {
                                HicreteLogger::logInfo("insertion of year successfull");
                                $isComplete = 1;
                                $endDate = strtotime($toDate);
                                for ($i = strtotime($weeklyOffDay, strtotime($fromDate)); $i <= $endDate; $i = strtotime('+1 week', $i)) {
                                    HicreteLogger::logInfo("inserting weekly off");
                                    $stmt2 = $connect->prepare("INSERT INTO `weekly_off_in_year`(`caption_of_year`, `weekly_off_date`) VALUES (:caption,:offDate)");
                                    $stmt2->bindParam(':caption', $captionYear);
                                    $date = new DateTime(date('Y-m-d', $i));
                                    $nxtDate = $date->format('Y-m-d');

                                    $stmt2->bindParam(':offDate', $nxtDate);
                                    HicreteLogger::logDebug("query: \n".json_encode($stmt2));
                                    HicreteLogger::logDebug("Data: \n".json_encode($data));
                                    if (!$stmt2->execute()) {
                                        HicreteLogger::logError("Creating Year Failed");
                                        $isComplete = 0;
                                        break;
                                    }
                                }
                                return $isComplete;
                            } else {
                                HicreteLogger::logError("Creating Year Failed");
                                return 0;
                            }
                        }
                    }
                    catch(Exception $e){
                        HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                        echo AppUtil::getReturnStatus("failure","Exception Occur While Creating Year");
                    }
                }

                public function getCurrentYearHolidayDetails(){


                    $db = Database::getInstance();
                    $connect = $db->getConnection();
                    HicreteLogger::logInfo("Getting current holiday details");
                    $result_array=array();
                    $result_array['holidaysList']=array();
                        $stmt1=$connect->prepare("SELECT caption_of_year,from_date,to_date FROM attendance_year WHERE CURRENT_DATE () BETWEEN  from_date AND to_date");
                        HicreteLogger::logDebug("query: \n".json_encode($stmt1));
                        if($stmt1->execute()){
                            HicreteLogger::logDebug("Row Count: \n".$stmt1->rowCount());
                            $result1=$stmt1->fetch(PDO::FETCH_ASSOC);
                            $result_array['caption_of_year']=$result1['caption_of_year'];
                            $result_array['from_date']=$result1['from_date'];
                            $result_array['to_date']=$result1['to_date'];
                            $captionYear = $result1['caption_of_year'];
                            $stmt2=$connect->prepare("SELECT * FROM holiday_in_year WHERE caption_of_year=:captionYear");
                            $stmt2->bindParam(':captionYear',$captionYear);
                            HicreteLogger::logDebug("query: \n".json_encode($stmt2));
                            if($stmt2->execute()){
                                HicreteLogger::logDebug("Row Count: \n".$stmt2->rowCount());
                                $holidaysList=array();
                                while($result2=$stmt2->fetch(PDO::FETCH_ASSOC)){
                                        $holidaysList['holiday_date']=$result2['holiday_date'];
                                        $holidaysList['description']=$result2['description'];
                                        $holidaysList['creation_date']=$result2['creation_date'];
                                        $stmt3=$connect->prepare("SELECT firstName,lastName from usermaster WHERE userId='$result2[created_by]'");

                                        if($stmt3->execute()){
                                            $result3=$stmt3->fetch(PDO::FETCH_ASSOC);
                                            $holidaysList['created_by']=$result3['firstName']." ".$result3['lastName'];
                                        }
                                        array_push($result_array['holidaysList'],$holidaysList);
                                }
                            }

                            if(sizeof($result_array)>0){
                                HicreteLogger::logInfo("Current holiday details fetched successfully");
                                echo AppUtil::getReturnStatus("success",$result_array);
                            }
                            else{
                                HicreteLogger::logError("Current holiday details not fetched");
                                echo AppUtil::getReturnStatus("failure","Holidays Details Not Available");
                            }
                        }
                    else{
                        HicreteLogger::logError("Current holiday details not Available");
                        echo AppUtil::getReturnStatus("failure","Holidays Details Not Available");
                    }



            }

                public function createHoliday($data,$userId){

                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $captionYear=$data->caption_of_year;

                    $date1 = new DateTime($data->holidayDate);
                    $holidayDate = $date1->format('Y-m-d');
                    HicreteLogger::logInfo("Creating holiday");
                    $description=$data->description;
                    try {
                        $stmt1 = $connect->prepare("INSERT INTO holiday_in_year(caption_of_year,holiday_date,description,created_by,creation_date)
						     VALUES (:captionYear,:holidayDate,:description,:createdBy,NOW())");

                        $stmt1->bindParam(':captionYear', $captionYear);
                        $stmt1->bindParam(':holidayDate', $holidayDate);
                        $stmt1->bindParam(':description', $description);
                        $stmt1->bindParam(':createdBy', $userId);

                        HicreteLogger::logDebug("query: \n".json_encode($stmt1));
                        HicreteLogger::logDebug("Data: \n".json_encode($data));
                        if ($stmt1->execute()) {
                            HicreteLogger::logInfo("Holiday creation Successful ");
                            return true;
                        } else {
                            HicreteLogger::logError("Holiday creation failed ");
                            return false;
                        }
                    }
                    catch(Exception $e){
                        HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                        echo AppUtil::getReturnStatus("failure","Exception occur while creating holiday");
                    }
                }

            public function removeHoliday($data){

                $db = Database::getInstance();
                $connect = $db->getConnection();
                HicreteLogger::logInfo("Removing holidays");
                    $holidayDate=$data->holiday_date;

                try{
                    $stmt1=$connect->prepare("DELETE FROM holiday_in_year WHERE holiday_date=:holidayDate");
                    $stmt1->bindParam('holidayDate',$holidayDate);
                    HicreteLogger::logDebug("query: \n".json_encode($stmt1));
                    HicreteLogger::logDebug("Data: \n".json_encode($holidayDate));
                    if($stmt1->execute())
                    {
                        HicreteLogger::logInfo("Holiday removal successful ");
                        return true;
                    }
                    else{
                        HicreteLogger::logError("Holiday removal failed ");
                        return false;
                    }
                }
                catch(Exception $e){
                    HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                    echo AppUtil::getReturnStatus("failure","Exception occur while removing holiday");
                }
            }

            public function createLeave($data){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $applicationId=AppUtil::generateId();

                $leaveAppliedBy=$data->userId;
                $date1 = new DateTime($data->fromDate);
                $fromDate = $date1->format('Y-m-d');

                $date2 = new DateTime($data->toDate);
                $toDate = $date2->format('Y-m-d');

                $noOfLeaves=$data->numberOfLeaves;
                $typeOfLeave=$data->typeofLeave;
                $reason=$data->description;
                $status=$data->status;
                $actionDate="null";
                $actionBy="null";
                HicreteLogger::logInfo("Creating leaves");
                try {
                    $stmt1 = $connect->prepare("INSERT INTO leave_application_master(application_id,leave_applied_by,from_date,to_date,type_of_leaves,no_of_leaves,reason,status,application_date,action_by,action_date)
                                        VALUES(:applicationId,:leaveAppliedBy,:fromDate,:toDate,:type_of_leaves,:no_of_leaves,:reason,:status,NOW(),:actionBy,:actionDate)");


                    $stmt1->bindParam(':applicationId', $applicationId);
                    $stmt1->bindParam(':leaveAppliedBy', $leaveAppliedBy);
                    $stmt1->bindParam(':fromDate', $fromDate);
                    $stmt1->bindParam('toDate', $toDate);
                    $stmt1->bindParam('type_of_leaves', $typeOfLeave);
                    $stmt1->bindParam('no_of_leaves', $noOfLeaves);
                    $stmt1->bindParam(':reason', $reason);
                    $stmt1->bindParam(':status', $status);
                    $stmt1->bindParam(':actionDate', $actionDate);
                    $stmt1->bindParam(':actionBy', $actionBy);

                    HicreteLogger::logDebug("query: \n".json_encode($stmt1));
                    HicreteLogger::logDebug("Data: \n".json_encode($data));
                    if ($stmt1->execute()) {
                        HicreteLogger::logInfo("Creation of leaves successful ");
                        return true;
                    } else {
                        HicreteLogger::logError("Creation of leaves failed ");
                        return false;

                    }
                }
                catch(Exception $e){
                    HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                    $message = "Exception Occur While Creating Leave...!!!";
                    $arr = array('msg' => '', 'error' => $message);
                    $jsn = json_encode($arr);
                    echo($jsn);
                }
            }

            public function getEmployeeDetails(){

                HicreteLogger::logInfo("Getting employee details");
                $db = Database::getInstance();
                $connect = $db->getConnection();

                $result_array=array();

                $stmt1=$connect->prepare("SELECT userId,firstName,lastName FROM usermaster WHERE usermaster.userId NOT IN (SELECT employee_id FROM employee_on_payroll)");

                HicreteLogger::logDebug("query: \n".json_encode($stmt1));

                if($stmt1->execute()){
                    HicreteLogger::logDebug(" Row Count: \n".json_encode($stmt1->rowCount()));
                    $result1=$stmt1->fetchAll(PDO::FETCH_ASSOC);
                    $result_array['EmployeeDetails']=$result1;

                }

                $stmt2=$connect->prepare("SELECT userId,firstName,lastName FROM usermaster");
                HicreteLogger::logDebug("query: \n".json_encode($stmt2));
                if($stmt2->execute()){
                    HicreteLogger::logDebug(" Row Count: \n".json_encode($stmt2->rowCount()));
                    $result2=$stmt2->fetchAll(PDO::FETCH_ASSOC);
                    $result_array['LeaveApprover']=$result2;
                }
                echo json_encode($result_array);


            }

            public function addEmployeeToPayroll($data,$userId){

                $db = Database::getInstance();
                $connect = $db->getConnection();
                try {
                    for ($index = 0; $index < sizeof($data); $index++) {

                        $employeeId = $data->employee[$index]->userId;
                        $approverId = $data->employee[$index]->approverId;

                        $stmt1 = $connect->prepare("INSERT INTO employee_on_payroll(employee_id,leave_approver_id,created_by,creation_date,last_modified_by,last_modification_date)
							  VALUES (:employeeId ,:approverId ,:createdBy ,NOW(),:modifiedBy,NOW())");
                        $stmt1->bindParam(':employeeId', $employeeId);
                        $stmt1->bindParam(':approverId', $approverId);
                        $stmt1->bindParam(':createdBy', $userId);
                        $stmt1->bindParam(':modifiedBy', $userId);
                        HicreteLogger::logDebug("query: \n".json_encode($stmt1));
                        HicreteLogger::logDebug("Data: \n".json_encode($data));
                        if (!$stmt1->execute()) {
                            HicreteLogger::logError("Insertion failed");
                            return false;
                        }

                    }
                    HicreteLogger::logInfo("Employees added to payroll ");
                    return true;
                }
                catch(Exception $e)
                {
                    HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                    return false;
                }
            }

            public  function getEmployeeDetailsForLeave($userId){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $result_array=array();
                HicreteLogger::logInfo("Getting employee details for leave ");
                $stmt1=$connect->prepare("SELECT leave_approver_id FROM employee_on_payroll WHERE employee_id=:userId ");
                $stmt1->bindParam(':userId',$userId);
                HicreteLogger::logDebug("query: \n".json_encode($stmt1));

                $stmt1->execute();
                HicreteLogger::logDebug("Row count: ".$stmt1->rowCount());
                $result1=$stmt1->fetch(PDO::FETCH_ASSOC);
                $approverId=$result1['leave_approver_id'];

                $stmt2=$connect->prepare("SELECT firstName,lastName FROM userMaster WHERE userId='$approverId'");
                HicreteLogger::logDebug("query: \n".json_encode($stmt2));
                $stmt2->execute();
                HicreteLogger::logDebug("Row count: ".$stmt2->rowCount());
                $result2=$stmt2->fetch(PDO::FETCH_ASSOC);
                $result_array['approverName']=$result2['firstName']." ".$result2['lastName'];

                $stmt3=$connect->prepare("SELECT userId,firstName,lastName FROM userMaster WHERE userId=:userId");
                $stmt3->bindParam(':userId',$userId);
                HicreteLogger::logDebug("query: \n".json_encode($stmt3));
                $stmt3->execute();
                HicreteLogger::logDebug("Row count: ".$stmt3->rowCount());
                $result3=$stmt3->fetch(PDO::FETCH_ASSOC);

                $result_array['userId']=$result3['userId'];
                $userId=$result3['userId'];
                $result_array['employeeName']=$result3['firstName']." ".$result3['lastName'];

                $date=date('Y-m-d');

                $stmt4=$connect->prepare("SELECT caption_of_year FROM attendance_year WHERE from_date<=:currentDate AND to_date>=:currentDate");

                $stmt4->bindParam(':currentDate',$date);
                HicreteLogger::logDebug("query: \n".json_encode($stmt4));
                $stmt4->execute();
                HicreteLogger::logDebug("Row count: ".$stmt4->rowCount());
                $result4=$stmt4->fetch(PDO::FETCH_ASSOC);
                $result_array['caption_of_year']=$result4['caption_of_year'];
                $captionYear=$result4['caption_of_year'];

                $stmt5=$connect->prepare("SELECT (`attendance_year`.`no_of_paid_leaves`- SUM(`leave_application_master`.`no_of_leaves`)) FROM `leave_application_master`,`attendance_year` WHERE (`leave_application_master`.`from_date`>=`attendance_year`.`from_date` AND `leave_application_master`.`to_date`<=`attendance_year`.`to_date`) AND `attendance_year`.`caption_of_year`=:captionYear
                                                  AND `leave_application_master`.`status`!='cancel' AND
                                                   `leave_application_master`.`leave_applied_by`=:userId
                                                    AND `leave_application_master`.`type_of_leaves`='paid'
                                                     group by `leave_application_master`.`leave_applied_by`");

                $stmt5->bindParam(':userId',$userId);
                $stmt5->bindParam(':captionYear',$captionYear);
                HicreteLogger::logDebug("query: \n".json_encode($stmt5));
                $stmt5->execute();
                HicreteLogger::logDebug("Row count: ".$stmt5->rowCount());
                $result5=$stmt5->fetch();
                $result_array['leaves_remaining']=$result5[0];
                echo  json_encode($result_array);

            }


            public function getNoOfLeaves($data){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $date1 = new DateTime($data->fromDate);
                $fromDate = $date1->format('Y-m-d');
                $date2 = new DateTime($data->toDate);
                $toDate = $date2->format('Y-m-d');

                $caption=$data->caption_of_year;

                $dateDifference=$date2->diff($date1,true)->days;

                try {
                    $stmt1 = $connect->prepare("SELECT count(*) FROM `weekly_off_in_year` WHERE (`weekly_off_date` BETWEEN :fromDate AND :toDate)
                                          AND `caption_of_year`=:caption");

                    $stmt1->bindParam(':fromDate', $fromDate);
                    $stmt1->bindParam(':toDate', $toDate);
                    $stmt1->bindParam(':caption', $caption);
                    HicreteLogger::logDebug("query: \n" . json_encode($stmt1));
                    $stmt1->execute();
                    HicreteLogger::logDebug("Row count: " . $stmt1->rowCount());
                    $result1 = $stmt1->fetch();
                    $resultdays1 = $result1[0];

                    $stmt2 = $connect->prepare("SELECT count(*) FROM `holiday_in_year` WHERE (`holiday_date` BETWEEN :fromDate AND :toDate) AND `caption_of_year`=:caption");

                    $stmt2->bindParam(':fromDate', $fromDate);
                    $stmt2->bindParam(':toDate', $toDate);
                    $stmt2->bindParam(':caption', $caption);
                    HicreteLogger::logDebug("query: \n" . json_encode($stmt2));
                    $stmt2->execute();
                    HicreteLogger::logDebug("Row count: " . $stmt2->rowCount());
                    $result2 = $stmt2->fetch();
                    $resultdays2 = $result2[0];

                    $numberOfDays = $resultdays1 + $resultdays2;
                    $numberOfLeaves = $dateDifference - $numberOfDays;

                    if ($numberOfLeaves <= 0) {
                        $numberOfLeaves = 0;
                        echo json_encode($numberOfLeaves);
                    } else {
                        echo json_encode($numberOfLeaves);
                    }

                }
                catch(Exception $e)
                {
                    HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                }

            }
            public function getLeaveDetails($data,$userId){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $json_response=array();
                HicreteLogger::logInfo("Getting Leave details");
                if(!empty($data->fromDate) && !empty($data->toDate)){
                    $date1 = new DateTime($data->fromDate);
                    $fromDate = $date1->format('Y-m-d');
                    //echo "\n".$fromDate;
                    $date2 = new DateTime($data->toDate);
                    $toDate = $date2->format('Y-m-d');
                    //echo "\n".$toDate;
                    //echo "\n".$userId;
                    $stmt1=$connect->prepare("SELECT application_id,from_date,to_date,type_of_leaves,reason,status,application_date FROM leave_application_master WHERE from_date >= :fromDate AND to_date <= :toDate AND leave_applied_by=:userId");

                    $stmt1->bindParam(':userId',$userId);
                    $stmt1->bindParam(':fromDate',$fromDate);
                    $stmt1->bindParam(':toDate',$toDate);
                }
                else{
                    $stmt1=$connect->prepare("SELECT application_id,from_date,to_date,type_of_leaves,reason,status,application_date FROM leave_application_master WHERE leave_applied_by=:userId");
                    $stmt1->bindParam(':userId',$userId);
                }
                HicreteLogger::logDebug("query: \n" . json_encode($stmt1));
                if($stmt1->execute()){
                    HicreteLogger::logDebug("Row count: " . $stmt1->rowCount());
                    while($result1=$stmt1->fetch(PDO::FETCH_ASSOC)){

                        $leaves=array();
                        $leaves['from_date']=$result1['from_date'];
                        $leaves['to_date']=$result1['to_date'];
                        $leaves['type_of_leaves']=$result1['type_of_leaves'];
                        $leaves['reason']=$result1['reason'];
                        $leaves['status']=$result1['status'];
                        $leaves['application_date']=$result1['application_date'];
                        $leaves['application_id']=$result1['application_id'];

                        array_push($json_response, $leaves);
                    }

                    if(sizeof($json_response)>0){
                        HicreteLogger::logInfo("Leave details found successfully");
                        echo AppUtil::getReturnStatus("success",$json_response);
                        return true;
                    }
                }
                else{
                    HicreteLogger::logError("Leave details not found");
                    return false;
                }


            }
             public function changeLeaveStatus($data){

                 $applicationId=$data->applicationId;

                 $db = Database::getInstance();
                 $connect = $db->getConnection();
                 HicreteLogger::logInfo("Changing leave status");
                 try{
                 $stmt1=$connect->prepare("UPDATE leave_application_master
                                            SET status='cancel'
                                            WHERE application_id=:applicationId
                                          ");
                 $stmt1->bindParam(':applicationId',$applicationId);
                     HicreteLogger::logDebug("query: \n" . json_encode($stmt1));
                     HicreteLogger::logDebug("Data : \n" . json_encode($data));
                      if($stmt1->execute()){
                          HicreteLogger::logInfo("Leave Status changed successfully");
                          $message="Leave Status Changed Successfully";
                          echo AppUtil::getReturnStatus("success",$message);
                          return true;
                      }
                     else{
                         HicreteLogger::logError("Leave Status change failed");
                          return false;
                     }
                 }
                 catch(Exception $e){
                     HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                     echo AppUtil::getReturnStatus("fail","Exception Occur while Changing Canceling Leave");
                 }
             }

            public function getYears(){

                $db = Database::getInstance();
                $connect = $db->getConnection();
                HicreteLogger::logInfo("Getting year failed");
                try {
                    $stmt = $connect->prepare("SELECT caption_of_year FROM attendance_year ");
                    HicreteLogger::logDebug("query: \n" . json_encode($stmt));
                    if ($stmt->execute()) {
                        HicreteLogger::logInfo("Getting year failed");
                        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
                        return true;
                    }
                }
                catch(Exception $e){
                    HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                    echo AppUtil::getReturnStatus("fail","Exception Occur While Getting Years");
                }
            }

            public function searchLeaveByDate($data){

                $db = Database::getInstance();
                $connect = $db->getConnection();
                $json_response=array();
                HicreteLogger::logInfo("searching leave by date");
                $searchBy=$data->searchBy;
                if($searchBy==="Year"){
                    if(isset($data->year)) {
                        $year = $data->year;
                        if (isset($data->month)) {
                            $month = $data->month;
                            $stmt1 = $connect->prepare("SELECT * FROM `leave_application_master`,`attendance_year` WHERE (`leave_application_master`.`from_date`>=`attendance_year`.`from_date` AND `leave_application_master`.`to_date`<=`attendance_year`.`to_date`) AND `attendance_year`.`caption_of_year`='$year' AND DATE_FORMAT(`leave_application_master`.`from_date`, '%m') = '$month'");
                        } else {
                            $stmt1 = $connect->prepare("SELECT * FROM `leave_application_master`,`attendance_year` WHERE (`leave_application_master`.`from_date`>=`attendance_year`.`from_date` AND `leave_application_master`.`to_date`<=`attendance_year`.`to_date`) AND `attendance_year`.`caption_of_year`='$year'");
                        }
                    }
                    else{
                        return false;
                    }
                }
                else{

                    if(isset($data->fromDate) && isset($data->toDate)) {
                        $date1 = new DateTime($data->fromDate);
                        $fromDate = $date1->format('Y-m-d');
                        $date2 = new DateTime($data->toDate);
                        $toDate = $date2->format('Y-m-d');
                        $stmt1 = $connect->prepare("SELECT leave_applied_by,from_date,to_date,type_of_leaves,reason,status,application_date FROM leave_application_master WHERE from_date>=:fromDate AND to_date<=:toDate");
                        $stmt1->bindParam(':fromDate', $fromDate);
                        $stmt1->bindParam(':toDate', $toDate);
                    }
                    else{
                        return false;
                    }
                }
                HicreteLogger::logDebug("query: \n" . json_encode($stmt1));

                if($stmt1->execute()) {
                    HicreteLogger::logDebug("Row Count : \n" . json_encode($stmt1->rowCount()));
                    while($result=$stmt1->fetch(PDO::FETCH_ASSOC)){

                        $result_array=array();
                        $result_array['from_date']=$result['from_date'];
                        $result_array['to_date']=$result['to_date'];
                        $result_array['reason']=$result['reason'];
                        $result_array['type_of_leaves']=$result['type_of_leaves'];
                        $result_array['status']=$result['status'];
                        $result_array['application_date']=$result['application_date'];

                        $userId=$result['leave_applied_by'];
                        $stmt2=$connect->prepare("SELECT firstName,lastName FROM usermaster WHERE userId='$userId'");
                        HicreteLogger::logDebug("query: \n" . json_encode($stmt2));
                        if($stmt2->execute()){
                            HicreteLogger::logDebug("Row Count : \n" . json_encode($stmt2->rowCount()));
                            $result1=$stmt2->fetch(PDO::FETCH_ASSOC);
                            $result_array['leave_applied_by']=$result1['firstName']." ".$result1['lastName'];
                        }
                        array_push($json_response,$result_array);
                    }
                    if(sizeof($json_response)>0) {
                        HicreteLogger::logInfo("Leave details found  ");
                        echo AppUtil::getReturnStatus("success", $json_response);
                        return true;
                    }
                    else{
                        HicreteLogger::logError("Leave details not found  ");
                        return false;
                    }
                }
                else{
                    HicreteLogger::logError("Leave details not found  ");
                    return false;
                }

            }

            public function getEmployees(){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $stmt1=$connect->prepare("SELECT userId,firstName,lastName from usermaster");
                HicreteLogger::logDebug("query: \n" . json_encode($stmt1));
                $stmt1->execute();
                HicreteLogger::logDebug("Row Count : \n" . json_encode($stmt1->rowCount()));
                $result=$stmt1->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);

            }
            public function searchLeaveByEmployee($data){

                $db = Database::getInstance();
                $connect = $db->getConnection();
                $json_response=array();
                $searchBy=$data->employee;

                $stmt1=$connect->prepare("SELECT * FROM leave_application_master WHERE leave_applied_by=:searchBy");
                $stmt1->bindParam(':searchBy',$searchBy);
                HicreteLogger::logDebug("query: \n" . json_encode($stmt1));
                if($stmt1->execute()) {
                    HicreteLogger::logDebug("Row Count : \n" . json_encode($stmt1->rowCount()));
                    while($result=$stmt1->fetch(PDO::FETCH_ASSOC)){
                        $result_array=array();
                        $result_array['from_date']=$result['from_date'];
                        $result_array['to_date']=$result['to_date'];
                        $result_array['reason']=$result['reason'];
                        $result_array['type_of_leaves']=$result['type_of_leaves'];
                        $result_array['status']=$result['status'];
                        $result_array['application_date']=$result['application_date'];
                        $userId=$result['leave_applied_by'];
                        $stmt2=$connect->prepare("SELECT firstName,lastName FROM usermaster WHERE userId='$userId'");
                        if($stmt2->execute()){
                            $result1=$stmt2->fetch(PDO::FETCH_ASSOC);
                            $result_array['leave_applied_by']=$result1['firstName']." ".$result1['lastName'];
                        }
                        array_push($json_response,$result_array);
                    }
                    if(sizeof($json_response)>0) {
                        HicreteLogger::logInfo("Leave details found  ");
                        echo AppUtil::getReturnStatus("success", $json_response);
                        return true;
                    }
                    else{
                        HicreteLogger::logError("Leave details not found");
                        return false;
                    }
                }
                else{
                    HicreteLogger::logError("Leave details not found");
                    return false;
                }
            }

            public function getLeavesApproval(){


                $db = Database::getInstance();
                $connect = $db->getConnection();
                HicreteLogger::logInfo("Getting leaves for approval");
                try {
                    $stmt = $connect->prepare("SELECT leave_application_master.application_id,usermaster.firstName,usermaster.lastName,leave_application_master.from_date,leave_application_master.to_date,leave_application_master.type_of_leaves,leave_application_master.reason FROM usermaster JOIN leave_application_master
                                          ON usermaster.userId=leave_application_master.leave_applied_by WHERE leave_application_master.status='pending'
                                         ");
                    HicreteLogger::logDebug("query: \n" . json_encode($stmt));
                    $stmt->execute();
                    HicreteLogger::logDebug("Row Count : \n" . json_encode($stmt->rowCount()));
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    echo AppUtil::getReturnStatus("success", $result);
                    return true;
                }
                catch(Exception $e)
                {
                    HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                }
            }

            public function updateLeaveApprovalStatus($userId,$data){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $status=$data->status;
                $applicationId=$data->applicationId;

                try{
                $stmt=$connect->prepare("UPDATE leave_application_master SET
                                         status=:status,
                                         action_by=:actionBy,
                                         action_date=NOW()
                                         WHERE application_id=:applicationId");

                $stmt->bindParam(':status',$status);
                $stmt->bindParam(':actionBy',$userId);
                $stmt->bindParam(':applicationId',$applicationId);

                    $connect->beginTransaction();
                    HicreteLogger::logDebug("query: \n" . json_encode($stmt));
                    HicreteLogger::logDebug("Data: \n" . json_encode($data));
                    if($stmt->execute()){
                        HicreteLogger::logInfo("Status Updated Successfully");
                        echo AppUtil::getReturnStatus("success", "Status Updated Successfully");
                        $connect->commit();
                        return true;
                    }
                }
                catch(Exception $e){
                    HicreteLogger::logFatal("Exception Occured Message:\n".$e->getMessage());
                    echo AppUtil::getReturnStatus("fail", "Exception While Updating Leave Approval");
                }
            }
        }

?>