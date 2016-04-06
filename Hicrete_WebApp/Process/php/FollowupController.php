<?php


require 'Followup.php';

class FollowupController
{
 

    public function getPaymentFollowup($id){
        try{
            $followup = Followup::getPaymentFollowup($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$followup);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }



    public function getApplicatorFollowup($id){
        try{
            $followup = Followup::getApplicatorFollowup($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$followup);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }




    public function getQuotationFollowup($id){
        try{
            $followup = Followup::getQuotationFollowup($id); // possible user loading method
            echo AppUtil::getReturnStatus("Successful",$followup);


        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }

    }
    public function getSitetrackingFollowup($id){
        try{
            $followup = Followup::getSitetrackingFollowup($id); // possible user loading method
                echo AppUtil::getReturnStatus("Successful",$followup);

        }catch(Exception $e){
            echo AppUtil::getReturnStatus("Unsuccessful",$e->getMessage());
        }


    }


    public function UpdatePaymentFollowup($Followupid,$data){
             $followup = Followup::UpdatePaymentFollowup($Followupid,$data); // possible user loading method
         return $followup;
    }



    public function UpdateQuotationFollowup($Followupid,$data){
             $followup = Followup::UpdateQuotationFollowup($Followupid,$data); // possible user loading method
         return $followup;
    }



    public function UpdateSiteTrackingFollowup($Followupid,$data){
             $followup = Followup::UpdateSiteTrackingFollowup($Followupid,$data); // possible user loading method
         return $followup;
    }



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