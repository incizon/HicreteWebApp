<?php
//ini_set('display_errors',1);
//error_reporting(E_ALL);

require 'Project.php';

class ProjectController
{

    public static function getProject($id = null){
        
         if ($id !=null) {
             $project = Project::load($id); // possible user loading method
         } else {
             $project = Project::loadAll();
         }

         return $project;
    }


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


    public static function getCompaniesForProject($id){

        try{
            $project = Project::getCompaniesForProject($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$project);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    public static function getExcludedCompaniesForProject($id){

        try{
            $project = Project::getExcludedCompaniesForProject($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$project);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    public function getInvoicesByProject($projid){
        
             $project = Project::getInvoicesByProject($projid); // possible user loading method

    }

    public static function getProjectSiteFollowup($projid){
        try{
            $project = Project::loadProjectSiteFollowup($projid); // possible user loading method
            if(sizeof($project)>0){
                echo AppUtil::getReturnStatus("Successful",$project);
            }
            else {
                echo AppUtil::getReturnStatus("Unsuccessful", "Data not found");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }
         return $project;
    }


    public function getAllProjects()
    {
         
        $project = Project::loadAll();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $project;
    }

    public function saveProject($id = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        try{
            $data->id = $id;
            $userId=AppUtil::getLoggerInUserId();

            $project = Project::saveProject($data,$userId); // saving the user to the database

            if($project==1){
                echo AppUtil::getReturnStatus("Successful","Project Created Successfully");
            }else if($project==0){
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred while Creating project");
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful","Project with same name already exist");
            }


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


    }

    public static function updateProject($id,$data){
        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            $project = $project = project::updateProject($id,$data,$loggedInUserId);;
            if($project==1)
                echo AppUtil::getReturnStatus("Successful","Project updated successfully");
            else if($project==0) {
                echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Project With Same Name already Exist");
            }


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }
    }


    public function deleteProject($id){
        $project = project::deleteProject($id);
        return $project;
    }

    public function closeProject($projid){
             $project = Project::closeProject($projid); // possible user loading method
         return $project;
    }


    public static function getProjectList(){
        try{
            $project = Project::getProjectList();
            if($project!==null)
                echo AppUtil::getReturnStatus("Successful",$project);
            else
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }


    public static function getSiteTrackingProjectList(){
        try{
            $project = Project::getSiteTrackingProjectList();
            if($project!==null)
              echo AppUtil::getReturnStatus("Successful",$project);
            else
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }

}