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

    public function getAllTask(){
             $task = Task::getAllTask(); 
         return $task;
    }

    /**
     * Gets all task for perticular user
     *
     * @url GET /assignedtask/$userId
     */

    public function getAllTaskForUser($userId){
             $task = Task::getAllTaskForUser($userId); 
         return $task;
    }

    /**
     * Gets  task by id 
     *
     * @url GET /task/$id
     */

    public function getTask($id){
             $task = Task::getTask($id); 
         return $task;
    }

    /**
     * Saves task for given user in database
     *
     * @url POST /task
     * @url PUT /task
     */
    public function saveTask($projid = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->projid = $projid;
        $task = Task::saveTask($data); // saving the user to the database
        
        return $task; // returning the updated or newly created user object
    }


    /**
     * Edit task...add notes 
     *
     * @url POST /task/edit/$taskId
     */

    public function editTask($taskId,$data){
             $task = Task::editTask($taskId,$data); 
         return $task;
    }

     /**
     * delete tasks 
     *
     * @url GET /task/delete/$taskId
     */

    public function deleteTask($taskId){
             $task = Task::deleteTask($taskId); 
         return $task;
    }

      /**
     * get task notes by  task id 
     *
     * @url GET /task/notes/$taskId
     */

    public function getNotes($taskId){
             $task = Task::getNotes($taskId); 
         return $task;
    }
  

  
}