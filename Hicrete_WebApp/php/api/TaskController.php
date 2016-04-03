<?php


require 'Task.php';

class TaskController
{

    public static function getAllTask($sortBy,$keyword){
             $task = Task::getAllTask($sortBy,$keyword);
        echo AppUtil::getReturnStatus("sucess",$task);
    }


    public static function getAllTaskForUser($includeCompleted){
             $task = Task::getAllTaskForUser($includeCompleted);
         echo AppUtil::getReturnStatus("sucess",$task);
    }


    public static function getTask($id){
             $task = Task::getTask($id); 
         return $task;
    }

    public static function saveTask($projid = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->projid = $projid;
        $task = Task::saveTask($data); // saving the user to the database
       echo AppUtil::getReturnStatus("sucess",$task);
      //  echo json_encode($task); // returning the updated or newly created user object
    }



    public static function editTask($taskId,$data){
             $task = Task::editTask($taskId,$data); 
         echo AppUtil::getReturnStatus("sucess",$task);
    }


    public  static function deleteTask($taskId){
             $task = Task::deleteTask($taskId); 
         echo AppUtil::getReturnStatus("sucess",$task);
    }


    public static function getNotes($taskId){
             $task = Task::getNotes($taskId); 
         echo AppUtil::getReturnStatus("sucess",$task);
    }
  

  
}