<?php

use \Jacwright\RestServer\RestException;
require 'Followup.php';

class FollowupController
{
 
    /**
     * Gets followup for project payment by project id
     *
     * @url GET /followup/payment/$id
     */
    public function getPaymentFollowup($id){
        try{
            $followup = Followup::getPaymentFollowup($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$followup);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    /**
     * Gets followup for project payment by project id
     *
     * @url GET /followup/payment/$id
     */
    public function getApplicatorFollowup($id){
        try{
            $followup = Followup::getApplicatorFollowup($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$followup);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }



     /**
     * Gets followup quotation 
     *
     * @url GET /followup/quotation/$id
     */
    public function getQuotationFollowup($id){
        try{
            $followup = Followup::getQuotationFollowup($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$followup);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    /**
     * Gets followup site tracking
     *
     * @url GET /followup/sitetracking/$id
     */

    public function getSitetrackingFollowup($id){
        try{
            $followup = Followup::getSitetrackingFollowup($id); // possible user loading method
                echo AppUtil::getReturnStatus("Successful",$followup);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


    }

     /**
     * Update payment followup by followup id
     *
     * @url POST /followup/payment/update/$Followupid
     */

    public function UpdatePaymentFollowup($Followupid,$data){
             $followup = Followup::UpdatePaymentFollowup($Followupid,$data); // possible user loading method
         return $followup;
    }

     /**
     * Update Quotation followup by followup id
     *
     * @url POST /followup/quotation/update/$Followupid
     */

    public function UpdateQuotationFollowup($Followupid,$data){
             $followup = Followup::UpdateQuotationFollowup($Followupid,$data); // possible user loading method
         return $followup;
    }

     /**
     * Update Quotation followup by followup id
     *
     * @url POST /followup/siteTracking/update/$Followupid
     */

    public function UpdateSiteTrackingFollowup($Followupid,$data){
             $followup = Followup::UpdateSiteTrackingFollowup($Followupid,$data); // possible user loading method
         return $followup;
    }

    /**
     * Create quotation followup by quotation id
     *
     * @url POST /followup/quotation/create/$quotationId
     */

    public function CreateQuotationFollowup($quotationId,$data){
        try{

            $userId=AppUtil::getLoggerInUserId();
            if($userId!=null){
                if(Followup::CreateQuotationFollowup($quotationId,$data,$userId)){
                    echo AppUtil::getReturnStatus("Successful","Quotation Followup is created");
                } else{
                    echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
                }
            }
            else{
                echo AppUtil::getReturnStatus("Unsuccessful","User Id is null");
            }



        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    /**
     * Schedule payment followup by followup id
     *
     * @url POST /schedule/followup/payment/$followupId
     */

    public function schedulePaymentFollowup($followupId,$data){
        try{
            if(Followup::schedulePaymentFollowup($followupId,$data)){
                echo AppUtil::getReturnStatus("Successful","Conduction Successful");
            } else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    /**
     * Schedule quotation followup by followup id
     *
     * @url POST /schedule/followup/quotation/$followupId
     */

    public function scheduleQuotationFollowup($followupId,$data){
        try{
            if(Followup::scheduleQuotationFollowup($followupId,$data)){
                echo AppUtil::getReturnStatus("Successful","Conduction Successful");
            } else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    /**
     * Schedule Sitetraking followup by followup id
     *
     * @url POST /schedule/followup/siteTracking/$followupId
     */

    public function schedulesiteTrackingFollowup($followupId,$data){
        try{
            if(Followup::scheduleSiteTrackingFollowup($followupId,$data)){
                echo AppUtil::getReturnStatus("Successful","Conduction Successful");
            } else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    /**
     * Create payment followup by invoice id
     *
     * @url POST /followup/payment/create/$invoiceId
     */

    public function CreatePaymentFollowup($invoiceId,$data,$userId){
        try{
            if(Followup::CreatePaymentFollowup($invoiceId,$data,$userId)){
                echo AppUtil::getReturnStatus("Successful","Conduction Successful");
            } else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    /**
     * Create payment followup by invoice id
     *
     * @url POST /followup/sitetracking/create/$projectId
     */

    public function CreateSiteTrackingFollowup($projectId,$data,$userId){
        try{
            if(Followup::CreateSiteTrackingFollowup($projectId,$data,$userId)){
                echo AppUtil::getReturnStatus("Successful","Conduction Successful");
            } else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


    /**
     * Create payment followup by invoice id
     *
     * @url POST /followup/sitetracking/create/$projectId
     */

    public function CreateApplicatorFollowup($applicatorId,$data,$userId){
        try{
            if(Followup::CreateApplicatorFollowup($applicatorId,$data,$userId)){
                echo AppUtil::getReturnStatus("Successful","Conduction Successful");
            } else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }

    /**
     * Schedule quotation followup by followup id
     *
     * @url POST /schedule/followup/quotation/$followupId
     */

    public function ConductApplicatorFollowup($followupId,$data){
        try{
            if(Followup::ConductApplicatorFollowup($followupId,$data)){
                echo AppUtil::getReturnStatus("Successful","Conduction Successful");
            } else{
                echo AppUtil::getReturnStatus("Unsuccessful","Database Error Occurred");
            }
        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }


}