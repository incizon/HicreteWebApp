<?php

	  include("PackageClassLib.php");

	 
	 $packageDetails=json_decode($_GET["packageDetails"]);

	 $operation=$packageDetails->operation;
     
     $package=new Package();

	 switch ($operation) {
	  	case 'create':
	  					
	  				 if($package->createPackage($packageDetails))
	  				 	{
	  				 		echo "Package Created Successfully";
	  				 	}
	  				 else{

	  				 		echo "Could not create pacakge";
	  				 }	

	  		break;
	  	
	  	case 'view':

	  				if(!$package->viewPackages()){

	  					echo "Could not view package details";
	  				}

	  		break;
	  	default:
	  		# code...
	  		break;
	  } 

	 

?>