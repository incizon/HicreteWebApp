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
				
				if($scope.applicatorDetails.pendingAmount!=0){
					
					console.log("In pending amount if");
					
				}
			}
	$scope.checkPaymentStatus=function(){
				if($scope.applicatorDetails.received=='Yes'){

					return false;
				}
				else{
					return true;
				}
			}
			
	$scope.processForm = function(applicatorDetails) {
        		
        		$scope.formSubmitted=false;
        		
        		if($scope.applicatorDetails.pendingAmount==0 && $scope.applicatorDetails.received=='Yes'){
        			
        			console.log("Full Amount Paid ");
        			applicatorDetails.operation='create';
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
        		applicatorDetails.operation='create';
        		applicatorDetails.paymentStatus="Partial";
        		ApplicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);
        	   
          }
        	if($scope.applicatorDetails.received=='No'){

        		applicatorDetails.operation='create';
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