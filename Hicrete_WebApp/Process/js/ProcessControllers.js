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
        projectSource:'',
        customerId:''

    }

    $scope.Companies=[];
    AppService.getCompanyList($http,$scope);

    $scope.projectManagers=[];
    AppService.getProjectManagers($http,$scope);
    console.log("In Project Creation Controller");

    $scope.customers=[];
    AppService.getAllCustomers($http,$scope);

    $scope.creteProject = function(){

        var company = '';
        var isTracking = 0;

        $scope = this;
        if($scope.isSiteTracking == true){
            isTracking = 1;
        }


        var companiesInvolved=[];
        for(var i=0;i<$scope.Companies.length;i++){
            if($scope.Companies[i].checkVal){
                companiesInvolved.push($scope.Companies[i]);
            }

        }
        var projectBasicDetails = {"ProjectName":$scope.projectDetails.projectName,"ProjectManagerId":$scope.projectDetails.projectManagerId,"ProjectSource":$scope.projectDetails.projectSource,"IsSiteTrackingProject":$scope.isSiteTracking,"CustomerId":$scope.projectDetails.customerId,"Address":$scope.projectDetails.address,"City":$scope.projectDetails.city,"State":$scope.projectDetails.state,"Country":$scope.projectDetails.country,"Pincode":$scope.projectDetails.pinCode,"PointContactName":$scope.projectDetails.pointOfContacName,"MobileNo":$scope.projectDetails.pointfContactMobileNo,"LandlineNo":$scope.projectDetails.pointOfContactLandlineNo,"EmailId":$scope.projectDetails.pointofConactEmailID};
        var projectData={
            projectDetails:projectBasicDetails,
            companiesInvolved:companiesInvolved
        }
        // console.log("data is "+projectData);
        console.log("Posting");
        console.log("data is "+JSON.stringify(projectData));
        $http.post('php/api/projects', projectData)
            .success(function (data, status, headers) {
                //$scope.PostDataResponse = data;
                alert("data is "+data+" status is "+status);

            })
            .error(function (data, status, header) {
                //$scope.ResponseDetails = "Data: " + data;
                console.log(data);
                alert(data);
            });
    }


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

    $scope.CustomerPerPage=5;
    $scope.currentPage=1;


    $scope.searchCustomer = function(){
        $scope.customers = [];
        var cust = [];

        if($scope.searchKeyword==""){

            $http.get("php/api/customer").then(function(response) {
                console.log(response.data.length);
                if(response.data.status=="Successful"){
                    for(var i = 0; i<response.data.length ; i++){
                        cust.push({
                            id:response.data.message[i].CustomerId,
                            name:response.data.message[i].CustomerName,
                            address:response.data.message[i].Address,
                            city:response.data.message[i].City,
                            state:response.data.message[i].State,
                            country:response.data.message[i].Country,
                            mobileNo:response.data.message[i].Mobileno,
                            contactNo:response.data.message[i].Landlineno,
                            faxNo:response.data.message[i].FaxNo,
                            emailId:response.data.message[i].EmailId,
                            pan:response.data.message[i].PAN,
                            cstNo:response.data.message[i].CSTNo,
                            vatNo:response.data.message[i].VATNo,
                            serviceTaxNo:response.data.message[i].ServiceTaxNo,
                            pincode:response.data.message[i].Pincode
                        });
                    }
                    $scope.customers = cust;
                    console.log($scope.customers);
                }else{
                    alert(response.data.message);
                }


            })

        }
        else{
            //alert("in "+searchCity);

            $http.get("php/api/customer/search/"+$scope.searchKeyword+'&'+$scope.searchBy).then(function(response) {

                if(response.data.status=="Successful"){
                    console.log(response.data.message.length);
                    for(var i = 0; i<response.data.message.length ; i++){
                        cust.push({
                            id:response.data.message[i].CustomerId,
                            name:response.data.message[i].CustomerName,
                            address:response.data.message[i].Address,
                            city:response.data.message[i].City,
                            state:response.data.message[i].State,
                            country:response.data.message[i].Country,
                            mobileNo:response.data.message[i].Mobileno,
                            contactNo:response.data.message[i].Landlineno,
                            faxNo:response.data.message[i].FaxNo,
                            emailId:response.data.message[i].EmailId,
                            pan:response.data.message[i].PAN,
                            cstNo:response.data.message[i].CSTNo,
                            vatNo:response.data.message[i].VATNo,
                            serviceTaxNo:response.data.message[i].ServiceTaxNo,
                            pincode:response.data.message[i].Pincode
                        });
                    }
                    $scope.customers = cust;
                    console.log($scope.customers);
                }else{
                    alert(response.data.message);
                }

            })

        }
    }


    $scope.deleteCustomer = function($id){
        console.log("delete cust id "+$id);


        $http({
            method: 'GET',
            url: 'php/api/customer/delete/'+$id
        }).then(function successCallback(response) {
            alert("in success"+response.status );
        }, function errorCallback(response) {
            alert("in error "+response);
        });
    }

    $scope.showCustomerDetails=function(customer){
        $scope.currentCustomer=customer;
    }

    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.CustomerPerPage;
        end = begin + $scope.CustomerPerPage;
        index = $scope.customers.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };


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
    $scope.submitted=false;

    $scope.createCustomer = function() {
        var date = new Date();

        var custData = '{"CustomerName":"' + $scope.customerDetails.customer_name + '","Address":"' + $scope.customerDetails.customer_address + '","City":"' + $scope.customerDetails.customer_city + '","State":"' + $scope.customerDetails.customer_state + '","Country":"' + $scope.customerDetails.customer_country + '","EmailId":"' + $scope.customerDetails.customer_emailId + '","Pincode":"' + $scope.customerDetails.customer_pincode + '","Mobileno":"' + $scope.customerDetails.customer_phone + '","Landlineno":"' + $scope.customerDetails.customer_landline + '","FaxNo":"' + $scope.customerDetails.customer_faxNo + '","VATNo":"' + $scope.customerDetails.customer_vatNo + '","CSTNo":"' + $scope.customerDetails.customer_cstNo + '","ServiceTaxNo":"' + $scope.customerDetails.customer_serviceTaxNo + '","PAN":"' + $scope.customerDetails.customer_panNo + '","isDeleted":"0"}';

        $http.post('php/api/customer', custData)
            .success(function (data, status, headers) {
                if (data.status == "Successful") {
                    $scope.postCustData = data;
                    alert("Customer created Successfully");
                } else {
                    alert(data.message);
                }
            })
            .error(function (data, status, header) {
                $scope.ResponseDetails = "Data: " + data;
                alert("Error Occurred:" + data);
            });
    }


});

