<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Workorder {
    
    public function getWokrorderByProject($projId) {
        $object = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();                                          //where q.ProjectId=wo.ProjectId AND q.isApproved = 1
            $stmt = $conn->prepare("SELECT * from work_order wo,quotation q where wo.ProjectId =q.ProjectId AND (wo.ProjectId = :projId AND q.isApproved=1) ");
            $stmt->bindParam(':projId', $projId, PDO::PARAM_STR);
            
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

   
    public function saveWorkOrder($data){
        $WorkOrderNo = AppUtil::generateId();
       // $object = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();                      //WorkOrderNo, WorkOrderName, ReceivedDate, WorkOrderBlob, ProjectId, CompanyId
            $stmt = $conn->prepare("INSERT INTO work_order (WorkOrderNo,WorkOrderName,ReceivedDate,WorkOrderBlob,ProjectId, CompanyId) VALUES (?,?,?,?,?,?)");
            //$stmt = $conn->prepare("INSERT INTO customer_master (CustomerId,CustomerName,Address,City,State,Country,Pincode,Mobileno,Landlineno,FaxNo,EmailId,isDeleted,CreationDate,CreatedBy,LastModificationDate,LastModifiedBy,VATNo,CSTNo,PAN,ServiceTaxNo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            if ($stmt->execute([$WorkOrderNo, $data->WorkOrderName,$data->ReceivedDate,$data->WorkOrderBlob,$data->ProjectId,$data->CompanyId]) === TRUE) {
//            if ($stmt->execute([$WorkOrderNo, $data->WorkOrderName,$data->ReceivedDate,$data->WorkOrderBlob,$data->ProjectId,$data->CompanyId]) === TRUE) {
                        
                $stmt1 = $conn->prepare("UPDATE quotation SET isApproved = 1 WHERE ProjectId = :projId AND CompanyId = :compId");
                $stmt1->bindParam(':projId',$data->ProjectId,PDO::PARAM_STR);
                $stmt1->bindParam(':compId',$data->CompanyId,PDO::PARAM_STR);
                if($stmt1->execute() ===TRUE){
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