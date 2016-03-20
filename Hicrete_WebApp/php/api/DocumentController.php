<?php
use \Jacwright\RestServer\RestException;
require 'Document.php';
class DocumentController
{
    /**
     * Gets workorder by project id
     *
     * @url GET /GenDoc
     */
    public function generateDoc(){
             $Doc = Document::generateDoc(); // possible user loading method
         return $Doc;
    }

   /**
     * Gets generate quotation
     * @url POST /GenDoc/Quotation
     */
    public function generateDocQuotation($data){
             $Doc = Document::generateDocQuotation($data); // possible user loading method
         return $Doc;
    }

  /**
     * Generate invoice
     *
     * @url POST /GenDoc/Invoice
     */
    public function generateDocInvoice($data){
             $Doc = Document::generateDocInvoice($data); // possible user loading method
         return $Doc;
    }

  
}