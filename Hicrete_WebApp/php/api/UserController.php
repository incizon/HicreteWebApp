<?php

use \Jacwright\RestServer\RestException;
require 'User.php';

class UserController
{
 
    /**
     * Gets the user by id or current user
     *
     * @url GET /user/$id
     */

    public function getUser($id = null){
        
         if ($id !=null) {
             $user = User::loadUser($id); // possible user loading method
         } else {
             $user = User::loadAllUser();
         }

         return $user;
    }

    /**
     * Gets the projects by id or current user
     *
     * @url GET /user
     */

    public function getAllUsers()
    {
         
        $user = User::loadAllUsers();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $user;
    }

    /**
     * Saves a user to the database
     *
     * @url POST /user
     *
     */
    public function saveUser($id = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->id = $id;
        $user = User::saveUser($data); // saving the user to the database
        
        return $user; // returning the updated or newly created user object
    }


    public function updateProject($id,$data){
        $project = projedct::updateProject($id,$data);
        return $project;
    }


/**
* Delete user
*
* @url GET /user/delete/$id
*
*/

    public function deleteUser($id){
        $user = User::deleteUser($id);
        return $user;
    }
  
}