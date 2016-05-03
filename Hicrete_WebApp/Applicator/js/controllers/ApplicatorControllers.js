myApp.controller('ApplicatorController',function($scope,$rootScope,$http,ApplicatorService,PackageService,$uibModal, $log,AppService) {

    $scope.step=1;
    $scope.editPackage=false;
    $scope.showModal = false;
    $scope.noOfElement=0;
    $scope.editPackage=false;
    $scope.package_total_amount=0;
    $scope.packageDetailsShow='No';
    //$scope.warningMessage="";
    /* applicator details object */

    $scope.applicatorDetails={

        vatnumber:"",
        cstnumber:"",
        servicetaxnumber:"",
        pannumber:"",
        operation:"",
        packageEdited:"false",
        elementDetails:[]
    };

    /*package details object */

    $scope.packageDetails={
        operation :""

    };


    $scope.clearFields = function(applicatorDetails,page)
    {
        if(page=='initial')
        {
            applicatorDetails.firmname="";
            applicatorDetails.addressline1="";
            applicatorDetails.addressline2="";
            applicatorDetails.contactno="";
            applicatorDetails.country="";
            applicatorDetails.state="";
            applicatorDetails.city="";
            applicatorDetails.vatnumber="";
            applicatorDetails.cstnumber="";
            applicatorDetails.servicetaxnumber="";
            applicatorDetails.pannumber="";
            applicatorDetails.pointofcontact="";
            applicatorDetails.pointcontactno="";
        }
        $scope.formSubmitted=false;
        console.log($scope.formSubmitted);
    }


    /*to store all packages from return from  server */

    $scope.packages=[];

    /* call to package service to get packages */

    PackageService.viewPackages($scope,$http,$scope.packageDetails);

    /*Multistep form */

    $scope.nextStep = function() {

        $scope.formSubmitted=false;

        $scope.step++;

    }

    $scope.prevStep = function() {
        $scope.step--;

    }

    $scope.today = function() {
        $scope.applicatorDetails.paymentDate = new Date();
        //$scope.applicatorDetails.followupdate = new Date();
    };
    $scope.today();

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openPayDate = function() {
        $scope.showPopup.opened = true;
    };

    $scope.showPopup = {
        opened: false
    };

    //$scope.todayDate = function() {
    //    $scope.applicatorDetails.followupdate = new Date();
    //};
    //$scope.todayDate();


    /* to show package details while creating applicator */

    $scope.getPackageDetails=function(packageID){
        console.log(packageID);
        $scope.packageDetailsShow='Yes';
        $scope.editPackage=false;
        $scope.applicatorDetails.packageEdited="false";
        $scope.applicatorDetails.elementDetails=[];

        for(var pindex=0;pindex<$scope.packages.length;pindex++){

            if($scope.packages[pindex].payment_package_id==packageID){


                $scope.applicatorDetails.package_name=$scope.packages[pindex].package_name;
                $scope.applicatorDetails.package_description=$scope.packages[pindex].package_description;
                $scope.package_total_amount=$scope.packages[pindex].package_total_amount;

                $scope.noOfElement=$scope.packages[pindex].elementType.length;

                for(var index=0;index<$scope.packages[pindex].elementType.length;index++){
                    console.log("in for");
                    $scope.applicatorDetails.elementDetails.push({
                        element_name:$scope.packages[pindex].elementType[index].element_name,
                        element_quantity:$scope.packages[pindex].elementType[index].element_quantity,
                        element_rate:$scope.packages[pindex].elementType[index].element_rate,

                    });
                }
            }
        }
    }

    /* if package edited then set packageEdited to true and editPackage to true adn hide package details*/
    $scope.editPackageDetails=function(){

        $scope.applicatorDetails.packageEdited="true";
        $scope.editPackage=true;
        $scope.packageDetailsShow='No';

    };

    /*number of package element if want to edit package(customized) */
    $scope.add = function (noOfMaterials) {

        console.log(noOfMaterials);
        for (var i = 0; i < noOfMaterials; i++) {
            $scope.addField();
        };
    };

    $scope.clear =function() {
        $scope.applicatorDetails.elementDetails.splice(0,$scope.applicatorDetails.elementDetails.length);//Remove items in array elementType
    };

    //Removing field selected
    $scope.remove= function(index){
        $scope.applicatorDetails.elementDetails.splice(index,1); //remove item by index
    };

    //Adding fields to if package edited

    $scope.addField= function(){

        console.log("In");
        $scope.applicatorDetails.elementDetails.push({

            element_name:"",
            element_quantity:"",
            element_rate:""

        });
    };

    /*calculate pending amount if package edited or selected standard package */

    $scope.getPendingAmount=function(){
        console.log("In Pending amount function");
        if($scope.applicatorDetails.packageEdited=="true"){
            console.log("In  package edited if");
            $scope.package_total_amount=0;
            for(var index=0;index<$scope.applicatorDetails.elementDetails.length;index++) {

                $scope.package_total_amount+=parseInt($scope.applicatorDetails.elementDetails[index].element_quantity) * parseInt($scope.applicatorDetails.elementDetails[index].element_rate);
            }
            console.log($scope.package_total_amount);
            $scope.applicatorDetails.pendingAmount = $scope.package_total_amount - parseInt($scope.applicatorDetails.amountpaid);
        }
        else {
            $scope.applicatorDetails.pendingAmount = parseInt($scope.package_total_amount) - parseInt($scope.applicatorDetails.amountpaid);
        }
    }

    /*Check payment received or not for form submit*/

    $scope.checkPaymentStatus=function(){
        if($scope.applicatorDetails.received=='Yes'){

            return false;
        }
        else{
            return true;
        }
    }

        /* to check payment status and according call to service to submit data */

    $scope.processForm = function(size) {
        $scope.loading=true;
        //$scope.errorMessage="";
        //$scope.warningMessage="";
        $('#loader').css("display","block");
        $scope.formSubmitted=false;
         console.log("In process form");
        if($scope.applicatorDetails.pendingAmount==0 && $scope.applicatorDetails.received=='Yes' ){

            console.log("Full Amount Paid ");
            $scope.applicatorDetails.operation='createApplicator';
            $scope.applicatorDetails.paymentStatus='Yes';
            console.log($scope.applicatorDetails);

            //applicatorDetails.paymentDate
            /*var viewValue1=new Date(applicatorDetails.paymentDate);
            viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
            applicatorDetails.paymentDate=viewValue1.toISOString().substring(0, 10);*/

            ApplicatorService.submitApplicatorDetails($scope,$http,$rootScope,$scope.applicatorDetails);
           // $scope.formSubmitted=false;
        }
        $scope.formSubmitted=false;
        console.log($scope.formSubmitted);
        if(($scope.applicatorDetails.pendingAmount!=0 && $scope.applicatorDetails.received=='Yes')){
            $scope.loading = false;
            $('#loading').css('display','none');


            console.log("Half Amount Paid");

            $scope.applicatorDetails.operation='createApplicator';
            $scope.applicatorDetails.paymentStatus="No";



            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',
                controller:  function ($scope,$uibModalInstance,applicatorDetails) {
                    console.log("Inside Followup");

                    AppService.getUsers($scope,$http);
                    $scope.openFollowDate = function() {
                        $scope.followup.opened = true;
                    };

                    $scope.followup = {
                        opened: false
                    };
                   /* var viewValue1=new Date(applicatorDetails.paymentDate);
                    viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
                    applicatorDetails.paymentDate=viewValue1.toISOString().substring(0, 10);

                    var viewValue1=new Date(applicatorDetails.followupdate);
                    viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
                    applicatorDetails.followupdate=viewValue1.toISOString().substring(0, 10);*/

                    $scope.applicatorDetails = applicatorDetails;
                    $scope.ok = function () {
                        applicatorDetails.isFollowup=true;
                        ApplicatorService.submitApplicatorDetails($scope, $http,$rootScope,applicatorDetails);
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        applicatorDetails.isFollowup=false;
                        ApplicatorService.submitApplicatorDetails($scope, $http,$rootScope,applicatorDetails);
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    applicatorDetails: function () {
                        return $scope.applicatorDetails;
                    }
                }
            });

            modalInstance.result.then(function (applicatorDetails) {
                //$scope.applicatorDetails = applicatorDetails;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.formSubmitted=false;
        }
        if($scope.applicatorDetails.received=='No'){

            console.log("No Amount paid");
            $scope.applicatorDetails.paymentStatus="No";
            $scope.applicatorDetails.operation='createApplicator';

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',
                controller:  function ($scope, $uibModalInstance,applicatorDetails) {
                    AppService.getUsers($scope,$http);

                    $scope.openFollowDate = function() {
                        $scope.followup.opened = true;
                    };

                    $scope.followup = {
                        opened: false
                    };
                   /* var viewValue1=new Date(applicatorDetails.followupdate);
                    viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
                    applicatorDetails.followupdate=viewValue1.toISOString().substring(0, 10);*/

                    $scope.applicatorDetails = applicatorDetails;

                    $scope.ok = function () {
                        applicatorDetails.isFollowup=true;
                        ApplicatorService.submitApplicatorDetails($scope, $http,$rootScope,applicatorDetails);
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        applicatorDetails.isFollowup=false;
                        ApplicatorService.submitApplicatorDetails($scope, $http,$rootScope,applicatorDetails);
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    applicatorDetails: function () {
                        return $scope.applicatorDetails;
                    }
                }
            });

            modalInstance.result.then(function (applicatorDetails) {
                //$scope.applicatorDetails = applicatorDetails;

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.formSubmitted=false;
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        }
        $('#loader').css("display","none");

    };


});

/* End of Applicator Controller */


/*Start of view tentative applicator controller */

myApp.controller('SearchTentativeApplicatorController',function($scope,$rootScope,$uibModal,$log,$http){

    $scope.currentPage = 1;
    $scope.ApplicatorPerPage = 10;
    $scope.searchExpression;
    $scope.searchKeyword;

    $scope.applicatorDetails={
        searchExpression:" ",
        searchKeyword:" ",
        operation:""
    };

    $scope.searchApplicator=function(){

             $scope.applicatorDetails.searchExpression=$scope.searchExpression;
             $scope.applicatorDetails.searchKeyword=$scope.searchKeyword;
             $scope.applicatorDetails.operation='viewTentativeApplicators';

         console.log($scope.applicatorDetails);
             $scope.loading=true;
             //$scope.errorMessage="";
             //$scope.warningMessage="";

             $('#loader').css("display","block");

                var config = {
                    params: {
                        data: $scope.applicatorDetails
                    }

                };

                 $http.post("Applicator/php/Applicator.php", null, config)

                     .success(function (data, status, headers, config) {

                         console.log(data);
                         if(data.status==="success") {
                             $rootScope.tentativeApplicators = data.message;
                             $scope.totalItems = $rootScope.tentativeApplicators.length;
                             $('#loader').css("display","none");
                         }
                         else{
                             $scope.loading=false;
                             $('#loader').css("display","none");
                             $rootScope.errorMessage=data.message;
                             $('#error').css("display","block");
                             setTimeout(function() {
                                 $scope.$apply(function() {
                                     //if(data.msg!=""){
                                         $('#error').css("display","none");
                                     //}
                                 });
                             }, 3000);
                         }
                     })

                     .error(function (data, status, headers) {
                         $scope.loading=false;
                         $('#loader').css("display","none");
                         $rootScope.errorMessage="Could Not Fetch Data";
                         $('#error').css("display","block");
                     });

    }

    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.ApplicatorPerPage;
        end = begin + $scope.ApplicatorPerPage;
        index = $rootScope.tentativeApplicators.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };

});

myApp.controller('ViewTentativeApplicatorController',function($scope,$http,$stateParams){



    $scope.applicatorDetails={
        applicator_master_id:"",
        operation:"",
        purpose:"toView"
    }

    $scope.getTentativeApplicatorDetails=function(){

        $scope.applicatorDetails.operation="getTentativeApplicatorDetails";
        $scope.applicatorDetails.applicator_master_id=$stateParams.applicator_id;

        var config = {
            params: {
                data: $scope.applicatorDetails
            }

        };

        $http.post("Applicator/php/Applicator.php", null, config)

            .success(function (data,status,headers,config) {

                $scope.tentativeApplicatorsDetails = data;
                console.log(data);

            })

            .error(function (data, status, headers) {
                console.log(data);

            });
    }

    $scope.getTentativeApplicatorDetails();

});

myApp.controller('ModifyTentativeApplicatorController',function($scope,$http,$rootScope,$stateParams){


    $scope.applicatorDetails={
        applicator_master_id:"",
        operation:"",
        purpose:"toModify"
    }

    $scope.tentativeApplicatorsDetails={
        operation:""
    };

    $scope.getTentativeApplicatorDetails=function(){

        $scope.applicatorDetails.operation="getTentativeApplicatorDetails";
        $scope.applicatorDetails.applicator_master_id=$stateParams.applicator_id;

        var config = {
            params: {
                data: $scope.applicatorDetails
            }
        };

        $http.post("Applicator/php/Applicator.php", null, config)
            .success(function (data, status, headers, config) {
                $scope.tentativeApplicatorsDetails = data;
                console.log($scope.tentativeApplicatorsDetails);
            })
            .error(function (data, status, headers) {
                console.log(data);
            });
    }

    $scope.getTentativeApplicatorDetails();

    $scope.modify=function() {
        $scope.loading=true;
        $('#loader').css("display","block");
        $scope.tentativeApplicatorsDetails.operation="modifyApplicatorDetails";
        var config = {
            params: {
                data: $scope.tentativeApplicatorsDetails
            }
        };

        $http.post("Applicator/php/Applicator.php", null, config)

            .success(function (data, status, headers, config) {

                $scope.loading=false;
                $('#loader').css("display","none");
                console.log(data);
                if(data.msg!=""){
                    $rootScope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                }
                setTimeout(function() {
                    $scope.$apply(function() {
                        if(data.msg!=""){
                            $('#warning').css("display","none");
                        }
                    });
                }, 3000);
                if(data.msg==""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            if(data.msg!=""){
                                $('#error').css("display","none");
                            }
                        });
                    }, 3000);
                }
                $rootScope.tentativeApplicators=[];
            })
            .error(function (data, status, headers) {
                console.log(data);
                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg==""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            if(data.msg!=""){
                                $('#error').css("display","none");
                            }
                        });
                    }, 3000);
                }
            });
    }

});


