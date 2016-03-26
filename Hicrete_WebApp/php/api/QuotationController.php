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

    public function getQuotationFollow($id = null){

        try{
            if ($id !=null) {
                $Quotation = Quotation::loadQuotationFollowup($id); // possible user loading method
            } else {
                $Quotation = Quotation::loadAllQuotationFollowup();
            }

            if($Quotation!=null){
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

    public function reviseQuotation($qid,$data){
             $Quotation = Quotation::reviseQuotation($qid,$data); // possible user loading method
         return $Quotation;
    }

      /**
     * Gets the quotation details
     *
     * @url GET /quotation/details/$qid
     */

    public function getQuotationDetails($qid){

        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($qid != null) {
                    $Quotation = Quotation::getQuotationDetails($qid);
                    if($Quotation!=null) {
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

    public function getQuotationTaxDetails($qid){
        try{
            $loggedInUserId=AppUtil::getLoggerInUserId();
            if($loggedInUserId!=null) {

                if ($qid != null) {
                    $Quotation = Quotation::getQuotationTaxDetails($qid); // possible user loading method
                    if($Quotation!=null) {
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
                    if($Quotation!=null) {
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
        // ... validate $data properties such as $data->username, $data->firstName, etc.
        
        $Quotation = Quotation::saveQuotationDetailsAndTax($data); // saving the user to the database
        
        return $Quotation; // returning the updated or newly created user object
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

    public static function getQuotationList($id){
        try{
            $quotation = Quotation::getQuotationListForProject($id);
            echo AppUtil::getReturnStatus("Successful",$quotation);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful","Unknown database error occurred");
        }

    }

}