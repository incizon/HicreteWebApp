<?php
require_once '/../../php/appUtil.php';
require_once 'PhpWord/TemplateProcessor.php';
require_once '../Database.php';
//include_once 'Sample_Header.php';
//include_once 'Sample_Footer.php';

Class Document {
    
    public function generateDoc() {
        
        try {
            $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('resources/Sample_07_TemplateCloneRow.docx');

// Variables on different parts of document
$templateProcessor->setValue('weekday', htmlspecialchars(date('l'), ENT_COMPAT, 'UTF-8')); // On section/content
$templateProcessor->setValue('time', htmlspecialchars(date('H:i'), ENT_COMPAT, 'UTF-8')); // On footer
$templateProcessor->setValue('serverName', htmlspecialchars(realpath(__DIR__), ENT_COMPAT, 'UTF-8')); // On header

// Simple table
$templateProcessor->cloneRow('rowValue', 10);

$templateProcessor->setValue('rowValue#1', htmlspecialchars('Sun', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#2', htmlspecialchars('Mercury', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#3', htmlspecialchars('Venus', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#4', htmlspecialchars('Earth', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#5', htmlspecialchars('Mars', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#6', htmlspecialchars('Jupiter', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#7', htmlspecialchars('Saturn', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#8', htmlspecialchars('Uranus', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#9', htmlspecialchars('Neptun', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowValue#10', htmlspecialchars('Pluto', ENT_COMPAT, 'UTF-8'));

$templateProcessor->setValue('rowNumber#1', htmlspecialchars('1', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#2', htmlspecialchars('2', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#3', htmlspecialchars('3', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#4', htmlspecialchars('4', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#5', htmlspecialchars('5', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#6', htmlspecialchars('6', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#7', htmlspecialchars('7', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#8', htmlspecialchars('8', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#9', htmlspecialchars('9', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('rowNumber#10', htmlspecialchars('10', ENT_COMPAT, 'UTF-8'));

// Table with a spanned cell
$templateProcessor->cloneRow('userId', 3);

$templateProcessor->setValue('userId#1', htmlspecialchars('1', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userFirstName#1', htmlspecialchars('James', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userName#1', htmlspecialchars('Taylor', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userPhone#1', htmlspecialchars('+1 428 889 773', ENT_COMPAT, 'UTF-8'));

$templateProcessor->setValue('userId#2', htmlspecialchars('2', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userFirstName#2', htmlspecialchars('Robert', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userName#2', htmlspecialchars('Bell', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userPhone#2', htmlspecialchars('+1 428 889 774', ENT_COMPAT, 'UTF-8'));

$templateProcessor->setValue('userId#3', htmlspecialchars('3', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userFirstName#3', htmlspecialchars('Michael', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userName#3', htmlspecialchars('Ray', ENT_COMPAT, 'UTF-8'));
$templateProcessor->setValue('userPhone#3', htmlspecialchars('+1 428 889 775', ENT_COMPAT, 'UTF-8'));

//echo date('H:i:s'), ' Saving the result document...', EOL;
$templateProcessor->saveAs('GeneratedDocs/Sample_07_TemplateCloneRow.docx');



         } catch (PDOException $e) {
            echo $e->getMessage();
        }

       
    }

	public function generateDocQuotation($data)
	{
		try{
				//return $data;
				$company_name ="test company";
				//$company_add = $data->Address+","+$data->City+","+$data->State+","+$data->Country+","+$data->City+":"+$data->Pincode+"";
				$company_add  = "pune";
				$templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('resources/Quotation.docx');
				$rownum = sizeof($data->Quotation);
			//$templateProcessor->setValue('Date', $date->Date); // On section/content
				$templateProcessor->setValue('Date', $data->DateOfQuotation);
				$templateProcessor->setValue('company_name', $data->CompanyName);
				$templateProcessor->setValue('company_add', "Pune");
				$templateProcessor->setValue('company_add', "Pune");
				$templateProcessor->setValue('quotationTitle', $data->QuotationTitle);
				//$templateProcessor->setValue('QtTitle', $data->QuotationTitle);
				$templateProcessor->setValue('ref', $data->RefNo);

				$templateProcessor->cloneRow('Description', $rownum);
			/*	for($i=0;$i<$rownum;$i++){
					$templateProcessor->setValue('Description', $data->Quotation[$i]->Description);
					$templateProcessor->setValue('qty', $data->Quotation[$i]->Quantity);
					$templateProcessor->setValue('rate', $data->Quotation[$i]->UnitRate);
					$templateProcessor->setValue('amount', $data->Quotation[$i]->Amount);
				}*/
						$TotalAmount =0;
					for($i = 0;$i<$rownum;$i++){
						$y = $i+1;
						$sr = "SrNo#".$y;
						$title = "QtTitle#".$y;
						$des = "Description#".$y;
						$qt = "qty#".$y;
						$rat = "rate#".$y;
						$amt = "amount#".$y;
						$templateProcessor->setValue($sr, htmlspecialchars($y, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($title, htmlspecialchars( $data->Quotation[$i]->Title, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($des, htmlspecialchars($data->Quotation[$i]->Description, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($qt, htmlspecialchars($data->Quotation[$i]->Quantity, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($rat, htmlspecialchars($data->Quotation[$i]->UnitRate, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($amt, htmlspecialchars($data->Quotation[$i]->Amount, ENT_COMPAT, 'UTF-8'));
						$TotalAmount = $TotalAmount + $data->Quotation[$i]->Amount;
				}

				$templateProcessor->setValue('Qt_Total', $TotalAmount);
				$templateProcessor->setValue('QT_company_name', $data->CompanyName );
				

			$templateProcessor->saveAs('GeneratedDocs/Quotations/'.$data->QuotationTitle.'.docx');

			//echo getEndingNotes(array('Word2007' => 'docx'));
			echo "Doc gen success";
		}	
		catch(PDOException $e){
			return "Exception in generateDocQuotation".$e->getMessage();
		}
	}   

public function generateDocInvoice($data){
	try{
			//$InvoiceNo = ;
			$today = date("Y-m-d");
			$contacPerson = $data->ContactPerson;
			$taxSize = sizeof($data->TaxJson);

			$rownum = sizeof($data->Quotation);

				$templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('resources/Invoice.docx');

				$templateProcessor->setValue('InvoiceNo', $data->InvoiceNo);
				$templateProcessor->setValue('InvoiceDate', $data->InvoiceDate);
				$templateProcessor->setValue('QuotationNo', $data->QuotationId);
				$templateProcessor->setValue('QuotationDate', $data->QuotationDate);
				$templateProcessor->setValue('WorkorderDate', $data->WorkOrderDate);
				$templateProcessor->setValue('ContactPerson', $data->ContactPerson);

				$templateProcessor->cloneRow('Description', $rownum);
					for($i = 0;$i<$rownum;$i++){
						$y = $i+1;
						$sr = "SrNo#".$y;
						$des = "Description#".$y;
						$qt = "Qty#".$y;
						$rat = "rate#".$y;
						$amt = "Amount#".$y;
						$templateProcessor->setValue($sr, htmlspecialchars($y, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($des, htmlspecialchars($data->Quotation[$i]->Description, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($qt, htmlspecialchars($data->Quotation[$i]->Quantity, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($rat, htmlspecialchars($data->Quotation[$i]->UnitRate, ENT_COMPAT, 'UTF-8'));
						$templateProcessor->setValue($amt, htmlspecialchars($data->Quotation[$i]->Amount, ENT_COMPAT, 'UTF-8'));

				}

			$templateProcessor->setValue('TotalAmount', $data->TotalAmount);
			$templateProcessor->setValue('RoundOff', $data->RoundingOffFactor);
			$templateProcessor->setValue('GrandTotal', $data->GrandTotal);

			$templateProcessor->saveAs('GeneratedDocs/Invoices/'.$data->InvoiceNo.'.docx');



	}
	catch(PDOException $e){
		return "Exception in generateDocInvoice".$e->getMessage();
	}
	
	
			return "Success";

}


}