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

  

  
}