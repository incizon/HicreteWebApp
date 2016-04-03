<?php

require 'Document.php';
class DocumentController
{

    public function generateDoc(){
             $Doc = Document::generateDoc(); // possible user loading method
         return $Doc;
    }


    public function generateDocQuotation($data){
             $Doc = Document::generateDocQuotation($data); // possible user loading method
         return $Doc;
    }


    public function generateDocInvoice($data){
             $Doc = Document::generateDocInvoice($data); // possible user loading method
         return $Doc;
    }

  
}