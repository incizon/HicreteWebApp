<?php


require 'Company.php';

class CompanyController
{
 

    public function getAllCompanies(){
             $company = Company::getAllCompanies(); // possible user loading method
         return $company;
    }

    

    
}