/*End of view tentative applicator controller */


/*Start of view permanent applicator */

myApp.controller('SearchPermanentApplicatorController',function($scope,$rootScope,$uibModal,$log,$http){

    $scope.currentPage = 1;
    $scope.ApplicatorPerPage = 10;
    $scope.searchExpression=undefined;
    $scope.searchKeyword=undefined;

    $scope.applicatorDetails={
        searchExpression:"",
        searchKeyword:"",
        operation:""
    };

    $scope.searchApplicator=function(){

        $scope.applicatorDetails.searchExpression=$scope.searchExpression;
        $scope.applicatorDetails.searchKeyword=$scope.searchKeyword;
        $scope.applicatorDetails.operation='viewPermanentApplicators';
        $scope.loading=true;
        //$scope.errorMessage="";
        //$scope.warningMessage="";
        $('#loader').css("display","block");
        var config = {
            params: {
                data: $scope.applicatorDetails
            }
        };
            $http.post("Applicator/php/Applicator.php", null, config)

                .success(function (data, status, headers, config) {

                    console.log(data);
                    if(data.status==="success") {
                        $rootScope.permanentApplicators = data.message;
                        $scope.totalItems = $rootScope.permanentApplicators.length;
                        $('#loader').css("display","none");
                    }
                    else{
                        $scope.loading=false;
                        $('#loader').css("display","none");
                        $rootScope.errorMessage=data.message;
                        $('#error').css("display","block");
                        setTimeout(function() {
                            $scope.$apply(function() {
                                if(data.msg!=""){
                                    $('#error').css("display","none");
                                }
                            });
                        }, 3000);
                    }
                })
                .error(function (data, status, headers) {
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $rootScope.errorMessage="Could Not Fetch Data";
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            if(data.msg!=""){
                                $('#error').css("display","none");
                            }
                        });
                    }, 3000);
                });

    }

    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.ApplicatorPerPage;
        end = begin + $scope.ApplicatorPerPage;
        index = $rootScope.permanentApplicators.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };

});
myApp.controller('ViewPermanentApplicatorController',function($scope,$http,$stateParams){

    $scope.applicatorDetails={
        applicator_master_id:"",
        operation:"",
        purpose:"toView"
    }

      $scope.getPermanentApplicatorDetails=function(){

          $scope.applicatorDetails.operation="getPermanentApplicatorDetails";
          $scope.applicatorDetails.applicator_master_id=$stateParams.applicator_id;

          var config = {
              params: {
                  data: $scope.applicatorDetails
              }
          };
          $http.post("Applicator/php/Applicator.php", null, config)

              .success(function (data, status, headers, config) {

                  $scope.permanentApplicatorsDetails = data;
                  console.log(data);

              })

              .error(function (data, status, headers) {
                  console.log(data);

              });
      }

    $scope.getPermanentApplicatorDetails();

});

