<?php
require_once '../../php/appUtil.php';
require_once '../../php/Database.php';

Class Workorder {
    
    public function getWokrorderByProject($projId) {
        $object = array();
        $final = array();
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT w.*,q.QuotationTitle,q.QuotationId ,q.RefNo ,q.DateOfQuotation FROM work_order w ,quotation q WHERE w.`quotationId` IN (SELECT `QuotationId` FROM `quotation` WHERE `ProjectId`=:projId) AND w.`quotationId`=q.`QuotationId` order by w.`ReceivedDate`");
        $stmt->bindParam(':projId',$projId,PDO::PARAM_STR);
        if($result = $stmt->execute()){
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
              $final['WorkOrderNo'] = $row['WorkOrderNo'];
              $final['WorkOrderName'] = $row['WorkOrderName'];
              $final['ReceivedDate'] = $row['ReceivedDate'];
              $final['QuotationTitle'] = $row['QuotationTitle'];
              $final['QuotationId']  =  $row['QuotationId'] ;
              $final['RefNo'] =$row['RefNo'] ;
              $final['DateOfQuotation'] = $row['DateOfQuotation'];
                $final['WorkOrderBlob'] = $row['WorkOrderBlob'];
                array_push($object, $final);
            }
        }
        else{
            return null;
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

    public static function isWorkOrderNumberAlreadyPresent($workOrderNumber){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT `WorkOrderNo` FROM `work_order` WHERE `isDeleted`='0' AND `WorkOrderNo`=:workOrderNo");
        $stmt->bindParam(':workOrderNo',$workOrderNumber, PDO::PARAM_STR);

        $stmt->execute();
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) > 0) {
            return true;
        }
        return false;
    }

    public static function isWorkOrderNameAlreadyPresent($projectId,$workOrderName){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT `WorkOrderName` FROM `work_order` WHERE `isDeleted`='0' AND `WorkOrderName`=:workorderName AND `quotationId` IN (SELECT `QuotationId` FROM `quotation` WHERE `ProjectId`=:projectId)");
        $stmt->bindParam(':workorderName',$workOrderName, PDO::PARAM_STR);
        $stmt->bindParam(':projectId',$projectId, PDO::PARAM_STR);
        $stmt->execute();
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) > 0) {
            return true;
        }
        return false;
    }



    public static function saveWorkOrder($data,$userId){

        $t=time();
        $current =date("Y-m-d",$t);
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $conn->beginTransaction();
        $date1 = new DateTime($data->ReceivedDate);
        $recievedDate = $date1->format('Y-m-d');

        $stmt = $conn->prepare("INSERT INTO `work_order`(`WorkOrderNo`, `WorkOrderName`, `ReceivedDate`, `WorkOrderBlob`, `CreationDate`, `CreatedBy`, `quotationId`) VALUES (?,?,?,?,?,?,?)");
        if($stmt->execute([$data->workOrderNumber, $data->WorkOrderName,$recievedDate,$data->WorkOrderBlob,$current,$userId,$data->QuotationId]) === TRUE) {
            /*$stmt1 = $conn->prepare("UPDATE quotation SET isApproved = 1 WHERE ProjectId = :projId AND CompanyId = :compId");*/
            $stmt1 = $conn->prepare("UPDATE quotation SET isApproved = 1 WHERE QuotationId = :id");
            $stmt1->bindParam(':id',$data->QuotationId,PDO::PARAM_STR);
            //$stmt1->bindParam(':compId',$data->CompanyId,PDO::PARAM_STR);
            if($stmt1->execute() === TRUE){
                $conn->commit();
                return true;
            }
            else{
               $conn->rollBack();
                return false;
            }

        }
        else {
               $conn->rollBack();
                return false;
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


    public static function isWorkorderAlreadyUploaded($workorderBlob){
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT `WorkOrderBlob` FROM `work_order` WHERE `WorkOrderBlob`=:workorderBlob");
        $stmt->bindParam(':workorderBlob',$workorderBlob, PDO::PARAM_STR);

        $stmt->execute();
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) > 0) {
            return true;
        }
        return false;
    }

}