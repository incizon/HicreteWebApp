<?php


require 'Quotation.php';

class QuotationController
{
 

    public static function getQuotationFollow($id){

        try{
            if ($id !=null) {
                $Quotation = Quotation::loadQuotationFollowup($id); // possible user loading method
            }

            if(sizeof($Quotation)>0){
                echo AppUtil::getReturnStatus("Successful",$Quotation);
            }
            else {
                echo AppUtil::getReturnStatus("Unsuccessful", "Data not found");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }


         return $Quotation;
    }

    public static function getQuotationList($id){
        try{
            $quotation = Quotation::getQuotationListForProject($id);
            echo AppUtil::getReturnStatus("Successful",$quotation);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }

    public function getQuotationTax($id){
             $Quotation = Quotation::loadQuotationWithTax($id); // possible user loading method
         return $Quotation;
    }


    public static function reviseQuotation($qid,$data){
        try{

            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($data != null && $qid!=null) {

                    $Quotation = $Quotation = Quotation::reviseQuotation($qid,$data); // possible user loading method;

                    if($Quotation==1) {
                        echo AppUtil::getReturnStatus("Successful", "Quotation Revised successfully");
                    }else if($Quotation==0){
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }else if($Quotation==2){
                        echo AppUtil::getReturnStatus("Unsuccessful","Quotation reference number is already present");
                    }else if($Quotation==3){
                        echo AppUtil::getReturnStatus("Unsuccessful","Quotation Title already used for another quotaion");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Data value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    public static function getQuotationDetails($qid){

        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($qid != null) {
                    $Quotation = Quotation::getQuotationDetails($qid);
                    if($Quotation!==null) {
                        echo AppUtil::getReturnStatus("Successful", $Quotation);
                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Quotation value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


    }


    public static function getQuotationTaxDetails($qid){
        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($qid != null) {
                    $Quotation = Quotation::getQuotationTaxDetails($qid); // possible user loading method
                    if($Quotation!==null) {
                        echo AppUtil::getReturnStatus("Successful", $Quotation);
                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Quotation value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    public function getAllQuotation()
    {
         
        $Quotation = Quotation::loadAllQuotation();
       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $Quotation;
    }



    public function getQuotationByProjectId($projectId = null)
    {

        try{

            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($projectId != null) {
                    $Quotation = Quotation::loadAllQuotationByProjId($projectId);
                    //echo json_encode($Quotation);
                    if($Quotation!==null) {
                        echo AppUtil::getReturnStatus("Successful", $Quotation);
                    }else{
                        echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                    }
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Data not found");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    public function saveQuotationDetailsAndTax($data)
    {
        try{

            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($data != null) {

                    if(Quotation::isRefNoPresent($data->Quotation->RefNo)){
                        echo AppUtil::getReturnStatus("Unsuccessful","Quotation reference number is already present");
                        return;
                    }
                    if(Quotation::isQuotationTitlePresent($data->Quotation->ProjectId,$data->Quotation->QuotationTitle)){
                        echo AppUtil::getReturnStatus("Unsuccessful","Quotation Title already used for another quotaion");
                        return;
                    }

                    $Quotation = Quotation::saveQuotationDetailsAndTax($data);

                    if($Quotation) {
                        echo AppUtil::getReturnStatus("Successful", "Quotation created successfully");
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

    public function getQuotationDetailsAndTax($id = null, $data)
    {
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        $data->id = $id;
        $Quotation = Quotation::getQuotationDetailsAndTax($data); // saving the user to the database
        
        return $Quotation; // returning the updated or newly created user object
    }


    public function updateQuotation($id,$data){
        $Quotation = Quotation::updateQuotation($id,$data);
        return $Quotation;
    }



    public static function isQuotationAlreadyUploadedForAnotherQuotation($quotationId,$quotationBlob){
        try{

            if($quotationId!==null && $quotationBlob!=null) {

                if(!Quotation::isQuotationAlreadyUploadedForAnotherQuotation($quotationBlob,$quotationId)){
                    echo AppUtil::getReturnStatus("Successful", "Quotation not Already Uploaded");
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Quotation Already Uploaded");
                }

            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Invalid Parameters");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    public static function isQuotationAlreadyUploaded($quotationBlob){
        try{

            if($quotationBlob!=null) {

                if(!Quotation::isQuotationAlreadyUploaded($quotationBlob)){
                    echo AppUtil::getReturnStatus("Successful", "Quotation not Already Uploaded");
                }else{
                    echo AppUtil::getReturnStatus("Unsuccessful", "Quotation Already Uploaded");
                }

            }else{
                echo AppUtil::getReturnStatus("Unsuccessful", "Invalid Parameters");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }



    public function deleteQuotation($id){
        $quotation = Quotation::deleteQuotation($id);
        return $quotation;
    }


    public function uploadQuotation($data){
        $target_dir = "../../upload/Quotations/";
        $target_file = $target_dir . basename($_FILES["file"]["name"]);
        $file = $_FILES['file'];
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            echo "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }



}