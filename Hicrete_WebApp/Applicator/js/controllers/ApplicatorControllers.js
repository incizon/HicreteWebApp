/*

    ApplicatorController:
                          1. Create applicator.
                             Methods
                             1.viewPackages() :- To view Package details while creation of applicator.
                             2.getPackageDetails :-Get Details of selected package.
                             3.getPendingAmount :-Return pending amount of applicator.
                             4.checkPaymentStatus :- return true or false depending on payment status i.e full/partial/no
                             5.processForm :- Process the applicatorDetails and call service to submit details to server.
                             6.processFollowUp :- Process the applicator follow up details  and call service to submit details to server.
 */

myApp.controller('ApplicatorController',function($scope,$http,ApplicatorService,PackageService){

$scope.step=1;
$scope.package_total_amount=0;
$scope.showModal = false;
$scope.packageDetailsShow='No';
$scope.applicatorDetails={

 						operation:""
 					};

$scope.packageDetails={
	 					operation :""
	 				};

$scope.packages=[];
$scope.elementDetails=[{
						element_name:"",
						element_quantity:"",
						element_rate:"",
						element_amount:""
					}];

    $scope.today = function() {
        $scope.applicatorDetails.paymentDate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.applicatorDetails.paymentDate = null;
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

	PackageService.viewPackages($scope,$http,$scope.packageDetails);

	$scope.nextStep = function() {
				
					$scope.formSubmitted=false;
					
					$scope.step++;

				}
 
	$scope.prevStep = function() {
					$scope.step--;
				
				}

	
	$scope.getPackageDetails=function(packageID){
				packageID=packageID-1;
				$scope.packageDetailsShow='Yes';				
				$scope.package_description=$scope.packages[packageID].package_description;
                $scope.package_total_amount=$scope.packages[packageID].package_total_amount;
				$scope.packageTotalAmount=0;
				$scope.elementDetails=[];
				for(var index=0;index<$scope.packages[packageID].elementType.length;index++){
						console.log("in for");
					$scope.elementDetails.push({ 
							element_name:$scope.packages[packageID].elementType[index].element_name,
							element_quantity:$scope.packages[packageID].elementType[index].element_quantity,
							element_rate:$scope.packages[packageID].elementType[index].element_rate,
							element_amount:$scope.packages[packageID].elementType[index].element_amount
						
						});
						
						
				}
				
				
		}
	$scope.getPendingAmount=function(){
				console.log("In Pending amount function");
				$scope.applicatorDetails.pendingAmount=parseInt($scope.package_total_amount)-parseInt($scope.applicatorDetails.amountpaid);
			}
	$scope.checkPaymentStatus=function(){
				if($scope.applicatorDetails.received=='Yes'){

					return false;
				}
				else{
					return true;
				}
			}

    $scope.today = function() {
        $scope.paymentDate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.paymentDate = null;
    };


    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

	$scope.processForm = function(applicatorDetails) {
        		
        		$scope.formSubmitted=false;
        		
        		if($scope.applicatorDetails.pendingAmount==0 && $scope.applicatorDetails.received=='Yes'){
        			
        			console.log("Full Amount Paid ");
        			applicatorDetails.operation='createApplicator';
        			applicatorDetails.paymentStatus='Yes';
        			console.log(applicatorDetails);
					   
                    //applicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);
        		}
        		if(($scope.applicatorDetails.pendingAmount!=0 && $scope.applicatorDetails.received=='Yes')||($scope.applicatorDetails.received=='No')){
        			 $scope.showModal = true;
        			 console.log("Half Amount Paid");
        			 
        		}
        		//if($scope.applicatorDetails.received=='No'){
        		//	$scope.showModal = true;
        		//	console.log("No Amount paid");
        		//
        		//}


        };
    $scope.processFollowup=function(applicatorDetails){
      

        		applicatorDetails.operation='createApplicator';
        		applicatorDetails.paymentStatus="No";
                console.log(applicatorDetails);
        //applicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);

        };



});
/*
    PackageController :-
                        1.Create Package
                        Methods
                        1.add :- to add no of element in package.
                        2.remove :- to remove particular element from package details.
                        3.clearFields :-To clear fields form.
                        4.addField :- Push the element in elementType array in packageDetails.
                        5.processPackage :- Process The package Details.and call service to submit package details to create it.
 */
myApp.controller('PackageController',function($scope,$http,PackageService){

    $scope.packageDetails={
      
              elementType:[]
                    
            };
           
    $scope.showElementField=false;        
    //Clear form Fields
    
    
    $scope.clearFields=function(packageDetails){

            packageDetails.packagedescription="";
            packageDetails.packagename="";
            packageDetails.elementType=[];
 
          };
          
       //Adding Number of Fields
        $scope.add = function () {
          
         
          $scope.showElementField=true;
         
          console.log($scope.noOfElement);
          for (var i = 0; i < $scope.noOfElement; i++) {
      
                        //console.log("Inside For Loop of Add fields");
                        $scope.addField();
                  };
          
          //$scope.noOfElement=""; 
        };

        
    $scope.clear =function() {
              
              $scope.packageDetails.elementType.splice(0,$scope.packageDetails.elementType.length);//Remove items in array elementType
          
            };
            
    //Removing field selected
        $scope.remove= function(index){
    
              $scope.packageDetails.elementType.splice(index,1); //remove item by index 
            };
    
    //Adding fields to packageDetails     
        
    $scope.addField= function(){

          $scope.packageDetails.elementType.push({ 
            
            type:"",
            quantity:"",
            rate:""
            
          });
        };
    
    //Submitting packageDetails to create package.
    
    $scope.processPackage = function(packageDetails) {
        $scope.packageFormSubmitted=false;
        PackageService.createPackage($scope,$http,packageDetails);      

    };

});
/*
      View PackageController :-
                            1. View Available Packages
                            Methods
                            1.paginatePackage :-Do pagination of total packages.
                            2.ViewPackages    :-View Total available packages.


 */
myApp.controller('ViewPackageController',function($scope,$http,PackageService) {
  
    $scope.oneAtATime = true;
    $scope.packages = [];

    $scope.totalPackages =0;
    $scope.packagePerPage=5;
    $scope.currentPackagePage = 1;


    $scope.packageDetails={
    operation :""
   };


   PackageService.viewPackages($scope,$http,$scope.packageDetails);

    $scope.paginatePackage = function(value) {

        var begin, end, index;
        begin = ($scope.currentPackagePage - 1) * $scope.packagePerPage;
        end = begin + $scope.packagePerPage;
        index = $scope.packages.indexOf(value);
       
        return (begin <= index && index < end);
    };



});

/*
    ViewTentetiveApplicatorController :
                                         View Tentative Applicators
                                           Methods
                                          1. ViewApplicatorDetails :- View all tentative applicators details.
                                          2. ApplicatorSelected :- View Details of selected applicator in modal.
                                          3. applicatorToModify  :- To modify applicator general information.

 */
myApp.controller('ViewTentetiveApplicatorController',function($scope,$http,ApplicatorService){


    $scope.Applicators=[];
    $scope.totalItems =0;
    $scope.currentPage = 1;
    $scope.packages=[];
    $scope.ApplicatorPerPage = 5;
    $scope.applicatorDetails={
      applicator:"tentetive",
      operation:""
    };
    ApplicatorService.viewApplicatorDetails($scope,$http,$scope.applicatorDetails);

        $scope.paginate = function(value) {
            //console.log("In Paginate");
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.ApplicatorPerPage;
            end = begin + $scope.ApplicatorPerPage;
            index = $scope.Applicators.indexOf(value);
                //console.log(index);
              return (begin <= index && index < end);
          };  
          
        $scope.ApplicatorSelected = function (tentetiveApplicator) {
          $scope.selectedTentetiveApplicator = tentetiveApplicator;
          
      };

        $scope.applicatorToModify=function(tentetiveApplicator){
          $scope.applicatorDetails.applicator_id=tentetiveApplicator.applicator_master_id;
          $scope.applicatorDetails.firmname=tentetiveApplicator.applicator_name;
          $scope.applicatorDetails.addressline1=tentetiveApplicator.applicator_address_line1;
          $scope.applicatorDetails.addressline2=tentetiveApplicator.applicator_address_line2;
          $scope.applicatorDetails.contactno=tentetiveApplicator.applicator_contact;
          $scope.applicatorDetails.city=tentetiveApplicator.applicator_city;
          $scope.applicatorDetails.state=tentetiveApplicator.applicator_state;
          $scope.applicatorDetails.country=tentetiveApplicator.applicator_country;
          $scope.applicatorDetails.cstnumber=tentetiveApplicator.applicator_cst_number;
          $scope.applicatorDetails.pannumber=tentetiveApplicator.applicator_pan_number;
          $scope.applicatorDetails.servicetaxnumber=tentetiveApplicator.applicator_stax_number;
          $scope.applicatorDetails.vatnumber=tentetiveApplicator.applicator_vat_number;
          $scope.applicatorDetails.pointofcontact=tentetiveApplicator.point_of_contact; 
          $scope.applicatorDetails.pointcontactno=tentetiveApplicator.point_of_contact_no;

        };

});
/*
    ViewPermanentApplicatorController :
                                View Permanent Applicators
                                Methods
                                1. ViewApplicatorDetails :- View all permanent applicators details.
                                2. ApplicatorSelected :- View Details of selected applicator in modal.
                                3. applicatorToModify  :- To modify applicator general information.

 */
myApp.controller('ViewPermanentApplicatorController',function($scope,$http,ApplicatorService){

    $scope.Applicators=[];
    $scope.totalItems =0;
    $scope.currentPage = 1;
    $scope.packages=[];
    $scope.ApplicatorPerPage = 5;
    $scope.applicatorDetails={

      applicator:"permanent",
      operation:""
    };

    ApplicatorService.viewApplicatorDetails($scope,$http,$scope.applicatorDetails);

        $scope.paginate = function(value) {
            //console.log("In Paginate");
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.ApplicatorPerPage;
            end = begin + $scope.ApplicatorPerPage;
            index = $scope.Applicators.indexOf(value);
                //console.log(index);
              return (begin <= index && index < end);
          };  
          
        $scope.ApplicatorSelected = function (permanentApplicator) {
          $scope.selectedPermanentApplicator = permanentApplicator;
          console.log(permanentApplicator);
      };

      
        $scope.applicatorToModify=function(permanentApplicator){
          $scope.applicatorDetails.applicator_id=permanentApplicator.applicator_master_id;
          $scope.applicatorDetails.firmname=permanentApplicator.applicator_name;
          $scope.applicatorDetails.addressline1=permanentApplicator.applicator_address_line1;
          $scope.applicatorDetails.addressline2=permanentApplicator.applicator_address_line2;
          $scope.applicatorDetails.contactno=permanentApplicator.applicator_contact;
          $scope.applicatorDetails.city=permanentApplicator.applicator_city;
          $scope.applicatorDetails.state=permanentApplicator.applicator_state;
          $scope.applicatorDetails.country=permanentApplicator.applicator_country;
          $scope.applicatorDetails.cstnumber=permanentApplicator.applicator_cst_number;
          $scope.applicatorDetails.pannumber=permanentApplicator.applicator_pan_number;
          $scope.applicatorDetails.servicetaxnumber=permanentApplicator.applicator_stax_number;
          $scope.applicatorDetails.vatnumber=permanentApplicator.applicator_vat_number;
          $scope.applicatorDetails.pointofcontact=permanentApplicator.point_of_contact; 
          $scope.applicatorDetails.pointcontactno=permanentApplicator.point_of_contact_no;

        };



});

/*
            ApplicatorPaymentController:
                                        To Update Payment of tentative applicators.
                                        Methods
                                        1.getApplicatorPaymentDetails :- get details of applicator previous payment details.
                                        2.applicatorPaymentDetails :-calculate remaining amount and view payment details of particular applicator.
                                        3.getPendingAmount :- calculate pending amount if payment is partial done.
                                        4.submitPaymentDetails :- Process payment details and call service to submit details to server.
                                        5.processFollowup :- Process follow up if partial payment is done and call service to submit details to server.

 */
myApp.controller('ApplicatorPaymentController',function($scope,$http,ApplicatorService){

    $scope.applicatorDetails={
        operation:""
    };
   $scope.formSubmitted=false;
    $scope.showPaymentDetails=false;
    $scope.Applicators=[];
    $scope.paymentDetails=[];

    ApplicatorService.getApplicatorPaymentDetails($scope,$http,$scope.applicatorDetails);


    $scope.applicatorPaymentDetails=function(enrollmentId){

        $scope.paymentDetails=[];
        for(var index=0;index<$scope.Applicators.length;index++){

               if($scope.Applicators[index].enrollment_id==enrollmentId) {

                   $scope.showPaymentDetails = true;
                    if ($scope.Applicators[index].total_paid_amount == null){

                        $scope.previousAmountPaid =0;
                    }
                    else{

                        $scope.previousAmountPaid=$scope.Applicators[index].total_paid_amount;
                    }
                         $scope.packageAmount=$scope.Applicators[index].package_total_amount;
                         $scope.remainingAmount=$scope.packageAmount-$scope.previousAmountPaid;


                   for(var index1=0;index1<$scope.Applicators[index].paymentDetails.length;index1++){

                       $scope.paymentDetails.push({
                           amount_paid:$scope.Applicators[index].paymentDetails[index1].amount_paid,
                           date_of_payment:$scope.Applicators[index].paymentDetails[index1].date_of_payment,
                           paid_to:$scope.Applicators[index].paymentDetails[index1].paid_to,
                           payment_mode:$scope.Applicators[index].paymentDetails[index1].payment_mode

                       });

                   }
                     break;
               }
        }

    }


    $scope.getPendingAmount=function(){
        console.log("In Pending amount function");
        $scope.applicatorDetails.pendingAmount=parseInt($scope.packageAmount)-parseInt($scope.applicatorDetails.amountpaid)-$scope.previousAmountPaid;

    }
    $scope.submitPaymentDetails=function(applicatorDetails){

        $scope.formSubmitted=false;

       if($scope.applicatorDetails.pendingAmount==0) {

           applicatorDetails.paymentStatus='Full';
           ApplicatorService.savePaymentDetails($scope, $http, applicatorDetails);
       }
        else if($scope.applicatorDetails.pendingAmount!=0){
           $scope.showModal = true;
           applicatorDetails.paymentStatus='Partial';

       }
    }
    $scope.processFollowup=function(applicatorDetails){

        ApplicatorService.savePaymentDetails($scope, $http, applicatorDetails);
    }
});
