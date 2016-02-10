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
        			applicatorDetails.paymentStatus='Full';
        			//console.log(applicatorDetails);
					   
              ApplicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);	
        		}
        		if($scope.applicatorDetails.pendingAmount!=0 && $scope.applicatorDetails.received=='Yes'){
        			 $scope.showModal = true;
        			 console.log("Half Amount Paid");
        			 
        		}
        		if($scope.applicatorDetails.received=='No'){
        			$scope.showModal = true;
        			console.log("No Amount paid");
        			
        		}


        };
    $scope.processFollowup=function(applicatorDetails){
      
        	
        	if($scope.applicatorDetails.pendingAmount!=0 && $scope.applicatorDetails.received=='Yes'){
        		console.log("in pending amount function call");	
        		applicatorDetails.operation='createApplicator';
        		applicatorDetails.paymentStatus="Partial";
        		ApplicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);
        	   
          }
        	if($scope.applicatorDetails.received=='No'){

        		applicatorDetails.operation='createApplicator';
        		applicatorDetails.paymentStatus="No";
        		 
            ApplicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);
        	}	
        } 		



});
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
myApp.controller('ViewPackageController',function($scope,$http,PackageService) {
  
  $scope.oneAtATime = true;
  $scope.packages = [];

   $scope.packageDetails={
    operation :""
   };
  
    
   PackageService.viewPackages($scope,$http,$scope.packageDetails);
    
  
  
});

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

    $scope.viewPaymentDetails=function(){



    };
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

myApp.controller('ProjectPaymentController',function($scope,$http,ApplicatorService,$uibModal, $log){


    $scope.paymentDetails={
        operation:""
    };
    $scope.formSubmitted=false;
    $scope.showPaymentDetails=false;
    $scope.Projects=[
        {
            "project_id": "1",
            project_name: "project1",
            total_project_amount:"100000",
            total_paid_amount:"8000",
            paymentDetails:[
                {
                    amount_paid:"4000",
                    date_of_payment:"10-02-2000",
                    paid_to :"Namdev",
                    payment_mode :"cash"
                },
                {
                    amount_paid:"4000",
                    date_of_payment:"15-02-2000",
                    paid_to :"Namdev",
                    payment_mode :"cash"
                }
            ]
        },
        {
            "project_id": "2",
            project_name: "project2",
            total_project_amount:"111111",
            total_paid_amount:"70000",
            paymentDetails:[
                {
                    amount_paid:"20000",
                    date_of_payment:"10-02-2000",
                    paid_to :"Namdev",
                    payment_mode :"cash"
                },
                {
                    amount_paid:"50000",
                    date_of_payment:"15-02-2000",
                    paid_to :"Namdev",
                    payment_mode :"cash"
                }
            ]
        },
        {
            "project_id": "3",
            project_name: "project3",
            total_project_amount:"110000",
            total_paid_amount:"60000",
            paymentDetails:[
                {
                    amount_paid:"40000",
                    date_of_payment:"10-02-2000",
                    paid_to :"Namdev",
                    payment_mode :"cash"
                },
                {
                    amount_paid:"20000",
                    date_of_payment:"15-02-2000",
                    paid_to :"Namdev",
                    payment_mode :"cash"
                }
            ]
        }
    ];
    $scope.projectPayment=[];
    $scope.animationsEnabled=true;
    $scope.paymentReceivedFor=undefined;






    ApplicatorService.getApplicatorPaymentDetails($scope,$http,$scope.paymentDetails);


    $scope.viewProjectPaymentDetails=function(project_id){

        $scope.projectPayment=[];
        for(var index=0;index<$scope.Projects.length;index++){

            if($scope.Projects[index].project_id==project_id) {

                $scope.showPaymentDetails = true;
                if ($scope.Projects[index].total_paid_amount == null){

                    $scope.previousAmountPaid =0;
                }
                else{

                    $scope.previousAmountPaid=$scope.Projects[index].total_paid_amount;
                }
                $scope.packageAmount=$scope.Projects[index].total_project_amount;
                $scope.remainingAmount=$scope.packageAmount-$scope.previousAmountPaid;


                for(var index1=0;index1<$scope.Projects[index].paymentDetails.length;index1++){

                    $scope.projectPayment.push({
                        amount_paid:$scope.Projects[index].paymentDetails[index1].amount_paid,
                        date_of_payment:$scope.Projects[index].paymentDetails[index1].date_of_payment,
                        paid_to:$scope.Projects[index].paymentDetails[index1].paid_to,
                        payment_mode:$scope.Projects[index].paymentDetails[index1].payment_mode

                    });

                }
                break;
            }
        }

    }



    $scope.getPendingAmount=function(){
        console.log("In Pending amount function");
        $scope.paymentDetails.pendingAmount=parseInt($scope.packageAmount)-parseInt($scope.paymentDetails.amountPaid)-$scope.previousAmountPaid;

    }
    $scope.submitPaymentDetails=function(size,paymentDetails){

        console.log("In");
        $scope.formSubmitted=false;

        if($scope.paymentDetails.pendingAmount==0) {

            paymentDetails.paymentStatus='Yes';
            console.log(paymentDetails);
            // ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
        }
        else if($scope.paymentDetails.pendingAmount!=0){
            //$scope.showModal = true;

            paymentDetails.paymentStatus='No';

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',
                controller:  function ($scope, $uibModalInstance,paymentDetails) {


                    $scope.paymentDetails = paymentDetails;

                    $scope.ok = function () {

                        console.log($scope.paymentDetails);
                        // ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    paymentDetails: function () {
                        return $scope.paymentDetails;
                    }
                }
            });

            modalInstance.result.then(function (paymentDetails) {
                $scope.paymentDetails = paymentDetails;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        }
    }
    //$scope.processFollowup=function(paymentDetails){
    //
    //  ApplicatorService.savePaymentDetails($scope, $http, applicatorDetails);
    //}
});


// myApp.directive('modal', function () {
//     return {
//       template: '<div class="modal fade">' + 
//           '<div class="modal-dialog">' + 
//             '<div class="modal-content">' + 
//               '<div class="modal-header">' + 
//                 '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
//                 '<h4 class="modal-title">Schedule Followup</h4>' + 
//               '</div>' + 
//               '<div class="modal-body" ng-transclude></div>' +
//             '</div>' + 
//           '</div>' + 
//         '</div>',
//       restrict: 'E',
//       transclude: true,
//       replace:true,
//       scope:true,
//       link: function postLink(scope, element, attrs) {
//         scope.title = attrs.title;

//         scope.$watch(attrs.visible, function(value){
//           if(value == true)
//             $(element).modal('show');
//           else
//             $(element).modal('hide');
//         });

//         $(element).on('shown.bs.modal', function(){
//           scope.$apply(function(){
//             scope.$parent[attrs.visible] = true;
//           });
//         });

//         $(element).on('hidden.bs.modal', function(){
//           scope.$apply(function(){
//             scope.$parent[attrs.visible] = false;
//           });
//         });
//       }
//     };
//   });