myApp.controller('ModifyPermanentApplicatorController',function($scope,$http,$rootScope,$stateParams){

    $scope.applicatorDetails={
        applicator_master_id:"",
        operation:"",
        purpose:"toModify"
    }

    $scope.permanentApplicatorsDetails={

        operation:""
    };

    $scope.getPermanentApplicatorDetails=function(){

        $scope.applicatorDetails.operation="getPermanentApplicatorDetails";
        $scope.applicatorDetails.applicator_master_id=$stateParams.applicator_id;

        var config = {
            params: {
                data: $scope.applicatorDetails
            }
        };

        $http.post("Applicator/php/Applicator.php", null, config)

            .success(function (data, status, headers, config) {
                $scope.permanentApplicatorsDetails = data;
                console.log($scope.permanentApplicatorsDetails);
            })
            .error(function (data, status, headers) {
                console.log(data);
            });
    }

    $scope.getPermanentApplicatorDetails();

    $scope.modify=function() {

        $scope.permanentApplicatorsDetails.operation="modifyApplicatorDetails";
        var config = {
            params: {
                data: $scope.permanentApplicatorsDetails
            }
        };

        $scope.loading=true;
        $('#loader').css("display","block");

        $http.post("Applicator/php/Applicator.php", null, config)

            .success(function (data, status, headers, config) {

                console.log(data);
                $scope.loading=false;
                $('#loader').css("display","none");
                console.log(data);
                if(data.msg!=""){
                    $rootScope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                }
                setTimeout(function() {
                    $scope.$apply(function() {
                        if(data.msg!=""){
                            $('#warning').css("display","none");
                        }
                    });
                }, 3000);
                if(data.msg==""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            if(data.msg==""){
                                $('#error').css("display","none");
                            }
                        });
                    }, 3000);
                }
                $rootScope.permanentApplicators=[];

            })
            .error(function (data, status, headers) {
                console.log(data);
                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg==""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            if(data.msg!=""){
                                $('#error').css("display","none");
                            }
                        });
                    }, 3000);
                }
            });
        }
});

