<?php
//ini_set('display_errors',1);
//error_reporting(E_ALL);
use \Jacwright\RestServer\RestException;
require 'Project.php';

class ProjectController
{
 
    /**
     * Gets projet by project id
     *
     * @url GET /projects/$id
     */

    public static function getProject($id = null){
        
         if ($id !=null) {
             $project = Project::load($id); // possible user loading method
         } else {
             $project = Project::loadAll();
         }

         return $project;
    }

    /**
     * Gets projet by search terms
     *
     * @url GET /projects/search/$expression/$searchKeyword
     */

    public function searchProject($expression,$searchKeyword){

        try{
            if(!isset($searchKeyword))
                $searchKeyword="";
            $project = Project::searchProject($searchKeyword,$expression); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$project);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


     /**
     * Gets companies involved in project by project id
     *
     * @url GET /projects/companies/$id
     */

    public static function getCompaniesForProject($id){

        try{
            $project = Project::getCompaniesForProject($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$project);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

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
        try{
            $project = Project::loadProjectSiteFollowup($projid); // possible user loading method

            if($project!=null){
                echo AppUtil::getReturnStatus("Successful",$project);
            }
            else {
                echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }
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
        try{
            $data->id = $id;
            $userId=AppUtil::getLoggerInUserId();

            $project = Project::saveProject($data,$userId); // saving the user to the database

            if($project){
                echo AppUtil::getReturnStatus("Successful","Project Created Successfully");
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred while Creating project");
            }


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


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

    public static function updateProject($id,$data){
        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            $project = $project = project::updateProject($id,$data,$loggedInUserId);;
            if($project)
                echo AppUtil::getReturnStatus("Successful","Project updated successfully");
            else
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }
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



    /**
     * delete customer using id
     *
     * @url POST /projectlist
     *
     */

    public static function getProjectList(){
        try{
            $project = Project::getProjectList();
            if($project!=null)
                echo AppUtil::getReturnStatus("Successful",$project);
            else
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }

    /**
     * delete customer using id
     *
     * @url POST /sitetrackingprojectlist
     *
     */

    public static function getSiteTrackingProjectList(){
        try{
            $project = Project::getSiteTrackingProjectList();
            if($project!=null)
              echo AppUtil::getReturnStatus("Successful",$project);
            else
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }

}