myApp.controller('ModifyCustomerController',function($scope,$http,$stateParams){

    $scope.customerDetails={

        customer_id:$stateParams.customerToModify.id,
        customer_name:$stateParams.customerToModify.name,
        customer_address:$stateParams.customerToModify.address,
        customer_pincode:$stateParams.customerToModify.pincode,
        customer_city:$stateParams.customerToModify.city,
        customer_country:$stateParams.customerToModify.country,
        customer_vatNo:$stateParams.customerToModify.vatNo,
        customer_cstNo:$stateParams.customerToModify.cstNo,
        customer_panNo:$stateParams.customerToModify.pan,
        customer_state:$stateParams.customerToModify.state,
        customer_emailId:$stateParams.customerToModify.emailId,
        customer_landline:$stateParams.customerToModify.contactNo,
        customer_phone:$stateParams.customerToModify.mobileNo,
        customer_faxNo:$stateParams.customerToModify.faxNo,
        customer_serviceTaxNo:$stateParams.customerToModify.serviceTaxNo
    };

    $scope.modifyCustomer = function($custId){

        var custUpdate = '{"CustomerName":"'+$scope.customerDetails.customer_name+'","Address":"'+$scope.customerDetails.customer_address+'","City":"'+$scope.customerDetails.customer_city+'","State":"'+$scope.customerDetails.customer_state+'","Country":"'+$scope.customerDetails.customer_country+'","Mobileno":"'+$scope.customerDetails.customer_phone+'","Landlineno":"'+$scope.customerDetails.customer_landline+'","FaxNo":"'+$scope.customerDetails.customer_faxNo+'","EmailId":"'+$scope.customerDetails.customer_emailId+'","VATNo":"'+$scope.customerDetails.customer_vatNo+'","CSTNo":"'+$scope.customerDetails.customer_cstNo+'","PAN":"'+$scope.customerDetails.customer_panNo+'","ServiceTaxNo":"'+$scope.customerDetails.customer_serviceTaxNo+'"}';
        //  console.log("update data is ::"+custUpdate);
        $http.post('php/api/customer/update/'+$custId, custUpdate)
            .success(function (data, status) {
                $scope.postCustData = data;
                alert("data is "+data+" status is "+status);

            })
            .error(function (data, status) {

                alert($scope.ResponseDetails );
            });

    }





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

