/**
 * Created by Atul on 11-02-2016.
 */

myApp.controller('ProjectDetailsController',function($scope,$http){


    console.log("IN");

});

myApp.controller('QuotationController',function($scope,$http){


    console.log("IN");

});

myApp.controller('InvoiceController',function($scope,$http){


    console.log("IN");

});
myApp.controller('ProjectPaymentController',function($scope,$http,$uibModal, $log){


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
    }});

myApp.controller('viewProjectController',function($scope,$http){


    $scope.Projects=[
        {
            "project_id": "1",
            project_name: "Dream city",
            project_manager:"Namdev",
            project_status:"incomplete",
            payment_status:"no",
            project_quotation:'yes',

        },
        {
            "project_id": "2",
            project_name: "Prayeja city",
            project_manager:"Atul",
            project_status:"complete",
            payment_status:"yes",
            project_quotation:"yes",

        },
        {
            "project_id": "4",
            project_name: "dsk",
            project_manager:"Ajit",
            project_status:"incomplete",
            payment_status:"no",
            project_quotation:"yes",

        },
        {
            "project_id": "3",
            project_name: "Ghokhale Constructions",
            project_manager:"Pranav",
            project_status:"complete",
            payment_status:"yes",
            project_quotation:"yes",

        },
        {
            "project_id": "5",
            project_name: "ABI",
            project_manager:"Pranav",
            project_status:"incomplete",
            payment_status:"no",
            project_quotation:"no",

        }

    ];



});