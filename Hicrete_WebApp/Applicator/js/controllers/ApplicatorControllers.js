myApp.controller('ApplicatorController',function($scope,$http,ApplicatorService,PackageService) {

    $scope.step=1;
    $scope.editPackage=false;
    $scope.showModal = false;
    $scope.noOfElement=0;
    $scope.editPackage=false;
    $scope.package_total_amount=0;
    $scope.packageDetailsShow='No';
    $scope.applicatorDetails={

        operation:"",
        packageEdited:"false",
        elementDetails:[]
    };

    $scope.packageDetails={
        operation :""

    };

    $scope.packages=[];


    PackageService.viewPackages($scope,$http,$scope.packageDetails);

    $scope.nextStep = function() {

        $scope.formSubmitted=false;

        $scope.step++;

    }

    $scope.prevStep = function() {
        $scope.step--;

    }

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




    };

    $scope.editPackageDetails=function(){

        $scope.applicatorDetails.packageEdited="true";
        $scope.editPackage=true;
        $scope.packageDetailsShow='No';

    };

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

    //Adding fields to packageDetails

    $scope.addField= function(){

          console.log("In");
        $scope.applicatorDetails.elementDetails.push({

            element_name:"",
            element_quantity:"",
            element_rate:""

        });
    };

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

        if($scope.applicatorDetails.pendingAmount==0 && $scope.applicatorDetails.received=='Yes' ){

            console.log("Full Amount Paid ");
            applicatorDetails.operation='createApplicator';
            applicatorDetails.paymentStatus='Yes';
            console.log(applicatorDetails);

          ApplicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);
        }
        if(($scope.applicatorDetails.pendingAmount!=0 && $scope.applicatorDetails.received=='Yes')){
            $scope.showModal = true;
            applicatorDetails.paymentStatus="No";
            console.log("Half Amount Paid");



        }
        if($scope.applicatorDetails.received=='No'){
        	$scope.showModal = true;
        	console.log("No Amount paid");
            applicatorDetails.paymentStatus="No";
        }


    };
    $scope.processFollowup=function(applicatorDetails){

        applicatorDetails.operation='createApplicator';
        console.log(applicatorDetails);
       ApplicatorService.submitApplicatorDetails($scope,$http,applicatorDetails);

    };


});

myApp.controller('PackageController',function($scope,$http,PackageService){

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
            element_quantity:"",
            element_rate:""

        });
    };

    //Submitting packageDetails to create package.

    $scope.processPackage = function(packageDetails) {
        $scope.packageFormSubmitted=false;
       $scope.packageDetails.packageEdited='false';
        console.log(packageDetails);
         PackageService.createPackage($scope,$http,packageDetails);

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
myApp.controller('ApplicatorPaymentController',function($scope,$http,ApplicatorService,$uibModal, $log){


    $scope.paymentDetails={
        operation:""
    };
    $scope.formSubmitted=false;
    $scope.showPaymentDetails=false;
    $scope.Applicators=[];
    $scope.applicatorPayment=[];
    $scope.animationsEnabled=true;
    $scope.paymentReceivedFor=undefined;






    ApplicatorService.getApplicatorPaymentDetails($scope,$http,$scope.paymentDetails);


    $scope.applicatorPaymentDetails=function(enrollmentId){

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
        $scope.paymentDetails.pendingAmount=parseInt($scope.packageAmount)-parseInt($scope.paymentDetails.amountpaid)-$scope.previousAmountPaid;

    }
    $scope.submitPaymentDetails=function(size,paymentDetails){

        console.log("In");
        $scope.formSubmitted=false;

        if($scope.paymentDetails.pendingAmount==0) {

            paymentDetails.paymentStatus='Yes';
            console.log(paymentDetails);
           ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
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

                        ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
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

