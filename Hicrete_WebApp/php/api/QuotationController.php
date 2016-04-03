<?php

use \Jacwright\RestServer\RestException;
require 'Quotation.php';

class QuotationController
{
 
    /**
     * Gets the quotation along with followup details
     *
     * @url GET /quotation/followup/$id
     */

    public static function getQuotationFollow($id = null){

        try{
            if ($id !=null) {
                $Quotation = Quotation::loadQuotationFollowup($id); // possible user loading method
            } else {
                $Quotation = Quotation::loadAllQuotationFollowup();
            }

            if($Quotation!==null){
                echo AppUtil::getReturnStatus("Successful",$Quotation);
            }
            else {
                echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }


         return $Quotation;
    }
    /**
     *
     *
     * @url POST /quotationlist/$id
     *
     */

    public static function getQuotationList($id){
        try{
            $quotation = Quotation::getQuotationListForProject($id);
            echo AppUtil::getReturnStatus("Successful",$quotation);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }
    /**
     * Gets the quotation with tax details
     *
     * @url GET /quotation/tax/$id
     */

    public function getQuotationTax($id){
             $Quotation = Quotation::loadQuotationWithTax($id); // possible user loading method
         return $Quotation;
    }

    /**
     * Revise quotation
     *
     * @url POST /quotation/revise/$qid
     */

    public static function reviseQuotation($qid,$data){
        try{

            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($data != null && $qid!=null) {

                    $Quotation = $Quotation = Quotation::reviseQuotation($qid,$data); // possible user loading method;

                    if($Quotation==1) {
                        echo AppUtil::getReturnStatus("Successful", "Quotation created successfully");
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

      /**
     * Gets the quotation details
     *
     * @url GET /quotation/details/$qid
     */

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

   /**
     * Gets the quotation tax detail
     *
     * @url GET /quotation/taxDetails/$qid
     */

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

    /**
     * Gets all quotations
     *
     * @url GET /quotation
     */

    public function getAllQuotation()
    {
         
        $Quotation = Quotation::loadAllQuotation();
       // return array("id" => $id, "name" => null); // serializes object into JSON
         return $Quotation;
    }


    /**
     * Gets  quotations by project id
     *
     * @url GET /quotation/$projectId
     */

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
                    echo AppUtil::getReturnStatus("Unsuccessful", "Project value is empty");
                }


            }

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    /**
     * Saves Quotation with details and tax details only
     *
     * @url POST /quotation/tax
     * 
     */
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

       /**
     * Get Quotation with details and tax details only
     *
     * @url GET /quotation/tax
     * @url PUT /quotation/tax/$id
     */
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

    /**
     * delete quotation By id
     *
     * @url POST /quotation/delete/$id
     * 
     */

    public function deleteQuotation($id){
        $quotation = Quotation::deleteQuotation($id);
        return $quotation;
    }

    /**
     * upload quotation
     *
     * @url POST /quotation/upload
     * 
     */

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


    /**
     * delete customer using id
     *
     * @url POST /quotationlist/$id
     *
     */

//    public static function getQuotationList($id){
//        try{
//            $quotation = Quotation::getQuotationListForProject($id);
//            echo AppUtil::getReturnStatus("Successful",$quotation);
//
//        }catch(Exception $e){
//            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
//        }
//
//    }

}