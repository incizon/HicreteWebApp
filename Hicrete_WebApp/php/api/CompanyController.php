<?php

use \Jacwright\RestServer\RestException;
require 'Company.php';

class CompanyController
{
 
    /**
     * Gets All Companies  
     *
     * @url GET /company
     */

    public function getAllCompanies(){
             $company = Company::getAllCompanies(); // possible user loading method
         return $company;
    }

    

    
}
