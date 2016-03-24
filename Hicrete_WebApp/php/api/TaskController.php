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

    public static function getAllTask(){
             $task = Task::getAllTask(); 
         return $task;
    }

    /**
     * Gets all task for perticular user
     *
     * @url GET /assignedtask
     */

    public static function getAllTaskForUser(){
             $task = Task::getAllTaskForUser();
         return $task;
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
        
        echo json_encode($task); // returning the updated or newly created user object
    }


    /**
     * Edit task...add notes 
     *
     * @url POST /task/edit/$taskId
     */

    public static function editTask($taskId,$data){
             $task = Task::editTask($taskId,$data); 
         return $task;
    }

     /**
     * delete tasks 
     *
     * @url GET /task/delete/$taskId
     */

    public  static function deleteTask($taskId){
             $task = Task::deleteTask($taskId); 
         return $task;
    }

      /**
     * get task notes by  task id 
     *
     * @url GET /task/notes/$taskId
     */

    public static function getNotes($taskId){
             $task = Task::getNotes($taskId); 
         return $task;
    }
  

  
}