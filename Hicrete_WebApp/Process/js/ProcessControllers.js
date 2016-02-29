/**
 * Created by Atul on 11-02-2016.
 */

myApp.controller('ProcessWidgetController',function($scope,$http){

    $scope.hasRead=true;
    $scope.hasWrite=true;

    var data={
        operation :"CheckAccess",
        moduleName:"Process",
        accessType: "Read"
    };

    var config = {
        params: {
            data: data

        }
    };


    //$http.post("Config/php/configFacade.php",null, config)
    //    .success(function (data)
    //    {
    //        if(data.status=="Successful"){
    //            $scope.hasRead=true;
    //        }else if(data.status=="Unsuccessful"){
    //            $scope.hasRead=false;
    //        }else {
    //            doShowAlert("Failure", data.message);
    //        }
    //    })
    //    .error(function (data, status, headers, config)
    //    {
    //        doShowAlert("Failure","Error Occurred");
    //
    //    });


    var data={
        operation :"CheckAccess",
        moduleName:"Process",
        accessType: "Write"
    };

    var config = {
        params: {
            data: data

        }
    };


    //$http.post("Config/php/configFacade.php",null, config)
    //    .success(function (data)
    //    {
    //        if(data.status=="Successful"){
    //            $scope.hasWrite=true;
    //        }else if(data.status=="Unsuccessful"){
    //            $scope.hasWrite=false;
    //        }else {
    //            doShowAlert("Failure", data.message);
    //        }
    //    })
    //    .error(function (data, status, headers, config)
    //    {
    //        doShowAlert("Failure","Error Occurred");
    //
    //    });


});




myApp.controller('ProjectDetailsController',function($scope,$http,$uibModal, $log){
    $scope.animationsEnabled=true;

   $scope.scheduleFollowup=function(size) {
       var modalInstance = $uibModal.open({
           animation: $scope.animationsEnabled,
           templateUrl: 'Applicator/html/paymentFollowup.html',
           controller: function ($scope, $uibModalInstance) {
               $scope.ok = function () {
                   // ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
                   $uibModalInstance.close();
               };

               $scope.cancel = function () {
                   $uibModalInstance.dismiss('cancel');
               };
           },
           size: size,

       });

       modalInstance.result.then(function () {

       }, function () {
           $log.info('Modal dismissed at: ' + new Date());
       });
       $scope.toggleAnimation = function () {
           $scope.animationsEnabled = !$scope.animationsEnabled;
       };

   }

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
            project_quotation:'yes'

        },
        {
            "project_id": "2",
            project_name: "Prayeja city",
            project_manager:"Atul",
            project_status:"complete",
            payment_status:"yes",
            project_quotation:"yes"

        },
        {
            "project_id": "4",
            project_name: "dsk",
            project_manager:"Ajit",
            project_status:"incomplete",
            payment_status:"no",
            project_quotation:"yes"

        },
        {
            "project_id": "3",
            project_name: "Ghokhale Constructions",
            project_manager:"Pranav",
            project_status:"complete",
            payment_status:"yes",
            project_quotation:"yes"

        },
        {
            "project_id": "5",
            project_name: "ABI",
            project_manager:"Pranav",
            project_status:"incomplete",
            payment_status:"no",
            project_quotation:"no"

        }

    ];
});

myApp.controller('ViewInvoiceDetails',function($scope,$http){

    $scope.invoiceNumber="Invoice-123";
    $scope.quotationNumber="Quotation-123";
    $scope.workorderNumber="Workorder-123";
    $scope.contactPerson="Namdev devmare";
    $scope.invoiceDate="22-01-2016";
    $scope.quotationDate="22-01-2016";
    $scope.workorderDate="22-01-2016";

    $scope.roundingOff="10";
    $scope.grandTotal="15000";
    console.log("IN");

});
myApp.controller('QuotationFollowupHistoryController',function($scope,$http){



});

myApp.controller('PaymentFollowupHistoryController',function($scope,$http){


});
myApp.controller('SiteTrackingFollowupHistoryController',function($scope,$http){


});
myApp.controller('ViewCustomerController',function($scope,$http){


});

myApp.controller('ViewQuotationDetailsController',function($scope,$http){


});

myApp.controller('PaymentHistoryController',function($scope,$http){

    $scope.paymentHistoryData=[
        {amountPaid:10000,paymentDate:'10-FEB-2016',recievedBy:'Shankar',amountRemaining:5000,paymentMode:'Cheque',bankName:'SBI',branchName:'Kothrud',unqiueNo:179801},
        {amountPaid:20000,paymentDate:'13-DEC-2015',recievedBy:'Ajit',amountRemaining:25500,paymentMode:'Cash',bankName:'Bank of India',branchName:'Vadgaon',unqiueNo:101546},
        {amountPaid:100000,paymentDate:'16-JUL-2016',recievedBy:'Atul',amountRemaining:55600,paymentMode:'Cheque',bankName:'ICICI',branchName:'Balaji Nagar',unqiueNo:568343},
        {amountPaid:457000,paymentDate:'10-FEB-2016',recievedBy:'Shankar',amountRemaining:58700,paymentMode:'Netbanking',bankName:'SBI',branchName:'Indira Nagar',unqiueNo:678935},
    ];

    $scope.getPaymentHistoryData=function(pPaymentHistory){
        $scope.viewHistory=pPaymentHistory;
    }
});
myApp.controller('CustomerController',function($scope,$http){

    $scope.submitted=false;
});


myApp.controller('ReviseQuotation',function($scope,$http){

    $scope.Quotation={ProjectName:"Project1",
        CompanyName:"Hicrete Engineers",
        Title:"Demo Quotation",
        Date:"20-01-2016",
        Subject:"Quotation for flooring work",
        ReferenceNo:"HE/20-1-2016/A",
        totalAmount:20000,
        taxAmount:1000,
        grandTotal:21000
};

    $scope.QuotationDetails=[];
    $scope.QuotationDetails.push({title:"Material A",
        description:"Flooring",quantity:10,unit:"sqft",unitrate:1000});
    $scope.QuotationDetails.push({title:"Material B",
        description:"Flooring",quantity:10,unit:"sqft",unitrate:1000});

    $scope.TaxDetails=[];
    $scope.TaxDetails.push({name:"VAT",
        percentage:"5",amount:1000});


});
