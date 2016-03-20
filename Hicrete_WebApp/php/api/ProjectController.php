<?php
ini_set('display_errors',1);
error_reporting(E_ALL);
use \Jacwright\RestServer\RestException;
require 'Project.php';

class ProjectController
{
 
    /**
     * Gets projet by project id
     *
     * @url GET /projects/$id
     */

    public function getProject($id = null){
        
         if ($id !=null) {
             $project = Project::load($id); // possible user loading method
         } else {
             $project = Project::loadAll();
         }

         return $project;
    }

     /**
     * Gets companies involved in project by project id
     *
     * @url GET /projects/companies/$id
     */

    public function getCompaniesForProject($id){
       
             $project = Project::getCompaniesForProject($id); // possible user loading method
       
         return $project;
    }

    /**
     * Gets invoices by project id for that project which are approved
     *
     * @url GET /projects/invoices/$projid
     */

    public function getInvoicesByProject($projid){
        
             $project = Project::getInvoicesByProject($projid); // possible user loading method
         return $project;
    }

 /**
     * Gets project site followup and detail by project id
     *
     * @url GET /projects/siteFollowup/$projid
     */

    public function getProjectSiteFollowup($projid){
             $project = Project::loadProjectSiteFollowup($projid); // possible user loading method
         return $project;
    }

    /**
     * Gets the projects by id or current user
     *
     * @url GET /projects
     */

    public function getAllProjects()
    {
         
        $project = Project::loadAll();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $project;
    }

    /**
     * Saves a user to the database
     *
     * @url POST /projects
     * @url PUT /projects/$id
     */
    public function saveProject($id = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->id = $id;
        $userId="1";
        
        $project = Project::saveProject($data,$userId); // saving the user to the database
        
        return $project; // returning the updated or newly created user object
    }


    /*public function updateProject($id,$data){
        $project = projedct::updateProject($id,$data);
        return $project;
    }*/

    /**
     * update project
     *
     * @url POST /project/update/$id
     * @url PUT /project/update/$id
     */

    public function updateProject($id,$data){
        $project = project::updateProject($id,$data);
        return $project;
    }

    /**
     * delete project using id
     *
     * @url GET /project/delete/$id
     * 
     */

    public function deleteProject($id){
        $project = project::deleteProject($id);
        return $project;
    }
/**
     * Close given project by project id
     *
     * @url GET /projects/close/$projid
     */

    public function closeProject($projid){
             $project = Project::closeProject($projid); // possible user loading method
         return $project;
    }
  
}