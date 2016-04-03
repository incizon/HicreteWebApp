/**
 * Created by Atul on 11-02-2016.
 */

myApp.factory('setInfo', function () {
    var savedData = {}

    function set(data) {
        savedData = data;
    }

    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }
});
/****************** file upload *******************************/
myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', function ($http) {

    this.uploadFileToUrl = function (file, uploadUrl) {
        //alert("File upload started");

        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })

            .success(function (status) {
                $scope.warningMessage = "File upload started..";
                $('#warning').css("display", "block");
                setTimeout(function () {
                    $('#warning').css("display", "none");
                }, 1000);
                console.log("in upload successs" + status);
            })

            .error(function () {
                $scope.errorMessage = "File upload not started..";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);
                console.log("In file upload error");
            });
    }
}]);
/**************************************************************/


myApp.controller('ProcessWidgetController', function ($scope, $http) {

    $scope.hasRead = true;
    $scope.hasWrite = true;

    var data = {
        operation: "CheckAccess",
        moduleName: "Process",
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


    var data = {
        operation: "CheckAccess",
        moduleName: "Process",
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

myApp.controller('ProjectCreationController', function ($scope, $http, $httpParamSerializerJQLike, AppService) {
    $scope.projectDetails = {
        projectName: '',
        state: '',
        address: '',
        country: '',
        city: '',
        pincode: '',
        pointOfContactName: '',
        pointOfContactEmailId: '',
        pointOfContactLandlineNo: '',
        pointfContactMobileNo: '',
        projectManagerId: '',
        projectSource: '',
        customerId: ''

    }

    $scope.Companies = [];
    AppService.getCompanyList($http, $scope.Companies);

    $scope.projectManagers = [];
    AppService.getProjectManagers($http, $scope.projectManagers);
    console.log("In Project Creation Controller");

    $scope.customers = [];
    AppService.getAllCustomers($http, $scope.customers);




    $scope.creteProject = function () {

        var company = '';
        var isTracking = 0;

        $scope = this;
        if ($scope.projectSource == "Site Tracking") {
            isTracking = 1;
        }


        var companiesInvolved = [];
        for (var i = 0; i < $scope.Companies.length; i++) {
            if ($scope.Companies[i].checkVal) {
                companiesInvolved.push($scope.Companies[i]);
            }

        }
        if(companiesInvolved.length<=0){
            alert("Please Select atleast one Company");
            return;
        }

        var projectBasicDetails = {
            ProjectName: $scope.projectDetails.projectName,
            ProjectManagerId: $scope.projectDetails.projectManagerId,
            ProjectSource: $scope.projectDetails.projectSource,
            CustomerId: $scope.projectDetails.customerId,
            Address: $scope.projectDetails.address,
            City: $scope.projectDetails.city,
            State: $scope.projectDetails.state,
            Country: $scope.projectDetails.country,
            Pincode: $scope.projectDetails.pinCode,
            PointContactName: $scope.projectDetails.pointOfContactName,
            MobileNo: $scope.projectDetails.pointfContactMobileNo,
            LandlineNo: $scope.projectDetails.pointOfContactLandlineNo,
            EmailId: $scope.projectDetails.pointOfContactEmailId
        };
        var projectData = {
            projectDetails: projectBasicDetails,
            companiesInvolved: companiesInvolved
        }
        // console.log("data is "+projectData);
        console.log("Posting");
        var data = {
            operation: "createProject",
            data: projectData

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/projectFacade.php', null, config)
            .success(function (data, status, headers) {
                console.log(data);
                if (data.status == "Successful") {
                    $('#loader').css("display", "block");
                    //$scope.PostDataResponse = data;
                    $('#loader').css("display", "none");
                    $scope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    $scope.clearForm();
                }
                else
                {
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 1000);
                }


                //alert(data.message);

            })
            .error(function (data, status, header) {
                //$scope.ResponseDetails = "Data: " + data;
                console.log(data);
                $scope.errorMessage = data;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);
                //alert(data);
            });

    }

    $scope.clearForm=function(){
        $scope.projectDetails = {
            projectName: '',
            state: '',
            address: '',
            country: '',
            city: '',
            pincode: '',
            pointOfContactName: '',
            pointOfContactEmailId: '',
            pointOfContactLandlineNo: '',
            pointfContactMobileNo: '',
            projectManagerId: '',
            projectSource: '',
            customerId: ''
        }
        for (var i = 0; i < $scope.Companies.length; i++) {
            $scope.Companies[i].checkVal = false;
        }
        $scope.formSubmitted=false;

    }
});


myApp.controller('ProjectDetailsController', function ($stateParams, myService, setInfo, $scope, $http, $uibModal, $log, fileUpload, AppService) {

    var detaildata = $stateParams.projectToView;
    var projId = detaildata.project_id;

    $scope.projDetailsData = {
        projectId: detaildata.projectId,
        project_name: detaildata.project_name,
        project_City: detaildata.project_City,
        project_Country: detaildata.project_Country,
        project_state: detaildata.project_State,
        project_Address: detaildata.project_Address,
        project_quotation: detaildata.QuotationTitle,
        PointContactName: detaildata.PointContactName,
        MobileNo: detaildata.MobileNo,
        LandlineNo: detaildata.LandlineNo,
        EmailId: detaildata.EmailId,
        Pincode: detaildata.Pincode
    }

    $scope.projectQuotations=[];
    $scope.PaidPaymentDetails = [];
    $scope.projectInvoice = [];
    $scope.projectWorkorders = [];

    var data={
        operation :"getQuotationByProjectId",
        data : projId

    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Process/php/quotationFacade.php",null, config)
        .success(function (data) {
            if (data.status != "Successful") {
                alert(data.message);
                return;
            }

            for (var i = 0; i < data.message.length; i++) {
                $scope.projectQuotations.push({
                    QuotationTitle: data.message[i].QuotationTitle,
                    QuotationId: data.message[i].QuotationId,
                    CompanyId: data.message[i].companyId,
                    CompanyName: data.message[i].companyName,
                    CreationDate: data.message[i].DateOfQuotation,
                    ProjectName: data.message[i].ProjectName,
                    ProjectId:data.message[i].ProjectId,
                    Subject: data.message[i].Subject,
                    RefNo: data.message[i].RefNo,
                    title: data.message[i].Title,
                    description: data.message[i].Description,
                    isApproved: data.message[i].isApproved,
                    filePath: data.message[i].QuotationBlob
                });
            }
            myService.set($scope.projectQuotations);
            if($scope.projectQuotations.length>0) {
                $scope.loadWorkOrderData(projId);
            }

        })
        .error(function (data){
            alert(data);
        })


    /*Get Workorder by project id*/
    $scope.loadWorkOrderData=function(projId){
         var data={
            operation :"getWorkorderByProjectId",
            data : projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/workorderFacade.php",null, config)
            .success(function (data) {

                if(data.status!="Successful"){
                    alert(data.message);
                    return;
                }


                for (var i = 0; i < data.message.length; i++) {
                    $scope.projectWorkorders.push({
                        workOrderNo: data.message[i].WorkOrderNo,
                        workoOrderTitle: data.message[i].WorkOrderName,
                        receivedDate: data.message[i].ReceivedDate,
                        quotationTitle: data.message[i].QuotationTitle,
                        quotationId: data.message[i].QuotationId,
                        creationDate: data.message[i].CreationDate,
                        dateOfQuotation: data.message[i].DateOfQuotation,
                        refNo :data.message[i].RefNo,
                        filePath: data.message[i].WorkOrderBlob

                    });
                }
                myService.set($scope.projectWorkorders);
                if($scope.projectWorkorders.length>0){
                    $scope.loadInvoiceData(projId);
                }

            })
            .error(function(data){
                alert(data);
            });


    }

    /*Get Invoices by project id*/
    $scope.loadInvoiceData=function(projId){
        var data={
            operation :"getInvoicesByProjectId",
            data : projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/invoiceFacade.php",null, config)
            .success(function (data) {
                if(data.status!="Successful"){
                    alert(data.message);
                    return;
                }

                for (var i = 0; i < data.message.length; i++) {
                    $scope.projectInvoice.push({
                        invoiceNo: data.message[i].InvoiceNo,
                        quotationId: data.message[i].QuotationId,
                        invoiceDate: data.message[i].InvoiceDate,
                        invoiceTitle: data.message[i].InvoiceTitle,
                        totalAmount: data.message[i].TotalAmount,
                        invoiceBLOB: data.message[i].InvoiceBLOB,
                        isPaymentRetention: data.message[i].isPaymentRetention,
                        CreatedBy: data.message[i].CreatedBy,
                        quotationTitle: data.message[i].QuotationTitle,
                        quotationDate: data.message[i].DateOfQuotation,
                        companyId: data.message[i].CompanyId,
                        contactPerson:data.message[i].ContactPerson,
                        PurchasersVATNo:data.message[i].PurchasersVATNo
                    });
                }
                myService.set($scope.projectInvoice);
                if($scope.projectInvoice.length>0){
                    $scope.loadInvoiceData(projId);
                }

            })
            .error(function (data){
                alert(data);
            });


    }


    $scope.loadPaymentData=function(projId){
        var data={
            operation :"getPaymentPaidAndTotalAmount",
            data : projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/ProjectPaymentFacade.php",null, config)
            .success(function (data) {
                if(data.status!="Successful"){
                    alert(data.message);
                    return;
                }

                for (var i = 0; i < data.message.length; i++) {
                    $scope.PaidPaymentDetails .push({
                        invoiceNo: data.message[i].InvoiceNo,
                        amountPaid: data.message[i].AmountPaid,
                        totalAmount: data.message[i].ProjectAmount,
                        invoiceTitle: data.message[i].InvoiceTitle
                    });
                }
                myService.set($scope.projectInvoice);
            })
            .error(function (data){
                alert(data);
            });

    }



    $scope.checkAvailability=function(filePath){
        if(filePath===null || filePath===undefined){
            return true;
        }else if(filePath.trim()===''){
            return true;
        }
        return false;
    }



    $scope.passWork = function (wo) {
        setInfo.set(wo);
    }
    $scope.setScope = function(scope){
        setInfo.set(scope);
    }





    $scope.workorder = {
        projId: $scope.projDetailsData.projectId,
        //porjName: proj.project_name,
        //quotationId: projDetailsData.QuotationId
    };
    console.log("final scope is " + $scope.workorder);

    $scope.createWorkorder = function () {
        console.log("IN");
        console.log("company id is :" + JSON.stringify($scope.CompanyName));
        var uploadQuotationLocation = "upload/Workorders/";
        var fileName = uploadQuotationLocation + $scope.myFile.name;
        //console.log("in createWorkorder ");//WorkOrderNo, WorkOrderName, ReceivedDate, WorkOrderBlob, ProjectId, CompanyId
        var workorderData = {
            ProjectId: $scope.workorder.projId,
            WorkOrderName:$scope.workorder.title,
            ReceivedDate:$scope.workorder.date,
            WorkOrderBlob:fileName,
            CompanyId:$scope.workOrderDetails.CompanyId,
            QuotationId:$scope.workOrderDetails.QuotationId
        };
        console.log("workorder data is " + workorderData);
        var data={
            operation :"createWorkorder",
            data : workorderData

        };

        var config = {
            params: {
                data: data
            }
        };
        $http.post("Process/php/workorderFacade.php",null, config)
            .success(function (data) {
                console.log(data);
                alert("success in workorder creation " + data + " status is " + status);
                alert("status" + JSON.stringify(data));
                var file = $scope.myFile;
                var uploadUrl = "php/api/workorder/upload";
                fileUpload.uploadFileToUrl(file, uploadUrl);
            })
            .error(function (data){
                alert("error in workorder creation " + JSON.stringify(data));
            })
    }

    $scope.viewProjQuotationDetails = function (q) {
        setInfo.set(q);
        //alert("view data in viewProjQuotationDetails "+JSON.stringify(q));
    }
    // console.log("data is "+JSON.stringify($scope.projDetailsData));

    $scope.viewProjQuotationDetails = function (q) {
        setInfo.set(q);
        //alert("view data in viewProjQuotationDetails "+JSON.stringify(q));
    }

    $scope.sendProjId = function () {
        //alert("in");
        console.log("in modal " + projId);
    }
    $scope.animationsEnabled = true;

    $scope.scheduleFollowup = function (size, q,type) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Applicator/html/paymentFollowup.html',

            controller: function ($scope, $uibModalInstance, $filter) {
                // console.log("quotation is "+JSON.stringify(q));
                AppService.getUsers($scope, $http);
                $scope.ok = function () {

                    // ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
                    var FollowupDate = $filter('date')($scope.applicatorDetails.followupdate, 'yyyy/MM/dd hh:mm:ss', '+0530');
                    var AssignEmployee = $scope.applicatorDetails.followupemployeeId;
                    var FollowupTitle = $scope.applicatorDetails.followTitle;

                    var followupData = {FollowupDate: FollowupDate ,AssignEmployee:  AssignEmployee ,FollowupTitle:FollowupTitle };
                    var data={};
                    if(type === "invoice"){
                        data={
                            operation :"CreatePaymentFollowup",
                            id : q.InvoiceNo,
                            data:followupData
                        };

                    }else{
                        data={
                            operation :"CreateQuotationFollowup",
                            id : q.QuotationId,
                            data:followupData

                        };
                    }

                    var config = {
                        params: {
                            data: data
                        }
                    };

                    $http.post('Process/php/followupFacade.php',null,config)
                        .success(function (data, status, headers) {
                            console.log(data);
                            alert("Stop");
                            if(data.status == "Successful") {
                                $('#loader').css("display", "block");
                                //$scope.PostDataResponse = data;
                                $('#loader').css("display", "none");
                                $scope.warningMessage = "Followup Created Successfully";
                                $('#warning').css("display", "block");
                            }
                            else
                            {
                                $scope.errorMessage = data.message;
                                $('#error').css("display", "block");
                                setTimeout(function () {
                                    $('#error').css("display", "none");
                                }, 3000);
                            }
                            setTimeout(function () {
                                $('#warning').css("display", "none");

                            }, 3000);

                            //alert(data.message);

                        })
                        .error(function (data, status, header) {
                            //$scope.ResponseDetails = "Data: " + data;
                            console.log(data);
                            $scope.errorMessage = data;
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                $('#error').css("display", "none");
                            }, 3000);
                            //alert(data);
                        });






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

    //console.log("IN ProjectDetailsController "+projId);
    /*Get all quotations by project id*/



    $scope.check = function (q) {
        var projQId = q;
        console.log("qqqq " + JSON.stringify(projQId));
        setInfo.set(projQId);
        $scope.workOrderDetails = q;
        console.log("Daya=" + $scope.workOrderDetails);
    }

    $scope.passInvoice = function (iv) {
        //alert("in"+iv);
        myService.set(iv);
    }

    $scope.closeProject = function () {
        console.log("close project" + projId);
        var data={
            operation :"closeProject",
            data : projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php",null, config)
            .success(function (data) {
                alert(data);
                //window.location="/dashboard.php#/Process/viewProjects";
            })
            .error(function(data){

            });

    }

});


myApp.controller('QuotationController', function (fileUpload, $scope, $http, $uibModal,AppService,$stateParams) {
    //alert("in quotation");

    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.taxDetails = [];

    $scope.totalAmnt=0;
    $scope.QuotationDetails = {
        quotationItemDetails: []
    };
    $scope.currentItemList = [];

    $scope.projects = [];
    AppService.getAllProjects($http, $scope.projects);

    $scope.Companies = [];
    if($stateParams.projectId !==null || $stateParams.projectId !==undefined){
        $scope.QuotationDetails.projectId=$stateParams.projectId;
        console.log("Calling");
        AppService.getCompaniesForProject($http,$scope.QuotationDetails.projectId,$scope.Companies);
    }

    $scope.getCompaniesForProject=function(){
        AppService.getCompaniesForProject($http,$scope.QuotationDetails.projectId,$scope.Companies);
    }



    $scope.quotationDate = function () {
        $scope.showQdate.opened = true;
    };

    $scope.showQdate = {
        opened: false
    };

    var totalAmount = 0;
    var remainingTotal = 0;


    $scope.createQuotation = function () {
        var b = [];
        var data = [];
        var projectId = $scope.QuotationDetails.projectId;
        var companyId = $scope.QuotationDetails.companyName.company_id;
        var companyName = $scope.QuotationDetails.companyName.company_name;
        var fileName = "";
        $scope.warningMessage = "";
        $scope.errorMessage = "";

        for (var i = 0; i < $scope.noOfRows; i++) {
            b.push({
                'Title': $scope.QuotationDetails.quotationItemDetails[i].quotationItem,
                'Decription': $scope.QuotationDetails.quotationItemDetails[i].quotationDescription,
                'Quantity': $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity,
                'Unit': $scope.QuotationDetails.quotationItemDetails[i].quotationUnit,
                'UnitRate': $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate
            });

        }

        var quotationData = {
            QuotationTitle: $scope.QuotationDetails.quotationTitle,
            ProjectId: projectId,
            CompanyName: companyName,
            CompanyId: companyId,
            RefNo: $scope.QuotationDetails.referenceNo,
            DateOfQuotation: $scope.QuotationDetails.quotationDate,
            Subject: $scope.QuotationDetails.quotationSubject,
            QuotationBlob: fileName
        };
        var quotationDetails = $scope.QuotationDetails.quotationItemDetails;
        var taxDetails = $scope.taxDetails;
        var QuotationData = {
            Quotation: quotationData,
            Details: quotationDetails,
            taxDetails: taxDetails
        };

        console.log(QuotationData);
        var data = {
            operation: "createQuotation",
            data: QuotationData

        };
        var config = {
            params: {
                data: data
            }
        };

        if ($scope.myFile != undefined) {
            if ($scope.myFile.name != undefined) {
                var uploadQuotationLocation = "upload/Quotations/";
                fileName = uploadQuotationLocation + $scope.myFile.name;
                quotationData.QuotationBlob=fileName;
                var fd = new FormData();
                fd.append('file', $scope.myFile);
                $http.post("Process/php/uploadQuotation.php", fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function (data) {
                        if(data.status=="Successful"){
                            console.log("Upload Successful");
                            $http.post("Process/php/quotationFacade.php", null, config)
                                .success(function (data) {

                                    if(data.status=="Successful"){
                                        $('#loader').css("display", "block");
                                        $('#loader').css("display", "none");
                                        $scope.warningMessage = "Quotation is Created Successfully...'";
                                        console.log($scope.warningMessage);
                                        $('#warning').css("display", "block");
                                        $scope.clearForm();
                                        setTimeout(function () {
                                            $('#warning').css("display", "none");
                                            window.location="dashboard.php#/Process/addQuotation";
                                        }, 1000);

                                    }else{
                                        alert(data.message);
                                    }

                                })
                                .error(function (data) {
                                    $('#loader').css("display", "block");
                                    $('#loader').css("display", "none");
                                    $scope.errorMessage = "Error :"+data;
                                    console.log($scope.errorMessage);
                                    $('#error').css("display", "block");
                                    setTimeout(function () {
                                        $('#error').css("display", "none");
                                    }, 2000);
                                });


                        }else{
                            alert(data.message);
                        }
                    })
                    .error(function () {
                        $scope.errorMessage = "Something went wrong can not upload quoatation";
                        $('#error').css("display", "block");
                    });
            }

        }else{
            $http.post("Process/php/quotationFacade.php", null, config)
                .success(function (data) {

                    if(data.status=="Successful"){
                        $('#loader').css("display", "block");
                        $('#loader').css("display", "none");
                        $scope.warningMessage = "Quotation is Created Successfully...'";
                        console.log($scope.warningMessage);
                        $('#warning').css("display", "block");
                        $scope.clearForm();
                        setTimeout(function () {
                            $('#warning').css("display", "none");
                            window.location="dashboard.php#/Process/addQuotation";
                        }, 1000);

                    }else{
                        alert(data.message);
                    }

                })
                .error(function (data) {
                    $('#loader').css("display", "block");
                    $('#loader').css("display", "none");
                    $scope.errorMessage = "Error :"+data;
                    console.log($scope.errorMessage);
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 2000);
                });

        }
    }


    $scope.addRows = function () {
        var rowCount = $scope.noOfRows;
        for (var i = 0; i < rowCount; i++) {
            $scope.QuotationDetails.quotationItemDetails.push({

                quotationItem: "",
                quotationDescription: "",
                quotationQuantity: 0,
                quotationUnit: "",
                quotationUnitRate: 0,
                amount: 0,
                isTaxAplicable: false
            });
        }
    }

    $scope.calculateTaxableAmount = function (index) {

        if ($scope.QuotationDetails.quotationItemDetails[index].isTaxAplicable) {
            $scope.taxableAmount = $scope.taxableAmount + $scope.QuotationDetails.quotationItemDetails[index].amount;
            $scope.taxSelected++;
            $scope.currentItemList.push(index + 1);
        } else {
            $scope.taxableAmount = $scope.taxableAmount - $scope.QuotationDetails.quotationItemDetails[index].amount;
            $scope.taxSelected--;
            $scope.currentItemList.splice($scope.currentItemList.indexOf(index + 1), 1);
        }
    }

    $scope.calculateAmount = function (index) {

        $scope.QuotationDetails.quotationItemDetails[index].amount = $scope.QuotationDetails.quotationItemDetails[index].quotationQuantity * $scope.QuotationDetails.quotationItemDetails[index].quotationUnitRate;
    }

    $scope.calculateTotal = function (amount) {
        $scope.totalAmnt=0;
        for (var i = 0; i < $scope.QuotationDetails.quotationItemDetails.length; i++) {
            $scope.totalAmnt =$scope.totalAmnt+$scope.QuotationDetails.quotationItemDetails[i].amount;
        }

    }


    $scope.removeQuotationItem = function (index) {

        $scope.totalAmnt =$scope.totalAmnt- $scope.QuotationDetails.quotationItemDetails[index].amount;
        $scope.QuotationDetails.quotationItemDetails.splice(index, 1); //remove item by index

    };

    $scope.removeTaxItem = function (index) {
        $scope.TaxAmnt=$scope.TaxAmnt - $scope.taxDetails[index].amount;
        $scope.taxDetails.splice(index, 1);
    };

    $scope.addTax = function (size) {
        var allTax=false;
        if ($scope.taxSelected <= 0) {
            $scope.taxableAmount=$scope.totalAmnt;
            allTax=true;
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Process/html/addTax.html',
            controller: function ($scope, $uibModalInstance, amount) {
                $scope.tax = {taxTitle: "", taxApplicableTo: "", taxPercentage: 0, amount: 0};
                $scope.amount = amount;
                console.log($scope.amount);
                $scope.ok = function () {

                    console.log($scope.tax);
                    $uibModalInstance.close($scope.tax);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.calculateTaxAmount = function () {
                    $scope.tax.amount = $scope.amount * ($scope.tax.taxPercentage / 100);
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
            var itemString="All";
            var itemArray=[];
            if(!allTax) {
                itemString = " (Item ";
                for (var i = 0; i < $scope.currentItemList.length - 1; i++) {
                    itemString += $scope.currentItemList[i] + " ,";
                    itemArray.push($scope.currentItemList[i]);
                }
                itemString += $scope.currentItemList[$scope.currentItemList.length - 1] + " )";
                itemArray.push($scope.currentItemList[$scope.currentItemList.length - 1]);
            }

            $scope.taxDetails.push({
                taxTitle: tax.taxTitle,
                taxApplicableTo: itemString,
                taxPercentage: tax.taxPercentage,
                amount: tax.amount,
                taxArray: itemArray
            });

            $scope.TaxAmnt=0;;
            for (var s = 0; s < $scope.taxDetails.length; s++) {

                $scope.TaxAmnt =$scope.TaxAmnt +$scope.taxDetails[s].amount;
            }


        }, function () {
            console.log("modal Dismiss");
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        if(allTax)
            $scope.taxableAmount=0;
    }


    $scope.clearForm=function(){
        $scope.formSubmitted=false;
        $scope.totalAmnt=0;
        $scope.TaxAmnt=0;;
        $scope.QuotationDetails = {
            projectId:'',
            quotationTitle:'',
            quotationDate:'',
            quotationSubject:'',
            companyName:'',
            referenceNo:'',
            quotationItemDetails: []
        };
        $scope.currentItemList = [];
        $scope.taxDetails=[];

    }



    //$scope.createQuotationDoc = function () {
    //    var b = [];
    //    var data = [];
    //    var projectId = $scope.QuotationDetails.projectName.id;
    //    var companyId = $scope.QuotationDetails.companyName.company_id;
    //    var companyName = $scope.QuotationDetails.companyName.company_name;
    //    var date = new Date();
    //    alert("No of rows " + $scope.noOfRows);
    //    for (var i = 0; i < $scope.noOfRows; i++) {
    //        // alert("in for"+i+" count "+$scope.noOfRows);
    //        //alert("Title is "+$scope.QuotationDetails.quotationItemDetails[i].quotationItem);
    //        b.push({
    //            'Title': $scope.QuotationDetails.quotationItemDetails[i].quotationItem,
    //            'Decription': $scope.QuotationDetails.quotationItemDetails[i].quotationDescription,
    //            'Quantity': $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity,
    //            'Unit': $scope.QuotationDetails.quotationItemDetails[i].quotationUnit,
    //            'UnitRate': $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate
    //        });
    //        data[i] = '{"Title":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationItem + '","Description":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationDescription + '","Quantity":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity + '","UnitRate":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationUnit + '","Amount":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate + '"} '
    //        // console.log("data is "+data[i]);
    //    }
    //    var jsonData = [];
    //    jsonData = '"Quotation":[' + data + ']';
    //    //console.log("JSON data is --"+jsonData);
    //    var taxData = [];
    //    var taxJson = [];
    //    taxData = JSON.stringify($scope.taxDetails);
    //    taxJson = ', "TaxJson":' + taxData + ' }';
    //    var d2 = $filter('date')($scope.QuotationDetails.quotationDate, 'yyyy/MM/dd ', '+0530');
    //    var quotationData = '{"Date":"' + date + '","QuotationTitle":"' + $scope.QuotationDetails.quotationTitle + '","ProjectId":"' + projectId + '","CompanyName":"' + companyName + '","CompanyId":"' + companyId + '","RefNo":"' + $scope.QuotationDetails.referenceNo + '","DateOfQuotation":"' + d2 + '","Subject":"' + $scope.QuotationDetails.quotationSubject + '","QuotationBlob":"' + $scope.qBlob + '" ,';
    //    // var data3 =',{"TaxName":"test tax",  "TaxPercentage":"12",  "TaxAmount":"1200"}'
    //    var quotationAllData = quotationData + " " + jsonData + "" + taxJson;
    //
    //    console.log("data in create quotation doc " + quotationAllData);
    //    $.ajax({
    //        type: "POST",
    //        url: 'php/api/GenDoc/Quotation',
    //        data: quotationAllData,
    //        dataType: 'json',
    //        cache: false,
    //        contentType: 'application/json',
    //        processData: false,
    //
    //        success: function (data) {
    //            alert("success in task updation " + data);
    //
    //
    //        },
    //        error: function (data) {
    //            alert("error in task updation " + JSON.stringify(data));
    //        }
    //    });
    //
    //
    //}



});

myApp.controller('InvoiceController', function ($scope, $http, $uibModal, $log, $filter, setInfo) {

    console.log("in add invoice");
    var workDetail = setInfo.get();
    //console.log("workorder no is "+JSON.stringify(workDetail));
    var qId = workDetail.quotationId;
    //console.log("Quotation id is "+qId);
    $scope.taxSelected=0;
    $scope.taxableAmount=0;
    $scope.noOfRows=0;
    $scope.taxDetails=[];
    $scope.currentItemList=[];
    $scope.totalAmnt = 0;
    $scope.roundingOff = 0;
    var totalAmount = 0;

    $scope.InvoiceDetails={

        invoiceItemDetails:[],
        workoOrderTitle : workDetail.workoOrderTitle,
        quotationNumber : workDetail.quotationId,
        quotationDate :workDetail.dateOfQuotation,
        workOrderDate :workDetail.receivedDate,
        refNo:workDetail.refNo
    }

    /*Quotation Details and tax details*/

            $scope.QuotationDetails = [];
               $http({
                method : "GET",
                url : "php/api/quotation/details/"+qId
                }).then(function mySucces(response) {
                    $scope.qData = response.data;
                     var b = [];
                     var length = $scope.qData.length;
                    //alert("length is "+$scope.qData.length);
                    $scope.getTotalAmount = function(){
                              var total = 0;
                              var amount313 =0;
                               for(var i = 0; i < $scope.qData.length; i++){
                                  var amount = $scope.qData[i].Amount;
                                  total =+total + +amount;
                              }
                              return total;
                              console.log("totalAmount is"+total);
                             }
                      
                      for(var i = 0;i<length;i++){
                        $scope.InvoiceDetails.invoiceItemDetails.push({
                                'quotationItem':response.data[i].Title,                        
                                'quotationDescription':response.data[i].Description,
                                'quotationQuantity':response.data[i].Quantity,
                                'quotationUnitRate':response.data[i].UnitRate,
                                'amount':response.data[i].Amount,
                                'quotationUnit':response.data[i].Unit,
                                'detailID':response.data[i].DetailID,
                                'detailNo' :response.data[i].DetailNo
                            });
                      //$scope.invoiceItemDetails = b;
                      }
                }, function myError(response) {
                    $scope.error = response.statusText;
                });
            /*Get URL for only tax details by QuotatioId*/
                $http({
                method : "GET",
                url : "php/api/quotation/taxDetails/"+qId
                }).then(function mySucces(response) {
                  var qtData = response.data.message;
                    $scope.qtData = response.data.TaxDetails;
                     $scope.taxDetails =[];
                     var b = [];
                     var taxArray = [];
                     var length = $scope.qtData.length;
                   // alert("length is "+$scope.qtData.length);
                      $scope.getTotalTaxAmount = function(){
                          var total = 0;
                          var amount =0;
                          for(var i = 0; i<$scope.qtData.length; i++){
                             var amount = $scope.qtData[i].TaxAmount;
                              total =+total + +amount;
                            }
                           return total;
                           // console.log("totalTaxAmount is"+total);
                         }

                           for (var i = 0; i < length; i++) {
                              var taxApplicableTo = 'All';
                              if ($scope.qtData[i].DetailsNo.length > 0) {
                                  taxApplicableTo = "( Item No ";
                                  for (var j = 0; j < $scope.qtData[i].DetailsNo.length; j++) {
                                      if (j + 1 == $scope.qtData[i].DetailsNo.length)
                                          taxApplicableTo = taxApplicableTo + $scope.qtData[i].DetailsNo[j] + " )";
                                      else
                                          taxApplicableTo = taxApplicableTo + $scope.qtData[i].DetailsNo[j] + ",";
                                  }

                              }
                              var itemArray = [];
                             // alert("length is "+response.data.TaxDetails[i].DetailsNo.length);
                              for(var j = 0; j < response.data.TaxDetails[i].DetailsNo.length; j++){
                                itemArray.push(parseInt(response.data.TaxDetails[i].DetailsNo[j]));
                              }
                              $scope.taxDetails.push({
                                  'quotationId': $scope.qtData[i].QuotationId,
                                  'taxId': $scope.qtData[i].TaxID,
                                  'taxTitle': $scope.qtData[i].TaxName,
                                  'taxPercentage': $scope.qtData[i].TaxPercentage,
                                  'amount': $scope.qtData[i].TaxAmount,
                                  taxApplicableTo: taxApplicableTo,
                                  'taxArray' :itemArray 
                              });

                          }
                     console.log("qTaxDetails is " + JSON.stringify($scope.qTaxDetails));

                      //console.log("QuotationDetails scope is  "+JSON.stringify($scope.QuotationDetails));
                }, function myError(response) {
                    $scope.error = response.statusText;
                });

    /************************************/


    $scope.createInvoice = function(){
      console.log("in createInvoice");
      var totalAmount = $scope.getTotalAmount();
      //console.log("data ussssssss "+totalAmount);
      var totalTax =$scope.getTotalTaxAmount();
      //console.log("total tax is "+totalTax);
      var grandTotal =(+totalAmount + +totalTax) - +$scope.roundingOff;
      //console.log("Grand Total amount is "+grandTotal);
     // console.log("contactPerson "+$scope.InvoiceDetails.contactPerson);
       var d1 = $filter('date')($scope.InvoiceDetails.invoiceDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
       var d2= $filter('date')($scope.InvoiceDetails.quotationDate, 'yyyy/MM/dd', '+0530');
       var d3 = $filter('date')($scope.InvoiceDetails.workOrderDate, 'yyyy/MM/dd', '+0530');
       var invoicData = {"InvoiceNo":$scope.InvoiceDetails.invoiceNumber,"InvoiceTitle":"Invoice Title","TotalAmount":totalAmount,"RoundingOffFactor":$scope.roundingOff,"GrandTotal":grandTotal,"InvoiceBLOB":" ","isPaymentRetention":"1","PurchasersVATNo":"11","PAN":"123456","CreatedBy":"1","QuotationId":$scope.InvoiceDetails.quotationNumber,"WorkOrderNumber":$scope.InvoiceDetails.workOrderNumber,"ContactPerson":$scope.InvoiceDetails.contactPerson,"InvoiceDate":d1,"QuotationDate":d2,"WorkOrderDate":d3};
      //var invoiceAbstract = '{"TaxName":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationDescription+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'"}';
     // console.log("invoice data is final 11 "+JSON.stringify(invoicData));
      var b = [];
      var data = [];
     // console.log("noOfRows "+$scope.noOfRows);
        for(var i=0; i<$scope.noOfRows;i++){          
                b.push({'Title': $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem, 'Decription': $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription,'Quantity': $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity,'Unit': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit,'UnitRate': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate});
                        data[i] = '{"DetailNo":"1","Title":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription+'","Quantity":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity+'","UnitRate":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit+'","Amount":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate+'"}';
                     // console.log("data is "+data[i]);
            }
    
       var jsonData = [];
        jsonData = ',"Details":['+data+']';
         var taxData =[];
         var taxJson = []; 
         taxData =$scope.taxDetails;
         console.log("tax data is "+taxData);
        // taxJson = ', "taxDetails":'+taxData+' }';
         var invoiceAllData = invoicData+" "+jsonData+""+taxJson;
         //console.log("111 "+invoiceAllData);
          var invoiceDetails = $scope.InvoiceDetails.invoiceItemDetails;
          //console.log("invoice details is 313 "+invoiceDetails);
                var taxDetails = $scope.taxDetails;
                var InvoiceData = {
                  Invoice:invoicData,
                  Details:invoiceDetails,
                  taxDetails:taxData
                };

         console.log("Final invoice data is "+JSON.stringify(InvoiceData));

             $.ajax({
                            type: "POST",
                            url: 'php/api/invoice',
                            data: JSON.stringify(InvoiceData),
                            dataType: 'json',
                            cache: false,
                            contentType: 'application/json',
                            processData: false,                           
                            success:  function(data)                            {
                                alert("success in Invice creation "+data);                           
                             } ,
                            error: function(data){
                            alert("error in invoice creation "+JSON.stringify(data));         
                            } 
                        }); 

    }

    var currentList1=[1,2];
    //$scope.taxDetails.push({taxTitle:"VAT",taxApplicableTo:"(Item 1,2)",taxPercentage:10,amount:250 ,itemList:currentList1});
    //$scope.taxDetails.push({taxTitle:"CST",taxApplicableTo:"(Item 3)",taxPercentage:10,amount:150 ,itemList:[3]});

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

        var amount =$scope.InvoiceDetails.invoiceItemDetails[index].amount;
        /*alert("amount is "+amount);
         alert("totalAmount is "+totalAmount);*/
        totalAmount = +totalAmount - +amount;
        $scope.totalAmnt = totalAmount;
        console.log("remainingTotal is "+$scope.totalAmnt);
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
        //alert("ttttt");

        $scope.InvoiceDetails.invoiceItemDetails[index].amount=$scope.InvoiceDetails.invoiceItemDetails[index].quotationQuantity * $scope.InvoiceDetails.invoiceItemDetails[index].quotationUnitRate;
        console.log("amount is "+$scope.InvoiceDetails.invoiceItemDetails[index].amount);
    }


    $scope.calculateTotal = function(amount){

        totalAmount = +totalAmount + +amount;
        console.log("total amount is "+totalAmount);
        $scope.totalAmnt = totalAmount;
        // alert("totalAmount is "+$scope.totalAmnt);
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
                var itemArray = [];
                for(var i=0;i<$scope.currentItemList.length-1;i++){
                    itemString+=$scope.currentItemList[i]+" ,";
                    itemArray.push($scope.currentItemList[i]);
                }
                itemString+=$scope.currentItemList[$scope.currentItemList.length-1]+" )";
                itemArray.push($scope.currentItemList[$scope.currentItemList.length-1]);
                //$scope.taxDetails.push({taxTitle:tax.taxTitle,taxPercentage:tax.taxPercentage,amount:tax.amount});
                $scope.taxDetails.push({taxTitle:tax.taxTitle,taxApplicableTo:itemString,taxPercentage:tax.taxPercentage,amount:tax.amount ,itemList:$scope.currentItemList,taxArray:itemArray});
                //console.log($scope.currentItemList);
                //console.log($scope.taxDetails);
                // console.log($scope.currentItemList);
                //console.log(JSON.stringify($scope.taxDetails));
                //console.log("tax amnt is 313 "+$scope.taxDetails.amount);
                var taxAmnt = 0;
                //console.log("length is "+$scope.taxDetails.length);
                for(var s=0;s<$scope.taxDetails.length;s++){
                    var taxamnt = $scope.taxDetails[s].amount;
                    taxAmnt = taxAmnt + taxamnt;
                    //  console.log("tax amnt is "+taxAmnt);
                    $scope.TaxAmnt = taxAmnt;
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            //$scope.taxableAmount=0;

        }
        else {
            //alert("Please Select Checkbox");
            $scope.errorMessage = "Please Select Checkbox for Tax..";
            console.log($scope.errorMessage);
            $('#error').css('display','block');
            setTimeout(function(){
                $('#error').css('display','none');
            },3000);
        }

    }

    $scope.totalTaxAmount = function (amount) {
        //  console.log("amount is "+amount);
    }


    $scope.CreateInvoiceDoc = function(){
        // console.log("in createInvoice DOc generation");
        var d1 = $filter('date')($scope.InvoiceDetails.invoiceDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var d2= $filter('date')($scope.InvoiceDetails.quotationDate, 'yyyy/MM/dd', '+0530');
        var d3 = $filter('date')($scope.InvoiceDetails.workOrderDate, 'yyyy/MM/dd', '+0530');
        //var grandTotal = (+$scope.totalAmnt + +$scope.TaxAmnt) - +$scope.roundingOff;
        var totalAt =$scope.totalAmnt;
        var totalTat = $scope.TaxAmnt;
        var totalAmount =+totalAt + +totalTat;
        var roundingOff =$scope.roundingOff;
        var grandTotal = +totalAmount - +roundingOff;
        /* var invoicData = '{"InvoiceNo":"'+$scope.InvoiceDetails.invoiceNumber+'","InvoiceTitle":"Invoice Title","TotalAmount":"1000","RoundingOffFactor":"10","GrandTotal":"1000","InvoiceBLOB":" ","isPaymentRetention":"1","PurchasersVATNo":"11","PAN":"123456","CreatedBy":"1","QuotationId":"'+$scope.InvoiceDetails.quotationNumber+'","WorkOrderNumber":"'+$scope.InvoiceDetails.workOrderNumber+'","ContactPerson":"'+$scope.InvoiceDetails.contactPerson+'","InvoiceDate":"'+d1+'","QuotationDate":"'+d2+'","WorkOrderDate":"'+d3+'"';
         var b = [];
         var data = [];
         console.log("row size is "+$scope.noOfRows);
         for(var i=0; i<$scope.noOfRows;i++){

         // b.push({'Title': $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem, 'Decription': $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription,'Quantity': $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity,'Unit': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit,'UnitRate': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate,'Amount': $scope.InvoiceDetails.invoiceItemDetails[i].amount});
         data[i] = '{"DetailNo":"'+i+'","Title":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription+'","Quantity":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity+'","UnitRate":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit+'","Amount":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate+'"}';
         console.log("data is "+data[i]);
         }
         var taxDetails =JSON.stringify($scope.taxDetails);
         console.log("tax is  data "+taxDetails);

         var jsonData = [];
         jsonData = ',"Quotation":['+data+']';
         var taxData =[];
         var taxJson = [];
         taxData =JSON.stringify($scope.taxDetails);
         taxJson = ', "TaxJson":'+taxData+' }';
         var invoiceAllData = invoicData+" "+jsonData+""+taxJson;
         //console.log("Final invoice data is "+invoiceAllData);*/
        var invoicData = {"InvoiceNo":$scope.InvoiceDetails.invoiceNumber,"InvoiceTitle":"Invoice Title","TotalAmount":totalAmount,"RoundingOffFactor":$scope.roundingOff,"GrandTotal":grandTotal,"InvoiceBLOB":" ","isPaymentRetention":"1","PurchasersVATNo":"11","PAN":"123456","CreatedBy":"1","QuotationId":$scope.InvoiceDetails.quotationNumber,"WorkOrderNumber":$scope.InvoiceDetails.workOrderNumber,"ContactPerson":$scope.InvoiceDetails.contactPerson,"InvoiceDate":d1,"QuotationDate":d2,"WorkOrderDate":d3};
        //var invoiceAbstract = '{"TaxName":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationDescription+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'"}';
        var b = [];
        var data = [];
        //console.log("data is "+invoicData);
        //console.log("noOfRows "+$scope.noOfRows);
        for(var i=0; i<$scope.noOfRows;i++){

            b.push({'Title': $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem, 'Decription': $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription,'Quantity': $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity,'Unit': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit,'UnitRate': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate});
            data[i] = '{"DetailNo":"1","Title":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription+'","Quantity":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity+'","UnitRate":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit+'","Amount":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate+'"}';
            //  console.log("data is "+data[i]);
        }
        var taxDetails =JSON.stringify($scope.taxDetails);
        // console.log("tax is  data "+taxDetails);

        var jsonData = [];
        jsonData = ',"Details":['+data+']';
        var taxData =[];
        var taxJson = [];
        taxData =JSON.stringify($scope.taxDetails);
        taxJson = ', "taxDetails":'+taxData+' }';
        var invoiceAllData = invoicData+" "+jsonData+""+taxJson;
        //console.log("111 "+invoiceAllData);

        var invoiceDetails = $scope.InvoiceDetails.invoiceItemDetails;
        //console.log("invoice details is313 "+invoiceDetails);
        var taxDetails = $scope.taxDetails;
        var InvoiceData = {
            Invoice:invoicData,
            Details:invoiceDetails,
            taxDetails:taxDetails
        };
        //console.log("doc gen is"+JSON.stringify(InvoiceData));

        $.ajax({
            type: "POST",
            url: 'php/api/GenDoc/Invoice',
            data: JSON.stringify(InvoiceData),
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success:  function(data)                            {
                alert("success gen doc invoice "+JSON.stringify(data));

            } ,
            error: function(data){
                alert("error in gen doc invoice "+JSON.stringify(data));
            }
        });


    };


});
myApp.controller('ProjectPaymentController', function ($scope, $http, $uibModal, $log, $filter, AppService) {
    /**************************************************************************/

    $scope.projectPayment = [];
    $scope.animationsEnabled = true;
    $scope.paymentReceivedFor = undefined;
    var totalAmount = 0;
    $scope.AssignedPayments = [];
    var AssignedPayment = [];
    var paymentdetails = [];
    $scope.projectPaymentsInvoice = [];
    $scope.paymentDetails = {
        operation: ""

    };
    $scope.formSubmitted = false;
    $scope.showPaymentDetails = false;
    /**********************/
    $scope.Projects = [];
    var project = [];

    $scope.dateOfPayment = function () {
        $scope.payDate.opened = true;
    };

    $scope.payDate = {
        opened: false
    };

    AppService.getUsers($scope, $http);
    /****************************/
    //     /************* got all project ********************/

    AppService.getAllProjects($http, $scope.Projects);
    AppService.getAllInvoicesOfProject($http, $scope.Invoices, $scope.paymentDetails.projectID);

    $scope.viewProjectPaymentDetails = function (project_id) {
        $scope.Invoices = [];
        var invoice = [];
        AppService.getAllInvoicesOfProject($http, $scope.Invoices, project_id);
        var data = {
            operation: "getProjectPayment",
            projectId: project_id

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Process/php/ProjectPaymentFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    if (data.message != null) {
                        paymentdetails =data.message;
                    }
                    $scope.projectPayment = paymentdetails;
                    console.log("project payment new scope is " + JSON.stringify($scope.projectPayment));
                    var pkgamount = 0;
                    var amountPaid = 0;

                    for (var i = 0; i < $scope.projectPayment.Quotation.length; i++) {
                        pkgamount = +pkgamount + +$scope.projectPayment.Quotation[i].total_project_amount;
                        amountPaid = +amountPaid + +$scope.projectPayment.Quotation[i].total_paid_amount;

                        for (var index1 = 0; index1 < $scope.projectPayment.Quotation[i].paymentDetails.length; index1++) {
                            //    console.log("in for");
                            $scope.projectPaymentsInvoice.push({
                                amount_paid: $scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal,
                                date_of_payment: $scope.projectPayment.Quotation[i].paymentDetails[index1].InvoiceDate,
                                paid_to: $scope.projectPayment.Quotation[i].paymentDetails[index1].FirstName + '' + $scope.projectPayment.Quotation[i].paymentDetails[index1].LastName,
                            });
                        }
                    }

                    $scope.packageAmount = pkgamount;
                    $scope.projectPayment.total_project_amount = pkgamount;
                    $scope.previousAmountPaid = amountPaid;
                    $scope.projectPayment.total_paid_amount = amountPaid;
                }

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $scope.errorMessage = data.message;
                $('#error').css("display", "block");
            });





        //$http.get("php/api/payment/allPayment/Byproj/" + project_id).then(function (response) {
        //    //  console.log(response.data.length);
        //    if (response.data != null) {
        //        paymentdetails = response.data;
        //    }
        //    $scope.projectPayment = paymentdetails;
        //    console.log("project payment new scope is " + JSON.stringify($scope.projectPayment));
        //    var pkgamount = 0;
        //    var amountPaid = 0;
        //
        //    for (var i = 0; i < $scope.projectPayment.Quotation.length; i++) {
        //        pkgamount = +pkgamount + +$scope.projectPayment.Quotation[i].total_project_amount;
        //        amountPaid = +amountPaid + +$scope.projectPayment.Quotation[i].total_paid_amount;
        //
        //        for (var index1 = 0; index1 < $scope.projectPayment.Quotation[i].paymentDetails.length; index1++) {
        //            //    console.log("in for");
        //            $scope.projectPaymentsInvoice.push({
        //                amount_paid: $scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal,
        //                date_of_payment: $scope.projectPayment.Quotation[i].paymentDetails[index1].InvoiceDate,
        //                paid_to: $scope.projectPayment.Quotation[i].paymentDetails[index1].FirstName + '' + $scope.projectPayment.Quotation[i].paymentDetails[index1].LastName,
        //            });
        //        }
        //    }
        //
        //    $scope.packageAmount = pkgamount;
        //    $scope.projectPayment.total_project_amount = pkgamount;
        //    $scope.previousAmountPaid = amountPaid;
        //    $scope.projectPayment.total_paid_amount = amountPaid;
        //})

        $scope.showPaymentDetails = true;

    }


    $scope.getPendingAmount = function () {
        // console.log("In Pending amount function");
        $scope.paymentDetails.pendingAmount = parseInt($scope.packageAmount) - parseInt($scope.paymentDetails.amountPaid) - $scope.previousAmountPaid;

    }
    $scope.submitPaymentDetails = function (size, paymentDetails, quotation_id) {
        console.log("branch number is " + paymentDetails.branchName)
        var iscash = 0;
        var paydate = $filter('date')(paymentDetails.paymentDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        if (paymentDetails.paymentMode == 'cash') {
            iscash = 1;
            //var data = '{"AmountPaid":"'+paymentDetails.amountPaid+'", "PaymentDate":"'+paydate+'", "IsCashPayment":"'+iscash+'", "PaidTo":"'+paymentDetails.paidTo+'","InstrumentOfPayment":"'+paymentDetails.paymentMode+'"}'
            var data = {"InvoiceNo": paymentDetails.InvoiceNo,"AmountPaid": paymentDetails.amountPaid, "PaymentDate":paydate, "IsCashPayment": iscash, "PaidTo": paymentDetails.paidTo.id,"InstrumentOfPayment":paymentDetails.paymentMode, "IDOfInstrument":"", "BankName":"", "BranchName":"", "City":""};
        }
        else {
            var data = {"InvoiceNo": paymentDetails.InvoiceNo,"AmountPaid":paymentDetails.amountPaid , "PaymentDate": paydate, "IsCashPayment": iscash , "PaidTo": paymentDetails.paidTo.id,"InstrumentOfPayment":paymentDetails.paymentMode, "IDOfInstrument":paymentDetails.uniqueNumber, "BankName": paymentDetails.bankName, "BranchName":paymentDetails.branchName, "City": paymentDetails.branchCity };
        }
        console.log("dta is " + data);

        var data = {
            operation: "saveProjectPayment",
            //projectId: project_id,
            data:data

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Process/php/ProjectPaymentFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    $scope.warningMessage = data.message;
                    $('#warning').css("display", "block");

                }
                setTimeout(function () {
                    $scope.$apply(function () {
                        $('#warning').css("display", "none");
                       // window.location.reload(true);
                    });
                }, 3000);

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $scope.errorMessage = data.message;
                $('#error').css("display", "block");
            });

        //$.ajax({
        //    type: "POST",
        //    url: 'php/api/savepayment',
        //    data: data,
        //    dataType: 'json',
        //    cache: false,
        //    contentType: 'application/json',
        //    processData: false,
        //    success: function (data) {
        //        alert("success save payment " + data);
        //    },
        //    error: function (xhr, status, error) {
        //        alert(xhr.responseText + " " + error + " AND " + status.code);
        //    }
        //});


        $scope.formSubmitted = false;

        if ($scope.paymentDetails.pendingAmount == 0) {

            paymentDetails.paymentStatus = 'Yes';
            console.log(paymentDetails);

        }
        else if ($scope.paymentDetails.pendingAmount != 0) {


            paymentDetails.paymentStatus = 'No';

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',
                controller: function ($scope, $uibModalInstance, paymentDetails, AppService) {
                    AppService.getUsers($scope, $http);

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

myApp.controller('viewProjectController', function ($scope, $http, $rootScope, myService) {

    $scope.ProjectPerPage = 5;
    $scope.currentPage = 1;

    $scope.searchKeyword = "";

    $scope.searchproject = function () {
        var project = [];
        var expression = $scope.searchBy + "" + $scope.searchKeyword;
        $rootScope.projectSearch = [];

        if ($scope.searchBy != undefined) {
            // alert("nt");
            console.log($scope.searchBy);
            console.log($scope.searchKeyword);

            var data = {
                operation: "searchProject",
                searchBy: $scope.searchBy,
                searchKeyword: $scope.searchKeyword
            };

            var config = {
                params: {
                    data: data
                }
            };

            $http.post('Process/php/projectFacade.php', null, config)
                .success(function (data, status, headers) {
                    console.log(data);
                    if (data.status == "Successful") {
                        for (var i = 0; i < data.message.length; i++) {
                            project.push({
                                'project_name': data.message[i].ProjectName,
                                'projectId': data.message[i].ProjectId,
                                'project_status': data.message[i].ProjectStatus,
                                'project_manager': data.message[i].FirstName + " " + data.message[i].LastName,
                                'project_id': data.message[i].ProjectId,
                                'project_Address': data.message[i].Address,
                                'project_City': data.message[i].City,
                                'project_State': data.message[i].State,
                                'project_Country': data.message[i].Country,
                                'PointContactName': data.message[i].PointContactName,
                                'MobileNo': data.message[i].MobileNo,
                                'LandlineNo': data.message[i].LandlineNo,
                                'EmailId': data.message[i].EmailId,
                                'Pincode': data.message[i].Pincode,
                                'customerId': data.message[i].CustomerId,
                                'customerName': data.message[i].CustomerName,
                                projectManagerId: data.message[i].ProjectManagerId,

                            });
                            //$scope.Projects = b;
                        }

                        $rootScope.projectSearch = project;
                        if ($rootScope.projectSearch.length == 0) {
                            alert("No Data Found For Search Criteria");
                        }
                    } else {
                        alert(data.message);
                    }

                }).error(function (data, status, headers) {

            });
            // $http.get("php/api/projects/search/" + $scope.searchBy + "/" + $scope.searchKeyword).then(function (response) {


        } else {

            alert("Please Select Search By From SelectList");
        }
    }


    $scope.projectDetails = function (viewData) {
        myService.set(viewData);
    }

    /*delete project*/
    $scope.deleteProject = function (id) {
        console.log("in Deleted fn" + id);
        $http.get('php/api/project/delete/' + id)
            .success(function (data, status) {
                //  $scope.postCustData = data;
                alert("data is " + data + " status is " + status);
            })
            .error(function (data, status) {
                alert($scope.ResponseDetails);
            });
    }

    $scope.paginate = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.ProjectPerPage;
        end = begin + $scope.ProjectPerPage;
        index = $rootScope.projectSearch.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    }


});


myApp.controller('ViewCustomerController', function ($scope, $http, $rootScope) {

    $scope.CustomerPerPage = 5;
    $scope.currentPage = 1;

    $scope.searchKeyword = "";
    $scope.searchCustomer = function () {

        var cust = [];


        if ($scope.searchBy != undefined) {
            var data = {
                operation: "getCustomerDetails",
                searchKeyword: $scope.searchKeyword,
                searchBy: $scope.searchBy

            };
            var config = {
                params: {
                    data: data
                }
            };

            $http.post("Process/php/customerFacade.php", null, config)
                .success(function (data) {
                    console.log(data);
                    if (data.status == "Successful") {
                        for (var i = 0; i < data.message.length; i++) {

                            cust.push({
                                id: data.message[i].CustomerId,
                                name: data.message[i].CustomerName,
                                address: data.message[i].Address,
                                city: data.message[i].City,
                                state: data.message[i].State,
                                country: data.message[i].Country,
                                mobileNo: data.message[i].Mobileno,
                                contactNo: data.message[i].Landlineno,
                                faxNo: data.message[i].FaxNo,
                                emailId: data.message[i].EmailId,
                                pan: data.message[i].PAN,
                                cstNo: data.message[i].CSTNo,
                                vatNo: data.message[i].VATNo,
                                serviceTaxNo: data.message[i].ServiceTaxNo,
                                pincode: data.message[i].Pincode,
                                index: i
                            });
                        }


                        $rootScope.customerSearch = cust;

                    } else {

                        alert(response.data.message);


                    }

                })
                .error(function (data, status, headers, config) {
                    alert("Error Occured" + data);
                });
        }
        else{
            alert("Please select search by list");
        }


    }


    $scope.deleteCustomer = function ($id) {
        console.log("delete cust id " + $id);


        $http({
            method: 'GET',
            url: 'php/api/customer/delete/' + $id
        }).then(function successCallback(response) {
            alert("in success" + response.status);
        }, function errorCallback(response) {
            alert("in error " + response);
        });
    }

    $scope.showCustomerDetails = function (customer) {
        $scope.currentCustomer = customer;
    }

    $scope.paginate = function (value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.CustomerPerPage;
        end = begin + $scope.CustomerPerPage;
        index = $rootScope.customerSearch.indexOf(value);

        return (begin <= index && index < end);
    };


});


myApp.controller('ModifyProjectController', function ($scope, $http, $stateParams, AppService) {

    $scope.customers = [];
    AppService.getAllCustomers($http, $scope.customers);

    $scope.projectManagers = [];
    AppService.getProjectManagers($http, $scope.projectManagers);


    $scope.projectDetails = {
        projectId: $stateParams.projectToModify.projectId,
        projectName: $stateParams.projectToModify.project_name,
        projectAddress: $stateParams.projectToModify.project_Address,
        projectCity: $stateParams.projectToModify.project_City,
        projectState: $stateParams.projectToModify.project_State,
        projectCountry: $stateParams.projectToModify.project_Country,
        pinCode: $stateParams.projectToModify.Pincode,
        pointOfContactName: $stateParams.projectToModify.PointContactName,
        pointOfContactEmailID: $stateParams.projectToModify.EmailId,
        pointOfContactLandlineNo: $stateParams.projectToModify.LandlineNo,
        pointOfConactMobileNo: $stateParams.projectToModify.MobileNo,
        projectManager: $stateParams.projectToModify.project_manager,
        projectManagerId: $stateParams.projectToModify.projectManagerId,
        customerId: $stateParams.projectToModify.customerId
    };

    var companiesInvolved;
    $scope.companies = [];
    var data={
        operation:"getExcludedCompaniesForProject",
        data:$scope.projectDetails.projectId

    };
    var config = {
        params: {
            data: data
        }
    };


    $http.post("Process/php/projectFacade.php",null, config)
        .success(function (data){

            if (data.status == "Successful") {
                for(var i=0;i<data.message.length;i++){
                    $scope.companies.push({checkVal:false , companyId:data.message[i].companyId, companyName:data.message[i].companyName});
                }
            } else {
                alert("Error Occurred Getting Company Information For This Project");
            }
        })
        .error(function(data){
            console.log(data);
        });



    $scope.modifyProject = function () {
        if($scope.ProjectInfoForm.$pristine){
            alert("Fields are not modified");
            return;
        }


        console.log("in ");
        console.log($scope.projectDetails);
        var companiesInvolved = [];
        for (var i = 0; i < $scope.companies.length; i++) {
            if ($scope.companies[i].checkVal) {
                companiesInvolved.push($scope.companies[i]);
            }

        }
        var projectBasicDetails = {
            ProjectName: $scope.projectDetails.projectName,
            ProjectManagerId: $scope.projectDetails.projectManagerId,
            ProjectSource: $scope.projectDetails.projectSource,
            CustomerId: $scope.projectDetails.customerId,
            Address: $scope.projectDetails.projectAddress,
            City: $scope.projectDetails.projectCity,
            State: $scope.projectDetails.projectState,
            Country: $scope.projectDetails.projectCountry,
            Pincode: $scope.projectDetails.Pincode,
            PointContactName: $scope.projectDetails.pointOfContactName,
            MobileNo: $scope.projectDetails.pointOfConactMobileNo,
            LandlineNo: $scope.projectDetails.pointOfContactLandlineNo,
            EmailId: $scope.projectDetails.pointOfContactEmailID,
            projectId: $scope.projectDetails.projectId
        };
        var projectData = {
            projectDetails: projectBasicDetails,
            companiesInvolved: companiesInvolved
        }
        // console.log("data is "+projectData);
        console.log("Posting");
        var data = {
            operation: "modifyProject",
            data: projectData

        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data.status == "Successful") {
                    alert("Project Updated Successfully");
                }else{
                    alert(data.message);
                }


            })
            .error(function (data) {
                console.log(data);
            });

    }

});


myApp.controller('ViewInvoiceDetails', function ($scope, $http, myService) {

    var data = myService.get();
    var myInvoice = JSON.stringify(data);
    //console.log("invoice is "+myInvoice);
    $scope.invoiceDetail ={
      invoiceNumber : data.invoiceNo,
      quotationNumber : data.quotationId,
      invoiceDate : data.invoiceDate,
      quotationDate : data.quotationDate,
      companyId : data.companyId,
      contactPerson :data.contactPerson
      //invoiceNumber: $scope.myInvoice.invoiceNo,
    };
    //console.log("invoice date is +"+$scope.invoiceDetail.invoiceDate+" no is "+$scope.invoiceDetail.invoiceNumber+" qno "+$scope.invoiceDetail.quotationNumber);
    var qId = $scope.invoiceDetail.quotationNumber;
    var iId = $scope.invoiceDetail.invoiceNumber;
    var cId = $scope.invoiceDetail.companyId;
    console.log("cId is " + cId);
    /* $scope.invoiceNumber=myInvoice.invoiceNo;
     $scope.quotationNumber=myInvoice.quotationId;
     $scope.workorderNumber="Workorder-123";
     $scope.contactPerson="Namdev devmare";
     $scope.invoiceDate=myInvoice.invoiceDate;
     $scope.quotationDate=myInvoice.quotationDate;
     $scope.workorderDate="22-01-2016";*/

                     $http({
                        method : "GET",
                        url : "php/api/quotation/taxDetails/"+qId
                        }).then(function mySucces(response) {
                      $scope.qData = response.data.QuotationDetails;
                       $scope.qDetails = [];
                       var b = [];
                       var length = $scope.qData.length;
                       //alert("length is "+$scope.qData.length);
                       
                        for(var i = 0;i<length;i++){
                          b.push({'quotationId':$scope.qData[i].QuotationId,
                         'quotationTitle':$scope.qData[i].QuotationTitle,
                         'dateOfQuotation':$scope.qData[i].DateOfQuotation,
                         'subject':$scope.qData[i].Subject,
                         'companyId':$scope.qData[i].CompanyId,
                         'refNo':$scope.qData[i].RefNo,
                         'title':$scope.qData[i].Title,
                         'description':$scope.qData[i].Description,
                         'unitRate' :$scope.qData[i].UnitRate,
                         'unit':$scope.qData[i].Unit,
                         'amount' :$scope.qData[i].Amount,
                         'quantity' :$scope.qData[i].Quantity
                              });
                        $scope.qDetails = b;
                        }
                        $scope.qDetails;
                        //console.log("aaaaaaaaa "+JSON.stringify($scope.qDetails));
                  }, function myError(response) {
                      $scope.error = response.statusText;
                  });
          /******Only for Quotation-tax detials*********/
               
                $http({
                  method : "GET",
                  url : "php/api/quotation/taxDetails/"+qId
                  }).then(function mySucces(response) {
                      $scope.qData = response.data.TaxDetails;
                        $scope.qtDetails = [];
                       var b = [];
                       var length = $scope.qData.length;
                       //alert("length is "+$scope.qData.length);
                       var detailNo = [];
                       for(var j = 0; j < length; j++){

                                detailNo.push(parseInt(response.data.TaxDetails[i].DetailsNo[j]));
                          }
                       
                        for(var i = 0;i<length;i++){
                          b.push({
                              'quotationId':$scope.qData[i].QuotationId,
                             'taxName':$scope.qData[i].TaxName,
                             'detailsNo':detailNo,
                             'taxPercentage':$scope.qData[i].TaxPercentage,
                             'taxAmount':$scope.qData[i].TaxAmount
                            });
                        $scope.qtDetails = b;
                        }
                        $scope.qtDetails;
                       // console.log("aaaaaaaaa "+JSON.stringify($scope.qtDetails));
                  }, function myError(response) {
                      $scope.error = response.statusText;
                  });
            /***********************************/
    
          $http({
                        method : "GET",
                        url : "php/api/invoice/tax/"+iId
                        }).then(function mySucces(response) {
                            $scope.iData = response.data;
                             $scope.iDetails = [];
                             var b = [];
                             var length = $scope.iData.length;
                             //alert("length is "+$scope.qData.length);
                              $scope.getTotalAmount = function(){
                              var total = 0;
                              var amount313 =0;
                              for(var i = 0; i < $scope.iData.length; i++){
                                  var amount313 = $scope.iData[0].TotalAmount;
                                  total =amount313;
                              }
                              //console.log("totalAmount is"+total);
                              return total;
                             }
                             $scope.getTotalRoundingOffFactor = function(){
                              var total = 0;
                              var amount313 =0;
                              for(var i = 0; i < $scope.iData.length; i++){
                                  var amount313 = $scope.iData[0].RoundingOffFactor;
                                  total =amount313;
                              }
                              console.log("totalAmount is"+total);
                              return total;
                             }
                              $scope.getTotalGrandTotal = function(){
                              var total = 0;
                              var amount313 =0;
                              for(var i = 0; i < $scope.iData.length; i++){
                                  var amount313 = $scope.iData[0].GrandTotal;
                                  total =amount313;
                              }
                             // console.log("totalAmount is"+total);
                              return total;
                             }

                              for(var i = 0;i<length;i++){
                                b.push({
                               'totalAmount':$scope.iData[i].TotalAmount,
                               'roundingOffFactor':$scope.iData[i].RoundingOffFactor,
                               'grandTotal':$scope.iData[i].GrandTotal
                                    });
                              $scope.iDetails = b;
                              }
                              $scope.iDetails;
                              //console.log("aaaaaaaaa "+JSON.stringify($scope.qDetails));
                        }, function myError(response) {
                            $scope.error = response.statusText;
                        });


                  $http({
                        method : "GET",
                        url : "php/api/workorder/"+qId+"/"+cId
                        }).then(function mySucces(response) {
                            $scope.wData = response.data;
                             $scope.wDetails = [];
                             var b = [];
                             var length = $scope.wData.length;
                             //alert("length is "+$scope.qData.length);
                              for(var i = 0;i<length;i++){
                                b.push({'workOrderNo':$scope.wData[i].WorkOrderNo,
                               'creationDate':$scope.wData[i].CreationDate
                                    });
                              $scope.wDetails = b;
                              }
                              $scope.wDetails;
                              //console.log("aaaaaaaaa "+JSON.stringify($scope.qDetails));
                        }, function myError(response) {
                            $scope.error = response.statusText;
                        });

    console.log("IN ");

});

myApp.controller('AttachWorkorderController', function ($scope, $http, myService, setInfo, fileUpload) {
    //console.log("IN AttachWorkorderController");
    var proj = myService.get();
    var projQId = setInfo.get();
    //console.log("projQId scope is sssssssssssssssssssss"+JSON.stringify(projQId));

    $scope.workorder = {
        projId: proj.projectId,
        porjName: proj.project_name,
        quotationId: projQId.QuotationId
    };
    //console.log("Quotation id is "+$scope.workorder.quotationId);

    //console.log("proj id id "+$scope.workorder.projId)
    $scope.CompanyName = [];
    var b = [];
    $http.get("php/api/companyById/" + projQId.CompanyId).then(function (response) {
        console.log(response.data.length);
        if (response.data != null) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("company name is " + response.data[i].CompanyName);
                b.push({
                    companyName: response.data[i].CompanyName,
                    companyid: response.data[i].CompanyID

                });
            }
            $scope.CompanyName = b;
        }
    });

    console.log("final scope is " + $scope.workorder);
    $scope.createWorkorder = function () {
        console.log("IN");
        console.log("company id is :" + JSON.stringify($scope.CompanyName));
        var uploadQuotationLocation = "upload/Workorders/";
        var fileName = uploadQuotationLocation + $scope.myFile.name;
        //console.log("in createWorkorder ");//WorkOrderNo, WorkOrderName, ReceivedDate, WorkOrderBlob, ProjectId, CompanyId
        var workorderData = '{"ProjectId":"' + $scope.workorder.projId + '","WorkOrderName":"' + $scope.workorder.title + '","ReceivedDate":"' + $scope.workorder.date + '","WorkOrderBlob":"' + fileName + '","CompanyId":"' + $scope.CompanyName[0].companyid + '","QuotationId":"' + $scope.workorder.quotationId + '"}';
        console.log("workorder data is " + workorderData);

        $.ajax({
            type: "POST",
            url: 'php/api/workorder',
            data: workorderData,
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,

            success: function (data, status) {
                alert("success in workorder creation " + data + " status is " + status);
                alert("status" + JSON.stringify(data));
                var file = $scope.myFile;
                var uploadUrl = "php/api/workorder/upload";
                fileUpload.uploadFileToUrl(file, uploadUrl);
            },
            error: function (data) {
                alert("error in workorder creation " + JSON.stringify(data));
            }
        });
    }

});


myApp.controller('QuotationFollowupHistoryController', function ($scope, $http, AppService) {
    $scope.projects = [];
    var project = [];

    AppService.getAllProjects($http, $scope.projects);
    //$http.get("php/api/projects").then(function (response) {
    //    // console.log(response.data.length);
    //    if (response.data != null) {
    //        for (var i = 0; i < response.data.length; i++) {
    //            project.push({
    //                id: response.data[i].ProjectId,
    //                name: response.data[i].ProjectName
    //
    //            });
    //        }
    //    }
    //
    //    $scope.projects = project;
    //    // console.log("projects scope is "+JSON.stringify($scope.projects));
    //
    //})

//console.log("in QuotationFollowupHistoryController");
    $scope.selectProject = function (projectId) {
        $scope.quotations = [];
        var quotation = [];

        console.log("changed" + projectId);
        AppService.getAllQuotationOfProject($http, $scope.quotations, projectId);
        //$http.get("php/api/quotation/" + $scope.projectID.id).then(function (response) {
        //    // console.log(response.data.length);
        //    if (response.data != null) {
        //        for (var i = 0; i < response.data.length; i++) {
        //            quotation.push({
        //                id: response.data[i].ProjectId,
        //                name: response.data[i].ProjectName
        //            });
        //        }
        //    }
        //    $scope.quotations = quotation;
        //    // console.log("quotation scope is "+JSON.stringify($scope.quotations));
        //})
    }

    $scope.selectQuotation = function (quotationId) {
        //  console.log("quotation id is "+$scope.quotationID.id);






        $scope.followups = [];
        var followup = [];

        $http.get("php/api/quotation/followup/" + quotationId).then(function (response) {
            //   console.log(response.data.length);
            for (var i = 0; i < response.data.length; i++) {
                followup.push({
                    followup_id: response.data[i].FollowupId,
                    followup_conductionDate: response.data[i].FollowupDate,
                    followup_title: response.data[i].FollowupTitle,
                    followup_description: response.data[i].Description,
                    followup_actualDate: response.data[i].ConductDate,
                    followup_by: response.data[i].FirstName + " " + response.data[i].LastName,
                });
            }
            $scope.followups = followup;
            //  console.log("followup scope is "+JSON.stringify($scope.followups));
        })

    }

});

myApp.controller('PaymentFollowupHistoryController', function ($scope, $http, AppService) {

    $scope.projects = [];
    $scope.selectedProjectId = "";
    AppService.getAllProjects($http, $scope.projects);

    $scope.selectProject = function () {
        $scope.invoices = [];
        console.log("In payment followup history");
        AppService.getAllInvoicesOfProject($http, $scope.invoices, $scope.selectedProjectId);
    }

    $scope.show = function () {

        $http.post("php/api/invoice/followup/" + $scope.selectedInvoiceId)
            .success(function (data) {

                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $scope.followups.push({
                            followup_id: data.message[i].FollowupId,
                            followup_date: data.message[i].FollowupDate,
                            followup_title: data.message[i].FollowupTitle,
                            followup_description: data.message[i].Description,
                            followup_conductionDate: data.message[i].ConductDate,
                            followup_by: data.message[i].firstName + " " + data.message[i].lastName
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:" + data);

            });

    }

});

myApp.controller('SiteTrackingFollowupHistoryController', function ($scope, $http, AppService) {

    $scope.projects = [];

    AppService.getAllSiteTrackingProjects($http, $scope.projects);

    $scope.show = function () {

        $http.post("php/api/projects/siteFollowup/" + $scope.selectedProjectId, null)
            .success(function (data) {

                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $scope.followups.push({
                            followup_id: data.message[i].FollowupId,
                            followup_date: data.message[i].FollowupDate,
                            followup_title: data.message[i].FollowupTitle,
                            followup_description: data.message[i].Description,
                            followup_conductionDate: data.message[i].ConductDate,
                            followup_by: data.message[i].firstName + " " + data.message[i].lastName
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:" + data);

            });

    }

});

myApp.controller('ViewQuotationDetailsController', function ($stateParams, $scope, $http) {
    var viewQuotDetail = $stateParams.quotationToView;
    $scope.projectName = $stateParams.projectName;
    var qId = viewQuotDetail.QuotationId;
    $scope.viewQuotationDetail = {
        quotationTitle: viewQuotDetail.QuotationTitle,
        companyId: viewQuotDetail.CompanyId,
        companyName: viewQuotDetail.CompanyName,
        creationDate: viewQuotDetail.CreationDate,
        subject: viewQuotDetail.Subject,
        refNo: viewQuotDetail.RefNo
    }

    $http({
        method: "GET",
        url: "php/api/quotation/details/" + qId
    }).then(function mySucces(response) {
        if (response.data.status != "Successful") {
            alert("Error Occurred while fetching quoation data");
            return;
        }
        var qData = response.data.message;
        $scope.qDetails = [];

        $scope.totalAmount = 0;
        for (var i = 0; i < qData.length; i++) {
            $scope.totalAmount = $scope.totalAmount + parseInt(qData[i].Amount);

        }
        console.log("totalAmount is" + $scope.totalAmount);

        $scope.qDetails = [];
        for (var i = 0; i < qData.length; i++) {
            $scope.qDetails.push({
                'quotationId': qData[i].QuotationId,
                'quotationTitle': qData[i].QuotationTitle,
                'dateOfQuotation': qData[i].DateOfQuotation,
                'subject': qData[i].Subject,
                'companyId': qData[i].CompanyId,
                'refNo': qData[i].RefNo,
                'title': qData[i].Title,
                'description': qData[i].Description,
                'unitRate': qData[i].UnitRate,
                'amount': qData[i].Amount,
                'quantity': qData[i].Quantity,
                'detailNo': qData[i].DetailNo,
                unit: qData[i].Unit
            });

        }
    }, function myError(response) {
        $scope.error = response.statusText;
    });

    $http({
        method: "GET",
        url: "php/api/quotation/taxDetails/" + qId
    }).then(function mySucces(response) {
        if (response.data.status != "Successful") {
            alert("Error Occurred while getting tax details");
            return;
        }

        var qtData = response.data.message;
        $scope.qTaxDetails = [];
        $scope.TotalTax = 0;

        $scope.qTaxDetails = [];
        for (var i = 0; i < qtData.length; i++) {
            var taxApplicableTo = 'All';
            if (qtData[i].DetailsNo.length > 0) {
                taxApplicableTo = "( Item No ";
                for (var j = 0; j < qtData[i].DetailsNo.length; j++) {
                    if (j + 1 == qtData[i].DetailsNo.length)
                        taxApplicableTo = taxApplicableTo + qtData[i].DetailsNo[j] + " )";
                    else
                        taxApplicableTo = taxApplicableTo + qtData[i].DetailsNo[j] + ",";
                }

            }

            $scope.qTaxDetails.push({
                'quotationId': qtData[i].QuotationId,
                'taxId': qtData[i].TaxID,
                'taxName': qtData[i].TaxName,
                'taxPercentage': qtData[i].TaxPercentage,
                'taxAmount': qtData[i].TaxAmount,
                taxApplicableTo: taxApplicableTo
            });
            $scope.TotalTax = $scope.TotalTax + parseInt(qtData[i].TaxAmount);
        }

    }, function myError(response) {
        $scope.error = response.statusText;
    });


});

myApp.controller('PaymentHistoryController', function ($scope, $http, AppService) {

    console.log("in payment history controller");
    $scope.Projects = [];
    $scope.Invoices = [];
    $scope.InvoiceDetails = [];
    $scope.sortType = 'amountPaid'; // set the default sort type
    $scope.sortReverse = false;
    var project = [];
    AppService.getAllProjects($http, $scope.Projects);


    $scope.viewProjectInvoices = function (project) {
        $scope.paymentHistoryData = [];
        $scope.Invoices = [];
        var invoice = [];
        console.log("project id is :" + project);

        $http.get("php/api/invoice/project/" + project).then(function (response) {
            console.log(response.data.length);
            if (response.data != null) {
                for (var i = 0; i < response.data.length; i++) {
                    invoice.push({
                        invoice_id: response.data[i].InvoiceNo,
                        invoice_name: response.data[i].InvoiceTitle,
                        invoice_date: response.data[i].InvoiceDate
                    });
                }
            }
            $scope.Invoices = invoice;
            console.log("invoices  scope is " + JSON.stringify($scope.Invoices));
        })
    }

    $scope.getInvoiceDetails = function (invoiceId) {
        $scope.paymentHistoryData = [];
        $scope.totalAmtPaid = "";
        $scope.totalPayableAmount = 0;
        var invoiceDetail = [];
        var totalAmountPaid = 0;
        var totalPayableAmt = 12000;
        console.log("invoice id is " + invoiceId);
        $http.get("php/api/paymentDetails/Invoice/" + invoiceId).then(function (response) {
            console.log(response.data.length);
            if (response.data != null) {
                for (var i = 0; i < response.data.length; i++) {
                    invoiceDetail.push({
                        amountPaid: response.data[i].AmountPaid,
                        paymentDate: response.data[i].PaymentDate,
                        recievedBy: response.data[i].FirstName + response.data[i].LastName,
                        amountRemaining: "----",
                        grandTotal: response.data[i].GrandTotal,
                        paymentMode: response.data[i].InstrumentOfPayment,
                        bankName: response.data[i].BankName,
                        branchName: response.data[i].BranchName,
                        unqiueNo: response.data[i].IDOfInstrument
                    });
                    totalAmountPaid = totalAmountPaid + parseInt(response.data[i].AmountPaid);

                }
                totalPayableAmt = parseInt(response.data[0].GrandTotal);
            }
            $scope.totalAmtPaid = totalAmountPaid;
            $scope.totalPayableAmount = totalPayableAmt;
            console.log("total amount payable=" + totalPayableAmt);
            console.log("total amount paid=" + totalAmountPaid);
            $scope.paymentHistoryData = invoiceDetail;
            console.log("paymentHistoryData  scope is " + JSON.stringify($scope.paymentHistoryData));
        })

    }


    /*    $scope.paymentHistoryData=[
     {amountPaid:10000,paymentDate:'10-FEB-2016',recievedBy:'Shankar',amountRemaining:5000,paymentMode:'Cheque',bankName:'SBI',branchName:'Kothrud',unqiueNo:179801},
     {amountPaid:20000,paymentDate:'13-DEC-2015',recievedBy:'Ajit',amountRemaining:25500,paymentMode:'Cash',bankName:'Bank of India',branchName:'Vadgaon',unqiueNo:101546},
     {amountPaid:100000,paymentDate:'16-JUL-2016',recievedBy:'Atul',amountRemaining:55600,paymentMode:'Cheque',bankName:'ICICI',branchName:'Balaji Nagar',unqiueNo:568343},
     {amountPaid:457000,paymentDate:'10-FEB-2016',recievedBy:'Shankar',amountRemaining:58700,paymentMode:'Netbanking',bankName:'SBI',branchName:'Indira Nagar',unqiueNo:678935},
     ];*/

    $scope.getPaymentHistoryData = function (pPaymentHistory) {
        $scope.viewHistory = pPaymentHistory;
    }
});


myApp.controller('CustomerController', function ($scope, $http) {

    $scope.submitted = false;
    $scope.submitted = false;

    $scope.createCustomer = function () {
        console.log("Inside create customer");
        console.log($scope.customerDetails);
        var date = new Date();

        $scope.errorMessage = "";
        $scope.warningMessage = "";
        //$('#loader').css("display", "block");

       // var custData = '{"CustomerName":"' + $scope.customerDetails.customer_name + '","Address":"' + $scope.customerDetails.customer_address + '","City":"' + $scope.customerDetails.customer_city + '","State":"' + $scope.customerDetails.customer_state + '","Country":"' + $scope.customerDetails.customer_country + '","EmailId":"' + $scope.customerDetails.customer_emailId + '","Pincode":"' + $scope.customerDetails.customer_pincode + '","Mobileno":"' + $scope.customerDetails.customer_phone + '","Landlineno":"' + $scope.customerDetails.customer_landline + '","FaxNo":"' + $scope.customerDetails.customer_faxNo + '","VATNo":"' + $scope.customerDetails.customer_vatNo + '","CSTNo":"' + $scope.customerDetails.customer_cstNo + '","ServiceTaxNo":"' + $scope.customerDetails.customer_serviceTaxNo + '","PAN":"' + $scope.customerDetails.customer_panNo + '","isDeleted":"0"}';

        // console.log(custData);
        var data = {
            operation: "addCustomer",
            data: $scope.customerDetails

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/customerFacade.php', null, config)
            .success(function (data, status, headers) {
                console.log(data);
                if (data.status == "Successful") {
                    $('#loader').css("display", "block");
                    $scope.postCustData = data;
                    $('#loader').css("display", "none");
                    //alert("Customer created Successfully");
                    $scope.warningMessage = "Customer created Successfully";
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location.reload(1);
                    }, 1000);

                } else {
                    //alert(data.message);
                    $('#loader').css("display", "block");
                    $('#loader').css("display", "none");
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 1000);
                }
            })
            .error(function (data, status, header) {
                console.log(data);
                $('#loader').css("display", "block");
                $scope.ResponseDetails = "Data: " + data;
                $('#loader').css("display", "none");
                $scope.errorMessage = "Customer not created..";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);
                //alert("Error Occurred:" + data);
            });
    }


});

myApp.controller('ModifyCustomerController', function ($scope, $http, $stateParams, $rootScope) {


    $scope.customerDetails = {

        customer_id: $stateParams.customerToModify.id,
        customer_name: $stateParams.customerToModify.name,
        customer_address: $stateParams.customerToModify.address,
        customer_pincode: $stateParams.customerToModify.pincode,
        customer_city: $stateParams.customerToModify.city,
        customer_country: $stateParams.customerToModify.country,
        customer_vatNo: $stateParams.customerToModify.vatNo,
        customer_cstNo: $stateParams.customerToModify.cstNo,
        customer_panNo: $stateParams.customerToModify.pan,
        customer_state: $stateParams.customerToModify.state,
        customer_emailId: $stateParams.customerToModify.emailId,
        customer_landline: $stateParams.customerToModify.contactNo,
        customer_phone: $stateParams.customerToModify.mobileNo,
        customer_faxNo: $stateParams.customerToModify.faxNo,
        customer_serviceTaxNo: $stateParams.customerToModify.serviceTaxNo,
        index: $stateParams.customerToModify.index
    };
    $scope.formSubmitted=false;

    $scope.modifyCustomer = function () {
        if($scope.customerModifyForm.$pristine){
            alert("Fields are not modified");
            return;
        }

        console.log($scope.customerDetails);
        $custId = $scope.customerDetails.customer_id;
        var custUpdate = '{"CustomerName":"' + $scope.customerDetails.customer_name + '","Address":"' + $scope.customerDetails.customer_address + '","City":"' + $scope.customerDetails.customer_city + '","State":"' + $scope.customerDetails.customer_state + '","Country":"' + $scope.customerDetails.customer_country + '","Mobileno":"' + $scope.customerDetails.customer_phone + '","Landlineno":"' + $scope.customerDetails.customer_landline + '","FaxNo":"' + $scope.customerDetails.customer_faxNo + '","EmailId":"' + $scope.customerDetails.customer_emailId + '","VATNo":"' + $scope.customerDetails.customer_vatNo + '","CSTNo":"' + $scope.customerDetails.customer_cstNo + '","PAN":"' + $scope.customerDetails.customer_panNo + '","ServiceTaxNo":"' + $scope.customerDetails.customer_serviceTaxNo + '"}';
        //  console.log("update data is ::"+custUpdate);
        $scope.errorMessage = "";
        $scope.warningMessage = "";
        $('#loader').css("display", "block");

        // var custData = '{"CustomerName":"' + $scope.customerDetails.customer_name + '","Address":"' + $scope.customerDetails.customer_address + '","City":"' + $scope.customerDetails.customer_city + '","State":"' + $scope.customerDetails.customer_state + '","Country":"' + $scope.customerDetails.customer_country + '","EmailId":"' + $scope.customerDetails.customer_emailId + '","Pincode":"' + $scope.customerDetails.customer_pincode + '","Mobileno":"' + $scope.customerDetails.customer_phone + '","Landlineno":"' + $scope.customerDetails.customer_landline + '","FaxNo":"' + $scope.customerDetails.customer_faxNo + '","VATNo":"' + $scope.customerDetails.customer_vatNo + '","CSTNo":"' + $scope.customerDetails.customer_cstNo + '","ServiceTaxNo":"' + $scope.customerDetails.customer_serviceTaxNo + '","PAN":"' + $scope.customerDetails.customer_panNo + '","isDeleted":"0"}';

        // console.log(custData);
        var data = {
            operation: "modifyCustomer",
            data: $scope.customerDetails

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/customerFacade.php', null, config)
            .success(function (data, status, headers) {
                console.log(data);
                if (data.status == "Successful") {
                    $('#loader').css("display", "block");
                    $scope.postCustData = data;
                    $('#loader').css("display", "none");
                    //alert("Customer created Successfully");
                    $scope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    console.log($scope.customerDetails);
                    console.log($stateParams.customerToModify);
                    //$rootScope.customerSearch[$scope.customerDetails.index]=$stateParams.customerToModify;
                    $rootScope.customerSearch[$scope.customerDetails.index].id = $scope.customerDetails.customer_id;
                    $rootScope.customerSearch[$scope.customerDetails.index].name = $scope.customerDetails.customer_name;
                    $rootScope.customerSearch[$scope.customerDetails.index].address = $scope.customerDetails.customer_address;
                    $rootScope.customerSearch[$scope.customerDetails.index].city = $scope.customerDetails.customer_city;
                    $rootScope.customerSearch[$scope.customerDetails.index].state = $scope.customerDetails.customer_state;
                    $rootScope.customerSearch[$scope.customerDetails.index].country = $scope.customerDetails.customer_country;
                    $rootScope.customerSearch[$scope.customerDetails.index].mobileNo = $scope.customerDetails.customer_phone;
                    $rootScope.customerSearch[$scope.customerDetails.index].contactNo = $scope.customerDetails.customer_landline;
                    $rootScope.customerSearch[$scope.customerDetails.index].faxNo = $scope.customerDetails.customer_faxNo;
                    $rootScope.customerSearch[$scope.customerDetails.index].emailId = $scope.customerDetails.customer_emailId;
                    $rootScope.customerSearch[$scope.customerDetails.index].pan = $scope.customerDetails.customer_panNo;
                    $rootScope.customerSearch[$scope.customerDetails.index].cstNo = $scope.customerDetails.customer_cstNo;
                    $rootScope.customerSearch[$scope.customerDetails.index].vatNo = $scope.customerDetails.customer_vatNo;
                    $rootScope.customerSearch[$scope.customerDetails.index].serviceTaxNo = $scope.customerDetails.customer_serviceTaxNo;
                    //$rootScope.customerSearch[$scope.customerDetails.index].pincode=data.message[i].Pincode;

                    //$rootScope.customerSearch[ $scope.customerDetails.index]=$scope.customerDetails;
                    $('#loader').css("display", "block");
                    $('#loading').css("display", "none");
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");

                } else {

                    $('#loader').css("display", "block");
                    $('#loading').css("display", "none");
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 1000);
                }
            })
            .error(function (data, status, header) {
                console.log(data);
                $('#loader').css("display", "block");
                $scope.ResponseDetails = "Data: " + data;
                $('#loading').css("display", "none");
                $scope.errorMessage = "Customer not Updated..";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);

            });

    }


});



myApp.controller('ReviseQuotationController',function($scope,$http,$uibModal,$stateParams){

    var reviseQuotationData = $stateParams.quotationToRevise;
    var qId = reviseQuotationData.QuotationId;
    $scope.QuotationDetails = {
        projectId:reviseQuotationData.ProjectId,
        ProjectName:$stateParams.projectName,
        quotationTitle:reviseQuotationData.QuotationTitle,
        quotationDate:reviseQuotationData.CreationDate,
        quotationSubject:reviseQuotationData.Subject,
        companyId:reviseQuotationData.CompanyId,
        companyName:reviseQuotationData.CompanyName,
        referenceNo:reviseQuotationData.RefNo,
        filePath:reviseQuotationData.filePath,
        quotationItemDetails: []
    };

    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.taxDetails = [];
    $scope.totalAmnt=0;
    $scope.currentItemList = [];
    $scope.taxDetails=[];



    var data = {
        operation: "getQuotationDetails",
        data: qId

    };
    var config = {
        params: {
            data: data
        }
    };

    $http.post("Process/php/quotationFacade.php", null, config)
        .success(function (data) {

        if (data.status != "Successful") {
            alert("Error Occurred while fetching quoation data");
            return;
        }

        var qData = data.message;
        $scope.qDetails = [];

        $scope.totalAmnt = 0;
        for (var i = 0; i < qData.length; i++) {
            $scope.QuotationDetails.quotationItemDetails.push({
                'quotationItem': qData[i].Title,
                'quotationDescription': qData[i].Description,
                'quotationUnitRate': parseFloat(qData[i].UnitRate),
                'amount': parseFloat(qData[i].Amount),
                'quotationQuantity': parseFloat(qData[i].Quantity),
                'detailNo': qData[i].DetailNo,
                quotationUnit: qData[i].Unit
            });
            $scope.totalAmnt = $scope.totalAmnt + parseFloat(qData[i].Amount);
        }
        console.log("totalAmount is" + $scope.totalAmount);
    })  .error(function (data) {
        alert(data);
    });


    data = {
        operation: "getQuotationTaxDetails",
        data: qId

    };
    config = {
        params: {
            data: data
        }
    };


    $http.post("Process/php/quotationFacade.php", null, config)
        .success(function (data) {
        if (data.status != "Successful") {
            alert("Error Occurred while getting tax details");
            return;
        }

        var qtData = data.message;
        $scope.qTaxDetails = [];
        $scope.TaxAmnt = 0;

        $scope.qTaxDetails = [];
        for (var i = 0; i < qtData.length; i++) {
            var taxApplicableTo = 'All';
            var itemArray = [];
            if (qtData[i].DetailsNo.length > 0) {
                taxApplicableTo = "( Item No ";
                for (var j = 0; j < qtData[i].DetailsNo.length; j++) {
                    if (j + 1 == qtData[i].DetailsNo.length)
                        taxApplicableTo = taxApplicableTo + qtData[i].DetailsNo[j] + " )";
                    else
                        taxApplicableTo = taxApplicableTo + qtData[i].DetailsNo[j] + ",";
                    itemArray.push(parseInt(qtData[i].DetailsNo[j]));
                }

            }

            $scope.taxDetails.push({
                'taxTitle': qtData[i].TaxName,
                'taxPercentage': qtData[i].TaxPercentage,
                'amount': parseFloat(qtData[i].TaxAmount),
                  taxApplicableTo: taxApplicableTo,
                'taxArray' :itemArray
            });
            $scope.TaxAmnt = $scope.TaxAmnt + parseFloat(qtData[i].TaxAmount);

        }
        console.log($scope.TaxAmnt);
    })
        .error(function (data) {
          alert(data);
        });


    $scope.quotationDate = function () {
        $scope.showQdate.opened = true;
    };

    $scope.showQdate = {
        opened: false
    };

    var totalAmount = 0;
    var remainingTotal = 0;


    $scope.ModifyQuotation = function () {
        if($scope.QuotationForm.$pristine){
            alert("Fields are not modified");
            return;
        }


        var b = [];
        var data = [];
        var projectId = $scope.QuotationDetails.projectId;
        var companyId = $scope.QuotationDetails.companyId;
        var companyName = $scope.QuotationDetails.companyName;
        var fileName =$scope.QuotationDetails.filePath ;
        $scope.warningMessage = "";
        $scope.errorMessage = "";

        for (var i = 0; i < $scope.noOfRows; i++) {
            b.push({
                'Title': $scope.QuotationDetails.quotationItemDetails[i].quotationItem,
                'Decription': $scope.QuotationDetails.quotationItemDetails[i].quotationDescription,
                'Quantity': $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity,
                'Unit': $scope.QuotationDetails.quotationItemDetails[i].quotationUnit,
                'UnitRate': $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate
            });

        }

        var quotationData = {
            QuotationTitle: $scope.QuotationDetails.quotationTitle,
            ProjectId: projectId,
            CompanyName: companyName,
            CompanyId: companyId,
            RefNo: $scope.QuotationDetails.referenceNo,
            DateOfQuotation: $scope.QuotationDetails.quotationDate,
            Subject: $scope.QuotationDetails.quotationSubject,
            QuotationBlob: fileName
        };
        var quotationDetails = $scope.QuotationDetails.quotationItemDetails;
        var taxDetails = $scope.taxDetails;
        var QuotationData = {
            Quotation: quotationData,
            Details: quotationDetails,
            taxDetails: taxDetails
        };

        console.log(QuotationData);
        var data = {
            operation: "modifyQuotation",
            quotationId:qId,
            data: QuotationData

        };
        var config = {
            params: {
                data: data
            }
        };

        if ($scope.myFile != undefined) {
            if ($scope.myFile.name != undefined) {
                var uploadQuotationLocation = "upload/Quotations/";
                fileName = uploadQuotationLocation + $scope.myFile.name;
                quotationData.QuotationBlob=fileName;
                var fd = new FormData();
                fd.append('file', $scope.myFile);
                $http.post("Process/php/uploadQuotation.php", fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function (data) {
                        if(data.status=="Successful"){
                            console.log("Upload Successful");
                            $http.post("Process/php/quotationFacade.php", null, config)
                                .success(function (data) {

                                    if(data.status=="Successful"){
                                       alert("Quotaion Revised Successfully");
                                    }else{
                                        alert(data.message);
                                    }

                                })
                                .error(function (data) {
                                    alert(data);
                                });


                        }else{
                            alert(data.message);
                        }
                    })
                    .error(function () {
                       alert("Something went wrong can not upload quoatation");

                    });
            }

        }else{
            $http.post("Process/php/quotationFacade.php", null, config)
                .success(function (data) {

                    if(data.status=="Successful"){
                        alert("Quotation is Revised Successfully");

                    }else{
                        alert(data.message);
                    }

                })
                .error(function (data) {
                    alert(data);
                });

        }
    }


    $scope.addRows = function () {
        var rowCount = $scope.noOfRows;
        for (var i = 0; i < rowCount; i++) {
            $scope.QuotationDetails.quotationItemDetails.push({

                quotationItem: "",
                quotationDescription: "",
                quotationQuantity: 0,
                quotationUnit: "",
                quotationUnitRate: 0,
                amount: 0,
                isTaxAplicable: false
            });
        }
    }

    $scope.calculateTaxableAmount = function (index) {

        if ($scope.QuotationDetails.quotationItemDetails[index].isTaxAplicable) {
            $scope.taxableAmount = $scope.taxableAmount + $scope.QuotationDetails.quotationItemDetails[index].amount;
            $scope.taxSelected++;
            $scope.currentItemList.push(index + 1);
        } else {
            $scope.taxableAmount = $scope.taxableAmount - $scope.QuotationDetails.quotationItemDetails[index].amount;
            $scope.taxSelected--;
            $scope.currentItemList.splice($scope.currentItemList.indexOf(index + 1), 1);
        }

    }

    $scope.calculateAmount = function (index) {

        $scope.QuotationDetails.quotationItemDetails[index].amount = $scope.QuotationDetails.quotationItemDetails[index].quotationQuantity * $scope.QuotationDetails.quotationItemDetails[index].quotationUnitRate;
    }

    $scope.calculateTotal = function (amount) {
        $scope.totalAmnt=0;
        for (var i = 0; i < $scope.QuotationDetails.quotationItemDetails.length; i++) {
            $scope.totalAmnt =$scope.totalAmnt+ $scope.QuotationDetails.quotationItemDetails[i].amount;
        }

    }


    $scope.removeQuotationItem = function (index) {

        $scope.totalAmnt =$scope.totalAmnt- $scope.QuotationDetails.quotationItemDetails[index].amount;
        $scope.QuotationDetails.quotationItemDetails.splice(index, 1); //remove item by index

    };

    $scope.removeTaxItem = function (index) {
        $scope.TaxAmnt=$scope.TaxAmnt - $scope.taxDetails[index].amount;
        $scope.taxDetails.splice(index, 1);
    };

    $scope.addTax = function (size) {
        var allTax=false;
        if ($scope.taxSelected <= 0) {
            $scope.taxableAmount=$scope.totalAmnt;
            allTax=true;
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Process/html/addTax.html',
            controller: function ($scope, $uibModalInstance, amount) {
                $scope.tax = {taxTitle: "", taxApplicableTo: "", taxPercentage: 0, amount: 0};
                $scope.amount = amount;
                console.log($scope.amount);
                $scope.ok = function () {

                    console.log($scope.tax);
                    $uibModalInstance.close($scope.tax);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.calculateTaxAmount = function () {
                    $scope.tax.amount = $scope.amount * ($scope.tax.taxPercentage / 100);
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
            var itemString="All";
            var itemArray=[];
            if(!allTax) {
                itemString = " (Item ";
                for (var i = 0; i < $scope.currentItemList.length - 1; i++) {
                    itemString += $scope.currentItemList[i] + " ,";
                    itemArray.push($scope.currentItemList[i]);
                }
                itemString += $scope.currentItemList[$scope.currentItemList.length - 1] + " )";
                itemArray.push($scope.currentItemList[$scope.currentItemList.length - 1]);
            }

            $scope.taxDetails.push({
                taxTitle: tax.taxTitle,
                taxApplicableTo: itemString,
                taxPercentage: tax.taxPercentage,
                amount: tax.amount,
                taxArray: itemArray
            });

            $scope.TaxAmnt=0;;
            for (var s = 0; s < $scope.taxDetails.length; s++) {

                $scope.TaxAmnt =$scope.TaxAmnt +$scope.taxDetails[s].amount;
            }


        }, function () {
            console.log("modal Dismiss");
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        if(allTax)
            $scope.taxableAmount=0;
    }
});







myApp.controller('ViewTaskController', function (setInfo, $scope, $http, $filter, $rootScope) {

    $scope.today = function () {
        $scope.actualStartDate = new Date();
        $scope.actualEndDate = new Date();
    };

    $scope.today();

    $scope.taskStartDate = function () {
        $scope.taskStart.opened = true;
    };

    $scope.taskStart = {
        opened: false
    };

    $scope.taskEndDate = function () {
        $scope.taskEnd.opened = true;
    };

    $scope.taskEnd = {
        opened: false
    };
    var task = setInfo.get();
    console.log("task set is " + JSON.stringify(task));
    $scope.ViewTask = {
        task_id: task.TaskID,
        task_name: task.TaskName,
        task_desc: task.TaskDescripion,
        task_startDate: task.ScheduleStartDate,
        task_endDate: task.ScheduleEndDate,
        task_isCompleted: task.isCompleted
    };


    $scope.getViewNotes = function () {
        console.log("In view Notes");
        $scope.ViewNotes = [];
        var notes = [];

        $scope.ViewNotes.length = 0;

        var data = {
            operation: "getNotes",
            taskId: task.TaskID

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Process/php/TaskFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                for (var i = 0; i <data.message.length; i++) {
                    notes.push({
                        Note: data.message[i].ConductionNote,
                        AddedBy: data.message[i].firstName + " " + data.message[i].lastName,
                        NoteDate: data.message[i].DateAdded
                    });
                }
                $scope.ViewNotes = notes;
                setInfo.set(notes);

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $scope.errorMessage = data.message;
                $('#error').css("display", "block");
            });

    }
    $scope.getViewNotes();

    $scope.updateTask = function (taskid) {


        var isCompleted = $scope.completed;
        console.log("completed " + isCompleted);

        var completed = 0;
        console.log("is completed" + completed);
        var crdate = new Date();
        var noteCreatedDate = $filter('date')(crdate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var actualStart = $filter('date')($scope.actualStartDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var actualEnd = $filter('date')($scope.actualEndDate, 'yyyy/MM/dd hh:mm:ss', '+0530');

        var data = {"CompletionPercentage":$scope.taskCompletionP ,"isCompleted":isCompleted,"ActualStartDate": actualStart,"ActualEndDate": actualEnd ,"ConductionNote": $scope.note,"NoteAddedBy":"1","NoteAdditionDate": noteCreatedDate};
        console.log("update task data is " + data);

        var data = {
            operation: "updateTask",
            data: data,
            taskId:taskid

        };
        var config = {
            params: {
                data: data
            }
        };
        $('#loader').css("display", "block");
        console.log(config);
        $http.post("Process/php/TaskFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    $scope.warningMessage = data.message;
                    $('#warning').css("display", "block");

                }
                $scope.getViewNotes();
                setTimeout(function () {
                    $scope.$apply(function () {
                        $('#warning').css("display", "none");
                    });
                }, 3000);


            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $scope.errorMessage = data.message;
                $('#error').css("display", "block");
            });




        //$.ajax({
        //    type: "POST",
        //    url: 'php/api/task/edit/' + taskid,
        //    data: data,
        //    dataType: 'json',
        //    cache: false,
        //    contentType: 'application/json',
        //    processData: false,
        //
        //    success: function (data) {
        //        $scope.getViewNotes(task);
        //        console.log($scope.ViewNotes);
        //        alert("success in task updation " + data);
        //    },
        //    error: function (data) {
        //        alert("error in task updation " + data);
        //    }
        //});
    }
});


myApp.controller('SearchTaskController', function (setInfo,$rootScope, $scope, $http) {


    //$scope.tasks = [];
    var task = [];


    var data = {
        operation: "getTasks"
    };
    var config = {
        params: {
            data: data
        }
    };
    console.log(config);
    $('#loader').css("display", "block");
    $http.post("Process/php/TaskFacade.php", null, config)
        .success(function (data) {
            console.log(data);
            $('#loader').css("display", "none");

            for (var i = 0; i < data.message.length; i++) {

                task.push({
                    "TaskID": data.message[i].TaskID,
                    "TaskName": data.message[i].TaskName,
                    "TaskDescripion": data.message[i].TaskDescripion,
                    "ScheduleStartDate": data.message[i].ScheduleStartDate,
                    "ScheduleEndDate": data.message[i].ScheduleEndDate,
                    "CompletionPercentage": data.message[i].CompletionPercentage,
                    "TaskAssignedTo": data.message[i].TaskAssignedTo,
                    "isCompleted": data.message[i].isCompleted,
                    "CreationDate": data.message[i].CreationDate,
                    "CreatedBy": data.message[i].CreatedBy,
                    "ActualStartDate": data.message[i].ActualStartDate,
                    "AcutalEndDate": data.message[i].AcutalEndDate,
                    "UserId": data.message[i].UserId,
                    "UserName": data.message[i].firstName + " " + data.message[i].lastName

                });
            }
            $rootScope.tasks = task;
            console.log($rootScope.tasks);

        })
        .error(function (data, status, headers, config) {
            console.log(data.error);

            $('#loader').css("display", "none");
            $scope.errorMessage = data.message;
            $('#error').css("display", "block");
        });



    $scope.totalItems = $rootScope.tasks.length;
    $scope.currentPage = 1;
    $scope.tasksPerPage = 10;
    $scope.paginateTasksDetails = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.tasksPerPage;
        end = begin + $scope.tasksPerPage;
        index = $rootScope.tasks.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    $scope.setTask = function (task) {
        setInfo.set(task);
    }

    $scope.deleteTask = function (taskid) {
        console.log("delete task " + taskid);
        var data = {
            operation: "deleteTask",
            taskId:taskid

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Process/php/TaskFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    $scope.warningMessage = data.message;
                    $('#warning').css("display", "block");

                }
                setTimeout(function () {
                    $scope.$apply(function () {
                        $('#warning').css("display", "none");
                        window.location.reload(true);
                    });
                }, 3000);

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $scope.errorMessage = data.message;
                $('#error').css("display", "block");
            });





        //$http({
        //    method: 'GET',
        //    url: 'php/api/task/delete/' + taskid
        //}).then(function successCallback(response) {
        //    alert("in success :::" + response);
        //}, function errorCallback(response) {
        //    alert("in error ::" + response);
        //});






    }

});


myApp.controller('AssignTaskController', function ($scope, $http, AppService, $filter) {

    console.log("in AssignTaskController");
    $scope.users = [];
    AppService.getUsers($scope, $http);

    $scope.assignTask = function () {
        $('#loader').css("display", "block");
        console.log("IN ASSIGN TASK");
        var date = new Date();
        var creationDate = $filter('date')(date, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var startDate = $filter('date')($scope.task.startDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var endDate = $filter('date')($scope.task.endDate, 'yyyy/MM/dd hh:mm:ss', '+0530');

        console.log("startDate " + startDate);
        var Taskdata = {
            "TaskName": $scope.task.taskname,
            "TaskDescripion": $scope.task.description,
            "ScheduleStartDate": startDate,
            "ScheduleEndDate": endDate,
            "CompletionPercentage": "0",
            "TaskAssignedTo": $scope.task.assignedTo.id,
            "isCompleted": "0",
            "CreationDate": creationDate
        };
        console.log("Task data is " + JSON.stringify(Taskdata));

        var data = {
            operation: "saveTask",
            data: Taskdata

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Process/php/TaskFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    $scope.warningMessage = data.message;
                    $('#warning').css("display", "block");

                }
                setTimeout(function () {
                    $scope.$apply(function () {
                        $('#warning').css("display", "none");
                        window.location.reload(true);
                    });
                }, 3000);


            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $scope.errorMessage = data.message;
                $('#error').css("display", "block");
            });

        //$.ajax({
        //    type: "POST",
        //    url: 'php/api/task',
        //    data: Taskdata,
        //    dataType: 'json',
        //    cache: false,
        //    contentType: 'application/json',
        //    processData: false,
        //
        //    success: function (data) {
        //        alert("success in assign task " + data);
        //
        //    },
        //    error: function (data) {
        //        console.log(data);
        //        alert("error in task assignment" + data);
        //    }
        //});

    };
    //$scope.today = function(){
    //    $scope.task.startDate = new Date();
    //};
    //
    //$scope.today();

    $scope.taskStartDate = function () {
        $scope.show.opened = true;
    };

    $scope.show = {
        opened: false
    };
    $scope.taskEndDate = function () {
        $scope.showEnd.opened = true;
    };
    $scope.showEnd = {
        opened: false
    };

});

myApp.factory('myService', function () {
    var savedData = {}
    //alert("in myService");
    function set(data) {
        savedData = data;
    }

    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }

});



