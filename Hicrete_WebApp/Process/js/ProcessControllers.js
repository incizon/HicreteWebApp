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
        alert("File upload started");
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })

            .success(function (status) {
                console.log("in upload successs" + status);
            })

            .error(function () {
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

myApp.controller('ProjectCreationController', function ($scope, $http, $httpParamSerializerJQLike,AppService) {
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

        $http.post('php/api/projects', projectData)
            .success(function (data, status, headers) {
                //$scope.PostDataResponse = data;
                alert(data.message);

            })
            .error(function (data, status, header) {
                //$scope.ResponseDetails = "Data: " + data;
                console.log(data);
                alert(data);
            });
    }


});


myApp.controller('ProjectDetailsController', function ($stateParams, setInfo, $scope, $http, $uibModal, $log, fileUpload,AppService) {

    var detaildata = $stateParams.projectToView;


    //console.log("data 12 "+JSON.stringify(detaildata));
    var projId = detaildata.project_id;

    $scope.PymentDetails = [];
    var paymentdetail = [];
    // console.log("project id"+projId);
    /*********************************************************/
    $scope.projectPaymentsInvoice = [];
    var paymentinvoice = [];


    $http.get("php/api/payment/allPayment/Byproj/" + projId).then(function (response) {
        // console.log(response.data.length);
        if (response.data != null) {
            paymentdetails = response.data;
        }
        $scope.projectPayment = paymentdetails;
        // console.log("project payment new scope is "+JSON.stringify($scope.projectPayment));
        var pkgamount = 0;
        var amountPaid = 0;
        var remaining = 0;
        var remaining2 = 0;
        for (var i = 0; i < $scope.projectPayment.Quotation.length; i++) {
            pkgamount = +pkgamount + +$scope.projectPayment.Quotation[i].total_project_amount;
            amountPaid = +amountPaid + +$scope.projectPayment.Quotation[i].total_paid_amount;
            // console.log("pkg amnt is "+pkgamount);
            for (var index1 = 0; index1 < $scope.projectPayment.Quotation[i].paymentDetails.length; index1++) {
                remaining = 0;
                console.log("in for");
                console.log("remaining " + remaining);
                console.log("grand total is " + $scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal);
                // remaining = +pkgamount - +$scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal;
                remaining = +pkgamount - ( +remaining2 + +$scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal);
                remaining2 = +remaining2 + +$scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal
                paymentinvoice.push({
                    'amount_paid': $scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal,
                    'invoice_name': $scope.projectPayment.Quotation[i].paymentDetails[index1].InvoiceTitle,
                    'remaining_amt': remaining
                    //paid_to:$scope.projectPayment.Quotation[i].paymentDetails[index1].FirstName+''+$scope.projectPayment.Quotation[i].paymentDetails[index1].LastName,
                    //remaining_amount: remaining
                });
            }
            $scope.projectPaymentsInvoice = paymentinvoice;
        }
        $scope.projectPaymentsInvoice;
        // console.log("see here "+pkgamount+" total "+JSON.stringify($scope.projectPaymentsInvoice));
    })
    /*******************************************************************************/
    // console.log("iddddddddd "+projId);

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
        var workorderData = '{"ProjectId":"' + $scope.workorder.projId + '","WorkOrderName":"' + $scope.workorder.title + '","ReceivedDate":"' + $scope.workorder.date + '","WorkOrderBlob":"' + fileName + '","CompanyId":"' + $scope.workOrderDetails.CompanyId + '","QuotationId":"' + $scope.workOrderDetails.QuotationId + '"}';
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

    $scope.scheduleFollowup = function (size, q) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Applicator/html/paymentFollowup.html',

            controller: function ($scope, $uibModalInstance, $filter) {
                // console.log("quotation is "+JSON.stringify(q));
                AppService.getUsers($scope,$http);
                $scope.ok = function () {
                    // ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
                    var FollowupDate = $filter('date')($scope.applicatorDetails.followupdate, 'yyyy/MM/dd hh:mm:ss', '+0530');
                    var AssignEmployee = $scope.applicatorDetails.followupemployeeId;
                    var FollowupTitle = $scope.applicatorDetails.followTitle;

                    var CreatedBy = 1;
                    var date = new Date();
                    var creationDate = $filter('date')(date, 'yyyy/MM/dd hh:mm:ss', '+0530');

                    var data = '{"FollowupDate":"' + FollowupDate + '","AssignEmployee":"' + AssignEmployee + '","FollowupTitle":"' + FollowupTitle + '","CreatedBy":"' + CreatedBy + '","CreationDate":"' + creationDate + '"}';
                    console.log("q id is " + q.QuotationId);
                    console.log(" postdata for quotation followup is " + data);
                    $.ajax({
                        type: "POST",
                        url: 'php/api/followup/quotation/create/' + q.QuotationId,
                        data: data,
                        dataType: 'json',
                        cache: false,
                        contentType: 'application/json',
                        processData: false,

                        success: function (data) {
                            alert("success Followup creation " + data);


                        },
                        error: function (data) {
                            alert("error in Followup creation " + data);
                        }
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
    $http({
        method: "GET",
        url: "php/api/quotation/" + projId
    }).then(function mySucces(response) {

        if(response.data.status!="Successful"){
            alert(response.data.message);
            return;
        }

        $scope.qData = response.data.message;
        $scope.projectQuotations = [];
        var b = [];
        var length = $scope.qData.length;
        //alert("length is "+$scope.qData.length);
        for (var i = 0; i < length; i++) {
            b.push({
                'QuotationTitle': $scope.qData[i].QuotationTitle,
                'QuotationId': $scope.qData[i].QuotationId,
                'CompanyId': $scope.qData[i].companyId,
                'CompanyName': $scope.qData[i].companyName,
                'CreationDate': $scope.qData[i].DateOfQuotation,
                'ProjectName': $scope.qData[i].ProjectName,
                'Subject': $scope.qData[i].Subject,
                'RefNo': $scope.qData[i].RefNo,
                'title': $scope.qData[i].Title,
                'description': $scope.qData[i].Description,
                //'quantity': $scope.qData[i].Quantity,
                //'unitRate': $scope.qData[i].UnitRate,
                //'amount': $scope.qData[i].Amount,
                'isApproved': $scope.qData[i].isApproved,
                'filePath': $scope.qData[i].QuotationBlob
            });
            $scope.projectQuotations = b;
            //myService.set($scope.projectQuotations);
        }
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });

    $scope.check = function (q) {
        var projQId = q;
        console.log("qqqq " + JSON.stringify(projQId));
        setInfo.set(projQId);
        $scope.workOrderDetails=q;
        console.log("Daya="+$scope.workOrderDetails);
    }
    /*Get Workorder by project id*/
    $http({
        method: "GET",
        url: "php/api/workorder/" + projId
    }).then(function mySucces(response) {
        $scope.qData = response.data;
        $scope.projectWorkorders = [];
        var b = [];
        var length = $scope.qData.length;
        //alert("length is "+$scope.qData.length);
        for (var i = 0; i < length; i++) {
            b.push({
                'workOrderNo': $scope.qData[i].WorkOrderNo,
                'workoOrderTitle': $scope.qData[i].WorkOrderName,
                'receivedDate': $scope.qData[i].ReceivedDate,
                'workOrderBlob': $scope.qData[i].WorkOrderBlob,
                'projectId': $scope.qData[i].ProjectId,
                'companyId': $scope.qData[i].CompanyId,
                'isApproved': $scope.qData[i].isApproved,
                'quotationTitle': $scope.qData[i].QuotationTitle,
                'workOrderNo': $scope.qData[i].WorkOrderNo,
                'quotationId': $scope.qData[i].QuotationId,
                'creationDate': $scope.qData[i].CreationDate,
                'dateOfQuotation': $scope.qData[i].DateOfQuotation,
                'filePath': $scope.qData[i].WorkOrderBlob

            });
            $scope.projectWorkorders = b;
            //myService.set($scope.projectQuotations);
        }
        $scope.projectWorkorders;
        //console.log("work order data is "+JSON.stringify($scope.projectWorkorders));
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
    //console.log("quotation title is "+$scope.projectQuotations.QuotationTitle);

    $scope.passWork = function (wo) {
        setInfo.set(wo);
    }

    /*Get Invoices by project id*/
    $http({
        method: "GET",
        url: "php/api/invoice/project/" + projId
    }).then(function mySucces(response) {
        $scope.qData = response.data;
        $scope.projectInvoice = [];
        var b = [];
        var length = $scope.qData.length;
        //alert("length is "+$scope.qData.length);
        for (var i = 0; i < length; i++) {
            b.push({
                'invoiceNo': $scope.qData[i].InvoiceNo,
                'quotationId': $scope.qData[i].QuotationId,
                'invoiceDate': $scope.qData[i].InvoiceDate,
                'invoiceTitle': $scope.qData[i].InvoiceTitle,
                'totalAmount': $scope.qData[i].TotalAmount,
                'invoiceBLOB': $scope.qData[i].InvoiceBLOB,
                'isPaymentRetention': $scope.qData[i].isPaymentRetention,
                'CreatedBy': $scope.qData[i].CreatedBy,
                'quotationTitle': $scope.qData[i].QuotationTitle,
                'quotationDate': $scope.qData[i].DateOfQuotation,
                'companyId': $scope.qData[i].CompanyId
            });
            $scope.projectInvoice = b;
            //myService.set($scope.projectQuotations);
        }
        console.log("Invoice data is " + JSON.stringify($scope.projectInvoice));
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });

    $scope.passInvoice = function (iv) {
        //alert("in"+iv);
        myService.set(iv);
    }

    $scope.closeProject = function () {
        console.log("close project" + projId);

        $http.get("php/api/projects/close/" + projId).then(function (response) {
            alert(response.data);
        })

    }

});


myApp.controller('QuotationController', function (fileUpload, $scope, $http, $uibModal, $log, $filter,AppService) {
    //alert("in quotation");
    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.taxDetails = [];
    $scope.currentItemList = [];

    $scope.QuotationDetails = {
        quotationItemDetails: []
    };
    $scope.Companies = [];
    var company = [];
    var totalAmount = 0;
    var remainingTotal = 0;

    $scope.quotationDate = function(){
        $scope.showQdate.opened = true;
    };

    $scope.showQdate = {
        opened:false
    };

    $scope.projects=[];
    AppService.getAllProjects($http,$scope.projects);

    $scope.getCustomerForProject = function () {
        // alert("in chage");
        $scope.Companies = [];
        var company = [];
        var projectId = $scope.QuotationDetails.projectId;
        console.log("proj id is " + projectId);
        $http.get("php/api/projects/companies/" + projectId).then(function (response) {
            //console.log(response.data.length);

            if (response.data.status =="Successful") {
                for (var i = 0; i < response.data.message.length; i++) {
                    company.push({
                        company_id: response.data.message[i].companyId,
                        company_name: response.data.message[i].companyName
                    });
                }
                $scope.Companies = company;
                console.log("Companies scope is " + JSON.stringify($scope.Companies));
            }else{
                alert(response.data.message);
            }

        })
        // alert("in "+projectId);
    }

    $scope.createQuotation = function () {
        var b = [];
        var data = [];
        var projectId = $scope.QuotationDetails.projectId;
        var companyId = $scope.QuotationDetails.companyName.company_id;
        var companyName = $scope.QuotationDetails.companyName.company_name;
        var fileName="";
        if($scope.myFile!=undefined){
            if($scope.myFile.name!=undefined){
                var uploadQuotationLocation = "upload/Quotations/";
                fileName = uploadQuotationLocation + $scope.myFile.name;
            }

        }

        // alert("no of rows"+$scope.noOfRows);
        //alert(JSON.stringify($scope.QuotationDetails.quotationItemDetails));

        for (var i = 0; i < $scope.noOfRows; i++) {
            b.push({
                'Title': $scope.QuotationDetails.quotationItemDetails[i].quotationItem,
                'Decription': $scope.QuotationDetails.quotationItemDetails[i].quotationDescription,
                'Quantity': $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity,
                'Unit': $scope.QuotationDetails.quotationItemDetails[i].quotationUnit,
                'UnitRate': $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate
            });
            data[i] = '{"Title":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationItem + '","Description":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationDescription + '","Quantity":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity + '","UnitRate":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationUnit + '","Amount":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate + '"} '
            // console.log("data is "+data[i]);
        }
        var jsonData = [];
        jsonData = '"Quotation":[' + data + ']';
        //console.log("JSON data is --"+jsonData);
        var taxData = [];
        var taxJson = [];
        taxData = JSON.stringify($scope.taxDetails);
        taxJson = ', "TaxJson":' + taxData + ' }';
        var d2 = $filter('date')($scope.QuotationDetails.quotationDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        // var quotationData = '[{"QuotationTitle":'+$scope.QuotationDetails.quotationTitle+',"ProjectId":'+projectId+',"CompanyName":'+companyName+',"CompanyId":'+companyId+',"RefNo":'+$scope.QuotationDetails.referenceNo+',"DateOfQuotation":'+d2+',"Subject":'+$scope.QuotationDetails.quotationSubject+',"QuotationBlob":'+$scope.qBlob+'}]';
        var quotationData = {
            "QuotationTitle": $scope.QuotationDetails.quotationTitle,
            "ProjectId": projectId,
            "CompanyName": companyName,
            "CompanyId": companyId,
            "RefNo": $scope.QuotationDetails.referenceNo,
            "DateOfQuotation": d2,
            "Subject": $scope.QuotationDetails.quotationSubject,
            "QuotationBlob": fileName
        };
        var quotationDetails = $scope.QuotationDetails.quotationItemDetails;
        var taxDetails = $scope.taxDetails;
        var QuotationData = {
            Quotation: quotationData,
            Details: quotationDetails,
            taxDetails: taxDetails
        };
        //var quotationAllData = quotationData+" "+jsonData+""+taxJson;
        console.log("data is " + JSON.stringify(QuotationData));

        $.ajax({
            type: "POST",
            url: 'php/api/quotation/tax',
            data: JSON.stringify(QuotationData),
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,

            success: function (data) {
                alert("status" + JSON.stringify(data));
                var file = $scope.myFile;
                var uploadUrl = "php/api/quotation/upload";
                fileUpload.uploadFileToUrl(file, uploadUrl);
            },
            error: function (data) {
                alert("Status" + data);
                //var file = $scope.myFile;
                //  var uploadUrl = "php/api/quotation/upload";
                //fileUpload.uploadFileToUrl(file, uploadUrl);
            }
        });


    }

    $scope.createQuotationDoc = function () {
        var b = [];
        var data = [];
        var projectId = $scope.QuotationDetails.projectName.id;
        var companyId = $scope.QuotationDetails.companyName.company_id;
        var companyName = $scope.QuotationDetails.companyName.company_name;
        var date = new Date();
        alert("No of rows " + $scope.noOfRows);
        for (var i = 0; i < $scope.noOfRows; i++) {
            // alert("in for"+i+" count "+$scope.noOfRows);
            //alert("Title is "+$scope.QuotationDetails.quotationItemDetails[i].quotationItem);
            b.push({
                'Title': $scope.QuotationDetails.quotationItemDetails[i].quotationItem,
                'Decription': $scope.QuotationDetails.quotationItemDetails[i].quotationDescription,
                'Quantity': $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity,
                'Unit': $scope.QuotationDetails.quotationItemDetails[i].quotationUnit,
                'UnitRate': $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate
            });
            data[i] = '{"Title":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationItem + '","Description":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationDescription + '","Quantity":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity + '","UnitRate":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationUnit + '","Amount":"' + $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate + '"} '
            // console.log("data is "+data[i]);
        }
        var jsonData = [];
        jsonData = '"Quotation":[' + data + ']';
        //console.log("JSON data is --"+jsonData);
        var taxData = [];
        var taxJson = [];
        taxData = JSON.stringify($scope.taxDetails);
        taxJson = ', "TaxJson":' + taxData + ' }';
        var d2 = $filter('date')($scope.QuotationDetails.quotationDate, 'yyyy/MM/dd ', '+0530');
        var quotationData = '{"Date":"' + date + '","QuotationTitle":"' + $scope.QuotationDetails.quotationTitle + '","ProjectId":"' + projectId + '","CompanyName":"' + companyName + '","CompanyId":"' + companyId + '","RefNo":"' + $scope.QuotationDetails.referenceNo + '","DateOfQuotation":"' + d2 + '","Subject":"' + $scope.QuotationDetails.quotationSubject + '","QuotationBlob":"' + $scope.qBlob + '" ,';
        // var data3 =',{"TaxName":"test tax",  "TaxPercentage":"12",  "TaxAmount":"1200"}'
        var quotationAllData = quotationData + " " + jsonData + "" + taxJson;

        console.log("data in create quotation doc " + quotationAllData);
        $.ajax({
            type: "POST",
            url: 'php/api/GenDoc/Quotation',
            data: quotationAllData,
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,

            success: function (data) {
                alert("success in task updation " + data);


            },
            error: function (data) {
                alert("error in task updation " + JSON.stringify(data));
            }
        });


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

        totalAmount = totalAmount + amount;
        console.log("amount is " + amount);
        $scope.totalAmnt = totalAmount;
    }

    $scope.totalTaxAmount = function (amount) {
        console.log("amount is " + amount);
    }
    $scope.removeQuotationItem = function (index) {
        var amount = $scope.QuotationDetails.quotationItemDetails[index].amount;
        totalAmount = +totalAmount - +amount;
        $scope.totalAmnt = totalAmount;
        //alert("remainingTotal is "+$scope.totalAmnt);
        $scope.QuotationDetails.quotationItemDetails.splice(index, 1); //remove item by index

    };
    $scope.removeTaxItem = function (index) {

        $scope.taxDetails.splice(index, 1); //remove item by index

    };


    $scope.addTax = function (size) {


        if ($scope.taxSelected > 0) {

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
                var itemString = " (Item ";
                var itemArray = [];


                for (var i = 0; i < $scope.currentItemList.length - 1; i++) {
                    itemString += $scope.currentItemList[i] + " ,";
                    itemArray.push($scope.currentItemList[i]);
                }
                itemString += $scope.currentItemList[$scope.currentItemList.length - 1] + " )";
                itemArray.push($scope.currentItemList[$scope.currentItemList.length - 1]);
                $scope.taxDetails.push({
                    taxTitle: tax.taxTitle,
                    taxApplicableTo: itemString,
                    taxPercentage: tax.taxPercentage,
                    amount: tax.amount,
                    itemList: $scope.currentItemList,
                    taxArray: itemArray
                });
                // $scope.taxDetails.push({taxTitle:tax.taxTitle,taxPercentage:tax.taxPercentage,amount:tax.amount});
                console.log($scope.currentItemList);
                console.log(JSON.stringify($scope.taxDetails));
                console.log("tax amnt is " + $scope.taxDetails.amount);
                var taxAmnt = 0;
                console.log("lenfthh" + $scope.taxDetails.length);
                for (var s = 0; s < $scope.taxDetails.length; s++) {
                    var taxamnt = $scope.taxDetails[s].amount;
                    taxAmnt = taxAmnt + taxamnt;
                    console.log("tax amnt is " + taxAmnt);
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
            alert("Please Select Checkbox");
        }

    }

    /*$scope.uploadQuotation = function(){
     console.log("in upload file function");
     //var file = $scope.QuotationDetails.quotationBlob;
     var file = $scope.myFile;
     console.log('file is '+file);
     console.dir(file);

     var uploadUrl = "../App/upload";
     console.log("Upload url is "+uploadUrl);
     fileUpload.uploadFileToUrl(file, uploadUrl);
     }*/


});

myApp.controller('InvoiceController', function ($scope, $http, $uibModal, $log, $filter, setInfo) {

    console.log("in add invoice");
    var workDetail = setInfo.get();
    //console.log("workorder no is "+JSON.stringify(workDetail));
    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.taxDetails = [];
    $scope.currentItemList = [];
    $scope.totalAmnt = 0;
    $scope.roundingOff = 0;
    var totalAmount = 0;

    $scope.InvoiceDetails = {

        invoiceItemDetails: [],
        workOrderNumber: workDetail.workOrderNo,
        quotationNumber: workDetail.quotationId,
        quotationDate: workDetail.dateOfQuotation,
        workOrderDate: workDetail.creationDate
    }


    $scope.createInvoice = function () {
        //console.log("roundingOff is "+$scope.roundingOff);
        console.log("in createInvoice");
        var d1 = $filter('date')($scope.InvoiceDetails.invoiceDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var d2 = $filter('date')($scope.InvoiceDetails.quotationDate, 'yyyy/MM/dd', '+0530');
        var d3 = $filter('date')($scope.InvoiceDetails.workOrderDate, 'yyyy/MM/dd', '+0530');
        //var grandTotal = (+$scope.totalAmnt + +$scope.TaxAmnt) - +$scope.roundingOff;
        var totalAt = $scope.totalAmnt;
        var totalTat = $scope.TaxAmnt;
        var totalAmount = +totalAt + +totalTat;
        var roundingOff = $scope.roundingOff;
        var grandTotal = +totalAmount - +roundingOff;

        console.log("contactPerson " + $scope.InvoiceDetails.contactPerson);
        var invoicData = {
            "InvoiceNo": $scope.InvoiceDetails.invoiceNumber,
            "InvoiceTitle": "Invoice Title",
            "TotalAmount": totalAmount,
            "RoundingOffFactor": $scope.roundingOff,
            "GrandTotal": grandTotal,
            "InvoiceBLOB": " ",
            "isPaymentRetention": "1",
            "PurchasersVATNo": "11",
            "PAN": "123456",
            "CreatedBy": "1",
            "QuotationId": $scope.InvoiceDetails.quotationNumber,
            "WorkOrderNumber": $scope.InvoiceDetails.workOrderNumber,
            "ContactPerson": $scope.InvoiceDetails.contactPerson,
            "InvoiceDate": d1,
            "QuotationDate": d2,
            "WorkOrderDate": d3
        };
        //var invoiceAbstract = '{"TaxName":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationDescription+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'"}';
        console.log("data is final 11 " + JSON.stringify(invoicData));
        var b = [];
        var data = [];
        console.log("noOfRows " + $scope.noOfRows);
        for (var i = 0; i < $scope.noOfRows; i++) {

            b.push({
                'Title': $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem,
                'Decription': $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription,
                'Quantity': $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity,
                'Unit': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit,
                'UnitRate': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate
            });
            data[i] = '{"DetailNo":"1","Title":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem + '","Description":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription + '","Quantity":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity + '","UnitRate":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit + '","Amount":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate + '"}';
            // console.log("data is "+data[i]);
        }
        var taxDetails = JSON.stringify($scope.taxDetails);
        console.log("tax is  data " + taxDetails);

        var jsonData = [];
        jsonData = ',"Details":[' + data + ']';
        var taxData = [];
        var taxJson = [];
        taxData = JSON.stringify($scope.taxDetails);
        taxJson = ', "taxDetails":' + taxData + ' }';
        var invoiceAllData = invoicData + " " + jsonData + "" + taxJson;
        //console.log("111 "+invoiceAllData);

        var invoiceDetails = $scope.InvoiceDetails.invoiceItemDetails;
        //console.log("invoice details is313 "+invoiceDetails);
        var taxDetails = $scope.taxDetails;
        var InvoiceData = {
            Invoice: invoicData,
            Details: invoiceDetails,
            taxDetails: taxDetails
        };

        //  console.log("Final invoice data is "+JSON.stringify(InvoiceData));
        $.ajax({
            type: "POST",
            url: 'php/api/invoice',
            data: JSON.stringify(InvoiceData),
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function (data) {
                alert("success in Invice creation " + data);

            },
            error: function (data) {
                alert("error in invoice creation " + JSON.stringify(data));
            }
        });

    }


    /*$scope.InvoiceDetails.invoiceItemDetails.push({

     quotationItem: "Material 1",
     quotationDescription: "Supply Material 1",
     quotationQuantity: 10,
     quotationUnit: "kg",
     quotationUnitRate: 200,
     amount:2000,
     isTaxAplicable:false
     });*/
    /*$scope.InvoiceDetails.invoiceItemDetails.push({

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
     });*/

    var currentList1 = [1, 2];
    //$scope.taxDetails.push({taxTitle:"VAT",taxApplicableTo:"(Item 1,2)",taxPercentage:10,amount:250 ,itemList:currentList1});
    //$scope.taxDetails.push({taxTitle:"CST",taxApplicableTo:"(Item 3)",taxPercentage:10,amount:150 ,itemList:[3]});

    $scope.addRows = function () {

        for (var index = 0; index < $scope.noOfRows; index++) {
            $scope.InvoiceDetails.invoiceItemDetails.push({

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
    $scope.removeInvoiceItem = function (index) {

        var amount = $scope.InvoiceDetails.invoiceItemDetails[index].amount;
        /*alert("amount is "+amount);
         alert("totalAmount is "+totalAmount);*/
        totalAmount = +totalAmount - +amount;
        $scope.totalAmnt = totalAmount;
        console.log("remainingTotal is " + $scope.totalAmnt);
        $scope.InvoiceDetails.invoiceItemDetails.splice(index, 1); //remove item by index

    };
    $scope.removeInvoiceTaxItem = function (index) {

        $scope.taxDetails.splice(index, 1); //remove item by index

    };

    $scope.calculateTaxableAmount = function (index) {

        if ($scope.InvoiceDetails.invoiceItemDetails[index].isTaxAplicable) {
            $scope.taxableAmount = $scope.taxableAmount + $scope.InvoiceDetails.invoiceItemDetails[index].amount;
            $scope.taxSelected++;
            $scope.currentItemList.push(index + 1);
        } else {
            $scope.taxableAmount = $scope.taxableAmount - $scope.InvoiceDetails.invoiceItemDetails[index].amount;
            $scope.taxSelected--;
            $scope.currentItemList.splice($scope.currentItemList.indexOf(index + 1), 1);
        }
    }

    $scope.calculateAmount = function (index) {
        //alert("ttttt");

        $scope.InvoiceDetails.invoiceItemDetails[index].amount = $scope.InvoiceDetails.invoiceItemDetails[index].quotationQuantity * $scope.InvoiceDetails.invoiceItemDetails[index].quotationUnitRate;
        console.log("amount is " + $scope.InvoiceDetails.invoiceItemDetails[index].amount);
    }


    $scope.calculateTotal = function (amount) {

        totalAmount = +totalAmount + +amount;
        console.log("total amount is " + totalAmount);
        $scope.totalAmnt = totalAmount;
        // alert("totalAmount is "+$scope.totalAmnt);
    }


    $scope.addTax = function (size) {


        if ($scope.taxSelected > 0) {

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
                var itemString = " (Item ";
                var itemArray = [];
                for (var i = 0; i < $scope.currentItemList.length - 1; i++) {
                    itemString += $scope.currentItemList[i] + " ,";
                    itemArray.push($scope.currentItemList[i]);
                }
                itemString += $scope.currentItemList[$scope.currentItemList.length - 1] + " )";
                itemArray.push($scope.currentItemList[$scope.currentItemList.length - 1]);
                //$scope.taxDetails.push({taxTitle:tax.taxTitle,taxPercentage:tax.taxPercentage,amount:tax.amount});
                $scope.taxDetails.push({
                    taxTitle: tax.taxTitle,
                    taxApplicableTo: itemString,
                    taxPercentage: tax.taxPercentage,
                    amount: tax.amount,
                    itemList: $scope.currentItemList,
                    taxArray: itemArray
                });
                //console.log($scope.currentItemList);
                //console.log($scope.taxDetails);
                // console.log($scope.currentItemList);
                //console.log(JSON.stringify($scope.taxDetails));
                //console.log("tax amnt is 313 "+$scope.taxDetails.amount);
                var taxAmnt = 0;
                //console.log("length is "+$scope.taxDetails.length);
                for (var s = 0; s < $scope.taxDetails.length; s++) {
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
            alert("Please Select Checkbox");
        }

    }

    $scope.totalTaxAmount = function (amount) {
        //  console.log("amount is "+amount);
    }


    $scope.CreateInvoiceDoc = function () {
        // console.log("in createInvoice DOc generation");
        var d1 = $filter('date')($scope.InvoiceDetails.invoiceDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var d2 = $filter('date')($scope.InvoiceDetails.quotationDate, 'yyyy/MM/dd', '+0530');
        var d3 = $filter('date')($scope.InvoiceDetails.workOrderDate, 'yyyy/MM/dd', '+0530');
        //var grandTotal = (+$scope.totalAmnt + +$scope.TaxAmnt) - +$scope.roundingOff;
        var totalAt = $scope.totalAmnt;
        var totalTat = $scope.TaxAmnt;
        var totalAmount = +totalAt + +totalTat;
        var roundingOff = $scope.roundingOff;
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
        var invoicData = {
            "InvoiceNo": $scope.InvoiceDetails.invoiceNumber,
            "InvoiceTitle": "Invoice Title",
            "TotalAmount": totalAmount,
            "RoundingOffFactor": $scope.roundingOff,
            "GrandTotal": grandTotal,
            "InvoiceBLOB": " ",
            "isPaymentRetention": "1",
            "PurchasersVATNo": "11",
            "PAN": "123456",
            "CreatedBy": "1",
            "QuotationId": $scope.InvoiceDetails.quotationNumber,
            "WorkOrderNumber": $scope.InvoiceDetails.workOrderNumber,
            "ContactPerson": $scope.InvoiceDetails.contactPerson,
            "InvoiceDate": d1,
            "QuotationDate": d2,
            "WorkOrderDate": d3
        };
        //var invoiceAbstract = '{"TaxName":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationDescription+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'"}';
        var b = [];
        var data = [];
        //console.log("data is "+invoicData);
        //console.log("noOfRows "+$scope.noOfRows);
        for (var i = 0; i < $scope.noOfRows; i++) {

            b.push({
                'Title': $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem,
                'Decription': $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription,
                'Quantity': $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity,
                'Unit': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit,
                'UnitRate': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate
            });
            data[i] = '{"DetailNo":"1","Title":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem + '","Description":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription + '","Quantity":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity + '","UnitRate":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit + '","Amount":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate + '"}';
            //  console.log("data is "+data[i]);
        }
        var taxDetails = JSON.stringify($scope.taxDetails);
        // console.log("tax is  data "+taxDetails);

        var jsonData = [];
        jsonData = ',"Details":[' + data + ']';
        var taxData = [];
        var taxJson = [];
        taxData = JSON.stringify($scope.taxDetails);
        taxJson = ', "taxDetails":' + taxData + ' }';
        var invoiceAllData = invoicData + " " + jsonData + "" + taxJson;
        //console.log("111 "+invoiceAllData);

        var invoiceDetails = $scope.InvoiceDetails.invoiceItemDetails;
        //console.log("invoice details is313 "+invoiceDetails);
        var taxDetails = $scope.taxDetails;
        var InvoiceData = {
            Invoice: invoicData,
            Details: invoiceDetails,
            taxDetails: taxDetails
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
            success: function (data) {
                alert("success gen doc invoice " + JSON.stringify(data));

            },
            error: function (data) {
                alert("error in gen doc invoice " + JSON.stringify(data));
            }
        });


    };


});
myApp.controller('ProjectPaymentController',function($scope,$http,$uibModal,$log,$filter,AppService){
/**************************************************************************/

    $scope.projectPayment=[];
    $scope.animationsEnabled=true;
    $scope.paymentReceivedFor=undefined;
    var totalAmount  = 0;
    $scope.AssignedPayments = [];
    var AssignedPayment = [];
    var paymentdetails = [];
    $scope.projectPaymentsInvoice = [];
 $scope.paymentDetails={
        operation:""

    };
    $scope.formSubmitted=false;
    $scope.showPaymentDetails=false;
    /**********************/
$scope.Projects = [];
var project = [];

    $scope.dateOfPayment = function(){
        $scope.payDate.opened = true;
    };

    $scope.payDate = {
        opened:false
    };

AppService.getUsers($scope,$http);
/****************************/
       //     /************* got all project ********************/
       //$http.get("php/api/projects").then(function(response) {
       //        //  console.log(response.data.length);
       //         if(response.data != null){
       //                 for(var i = 0; i<response.data.length ; i++){
       //                             project.push({
       //                                         project_id: response.data[i].ProjectId,
       //                                         project_name: response.data[i].ProjectName
       //                             });
       //                 }
       //         }
       //        $scope.Projects = project;
       //       // console.log("projects scope is "+JSON.stringify($scope.Projects));
       //     })

    AppService.getAllProjects($http,$scope.Projects);
    AppService.getAllInvoicesOfProject($http,$scope.Invoices,$scope.paymentDetails.projectID);

   /* $scope.viewProjectPaymentDetails=function(project_id){
       
        console.log("project id is "+project_id);

         $http.get("php/api/payment/assigned/Byproj/"+project_id).then(function(response) {
                console.log(response.data.length);
                if(response.data != null){
                        for(var i = 0; i<response.data.length ; i++){
                                    AssignedPayment.push({
                                                payment_grand_total:response.data[i].GrandTotal
                                    });
                        }
                }
               $scope.AssignedPayments = AssignedPayment;
               console.log("AssignedPayment scope is "+JSON.stringify($scope.AssignedPayments));
            })

         
    }*/
    $scope.viewProjectPaymentDetails = function(project_id){
      $scope.Invoices = [];
      var invoice = [];
        AppService.getAllInvoicesOfProject($http,$scope.Invoices,project_id);
          //$http.get("php/api/invoice/project/"+project_id).then(function(response) {
          //     // console.log(response.data.length);
          //      if(response.data != null){
          //              for(var i = 0; i<response.data.length ; i++){
          //                          invoice.push({
          //                                     invoice_id: response.data[i].InvoiceNo,
          //                                      invoice_name: response.data[i].InvoiceTitle,
          //                                      invoice_date :response.data[i].InvoiceDate
          //                          });
          //              }
          //      }
          //     $scope.Invoices = invoice;
          //   //  console.log("invoices  scope is "+JSON.stringify($scope.Invoices));
          //  });


            $http.get("php/api/payment/allPayment/Byproj/"+project_id).then(function(response) {
              //  console.log(response.data.length);
                if(response.data != null){
                       paymentdetails = response.data;
                }
               $scope.projectPayment = paymentdetails;
              // console.log("project payment new scope is "+JSON.stringify($scope.projectPayment));
                    var pkgamount = 0;
                    var amountPaid = 0;

                    for(var i = 0; i<$scope.projectPayment.Quotation.length;i++){
                        pkgamount = +pkgamount + +$scope.projectPayment.Quotation[i].total_project_amount;
                        amountPaid = +amountPaid + +$scope.projectPayment.Quotation[i].total_paid_amount;

                             for(var index1=0;index1<$scope.projectPayment.Quotation[i].paymentDetails.length;index1++){
                                        //    console.log("in for");
                                    $scope.projectPaymentsInvoice.push({
                                        amount_paid:$scope.projectPayment.Quotation[i].paymentDetails[index1].GrandTotal,
                                        date_of_payment:$scope.projectPayment.Quotation[i].paymentDetails[index1].InvoiceDate,
                                        paid_to:$scope.projectPayment.Quotation[i].paymentDetails[index1].FirstName+''+$scope.projectPayment.Quotation[i].paymentDetails[index1].LastName,
                                        //payment_mode:$scope.projectPayment.paymentDetails[index1].payment_mode
                                    });
                            }
                    }

               $scope.packageAmount = pkgamount;
               $scope.projectPayment.total_project_amount = pkgamount;
             //  console.log("project new package amount scope is  "+JSON.stringify($scope.packageAmount));

                $scope.previousAmountPaid = amountPaid;
                $scope.projectPayment.total_paid_amount = amountPaid;
              //  console.log("project package paid amount scope is  "+JSON.stringify($scope.previousAmountPaid));

               /*  for(var index1=0;index1<$scope.projectPayment.paymentDetails.length;index1++){
                            console.log("in for");
                    $scope.projectPaymentsInvoice.push({
                        amount_paid:$scope.projectPayment.paymentDetails[index1].GrandTotal,
                        date_of_payment:$scope.projectPayment.paymentDetails[index1].InvoiceDate,
                        paid_to:$scope.projectPayment.paymentDetails[index1].FirstName+''+$scope.projectPayment.paymentDetails[index1].LastName,
                        //payment_mode:$scope.projectPayment.paymentDetails[index1].payment_mode
                    });
                }*/
             //   console.log("payments in modal is "+$scope.projectPaymentsInvoice);
            })
            
            $scope.showPaymentDetails=true;

    }



    $scope.getPendingAmount=function(){
       // console.log("In Pending amount function");
        $scope.paymentDetails.pendingAmount=parseInt($scope.packageAmount)-parseInt($scope.paymentDetails.amountPaid)-$scope.previousAmountPaid;

    }
    $scope.submitPaymentDetails=function(size,paymentDetails,quotation_id){
        console.log("branch number is "+paymentDetails.branchName)
        var iscash =0;
        var paydate = $filter('date')(paymentDetails.paymentDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        if(paymentDetails.paymentMode == 'cash'){
             iscash= 1;
            //var data = '{"AmountPaid":"'+paymentDetails.amountPaid+'", "PaymentDate":"'+paydate+'", "IsCashPayment":"'+iscash+'", "PaidTo":"'+paymentDetails.paidTo+'","InstrumentOfPayment":"'+paymentDetails.paymentMode+'"}'
            var data = '{"InvoiceNo":"'+paymentDetails.InvoiceNo+'","AmountPaid":"'+paymentDetails.amountPaid+'", "PaymentDate":"'+paydate+'", "IsCashPayment":"'+iscash+'", "PaidTo":"'+paymentDetails.paidTo.id+'","InstrumentOfPayment":"'+paymentDetails.paymentMode+'", "IDOfInstrument":"", "BankName":"", "BranchName":"", "City":""}';
        }
        else{
            var data = '{"InvoiceNo":"'+paymentDetails.InvoiceNo+'","AmountPaid":"'+paymentDetails.amountPaid+'", "PaymentDate":"'+paydate+'", "IsCashPayment":"'+iscash+'", "PaidTo":"'+paymentDetails.paidTo.id+'","InstrumentOfPayment":"'+paymentDetails.paymentMode+'", "IDOfInstrument":"'+paymentDetails.uniqueNumber+'", "BankName":"'+paymentDetails.bankName+'", "BranchName":"'+paymentDetails.branchName+'", "City":"'+paymentDetails.branchCity+'"}';
        }
        console.log("dta is "+data);

             $.ajax({
                            type: "POST",
                            url: 'php/api/savepayment',
                            data: data,
                            dataType: 'json',
                            cache: false,
                            contentType: 'application/json',
                            processData: false,
                               success:  function(data)
                            {
                                alert("success save payment "+data);
                             } ,
                               error: function(xhr,status, error) {
                                alert(xhr.responseText+" "+error+" AND "+status.code);
                                }
                            });
  /*$.ajax({
    type: 'POST',
  url: 'php/api/savepayment',
  context: document.body
}).done(function() {
  $( this ).addClass( "done" );
});*/



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
                controller:  function ($scope, $uibModalInstance,paymentDetails,AppService) {
                    AppService.getUsers($scope,$http);

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

myApp.controller('viewProjectController', function ($scope, $http, $rootScope) {

    $scope.ProjectPerPage = 5;
    $scope.currentPage = 1;

    $scope.searchKeyword=null;

    $scope.searchproject = function () {
        var project = [];
        var expression = $scope.searchBy + "" + $scope.searchKeyword;
        $rootScope.projectSearch = [];

        if ($scope.searchBy != undefined) {
            // alert("nt");
            console.log($scope.searchBy);
            console.log($scope.searchKeyword);
            $http.get("php/api/projects/search/" + $scope.searchBy + "/" + $scope.searchKeyword).then(function (response) {

                if (response.data.status == "Successful") {
                    for (var i = 0; i < response.data.message.length; i++) {
                        project.push({
                            'project_name': response.data.message[i].ProjectName,
                            'projectId': response.data.message[i].ProjectId,
                            'project_status': response.data.message[i].ProjectStatus,
                            'project_manager': response.data.message[i].FirstName + " " + response.data.message[i].LastName,
                            'project_id': response.data.message[i].ProjectId,
                            'project_Address': response.data.message[i].Address,
                            'project_City': response.data.message[i].City,
                            'project_State': response.data.message[i].State,
                            'project_Country': response.data.message[i].Country,
                            'PointContactName': response.data.message[i].PointContactName,
                            'MobileNo': response.data.message[i].MobileNo,
                            'LandlineNo': response.data.message[i].LandlineNo,
                            'EmailId': response.data.message[i].EmailId,
                            'Pincode': response.data.message[i].Pincode,
                            'customerId': response.data.message[i].CustomerId,
                            'customerName': response.data.message[i].CustomerName,
                            projectManagerId: response.data.message[i].ProjectManagerId
                        });
                        //$scope.Projects = b;
                    }

                    $rootScope.projectSearch = project;
                    if ($rootScope.projectSearch.length == 0) {
                        alert("No Data Found For Search Criteria");
                    }
                } else {
                    alert(response.data.message);
                }


            })
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


myApp.controller('ViewCustomerController',function($scope,$http,$rootScope){

    $scope.CustomerPerPage=5;
    $scope.currentPage=1;

    $scope.searchKeyword="";
    $scope.searchCustomer = function(){

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
                            pincode:response.data.message[i].Pincode,
                            index:i
                        });
                    }
                    $rootScope.customerSearch = cust;

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
                    $rootScope.customerSearch = cust;

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
        index = $rootScope.customerSearch.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };


});




myApp.controller('ModifyProjectController', function ($scope, $http, $stateParams, AppService) {

    $scope.customers = [];
    AppService.getAllCustomers($http, $scope.customers);

    $scope.Allcompanies = [];
    AppService.getCompanyList($http, $scope.Allcompanies);

    $scope.projectManagers = [];
    AppService.getProjectManagers($http, $scope.projectManagers);

    console.log($stateParams);
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
    $http.get("php/api/projects/companies/" + $scope.projectDetails.projectId).then(function (response) {
        if (response.data.status == "Successful") {
            for (var j = 0; j < $scope.Allcompanies.length; j++) {
                var isExcluded = true;
                for (var i = 0; i < response.data.message.length; i++) {
                    if ($scope.Allcompanies[j].companyId == response.data.message[i].companyId) {
                        isExcluded = false;
                        break;
                    }
                }
                if (isExcluded)
                    $scope.companies.push($scope.Allcompanies[j]);
            }

        } else {
            alert("Error Occurred Getting Company Information For This Project");
        }
    });


    $scope.modifyProject = function () {
        console.log("in ");

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
            EmailId: $scope.projectDetails.pointOfContactEmailID
        };
        var projectData = {
            projectDetails: projectBasicDetails,
            companiesInvolved: companiesInvolved
        }
        // console.log("data is "+projectData);
        console.log("Posting");
        console.log("data is " + JSON.stringify(projectData));
        $.ajax({
            type: "POST",
            url: 'php/api/project/update/' + $scope.projectDetails.projectId,
            data: JSON.stringify(projectData),
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,

            success: function (data) {

                alert(data.message);
            },
            error: function (data) {
                alert(data.message);
            }
        });


    }

});


myApp.controller('ViewInvoiceDetails', function ($scope, $http, myService) {

    var data = myService.get();
    var myInvoice = JSON.stringify(data);
    //console.log("invoice is "+myInvoice);
    $scope.invoiceDetail = {
        invoiceNumber: data.invoiceNo,
        quotationNumber: data.quotationId,
        invoiceDate: data.invoiceDate,
        quotationDate: data.quotationDate,
        companyId: data.companyId
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
        method: "GET",
        url: "php/api/quotation/tax/" + qId
    }).then(function mySucces(response) {
        $scope.qData = response.data;
        $scope.qDetails = [];
        var b = [];
        var length = $scope.qData.length;
        //alert("length is "+$scope.qData.length);

        for (var i = 0; i < length; i++) {
            b.push({
                'quotationId': $scope.qData[i].QuotationId,
                'quotationTitle': $scope.qData[i].QuotationTitle,
                'dateOfQuotation': $scope.qData[i].DateOfQuotation,
                'subject': $scope.qData[i].Subject,
                'companyId': $scope.qData[i].CompanyId,
                'refNo': $scope.qData[i].RefNo,
                'title': $scope.qData[i].Title,
                'description': $scope.qData[i].Description,
                'unitRate': $scope.qData[i].UnitRate,
                'amount': $scope.qData[i].Amount,
                'quantity': $scope.qData[i].Quantity,
                'taxName': $scope.qData[i].TaxName,
                'taxPercentage': $scope.qData[i].TaxPercentage,
                'taxAmount': $scope.qData[i].TaxAmount
            });
            $scope.qDetails = b;
        }
        $scope.qDetails;
        //console.log("aaaaaaaaa "+JSON.stringify($scope.qDetails));
    }, function myError(response) {
        $scope.error = response.statusText;
    });

    /*$scope.roundingOff="10";
     $scope.grandTotal="15000";*/
    $http({
        method: "GET",
        url: "php/api/invoice/tax/" + iId
    }).then(function mySucces(response) {
        $scope.iData = response.data;
        $scope.iDetails = [];
        var b = [];
        var length = $scope.iData.length;
        //alert("length is "+$scope.qData.length);
        $scope.getTotalAmount = function () {
            var total = 0;
            var amount313 = 0;
            for (var i = 0; i < $scope.iData.length; i++) {
                var amount313 = $scope.iData[0].TotalAmount;
                total = amount313;
            }
            console.log("totalAmount is" + total);
            return total;
        }
        $scope.getTotalRoundingOffFactor = function () {
            var total = 0;
            var amount313 = 0;
            for (var i = 0; i < $scope.iData.length; i++) {
                var amount313 = $scope.iData[0].RoundingOffFactor;
                total = amount313;
            }
            console.log("totalAmount is" + total);
            return total;
        }
        $scope.getTotalGrandTotal = function () {
            var total = 0;
            var amount313 = 0;
            for (var i = 0; i < $scope.iData.length; i++) {
                var amount313 = $scope.iData[0].GrandTotal;
                total = amount313;
            }
            console.log("totalAmount is" + total);
            return total;
        }

        for (var i = 0; i < length; i++) {
            b.push({
                'totalAmount': $scope.iData[i].TotalAmount,
                'roundingOffFactor': $scope.iData[i].RoundingOffFactor,
                'grandTotal': $scope.iData[i].GrandTotal
            });
            $scope.iDetails = b;
        }
        $scope.iDetails;
        //console.log("aaaaaaaaa "+JSON.stringify($scope.qDetails));
    }, function myError(response) {
        $scope.error = response.statusText;
    });


    $http({
        method: "GET",
        url: "php/api/workorder/" + qId + "/" + cId
    }).then(function mySucces(response) {
        $scope.wData = response.data;
        $scope.wDetails = [];
        var b = [];
        var length = $scope.wData.length;
        //alert("length is "+$scope.qData.length);
        for (var i = 0; i < length; i++) {
            b.push({
                'workOrderNo': $scope.wData[i].WorkOrderNo,
                'creationDate': $scope.wData[i].CreationDate
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


myApp.controller('QuotationFollowupHistoryController', function ($scope, $http,AppService) {
    $scope.projects = [];
    var project = [];

    AppService.getAllProjects($http,$scope.projects);
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

        console.log("changed"+projectId);
        AppService.getAllQuotationOfProject($http,$scope.quotations,projectId);
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

    $scope.selectQuotation = function () {
        //  console.log("quotation id is "+$scope.quotationID.id);
        $scope.followups = [];
        var followup = [];
        $http.get("php/api/quotation/followup/" + $scope.quotationID.id).then(function (response) {
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

    AppService.getAllProjects($http, $scope.projects);

    $scope.selectProject = function () {
        $scope.invoicess = [];
        AppService.getAllInvoicesOfProject($http, $scope.invoicess, $scope.selectedProjectId);
    }

    $scope.show = function () {

        $http.post("php/api/invoice/followup/" + $scope.selectedInvoiceId, null)
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

myApp.controller('SiteTrackingFollowupHistoryController', function ($scope, $http,AppService) {

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
    $scope.projectName=$stateParams.projectName;
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
        if(response.data.status!="Successful"){
            alert("Error Occurred while fetching quoation data");
            return;
        }
        var qData = response.data.message;
        $scope.qDetails = [];

        $scope.totalAmount=0;
        for (var i = 0; i < qData.length; i++) {
            $scope.totalAmount =$scope.totalAmount+ parseInt(qData[i].Amount);

        }
        console.log("totalAmount is" + $scope.totalAmount);

        $scope.qDetails=[];
        for (var i = 0; i < qData.length; i++) {
            $scope.qDetails.push({
                'quotationId': qData[i].QuotationId,
                'quotationTitle': qData[i].QuotationTitle,
                'dateOfQuotation':qData[i].DateOfQuotation,
                'subject': qData[i].Subject,
                'companyId': qData[i].CompanyId,
                'refNo': qData[i].RefNo,
                'title': qData[i].Title,
                'description': qData[i].Description,
                'unitRate': qData[i].UnitRate,
                'amount': qData[i].Amount,
                'quantity': qData[i].Quantity,
                'detailNo': qData[i].DetailNo,
                unit:qData[i].Unit
            });

        }

        //console.log("aaaaaaaaa "+JSON.stringify($scope.qDetails));
    }, function myError(response) {
        $scope.error = response.statusText;
    });

    $http({
        method: "GET",
        url: "php/api/quotation/taxDetails/" + qId
    }).then(function mySucces(response) {
        if(response.data.status!="Successful"){
            alert("Error Occurred while getting tax details");
            return;
        }

        var qtData = response.data.message;
        $scope.qTaxDetails = [];
        $scope.TotalTax=0;
        for (var i = 0; i < qtData.length; i++) {
            $scope.TotalTax =$scope.TotalTax  +parseInt(qtData[i].TaxAmount);

        }
        console.log("total TaxAmount is" + $scope.TotalTax);
        $scope.qTaxDetails=[];
        for (var i = 0; i < length; i++) {
            var taxApplicableTo='All';
            if(qtData[i].DetailsNo.length>0){
                taxApplicableTo="( Item No ";
                for(var j=0; j<qtData[i].DetailsNo.length;j++){
                    if(j+1==qtData[i].DetailsNo.length)
                        taxApplicableTo=taxApplicableTo+qtData[i].DetailsNo[j]+" )";
                    else
                        taxApplicableTo=taxApplicableTo+qtData[i].DetailsNo[j]+",";
                }

            }

            $scope.qTaxDetails.push({
                'quotationId': qtData[i].QuotationId,
                'taxId': qtData[i].TaxID,
                'taxName': qtData[i].TaxName,
                'taxPercentage':qtData[i].TaxPercentage,
                'taxAmount': qtData[i].TaxAmount,
                taxApplicableTo :taxApplicableTo
            });

        }

        console.log("qTaxDetails is " + JSON.stringify($scope.qTaxDetails));
    }, function myError(response) {
        $scope.error = response.statusText;
    });



});

myApp.controller('PaymentHistoryController',function($scope,$http,AppService){

  console.log("in payment history controller");
$scope.Projects = [];
 $scope.Invoices = [];
  $scope.InvoiceDetails = [];
    $scope.sortType= 'amountPaid'; // set the default sort type
    $scope.sortReverse  = false;
    var project = [];
AppService.getAllProjects($http,$scope.Projects);
          //$http.get("php/api/projects").then(function(response) {
          //      console.log(response.data.length);
          //      if(response.data != null){
          //              for(var i = 0; i<response.data.length ; i++){
          //                          project.push({
          //                                      project_id: response.data[i].ProjectId,
          //                                      project_name: response.data[i].ProjectName
          //                          });
          //              }
          //      }
          //     $scope.Projects = project;
          //     console.log("projects scope is "+JSON.stringify($scope.Projects));
          //  })

        $scope.viewProjectInvoices = function(project){
            $scope.paymentHistoryData=[];
          $scope.Invoices = [];
          var invoice = [];
          console.log("project id is :"+project);

             $http.get("php/api/invoice/project/"+project).then(function(response) {
                console.log(response.data.length);
                if(response.data != null){
                        for(var i = 0; i<response.data.length ; i++){
                                    invoice.push({
                                               invoice_id: response.data[i].InvoiceNo,
                                                invoice_name: response.data[i].InvoiceTitle,
                                                invoice_date :response.data[i].InvoiceDate
                                    });
                        }
                }
               $scope.Invoices = invoice;
               console.log("invoices  scope is "+JSON.stringify($scope.Invoices));
            })
        }

        $scope.getInvoiceDetails = function(invoiceId){
          $scope.paymentHistoryData=[];
            $scope.totalAmtPaid="";
            $scope.totalPayableAmount=0;
          var invoiceDetail=[];
            var totalAmountPaid=0;
            var totalPayableAmt=12000;
          console.log("invoice id is "+invoiceId);
                $http.get("php/api/paymentDetails/Invoice/"+invoiceId).then(function(response) {
                console.log(response.data.length);
                if(response.data != null){
                        for(var i = 0; i<response.data.length ; i++){
                                 invoiceDetail.push({
                                      amountPaid:response.data[i].AmountPaid,
                                      paymentDate:response.data[i].PaymentDate,
                                      recievedBy:response.data[i].FirstName +response.data[i].LastName ,
                                      amountRemaining:"----",
                                      grandTotal:response.data[i].GrandTotal,
                                      paymentMode:response.data[i].InstrumentOfPayment,
                                      bankName:response.data[i].BankName,
                                      branchName:response.data[i].BranchName,
                                      unqiueNo:response.data[i].IDOfInstrument
                                  });
                            totalAmountPaid=totalAmountPaid + parseInt(response.data[i].AmountPaid);

                        }
                    totalPayableAmt=parseInt(response.data[0].GrandTotal);
                }
                    $scope.totalAmtPaid=totalAmountPaid;
                    $scope.totalPayableAmount=totalPayableAmt;
                    console.log("total amount payable="+totalPayableAmt);
                    console.log("total amount paid="+totalAmountPaid);
               $scope.paymentHistoryData = invoiceDetail;
               console.log("paymentHistoryData  scope is "+JSON.stringify($scope.paymentHistoryData));
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
        var date = new Date();

        $scope.errorMessage="";
        $scope.warningMessage="";
        $('#loader').css("display","block");

        var custData = '{"CustomerName":"' + $scope.customerDetails.customer_name + '","Address":"' + $scope.customerDetails.customer_address + '","City":"' + $scope.customerDetails.customer_city + '","State":"' + $scope.customerDetails.customer_state + '","Country":"' + $scope.customerDetails.customer_country + '","EmailId":"' + $scope.customerDetails.customer_emailId + '","Pincode":"' + $scope.customerDetails.customer_pincode + '","Mobileno":"' + $scope.customerDetails.customer_phone + '","Landlineno":"' + $scope.customerDetails.customer_landline + '","FaxNo":"' + $scope.customerDetails.customer_faxNo + '","VATNo":"' + $scope.customerDetails.customer_vatNo + '","CSTNo":"' + $scope.customerDetails.customer_cstNo + '","ServiceTaxNo":"' + $scope.customerDetails.customer_serviceTaxNo + '","PAN":"' + $scope.customerDetails.customer_panNo + '","isDeleted":"0"}';

        $http.post('php/api/customer', custData)
            .success(function (data, status, headers) {
                if (data.status == "Successful") {
                    $('#loader').css("display","block");
                    $scope.postCustData = data;
                    $('#loader').css("display","none");
                    //alert("Customer created Successfully");
                    $scope.warningMessage = "Customer created Successfully";
                    $('#warning').css("display","block");
                    setTimeout(function() {
                            $('#warning').css("display","none");
                    }, 3000);
                } else {
                    //alert(data.message);
                    $('#loader').css("display","block");
                    $('#loading').css("display","none");
                    $scope.errorMessage = data.message;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $('#error').css("display","none");
                    }, 3000);
                }
            })
            .error(function (data, status, header) {
                $('#loader').css("display","block");
                $scope.ResponseDetails = "Data: " + data;
                $('#loading').css("display","none");
                $scope.errorMessage = "Customer not created..";
                $('#error').css("display","block");
                setTimeout(function() {
                    $('#error').css("display","none");
                }, 3000);
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

    $scope.modifyCustomer = function () {
        $custId = $scope.customerDetails.customer_id;
        var custUpdate = '{"CustomerName":"' + $scope.customerDetails.customer_name + '","Address":"' + $scope.customerDetails.customer_address + '","City":"' + $scope.customerDetails.customer_city + '","State":"' + $scope.customerDetails.customer_state + '","Country":"' + $scope.customerDetails.customer_country + '","Mobileno":"' + $scope.customerDetails.customer_phone + '","Landlineno":"' + $scope.customerDetails.customer_landline + '","FaxNo":"' + $scope.customerDetails.customer_faxNo + '","EmailId":"' + $scope.customerDetails.customer_emailId + '","VATNo":"' + $scope.customerDetails.customer_vatNo + '","CSTNo":"' + $scope.customerDetails.customer_cstNo + '","PAN":"' + $scope.customerDetails.customer_panNo + '","ServiceTaxNo":"' + $scope.customerDetails.customer_serviceTaxNo + '"}';
        //  console.log("update data is ::"+custUpdate);
        $http.post('php/api/customer/update/' + $custId, custUpdate)
            .success(function (data, status) {
                if (data.status == "Successful") {
                    alert(data.message);

                } else {
                    alert(data.message);
                }
            })
            .error(function (data, status) {

                alert(data.message);
            });

    }


});




myApp.controller('ReviseQuotation', function (setInfo, $scope, $http) {
    var Name;
    var reviseQuotationData = setInfo.get();
    var qId = reviseQuotationData.QuotationId;

    $http.get("php/api/companyById/" + reviseQuotationData.CompanyId).then(function (response) {
        Name = response.data[0].CompanyName;
        var reviseQuotationData = setInfo.get();
        $scope.Quotation = {
            ProjectName: reviseQuotationData.ProjectName,
            CompanyName: Name,
            Title: reviseQuotationData.QuotationTitle,
            Date: reviseQuotationData.CreationDate,
            Subject: reviseQuotationData.Subject,
            ReferenceNo: reviseQuotationData.RefNo
            /*totalAmount:,
             taxAmount:,
             grandTotal:*/
        };
    })
//console.log("Quotation scope is "+JSON.stringify($scope.Quotation));
    /*$scope.QuotationDetails=[];
     $scope.QuotationDetails.push({title:"Material A",
     description:"Flooring",quantity:10,unit:"sqft",unitrate:1000});
     $scope.QuotationDetails.push({title:"Material B",
     description:"Flooring",quantity:10,unit:"sqft",unitrate:1000});*/

    /* $scope.TaxDetails=[];
     $scope.TaxDetails.push({name:"VAT",
     percentage:"5",amount:1000});
     $scope.reviseData = [];
     var rqd = [];*/


    $http({
        method: "GET",
        url: "php/api/quotation/tax/" + qId
    }).then(function mySucces(response) {
        $scope.qData = response.data;
        $scope.QuotationDetails = [];
        var b = [];
        var length = $scope.qData.length;
        // alert("length is "+$scope.qData.length);
        var totalAmnt = 0;
        var totaltaxAmnt = 0;
        for (var i = 0; i < length; i++) {
            totalAmnt = +totalAmnt + +response.data[i].Amount;
            totaltaxAmnt = +totaltaxAmnt + +response.data[i].TaxAmount;
            b.push({
                'id': response.data[i].QuotationId,
                'title': response.data[i].Title,
                'description': response.data[i].Description,
                'quantity': response.data[i].Quantity,
                'unitRate': response.data[i].UnitRate,
                'amount': response.data[i].Amount,
                'projectId': response.data[i].ProjectId,
                'taxName': response.data[i].TaxName,
                'taxPercentage': response.data[i].TaxPercentage,
                'taxAmount': response.data[i].TaxAmount
            });
            $scope.QuotationDetails = b;
        }
        $scope.TotalAmount = totalAmnt;
        $scope.TotalTaxamount = totaltaxAmnt;
        $scope.Grandtotal = totalAmnt + totaltaxAmnt;
        console.log("total amount is :" + totalAmnt + " tax amount is " + totaltaxAmnt);
        $scope.QuotationDetails;
        console.log("QuotationDetails scope is  " + JSON.stringify($scope.QuotationDetails));
    }, function myError(response) {
        $scope.error = response.statusText;
    });

    /* $http.get("php/api/quotation/"+projId).then(function(response) {
     console.log(response.data.length);
     for(var i = 0; i<response.data.length ; i++){
     rqd.push({
     'id':response.data[i].QuotationId,
     'title':response.data[i].QuotationTitle,
     'date':response.data[i].DateOfQuotation,
     'projName':response.data[i].ProjectName,
     'subject':response.data[i].Subject,
     'companyId':response.data[i].CompanyId,
     'refNo':response.data[i].RefNo,
     'quotationBlob':response.data[i].QuotationBlob
     });
     }
     $scope.reviseData = rqd;
     console.log("revise scope data is "+reviseData);
     //myService.set($scope.reviseData);


     })*/

    /*     $http({
     method : "GET",
     url : "php/api/quotation/tax"+projId
     }).then(function mySucces(response) {
     $scope.qData = response.data;
     $scope.names = [];
     var b = [];
     var length = $scope.qData.length;
     //alert("length is "+$scope.qData.length);
     for(var i = 0;i<length;i++){
     b.push({'id':response.data[i].QuotationId,
     'title':response.data[i].QuotationTitle,
     'projName':response.data[i].ProjectName,
     'subject':response.data[i].Subject,
     'companyId':response.data[i].CompanyId,
     'refNo':response.data[i].RefNo,
     'quotationBlob':response.data[i].QuotationBlob
     });
     $scope.names = b;
     }
     $scope.names;
     console.log("aaaaaaaaa "+JSON.stringify($scope.names));
     }, function myError(response) {
     $scope.myWelcome = response.statusText;
     });*/

    $scope.ModifyQuotation = function () {
        console.log("in modify quot" + qId);
        console.log("Whole scope is  " + JSON.stringify($scope.Quotation));
        var QuotationRevise = {
            Quotation: $scope.Quotation,
            QuotationDetails: $scope.QuotationDetails,
        };

        console.log("Total scope is " + JSON.stringify(QuotationRevise));
    }


});




myApp.controller('ViewTaskController', function (setInfo, $scope, $http, $filter, $rootScope) {

    $scope.today = function(){
        $scope.actualStartDate = new Date();
        $scope.actualEndDate = new Date();
    };

    $scope.today();

    $scope.taskStartDate = function(){
        $scope.taskStart.opened = true;
    };

    $scope.taskStart = {
        opened:false
    };

    $scope.taskEndDate = function(){
        $scope.taskEnd.opened = true;
    };

    $scope.taskEnd = {
        opened:false
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
        $scope.ViewNotes = [];
        var notes = [];

        $scope.ViewNotes.length = 0;
        $http.get("php/api/task/notes/" + task.TaskID).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                notes.push({
                    Note: response.data[i].ConductionNote,
                    AddedBy: response.data[i].firstName + " " + response.data[i].lastName,
                    NoteDate: response.data[i].DateAdded
                });
            }
            $scope.ViewNotes = notes;
            setInfo.set(notes);
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

        var data = '{"CompletionPercentage":"' + $scope.taskCompletionP + '","isCompleted":"' + isCompleted + '","ActualStartDate":"' + actualStart + '","ActualEndDate":"' + actualEnd + '","ConductionNote":"' + $scope.note + '","NoteAddedBy":"1","NoteAdditionDate":"' + noteCreatedDate + '"}';
        console.log("update task data is " + data);

        $.ajax({
            type: "POST",
            url: 'php/api/task/edit/' + taskid,
            data: data,
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,

            success: function (data) {
                $scope.getViewNotes(task);
                console.log($scope.ViewNotes);
                alert("success in task updation " + data);
            },
            error: function (data) {
                alert("error in task updation " + data);
            }
        });
    }
});





myApp.controller('SearchTaskController', function (setInfo, $scope, $http) {


    $scope.tasks = [];
    var task = [];
    $http.get("php/api/task").then(function (response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {

            task.push({
                "TaskID": response.data[i].TaskID,
                "TaskName": response.data[i].TaskName,
                "TaskDescripion": response.data[i].TaskDescripion,
                "ScheduleStartDate": response.data[i].ScheduleStartDate,
                "ScheduleEndDate": response.data[i].ScheduleEndDate,
                "CompletionPercentage": response.data[i].CompletionPercentage,
                "TaskAssignedTo": response.data[i].TaskAssignedTo,
                "isCompleted": response.data[i].isCompleted,
                "CreationDate": response.data[i].CreationDate,
                "CreatedBy": response.data[i].CreatedBy,
                "ActualStartDate": response.data[i].ActualStartDate,
                "AcutalEndDate": response.data[i].AcutalEndDate,
                "UserId": response.data[i].UserId,
                "UserName": response.data[i].firstName + " " + response.data[i].lastName

            });
        }
        $scope.tasks = task;
        $scope.totalItems = $scope.tasks.length;
        $scope.currentPage = 1;
        $scope.tasksPerPage = 5;
        $scope.paginateTasksDetails = function (value) {
            //console.log("In Paginate");
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.tasksPerPage;
            end = begin + $scope.tasksPerPage;
            index = $scope.tasks.indexOf(value);
            //console.log(index);
            return (begin <= index && index < end);
        };
        // setInfo.set($scope.customers);
    })

    $scope.setTask = function (task) {
        setInfo.set(task);
    }

    $scope.deleteTask = function (taskid) {
        console.log("delete task " + taskid);
        $http({
            method: 'GET',
            url: 'php/api/task/delete/' + taskid
        }).then(function successCallback(response) {
            alert("in success :::" + response);
        }, function errorCallback(response) {
            alert("in error ::" + response);
        });
    }

});





myApp.controller('AssignTaskController', function ($scope, $http, AppService, $filter) {

    console.log("in AssignTaskController");
    $scope.users = [];
    AppService.getUsers($scope, $http);

    $scope.assignTask = function () {
        var date = new Date();
        var creationDate = $filter('date')(date, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var startDate = $filter('date')($scope.task.startDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var endDate = $filter('date')($scope.task.endDate, 'yyyy/MM/dd hh:mm:ss', '+0530');

        console.log("startDate " + startDate);
        var Taskdata = '{"TaskName":"' + $scope.task.taskname + '","TaskDescripion":"' + $scope.task.description + '","ScheduleStartDate":"' + startDate + '","ScheduleEndDate":"' + endDate + '","CompletionPercentage":"0","TaskAssignedTo":"' + $scope.task.assignedTo.id + '","isCompleted":"0","CreationDate":"' + creationDate + '"}';
        console.log("Task data is " + Taskdata);
        /* $http.post('php/api/task', Taskdata,config)
         .success(function (data, status) {
         alert("Task has been created Successfuly.. "+status);
         })
         .error(function (data, status) {

         alert("Error in task creation "+$scope.ResponseDetails );
         });*/
        /*
         $http({
         method: 'POST',
         url: 'php/api/task',
         data: Taskdata,
         headers: {'Content-Type': 'application/json'}
         }).success(function (data, status) {
         alert("Task has been created Successfuly.. "+status);
         })
         .error(function (data, status) {
         alert("Error in task creation "+$scope.ResponseDetails );
         });*/

        $.ajax({
            type: "POST",
            url: 'php/api/task',
            data: Taskdata,
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            processData: false,

            success: function (data) {
                alert("success in assign task " + data);

            },
            error: function (data) {
                console.log(data);
                alert("error in task assignment" + data);
            }
        });

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





