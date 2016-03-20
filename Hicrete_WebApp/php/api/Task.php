<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Task {

    public static function saveTask($data){
        if (!isset($_SESSION['token'])) {
            session_start();
        }
        $userId=$_SESSION['token'];
       $taskId = AppUtil::generateId();

        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();
                $stmt = $conn->prepare("INSERT INTO task_master (TaskID, TaskName, TaskDescripion, ScheduleStartDate, ScheduleEndDate, CompletionPercentage, TaskAssignedTo, isCompleted, CreationDate, CreatedBy) VALUES(?,?,?,?,?,?,?,?,?,?)");
                        if($stmt->execute([$taskId,$data->TaskName,$data->TaskDescripion,$data->ScheduleStartDate,$data->ScheduleEndDate,$data->CompletionPercentage,$data->TaskAssignedTo,$data->isCompleted,$data->CreationDate,$userId]) === TRUE)
                        {
                            $conn->commit();
                            return "Task created successfully";
                        }
                        else
                        {
                            return "Task creation Failed..";
                        }

        } catch (PDOException $e) {
            echo $e->getMessage();
            $conn->rollBack();
        }
        $db = null;
    }


     public static function getAllTaskForUser($userId){
         if (!isset($_SESSION['token'])) {
             session_start();
         }
         $userId=$_SESSION['token'];
        $object = array();       
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();
                $stmt = $conn->prepare("SELECT * FROM task_master t WHERE t.TaskAssignedTo = :userId");
                    $stmt->bindParam(':userId',$userId,PDO::PARAM_STR);
                        if($stmt->execute() === TRUE)
                        {
//                            if($stmt->rowCount()>0){
                                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                    array_push($object, $row);
                                }
//                            }else{
//                                return "No Task assigned yet..";
//                            }

                        }
                        else
                        {
                            return "Error in stmt in getAllTaskForUser";
                        }

        } catch (PDOException $e) {
            echo $e->getMessage();
            
        }
        $db = null;
        return $object;
    }


    public static function getTask($id){
            $object  = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
                $stmt = $conn->prepare("SELECT * FROM task_master tm , user_master um  WHERE tm.TaskID = :id AND um.UserId = tm.TaskAssignedTo AND tm.isDeleted = 0");
                       $stmt->bindParam(':id', $id, PDO::PARAM_STR);
                        if($stmt->execute() === TRUE)
                        {
                            while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
                             {
                             array_push($object, $row);
                             }
                        }
                        else
                        {
                            return "error in fetching task by id..";
                        }

        } catch (PDOException $e) {
            echo $e->getMessage();
            $conn->rollBack();
        }
        $db = null;
        return $object;
    }

    public static function getAllTask(){
        $object  = array();
        try{
                $db = Database::getInstance();
                $conn = $db->getConnection();
                $conn->beginTransaction();
                    $stmt = $conn->prepare("SELECT * FROM task_master t , usermaster u WHERE t.TaskAssignedTo = u.UserId AND t.isDeleted = 0");
                        if($result = $stmt->execute()) {
                             while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
                             {
                             array_push($object, $row);
                             }
                        }
        }
        catch(PDOException $e){
            return "exception in getAllTask ".$e->getMessage();
        } 
        $db = null;
        return $object;
    }

    public static function editTask($taskId,$data){
        if (!isset($_SESSION['token'])) {
            session_start();
        }
        $userId=$_SESSION['token'];
        try 
        {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();
                $stmt = $conn->prepare("UPDATE task_master SET  CompletionPercentage = :completionPercentage, isCompleted =:iscompleted,  ActualStartDate =:actualStartDate, AcutalEndDate = :acutalEndDate WHERE TaskID =:taskId  ");

                 $stmt->bindParam(':completionPercentage', $data->CompletionPercentage, PDO::PARAM_STR);
                 $stmt->bindParam(':iscompleted', $data->isCompleted, PDO::PARAM_STR);
                 $stmt->bindParam(':actualStartDate', $data->ActualStartDate, PDO::PARAM_STR);
                 $stmt->bindParam(':acutalEndDate', $data->ActualEndDate, PDO::PARAM_STR);
                 $stmt->bindParam(':taskId', $taskId, PDO::PARAM_STR);

                        if($stmt->execute() === TRUE)  {
                            $stmt2 = $conn->prepare("INSERT INTO task_conduction_notes(TaskID, ConductionNote, NoteAddedBy, DateAdded) VALUES(?,?,?,?)");
                            if($stmt2->execute([$taskId,$data->ConductionNote,$userId,$data->NoteAdditionDate]) === TRUE){
                                $conn->commit();
                                return "task has been updated succesfully ";
                            }
                            else{
                                return "Error in task updation stmt2";
                            }
                        }
                        else{
                                return "Eror in task upfation stmt";
                        }
         }
        catch(PDOException $e){
            $conn->rollBack();
            return " exception in edit task ".$e->getMessage();
        }
        $db = null;
    }

    public static function deleteTask($taskId) {
        try{
                $db  = Database::getInstance();
                $conn = $db->getConnection();
                $conn->beginTransaction();
                $stmt = $conn->prepare("UPDATE task_master SET isDeleted = 1 WHERE TaskID = :id");
                $stmt ->bindParam(':id',$taskId,PDO::PARAM_STR);
                    if($stmt->execute() === TRUE){
                        $conn->commit();
                        return "Task has been deleted succesfully";
                    }
                    else{
                        return "Error during task deletion";
                    }
        }
        catch(PDOException $e){
            return "In Exception in deletion of task".$e->getMessage();
        }
        $conn = null;


    }


     public static function  getNotes($projid){
            $object  = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
                $stmt = $conn->prepare("SELECT * FROM task_conduction_notes tc,usermaster um  WHERE tc.TaskID = :id AND um.UserId = tc.NoteAddedBy ");
                       $stmt->bindParam(':id', $projid, PDO::PARAM_STR);
                        if($stmt->execute() === TRUE)
                        {
                            while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
                             {
                             array_push($object, $row);
                             }
                        }
                        else
                        {
                            return "error in fetching task notes by id..";
                        }

        } catch (PDOException $e) {
            echo $e->getMessage();
            $conn->rollBack();
        }
        $db = null;
        return $object;
    }
}

