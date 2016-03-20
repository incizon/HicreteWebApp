<?php


        require_once ("../../php/Database.php");
        require_once ("../../php/appUtil.php");

        class Payroll{

                public function createYear($data,$userId){


                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $captionYear=$data->caption;

                    $date1 = new DateTime($data->startDate);
                    $fromDate = $date1->format('Y-m-d');

                    $date2 = new DateTime($data->endDate);
                    $toDate = $date2->format('Y-m-d');

                    $dateDifference=$date2->diff($date1,true)->days;
//                  echo $dateDifference->format('%d days');


                    $noOfPaidLeaves=$data->paidLeaves;
                    $weeklyOff=$data->weeklyOff;

                    if($weeklyOff){
                        $weeklyOffDay=$data->weeklyoffDay;
                    }
                    else{
                        $weeklyOffDay="null";
                    }

                    $stmt1 = $connect->prepare("INSERT INTO attendance_year(caption_of_year,from_date,to_date,no_of_paid_leaves,weekly_off_day,created_by,creation_date)
						     VALUES (:captionYear,:fromDate,:toDate,:noOfPaidLeaves,:weeklyOffDay,:createdBy,NOW())");

                    $stmt1->bindParam(':captionYear',$captionYear);
                    $stmt1->bindParam(':fromDate',$fromDate);
                    $stmt1->bindParam(':toDate', $toDate);
                    $stmt1->bindParam(':noOfPaidLeaves', $noOfPaidLeaves);
                    $stmt1->bindParam(':weeklyOffDay', $weeklyOffDay);
                    $stmt1->bindParam(':createdBy', $userId);

                    if($stmt1->execute()){
                        return true;
                    }
                    else{
                         return false;
                    }
                }

                public function getYearDetails(){


                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $result_array=array();
                    $result_array['holidaysList']=array();
                        $stmt1=$connect->prepare("SELECT caption_of_year,from_date,to_date FROM attendance_year WHERE CURRENT_DATE () BETWEEN  from_date AND to_date");
                        if($stmt1->execute()){
                            $result1=$stmt1->fetch(PDO::FETCH_ASSOC);
                            $result_array['caption_of_year']=$result1['caption_of_year'];
                            $result_array['from_date']=$result1['from_date'];
                            $result_array['to_date']=$result1['to_date'];
                            $captionYear = $result1['caption_of_year'];
                            $stmt2=$connect->prepare("SELECT * FROM holiday_in_year WHERE caption_of_year=:captionYear");
                            $stmt2->bindParam(':captionYear',$captionYear);
                            if($stmt2->execute()){
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
                        }
                        echo json_encode($result_array);

            }

                public function createHoliday($data,$userId){

                    $db = Database::getInstance();
                    $connect = $db->getConnection();

                    $captionYear=$data->caption_of_year;

                    $date1 = new DateTime($data->holidayDate);
                    $holidayDate = $date1->format('Y-m-d');

                    $description=$data->description;

                    $stmt1 = $connect->prepare("INSERT INTO holiday_in_year(caption_of_year,holiday_date,description,created_by,creation_date)
						     VALUES (:captionYear,:holidayDate,:description,:createdBy,NOW())");

                    $stmt1->bindParam(':captionYear',$captionYear);
                    $stmt1->bindParam(':holidayDate',$holidayDate);
                    $stmt1->bindParam(':description', $description);
                    $stmt1->bindParam(':createdBy', $userId);

                    if($stmt1->execute()){

                          return true;
                    }
                    else{

                          return false;
                    }
                }
            public function removeHoliday($data){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                    $holidayDate=$data->holiday_date;

                    $stmt1=$connect->prepare("DELETE FROM holiday_in_year WHERE holiday_date=:holidayDate");
                    $stmt1->bindParam('holidayDate',$holidayDate);
                    if($stmt1->execute())
                    {
                        return true;
                    }
                    else{

                        return false;
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
                $noOfLeaves=$data->noOfLeaves;
                $typeOfLeave=$data->typeofLeave;
                $reason=$data->description;
                $status=$data->status;
                $actionDate="null";
                $actionBy="null";

                $stmt1=$connect->prepare("INSERT INTO leave_application_master(application_id,leave_applied_by,from_date,to_date,type_of_leaves,no_of_leaves,reason,status,application_date,action_by,action_date)
                                        VALUES(:applicationId,:leaveAppliedBy,:fromDate,:toDate,:type_of_leaves,:no_of_leaves,:reason,:status,NOW(),:actionBy,:actionDate)");


                $stmt1->bindParam(':applicationId',$applicationId);
                $stmt1->bindParam(':leaveAppliedBy',$leaveAppliedBy);
                $stmt1->bindParam(':fromDate',$fromDate);
                $stmt1->bindParam('toDate',$toDate);
                $stmt1->bindParam('type_of_leaves',$typeOfLeave);
                $stmt1->bindParam('no_of_leaves',$noOfLeaves);
                $stmt1->bindParam(':reason',$reason);
                $stmt1->bindParam(':status',$status);
                $stmt1->bindParam(':actionDate',$actionDate);
                $stmt1->bindParam(':actionBy',$actionBy);

                if($stmt1->execute()){
                    return true;
                }
                else{
                    return false;
                }

            }

            public function getEmployeeDetails(){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $result_array=array();

                $stmt1=$connect->prepare("SELECT userId,firstName,lastName FROM usermaster WHERE usermaster.userId NOT IN (SELECT employee_id FROM employee_on_payroll)");

                if($stmt1->execute()){

                    $result1=$stmt1->fetchAll(PDO::FETCH_ASSOC);
                    $result_array['EmployeeDetails']=$result1;

                }

                $stmt2=$connect->prepare("SELECT userId,firstName,lastName FROM usermaster");
                if($stmt2->execute()){

                    $result2=$stmt2->fetchAll(PDO::FETCH_ASSOC);
                    $result_array['LeaveApprover']=$result2;
                }
                echo json_encode($result_array);


            }

            public function addEmployeeToPayroll($data,$userId){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                for ($index = 0; $index < sizeof($data); $index++) {

                    $employeeId = $data->employee[$index]->userId;
                    $approverId = $data->employee[$index]->approverId;

                    $stmt1 = $connect->prepare("INSERT INTO employee_on_payroll(employee_id,leave_approver_id,created_by,creation_date,last_modified_by,last_modification_date)
							  VALUES (:employeeId ,:approverId ,:createdBy ,NOW(),:modifiedBy,NOW())");
                    $stmt1->bindParam(':employeeId', $employeeId);
                    $stmt1->bindParam(':approverId', $approverId);
                    $stmt1->bindParam(':createdBy',$userId);
                    $stmt1->bindParam(':modifiedBy',$userId);

                    if ($stmt1->execute()) {
                        return true;
                    }
                    else{
                        return false;
                    }
                }

            }

            public  function getEmployeeDetailsForLeave($userId){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $result_array=array();

                $stmt1=$connect->prepare("SELECT leave_approver_id FROM employee_on_payroll WHERE employee_id=:userId ");
                $stmt1->bindParam(':userId',$userId);

                $stmt1->execute();
                $result1=$stmt1->fetch(PDO::FETCH_ASSOC);
                $approverId=$result1['leave_approver_id'];

                $stmt2=$connect->prepare("SELECT firstName,lastName FROM userMaster WHERE userId='$approverId'");
                $stmt2->execute();
                $result2=$stmt2->fetch(PDO::FETCH_ASSOC);
                $result_array['approverName']=$result2['firstName']." ".$result2['lastName'];

                $stmt3=$connect->prepare("SELECT userId,firstName,lastName FROM userMaster WHERE userId=:userId");
                $stmt3->bindParam(':userId',$userId);
                $stmt3->execute();
                $result3=$stmt3->fetch(PDO::FETCH_ASSOC);

                $result_array['userId']=$result3['userId'];
                $result_array['employeeName']=$result3['firstName']." ".$result3['lastName'];

                echo  json_encode($result_array);


            }

            public function getLeaveDetails($data,$userId){

                $db = Database::getInstance();
                $connect = $db->getConnection();

                $json_response=array();

                if(!empty($data->fromDate) && !empty($data->toDate)){
                    $date1 = new DateTime($data->fromDate);
                    $fromDate = $date1->format('Y-m-d');
                    $date2 = new DateTime($data->toDate);
                    $toDate = $date2->format('Y-m-d');
                    $stmt1=$connect->prepare("SELECT application_id,from_date,to_date,type_of_leaves,reason,status,application_date FROM leave_application_master WHERE from_date>=:fromDate AND to_date<=:toDate AND leave_applied_by=:userId");

                    $stmt1->bindParam(':userId',$userId);
                    $stmt1->bindParam(':fromDate',$fromDate);
                    $stmt1->bindParam(':toDate',$toDate);
                }
                else{
                    $stmt1=$connect->prepare("SELECT application_id,from_date,to_date,type_of_leaves,reason,status,application_date FROM leave_application_master WHERE leave_applied_by=:userId");
                    $stmt1->bindParam(':userId',$userId);
                }


                if($stmt1->execute()){

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

                        echo AppUtil::getReturnStatus("success",$json_response);
                        return true;
                    }
                }
                else{

                    return false;
                }


            }
             public function changeLeaveStatus($data){

                 $applicationId=$data->applicationId;

                 $db = Database::getInstance();
                 $connect = $db->getConnection();

                 $stmt1=$connect->prepare("UPDATE leave_application_master
                                            SET status='cancel'
                                            WHERE application_id=:applicationId
                                          ");
                 $stmt1->bindParam(':applicationId',$applicationId);
                      if($stmt1->execute()){
                          $message="Leave Status Changed Successfully";
                          echo AppUtil::getReturnStatus("success",$message);
                          return true;
                      }
                     else{
                          return false;
                     }
                }

            public function getYears(){

                $db = Database::getInstance();
                $connect = $db->getConnection();
                $stmt=$connect->prepare("SELECT caption_of_year FROM attendance_year ");

                if($stmt->execute()){

                    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
                    return true;
                }
            }
        }

?>