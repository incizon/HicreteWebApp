<?php

use \Jacwright\RestServer\RestException;
require 'Task.php';

class TaskController
{
 
    /**
     * Gets all task 
     *
     * @url GET /task
     */

    public static function getAllTask($sortBy,$keyword){
             $task = Task::getAllTask($sortBy,$keyword);
        echo AppUtil::getReturnStatus("sucess",$task);
    }

    /**
     * Gets all task for perticular user
     *
     * @url GET /assignedtask
     */

    public static function getAllTaskForUser($includeCompleted){
             $task = Task::getAllTaskForUser($includeCompleted);
         echo AppUtil::getReturnStatus("sucess",$task);
    }

    /**
     * Gets  task by id 
     *
     * @url GET /task/$id
     */

    public static function getTask($id){
             $task = Task::getTask($id); 
         return $task;
    }

    /**
     * Saves task for given user in database
     *
     * @url POST /task
     * @url PUT /task
     */
    public static function saveTask($projid = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->projid = $projid;
        $task = Task::saveTask($data); // saving the user to the database
       echo AppUtil::getReturnStatus("sucess",$task);
      //  echo json_encode($task); // returning the updated or newly created user object
    }


    /**
     * Edit task...add notes 
     *
     * @url POST /task/edit/$taskId
     */

    public static function editTask($taskId,$data){
             $task = Task::editTask($taskId,$data); 
         echo AppUtil::getReturnStatus("sucess",$task);
    }

     /**
     * delete tasks 
     *
     * @url GET /task/delete/$taskId
     */

    public  static function deleteTask($taskId){
             $task = Task::deleteTask($taskId); 
         echo AppUtil::getReturnStatus("sucess",$task);
    }

      /**
     * get task notes by  task id 
     *
     * @url GET /task/notes/$taskId
     */

    public static function getNotes($taskId){
             $task = Task::getNotes($taskId); 
         echo AppUtil::getReturnStatus("sucess",$task);
    }
  

  
}