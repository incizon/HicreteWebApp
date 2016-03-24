<?php
use \Jacwright\RestServer\RestException;
require 'Workorder.php';
class WorkorderController
{
    /**
     * Gets workorder by project id
     *
     * @url GET /workorder/$projId
     */
    public function getWokrorderByProject($projId){
             $workorder = Workorder::getWokrorderByProject($projId); // possible user loading method
         return $workorder;
    }


     /**
     * Gets workorder by quotation id
     *
     * @url GET /workorder/$qId/$cId
     */
    public function getWokrorderByqId($qId,$cId){
             $workorder = Workorder::getWokrorderByqId($qId,$cId);
         return $workorder;
    }


    /**
     * Saves a workorder to the database
     *
     * @url POST /workorder
     * @url PUT /workorder
     */
    public function saveWorkOrder($data)
    {
        $workorder = Workorder::saveWorkOrder($data); // saving the user to the database
        return $workorder; // returning the updated or newly created user object
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
     * upload workorder
     *
     * @url POST /workorder/upload
     * 
     */

    public function uploadWorkorder($data){
        $target_dir = "../../upload/Workorders/";
        $target_file = $target_dir . basename($_FILES["file"]["name"]);
        $file = $_FILES['file'];
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            echo "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
  
}