/*End of view permanent applicator */

/* start of applicator payment controller*/

myApp.controller('ApplicatorPaymentController',function($scope,$rootScope,$http,ApplicatorService,$uibModal, $log,AppService){

    $scope.applicatorDetails={
        operation:""
    };
    $scope.formSubmitted=false;
    $scope.showPaymentDetails=false;
    $scope.Applicators=[];
    $scope.applicatorPayment=[];
    $scope.animationsEnabled=true;
    $scope.paymentReceivedFor=undefined;

    $scope.today = function() {
        $scope.applicatorDetails.paymentDate = new Date();
    };
    $scope.today();

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openAppDate = function() {
        $scope.appPopup.opened = true;
    };

    $scope.appPopup = {
        opened: false
    };

    ApplicatorService.getApplicatorPaymentDetails($scope,$http,$scope.applicatorDetails);

    $scope.viewApplicatorPaymentDetails=function(enrollmentId){

        $scope.applicatorPayment=[];
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

                    $scope.applicatorPayment.push({
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
    $scope.submitPaymentDetails=function(size,applicatorDetails){

        console.log("In");
        $scope.formSubmitted=false;

        if($scope.applicatorDetails.pendingAmount==0) {

            applicatorDetails.paymentStatus='Yes';
            console.log(applicatorDetails);
            ApplicatorService.savePaymentDetails($scope,$rootScope, $http, applicatorDetails);
        }
        else if($scope.applicatorDetails.pendingAmount!=0){

            applicatorDetails.paymentStatus='No';

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',
                controller:  function ($scope, $uibModalInstance,applicatorDetails) {
                    AppService.getUsers($scope,$http);

                    //date picker for followup date
                    $scope.openFollowDate = function() {
                        $scope.followup.opened = true;
                    };

                    $scope.followup = {
                        opened: false
                    };

                    $scope.applicatorDetails = applicatorDetails;

                    $scope.ok = function () {
                        applicatorDetails.isFollowup=true;
                        ApplicatorService.savePaymentDetails($scope,$rootScope, $http, applicatorDetails);
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        applicatorDetails.isFollowup=false;
                        ApplicatorService.savePaymentDetails($scope,$rootScope, $http, applicatorDetails);
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    applicatorDetails: function () {
                        return $scope.applicatorDetails;
                    }
                }
            });

            modalInstance.result.then(function (applicatorDetails) {
                $scope.applicatorDetails = applicatorDetails;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        }
    }

});

/*
start of package controller

 */
myApp.controller('PackageController',function($scope,$rootScope,$http,PackageService){

    $scope.packageDetails={

        elementDetails:[]

    };

    $scope.showElementField=false;
    //Clear form Fields

    $scope.clearFields=function(packageDetails){

        packageDetails.packagedescription="";
        packageDetails.packagename="";
        packageDetails.elementDetails=[];
    };

    //Adding Number of Fields
    $scope.add = function () {

        $scope.showElementField=true;

        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.addField();
        };

    };

    $scope.clear =function() {
        $scope.packageDetails.elementDetails.splice(0,$scope.packageDetails.elementDetails.length);//Remove items in array elementType
    };

    //Removing field selected
    $scope.remove= function(index){

        $scope.packageDetails.elementDetails.splice(index,1); //remove item by index
    };

    //Adding fields to packageDetails

    $scope.addField= function(){

        $scope.packageDetails.elementDetails.push({

            element_name:"",
            element_quantity:0,
            element_rate:0

        });
    };

    //Submitting packageDetails to create package.

    $scope.processPackage = function(packageDetails) {
        $scope.packageFormSubmitted=false;
        $scope.packageDetails.packageEdited='false';
        console.log(packageDetails);
        PackageService.createPackage($scope,$rootScope,$http,packageDetails);

    };

});
/*
End of package controller
 */

/*
start of view package controller
 */

myApp.controller('ViewPackageController',function($scope,$http,$rootScope,PackageService) {

    $scope.oneAtATime = true;
    $scope.packages = [];

    $scope.totalPackages =0;
    $scope.packagePerPage=10;
    $scope.currentPackagePage = 1;

    $scope.packageDetails={
        operation :""
    };

    PackageService.viewPackages($scope,$http,$scope.packageDetails);

    $scope.showPackageDetails=function(package){

        $scope.selectedPackage=package;
        $scope.totalElement=$scope.selectedPackage.elementType.length;
        console.log($scope.totalElement);

    }

    $scope.deletePackage=function(packageId){
        console.log(packageId);
        PackageService.deletePackage($scope,$rootScope,$http,packageId);

    }

    $scope.paginatePackage = function(value) {

        var begin, end, index;
        begin = ($scope.currentPackagePage - 1) * $scope.packagePerPage;
        end = begin + $scope.packagePerPage;
        index = $scope.packages.indexOf(value);

        return (begin <= index && index < end);
    }
});

/*
End of view package controller
 */
