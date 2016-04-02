<?php
require_once '/../../php/appUtil.php';
require_once '/../../php/Database.php';

Class Workorder {
    
    public function getWokrorderByProject($projId) {
        $object = array();
        $final = array();
       /* try {
            $db = Database::getInstance();
            $conn = $db->getConnection();                                          //where q.ProjectId=wo.ProjectId AND q.isApproved = 1
            $stmt = $conn->prepare("SELECT * from work_order wo,quotation q where wo.ProjectId =q.ProjectId AND (wo.ProjectId = :projId AND q.isApproved=1)");
            $stmt->bindParam(':projId', $projId, PDO::PARAM_STR);
            
            if($result = $stmt->execute()){
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    array_push($object, $row);
                }
            }

         } catch (PDOException $e) {
            echo $e->getMessage();
        }*/
        try{
            $db = Database::getInstance();
            $conn = $db->getConnection(); 
            $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
            $stmt = $conn->prepare("SELECT * FROM work_order w WHERE w.ProjectId =:projId");
            $stmt->bindParam(':projId',$projId,PDO::PARAM_STR);
                  if($result = $stmt->execute()){
                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                           // array_push($object, $row);
                           
                           // print_r($row);
                            $WorkOrderNo = $row['WorkOrderNo'];
                            $WorkOrderName = $row['WorkOrderName'];
                            $ReceivedDate = $row['ReceivedDate'];
                            $CompanyId = $row['companyId'];
                             $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
                             $stmt1 = $conn->prepare("SELECT q.QuotationTitle,q.QuotationId ,q.RefNo ,q.DateOfQuotation from quotation q WHERE q.ProjectId =:projId AND q.CompanyId = :companyId");
                              $stmt1->bindParam(':projId',$projId,PDO::PARAM_STR);
                              $stmt1->bindParam(':companyId',$CompanyId,PDO::PARAM_STR);
                              if($result1 = $stmt1->execute()){
                                  /*  while (){
                                       // print_r($row1);
                                        echo "quotation name is ".$row1['QuotationTitle'];
                                    }*/
                                    $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
                                    $QuotationTitle = $row1['QuotationTitle'];
                                    $QuotationId = $row1['QuotationId'];
                                    $RefNo = $row1['RefNo'];
                                    $DateOfQuotation = $row1['DateOfQuotation'];
                                    
                                    //echo "quotation name is ".$row1['QuotationTitle']."\n";

                              }
                              else{
                                return "error in stmt2 getWokrorderByProject";
                              }
                             //echo "work order is ".$WorkOrderNo;
                              //echo "WorkOrderNo is ".$WorkOrderNo."\n";
                              //echo "WorkOrderName is ".$WorkOrderName."\n";
                              //echo "ReceivedDate is ".$ReceivedDate."\n";
                              //echo "QuotationTitle is ".$QuotationTitle."\n";
                              $final['WorkOrderNo'] = $WorkOrderNo;
                              $final['WorkOrderName'] = $WorkOrderName;
                              $final['ReceivedDate'] = $ReceivedDate;
                              $final['QuotationTitle'] = $QuotationTitle;
                              $final['QuotationId']  =  $QuotationId ;
                              $final['RefNo'] = $RefNo;
                              $final['DateOfQuotation'] = $DateOfQuotation;
                              array_push($object, $final);
                        }
                    }
                    else{
                        return "Error in execute getWokrorderByProject";
                    }

        }
        catch(PDOException $e){
            return "Exception in getWokrorderByProject".$e->getMessage();
        }

        $db = null;
        return $object ;
        //return "i m in";
    }


     public function getWokrorderByqId($qId,$cId) {
        $object = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();       //SELECT * FROM work_order w where w.CompanyId ="2" AND w.ProjectId  IN (select q.ProjectId from quotation q where q.QuotationId = "56f0ebc92cd043576");
            $stmt = $conn->prepare("SELECT * from work_order wo where wo.ProjectId  IN (select q.ProjectId from quotation q where q.QuotationId = :qId ) AND  wo.CompanyId = :cId ");
            //print_r($stmt);
            $stmt->bindParam(':qId', $qId, PDO::PARAM_STR);
            $stmt->bindParam(':cId', $cId, PDO::PARAM_STR);            
            
            if($result = $stmt->execute()){
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    array_push($object, $row);
                }
            }

         } catch (PDOException $e) {
            echo $e->getMessage();
        }

        $db = null;
        return $object ;
        //return "i m in";
    }

   
    public function saveWorkOrder($data,$userId){
        $WorkOrderNo = AppUtil::generateId();
        $t=time();
        $current =date("Y-m-d",$t);
       // $object = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction(); 
            $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
            $stmt = $conn->prepare("INSERT INTO work_order (WorkOrderNo,WorkOrderName,ReceivedDate,WorkOrderBlob,ProjectId, CompanyId,CreationDate,CreatedBy) VALUES (?,?,?,?,?,?,?,?)");
            if($stmt->execute([$WorkOrderNo, $data->WorkOrderName,$data->ReceivedDate,$data->WorkOrderBlob,$data->ProjectId,$data->CompanyId,$current,$userId]) === TRUE) {
                /*$stmt1 = $conn->prepare("UPDATE quotation SET isApproved = 1 WHERE ProjectId = :projId AND CompanyId = :compId");*/
                $stmt1 = $conn->prepare("UPDATE quotation SET isApproved = 1 WHERE QuotationId = :id");
                $stmt1->bindParam(':id',$data->QuotationId,PDO::PARAM_STR);
                //$stmt1->bindParam(':compId',$data->CompanyId,PDO::PARAM_STR);
                if($stmt1->execute() === TRUE){
                    $conn->commit();
                    return "Quotation Updated succesfully";
                }
                else{
                    return "Error in updated deletion";
                }


                        $conn->commit();
                        return "Workorder created succesfully.";
                }
            else {
                   $conn->rollBack();
                    return "Error: ";
                }            
            } catch (PDOException $e) {
                $conn->rollBack();
                echo $e->getMessage();
            }
            $conn = null;
    }

/*Delete project*/
    public function deleteProject($id) {
        try{
                $db = Database::getInstance();
                $conn = $db->getConnection();
                $conn->beginTransaction();
                $stmt = $conn->prepare("UPDATE project_master pm SET  pm.IsDeleted =1 WHERE pm.isDeleted = 0 AND pm.ProjectId = :id");
                //$stmt->bindParam(':isDeleted', $data->IsDeleted, PDO::PARAM_STR);
                $stmt->bindParam(':id',$id,PDO::PARAM_STR);
                if($stmt->execute() ===TRUE){
                    $conn->commit();
                    return "Project deleted succesfully";
                }
                else{
                    return "Error in project deletion";
                }
        }
        catch(PDOException $e){
                return "Exception in deletion of customer ".$e->getMessage();
        }

    }

}