<?php

require 'Workorder.php';
class WorkorderController
{
    public function getWokrorderByProject($projId){
        try{

            if ($projId != null) {
                $workorder = Workorder::getWokrorderByProject($projId); // possible user loading method
                if($workorder!==null) {
                    echo AppUtil::getReturnStatus("Successful", $workorder);
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                }
            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Project value is empty");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    public function getWokrorderByqId($qId,$cId){
             $workorder = Workorder::getWokrorderByqId($qId,$cId);
         return $workorder;
    }


    public function saveWorkOrder($data)
    {
        try{

            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($data != null) {

                    if(Workorder::isWorkOrderNumberAlreadyPresent($data->workOrderNumber)){
                        echo AppUtil::getReturnStatus("Unsuccessful","Workorder number is already present");
                        return;
                    }
                    if(Workorder::isWorkOrderNameAlreadyPresent($data->ProjectId,$data->WorkOrderName)){
                        echo AppUtil::getReturnStatus("Unsuccessful","Workorder Title already used for another workorder");
                        return;
                    }

                    $Quotation = Workorder::saveWorkOrder($data,$loggedInUserId);

                    if($Quotation) {
                        echo AppUtil::getReturnStatus("Successful", "Workorder created successfully");
                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Data value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


    }



    public function getAllProjects()
    {
         
        $project = Project::loadAll();
         

       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $project;
    }


    public function updateProject($id,$data){
        $project = project::updateProject($id,$data);
        return $project;
    }


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