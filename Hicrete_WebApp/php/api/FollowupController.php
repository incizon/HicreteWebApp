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
             $followup = Followup::getPaymentFollowup($id); // possible user loading method
         return $followup;
    }

     /**
     * Gets followup quotation 
     *
     * @url GET /followup/quotation/$id
     */

    public function getQuotationFollowup($id){
        
             $followup = Followup::getQuotationFollowup($id); // possible user loading method
         return $followup;
    }

    /**
     * Gets followup site tracking
     *
     * @url GET /followup/sitetracking/$id
     */

    public function getSitetrackingFollowup($id){
             $followup = Followup::getSitetrackingFollowup($id); // possible user loading method
         return $followup;
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
             $followup = Followup::CreateQuotationFollowup($quotationId,$data); // possible user loading method
         return $followup;
    }

}