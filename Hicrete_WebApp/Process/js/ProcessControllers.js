/**
 * Created by Atul on 11-02-2016.
 */

myApp.controller('ProjectCreationController',function($scope,$http,$uibModal, $log,AppService){
    $scope.projectDetails={
        projectName:'',
        state:'',
        address:'',
        country:'',
        city:'',
        pincode:'',
        pointOfContactName:'',
        pointOfContactEmailId:'',
        pointOfContactLandlineNo:'',
        pointfContactMobileNo:'',
        projectManagerId:'',
        projectSource:''
    }

    $scope.Companies=[];
    AppService.getCompanyList($http,$scope);

    $scope.projectManagers=[];
    AppService.getProjectManagers($http,$scope);
    console.log("In Project Creation Controller");

    /*
    var companiesInvolved=[];
    for(var i=0;i<$scope.Companies.length;i++){
        if($scope.Companies[i].checkVal){
            companiesInvolved.push($scope.Companies[i]);
        }

    }*/


});


myApp.controller('ProjectDetailsController',function($scope,$http,$uibModal, $log,$stateParmas){

    $scope.project=$stateParmas.projectToModify;


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

myApp.controller('QuotationController',function($scope,$http,$uibModal, $log){

    $scope.taxSelected=0;
    $scope.taxableAmount=0;
    $scope.noOfRows=0;
    $scope.taxDetails=[];
    $scope.currentItemList=[];

    $scope.QuotationDetails={

        quotationItemDetails:[]
    };

    $scope.today = function(){
        $scope.QuotationDetails.quotationDate = new Date();
    };

    $scope.today();

    $scope.quotDate = function(){
        $scope.picker.opened =  true;
    };

    $scope.picker = {
        opened:false
    };

    $scope.addRows=function(){

        for(var index=0;index<$scope.noOfRows;index++) {
            $scope.QuotationDetails.quotationItemDetails.push({

                quotationItem: "",
                quotationDescription: "",
                quotationQuantity: 0,
                quotationUnit: "",
                quotationUnitRate: 0,
                amount:0,
                isTaxAplicable:false
            });
        }
    }

    $scope.calculateTaxableAmount=function(index){

            if($scope.QuotationDetails.quotationItemDetails[index].isTaxAplicable){
                $scope.taxableAmount=$scope.taxableAmount + $scope.QuotationDetails.quotationItemDetails[index].amount;
                $scope.taxSelected++;
                $scope.currentItemList.push(index+1);
            }else{
                $scope.taxableAmount=$scope.taxableAmount - $scope.QuotationDetails.quotationItemDetails[index].amount;
                $scope.taxSelected--;
                $scope.currentItemList.splice($scope.currentItemList.indexOf(index+1),1);
            }
    }

    $scope.calculateAmount=function(index){

        $scope.QuotationDetails.quotationItemDetails[index].amount=$scope.QuotationDetails.quotationItemDetails[index].quotationQuantity* $scope.QuotationDetails.quotationItemDetails[index].quotationUnitRate;
    }

    $scope.removeQuotationItem= function(index){

        $scope.QuotationDetails.quotationItemDetails.splice(index,1); //remove item by index

    };
    $scope.removeTaxItem= function(index){

        $scope.taxDetails.splice(index,1); //remove item by index

    };


    $scope.addTax=function(size) {


        if ($scope.taxSelected>0) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Process/html/addTax.html',
                controller: function ($scope, $uibModalInstance,amount) {
                    $scope.tax={taxTitle:"",taxApplicableTo:"",taxPercentage:0,amount:0};
                    $scope.amount=amount;
                    console.log($scope.amount);
                    $scope.ok = function () {

                        console.log($scope.tax);
                        $uibModalInstance.close($scope.tax);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.calculateTaxAmount=function(){
                        $scope.tax.amount=$scope.amount*($scope.tax.taxPercentage/100);
                    }
                },
                size: size,
                resolve: {
                    amount: function () {
                        return $scope.taxableAmount;
                    }
                }
            });

            modalInstance.result.then(function (tax) {
                var itemString=" (Item ";
                for(var i=0;i<$scope.currentItemList.length-1;i++){
                    itemString+=$scope.currentItemList[i]+" ,";
                }
                itemString+=$scope.currentItemList[$scope.currentItemList.length-1]+" )";
                $scope.taxDetails.push({taxTitle:tax.taxTitle,taxApplicableTo:itemString,taxPercentage:tax.taxPercentage,amount:tax.amount ,itemList:$scope.currentItemList});
                console.log($scope.currentItemList);
                console.log($scope.taxDetails);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            //$scope.taxableAmount=0;

        }
        else{
            alert("Please Select Checkbox");
        }

    }
});

myApp.controller('InvoiceController',function($scope,$http,$uibModal, $log){

    $scope.taxSelected=0;
    $scope.taxableAmount=0;
    $scope.noOfRows=0;
    $scope.taxDetails=[];
    $scope.currentItemList=[];

    $scope.InvoiceDetails={

        invoiceItemDetails:[]
    }

    $scope.InvoiceDetails.invoiceItemDetails.push({

        quotationItem: "Material 1",
        quotationDescription: "Supply Material 1",
        quotationQuantity: 10,
        quotationUnit: "kg",
        quotationUnitRate: 200,
        amount:2000,
        isTaxAplicable:false
    });
    $scope.InvoiceDetails.invoiceItemDetails.push({

        quotationItem: "Material 2",
        quotationDescription: "Supply Material 1",
        quotationQuantity: 5,
        quotationUnit: "kg",
        quotationUnitRate: 100,
        amount:500,
        isTaxAplicable:false
    });
    $scope.InvoiceDetails.invoiceItemDetails.push({

        quotationItem: "Material 3",
        quotationDescription: "Supply Material 3",
        quotationQuantity: 15,
        quotationUnit: "kg",
        quotationUnitRate: 100,
        amount:1500,
        isTaxAplicable:false
    });

    var currentList1=[1,2];
    $scope.taxDetails.push({taxTitle:"VAT",taxApplicableTo:"(Item 1,2)",taxPercentage:10,amount:250 ,itemList:currentList1});
    $scope.taxDetails.push({taxTitle:"CST",taxApplicableTo:"(Item 3)",taxPercentage:10,amount:150 ,itemList:[3]});

    $scope.addRows=function(){

        for(var index=0;index<$scope.noOfRows;index++) {
            $scope.InvoiceDetails.invoiceItemDetails.push({

                quotationItem: "",
                quotationDescription: "",
                quotationQuantity: 0,
                quotationUnit: "",
                quotationUnitRate: 0,
                amount:0,
                isTaxAplicable:false
            });
        }
    }
    $scope.removeInvoiceItem= function(index){

        $scope.InvoiceDetails.invoiceItemDetails.splice(index,1); //remove item by index

    };
    $scope.removeInvoiceTaxItem= function(index){

        $scope.taxDetails.splice(index,1); //remove item by index

    };

    $scope.calculateTaxableAmount=function(index){

        if($scope.InvoiceDetails.invoiceItemDetails[index].isTaxAplicable){
            $scope.taxableAmount=$scope.taxableAmount + $scope.InvoiceDetails.invoiceItemDetails[index].amount;
            $scope.taxSelected++;
            $scope.currentItemList.push(index+1);
        }else{
            $scope.taxableAmount=$scope.taxableAmount - $scope.InvoiceDetails.invoiceItemDetails[index].amount;
            $scope.taxSelected--;
            $scope.currentItemList.splice($scope.currentItemList.indexOf(index+1),1);
        }
    }

    $scope.calculateAmount=function(index){

        $scope.InvoiceDetails.invoiceItemDetails[index].amount=$scope.InvoiceDetails.invoiceItemDetails[index].quotationQuantity* $scope.InvoiceDetails.invoiceItemDetails[index].quotationUnitRate;
    }

    $scope.addTax=function(size) {


        if ($scope.taxSelected>0) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Process/html/addTax.html',
                controller: function ($scope, $uibModalInstance,amount) {
                    $scope.tax={taxTitle:"",taxApplicableTo:"",taxPercentage:0,amount:0};
                    $scope.amount=amount;
                    console.log($scope.amount);
                    $scope.ok = function () {

                        console.log($scope.tax);
                        $uibModalInstance.close($scope.tax);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.calculateTaxAmount=function(){
                        $scope.tax.amount=$scope.amount*($scope.tax.taxPercentage/100);
                    }
                },
                size: size,
                resolve: {
                    amount: function () {
                        return $scope.taxableAmount;
                    }
                }
            });

            modalInstance.result.then(function (tax) {
                var itemString=" (Item ";
                for(var i=0;i<$scope.currentItemList.length-1;i++){
                    itemString+=$scope.currentItemList[i]+" ,";
                }
                itemString+=$scope.currentItemList[$scope.currentItemList.length-1]+" )";
                $scope.taxDetails.push({taxTitle:tax.taxTitle,taxApplicableTo:itemString,taxPercentage:tax.taxPercentage,amount:tax.amount ,itemList:$scope.currentItemList});
                console.log($scope.currentItemList);
                console.log($scope.taxDetails);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            //$scope.taxableAmount=0;

        }
        else{
            alert("Please Select Checkbox");
        }

    }

});
myApp.controller('ProjectPaymentController',function($scope,$http,$uibModal, $log){


    $scope.paymentDetails={
        operation:""

    };
    $scope.formSubmitted=false;
    $scope.showPaymentDetails=false;

    $scope.today = function(){
        $scope.paymentDetails.paymentDate = new Date();
    };
    $scope.today();

    $scope.openDate = function(){
        $scope.showpopup.opened = true;
    };

    $scope.showpopup = {
        opened:false
    };

    $scope.payDate = function(){
        $scope.datePicker.opened = true;
    };

    $scope.datePicker = {
        opened:false
    };

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

        }
        else if($scope.paymentDetails.pendingAmount!=0){


            paymentDetails.paymentStatus='No';

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',
                controller:  function ($scope, $uibModalInstance,paymentDetails) {


                    $scope.paymentDetails = paymentDetails;

                    $scope.ok = function () {

                        console.log($scope.paymentDetails);
                       
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
});

myApp.controller('viewProjectController',function($scope,$http){

    $scope.searchBy='';
    $scope.searchKeyword='';
    $scope.ProjectPerPage=2;
    $scope.currentPage=1;
    $scope.totalItems=5;
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

    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.ProjectPerPage;
        end = begin + $scope.ProjectPerPage;
        index = $scope.Projects.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };


});

myApp.controller('ModifyProjectController',function($scope,$http) {

        console.log("IN");
        $scope.projectDetails={

            projectName:"Prayeja City",
            projectAddress:"Katraj",
            projectCity:"Pune",
            projectState:"Maharashtra",
            projectCountry:"India",
            pinCode:"411051",

            pointOfConatcName:"Namdev Devmare",
            pointofConactEmailID:"namdev@gmail.com",
            pointOfLandlineNo:"020-202020",
            pointofConactMobileNo:"9090989897",
            projectManager:"Namdev Devmare",

            company1:true



        };
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
$scope.currentCustomer;
    $scope.customerList=[];
    $scope.customerList.push({
        customerId:"asdasd",
        name:"Gokhale",
        city:"pune",
        state:"maharashtra",
        country:"India",
        contactNo:"1231323",
        mobileNo:"asdasda",
        faxNo:"asdasd",
        emailId:"abc@mail.com",
        pan:"cDSda213",
        cstNo:"CST-101",
        vatNo:"Vat-101",
        serviceTaxNo:"ST-101"
    });
    $scope.customerList.push({
        customerId:"asdasd",
        name:"Gokle",
        city:"pune",
        state:"maharashtra",
        country:"India",
        contactNo:"1231323",
        mobileNo:"asdasda",
        faxNo:"asdasd",
        emailId:"abc@mail.com",
        pan:"cDSda213",
        cstNo:"CST-101",
        vatNo:"Vat-101",
        serviceTaxNo:"ST-101"
    });
    $scope.customerList.push({
        customerId:"asdasd",
        name:"Gokha",
        city:"pune",
        state:"maharashtra",
        country:"India",
        contactNo:"1231323",
        mobileNo:"asdasda",
        faxNo:"asdasd",
        emailId:"abc@mail.com",
        pan:"cDSda213",
        cstNo:"CST-101",
        vatNo:"Vat-101",
        serviceTaxNo:"ST-101"
    });

    $scope.showCustomerDetails=function(customer){
        $scope.currentCustomer=customer;
    }
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

myApp.controller('ModifyCustomerController',function($scope,$http){


    $scope.customerDetails={

        customer_name:"Namdev",
        customer_address:"Old Mali Lane ,Pandharpur",
        customer_pincode:"413304",
        customer_city:"Pandharpur",
        customer_country:"India",
        customer_state:"Maharashtra",
        customer_emailId:"namdev@gmail.com",
        customer_landline:"020-220202",
        customer_phone:"9090989898",
        customer_faxNo:"020-220202",
        customer_vatNo:"V12345678901",
        customer_cstNo:"C12345678901",
        customer_panNo:"ABCDE123A",
        customer_serviceTaxNo:"ABCDE1234ABC123"

    };


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
myApp.controller('ViewTaskController',function($scope,$http){

    console.log("In");

});

myApp.controller('SearchTaskController',function($scope,$http){

    $scope.taskList=[];
    $scope.taskList.push({
        taskId:"asdasd",
        taskName:"Gokhale",
        description:"pune",
        completionPercentage:"maharashtra",
        assignTo:"India",
        creationDate:"22-09-1992"
    });
    $scope.taskList.push({
        taskId:"asdasd",
        taskName:"Gokhale",
        description:"pune",
        completionPercentage:"maharashtra",
        assignTo:"India",
        creationDate:"22-09-1992"
    });
    $scope.taskList.push({
        taskId:"asdasd",
        taskName:"Gokhale",
        description:"pune",
        completionPercentage:"maharashtra",
        assignTo:"India",
        creationDate:"22-09-1992"
    });



});
myApp.controller('AssignTaskController',function($scope,$http){

    //$scope.today = function(){
    //    $scope.task.startDate = new Date();
    //};
    //
    //$scope.today();

    $scope.taskStartDate = function() {
        $scope.show.opened = true;
    };

    $scope.show = {
        opened:false
    };

    $scope.taskEndDate = function() {
        $scope.showEnd.opened = true;
    };

    $scope.showEnd = {
        opened:false
    };
});

