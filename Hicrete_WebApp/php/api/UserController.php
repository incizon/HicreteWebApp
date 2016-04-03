<?php


require 'User.php';

class UserController
{
 

    public function getUser($id = null){
        
         if ($id !=null) {
             $user = User::loadUser($id); // possible user loading method
         } else {
             $user = User::loadAllUser();
         }

         return $user;
    }


    public function getAllUsers()
    {
         
        $user = User::loadAllUsers();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $user;
    }

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


    public function deleteUser($id){
        $user = User::deleteUser($id);
        return $user;
    }
  
}