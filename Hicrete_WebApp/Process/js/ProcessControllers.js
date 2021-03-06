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
                $rootScope.warningMessage = "File upload started..";
                $('#warning').css("display", "block");
                setTimeout(function () {
                    $('#warning').css("display", "none");
                }, 1000);
                console.log("in upload successs" + status);
            })

            .error(function () {
                $rootScope.errorMessage = "File upload not started..";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);
                console.log("In file upload error");
            });
    }
}]);
/**************************************************************/


myApp.controller('ProcessWidgetController', function ($scope, $http,$rootScope) {

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

});

myApp.controller('ProjectCreationController', function ($scope, $http, $rootScope, $httpParamSerializerJQLike, AppService, $uibModal, $log) {
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

   // $scope.projectManagers = [];
    //AppService.getProjectManagers($http, $scope.projectManagers);
    console.log("In Project Creation Controller");

    $scope.customers = [];
    AppService.getAllCustomers($http, $scope.customers);


    /**Autocomplete start*/
    $scope.noCustomer=false;
    $scope.customerSelected=function($item, $model, $label){
        $scope.projectDetails.customerId=$model.customerId;
        console.log($scope.projectDetails);
    }





    $scope.creteProject = function () {

        var company = '';
        var isTracking = 0;

        $scope = this;

        var companiesInvolved = [];
        for (var i = 0; i < $scope.Companies.length; i++) {
            if ($scope.Companies[i].checkVal) {
                companiesInvolved.push($scope.Companies[i]);
            }

        }
        if (companiesInvolved.length <= 0) {
            $rootScope.errorMessage = "Please Select atleast one company";
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 3000);
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

        if ($scope.projectDetails.projectSource == "Site Tracking") {
            isTracking = 1;
            //open Followup modal
            console.log("In site tracking set");
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',

                controller: function ($scope, $uibModalInstance, $filter, projectData,$rootScope) {
                    // console.log("quotation is "+JSON.stringify(q));
                    AppService.getUsers($scope, $http);
                    console.log("Project Data");
                    console.log(projectData);
                    $scope.ok = function () {

                        var viewValue=new Date( $scope.applicatorDetails.followupdate);
                        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                        $scope.applicatorDetails.followupdate=viewValue.toISOString().substring(0, 10);

                        var FollowupDate = $scope.applicatorDetails.followupdate;
                        var AssignEmployee = $scope.applicatorDetails.followupemployeeId;
                        var FollowupTitle = $scope.applicatorDetails.followTitle;

                        var followupData = {
                            FollowupDate: FollowupDate,
                            AssignEmployee: AssignEmployee,
                            FollowupTitle: FollowupTitle
                        };
                        projectData.followupData = followupData;
                        console.log(projectData);
                        $scope.createProject(projectData);
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        $scope.createProject(projectData);
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.createProject = function (projectData) {
                        console.log("In create project function");
                        console.log(projectData);
                        var data = {
                            operation: "createProject",
                            data: projectData

                        };

                        var config = {
                            params: {
                                data: data
                            }
                        };
                        $('#loader').css("display", "block");
                        $http.post('Process/php/projectFacade.php', null, config)
                            .success(function (data, status, headers) {
                                console.log(data);
                                if (data.status == "Successful") {
                                    $('#loader').css("display", "none");
                                    $rootScope.warningMessage = data.message;
                                    $('#warning').css("display", "block");
                                    setTimeout(function () {
                                        $('#warning').css("display", "none");
                                        window.location = "dashboard.php#/Process/viewProjects";
                                    }, 1000);
                                    $scope.clearForm();
                                }
                                else {
                                    $('#loader').css("display", "none");
                                    $rootScope.errorMessage = data.message;
                                    $('#error').css("display", "block");
                                    setTimeout(function () {
                                        $('#error').css("display", "none");
                                    }, 3000);
                                }
                            })
                            .error(function (data, status, header) {
                                $('#loader').css("display", "none");
                                console.log(data);
                                $rootScope.errorMessage = "Unable to create Project..Please try again";
                                $('#error').css("display", "block");
                                setTimeout(function () {
                                    $('#error').css("display", "none");
                                }, 3000);
                            });
                    }
                    $scope.clearForm = function () {
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
                    }
                },
                resolve: {
                    projectData: function () {
                        return projectData;
                    }
                }

            });

            modalInstance.result.then(function () {
            }, function () {
                $scope.clearForm();
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };

        } else {

            var data = {
                operation: "createProject",
                data: projectData

            };

            var config = {
                params: {
                    data: data
                }
            };

            $('#loader').css("display", "block");
            $http.post('Process/php/projectFacade.php', null, config)
                .success(function (data, status, headers) {
                    console.log(data);
                    if (data.status == "Successful") {
                        $('#loader').css("display", "none");
                        $rootScope.warningMessage = data.message;
                        $('#warning').css("display", "block");
                        setTimeout(function () {
                            $('#warning').css("display", "none");
                            window.location = "dashboard.php#/Process";
                        }, 1000);
                    }
                    else {
                        $('#loader').css("display", "none");
                        $rootScope.errorMessage = data.message;
                        $('#error').css("display", "block");
                        setTimeout(function () {
                            $('#error').css("display", "none");
                        }, 3000);
                    }
                })
                .error(function (data, status, header) {
                    $('#loader').css("display", "none");
                    console.log(data);
                    $rootScope.errorMessage = "Unable to create Project.Please try again";
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                });
        }
    }

    $scope.clearForm = function () {
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
        $scope.formSubmitted = false;
    }
});


myApp.controller('ProjectDetailsController', function ($stateParams, myService, setInfo, $scope, $http, $uibModal, $log, fileUpload, AppService, $rootScope) {

    var detaildata = $stateParams.projectToView;
    var projId = detaildata.project_id;
    $scope.showError = false;
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

    $scope.projectQuotations = [];
    $scope.PaidPaymentDetails = [];
    $scope.projectInvoice = [];
    $scope.projectWorkorders = [];
    $scope.workorderErrorMessage="All Fields are mandatory";
    var data = {
        operation: "getQuotationByProjectId",
        data: projId

    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Process/php/quotationFacade.php", null, config)
        .success(function (data) {
            if (data.status != "Successful") {
                $rootScope.errorMessage = data.message;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
                return;
            }
            for (var i = 0; i < data.message.length; i++) {
                $scope.projectQuotations.push({
                    QuotationTitle: data.message[i].QuotationTitle,
                    QuotationId: data.message[i].QuotationId,
                    CompanyId: data.message[i].companyId,
                    CompanyName: data.message[i].companyName,
                    CreationDate: data.message[i].DateOfQuotation,
                    formattedQuotationDate:AppService.getFormattedDate(data.message[i].DateOfQuotation),
                    ProjectName: data.message[i].ProjectName,
                    ProjectId: data.message[i].ProjectId,
                    Subject: data.message[i].Subject,
                    RefNo: data.message[i].RefNo,
                    title: data.message[i].Title,
                    description: data.message[i].Description,
                    isApproved: data.message[i].isApproved,
                    filePath: data.message[i].QuotationBlob
                });
            console.log(data.message[i].DateOfQuotation);
               // $scope.projectQuotations[i].CreationDate=AppService.getFormattedDate($scope.projectQuotations[i].CreationDate);
            }
            myService.set($scope.projectQuotations);
            if ($scope.projectQuotations.length > 0) {
                $scope.loadWorkOrderData(projId);
            }

        })
        .error(function (data) {
            $rootScope.errorMessage = data;
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 3000);
        })


    /*Get Workorder by project id*/
    $scope.loadWorkOrderData = function (projId) {
        var data = {
            operation: "getWorkorderByProjectId",
            data: projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/workorderFacade.php", null, config)
            .success(function (data) {
                if (data.status != "Successful") {
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                    return;
                }

                $scope.projectWorkorders = [];
                for (var i = 0; i < data.message.length; i++) {
                    $scope.projectWorkorders.push({
                        workOrderNo: data.message[i].WorkOrderNo,
                        workoOrderTitle: data.message[i].WorkOrderName,
                        receivedDate: AppService.getFormattedDate(data.message[i].ReceivedDate),
                        quotationTitle: data.message[i].QuotationTitle,
                        quotationId: data.message[i].QuotationId,
                        creationDate: data.message[i].CreationDate,
                        dateOfQuotation: data.message[i].DateOfQuotation,
                        refNo: data.message[i].RefNo,
                        filePath: data.message[i].WorkOrderBlob

                    });
                }
                myService.set($scope.projectWorkorders);
                if ($scope.projectWorkorders.length > 0) {
                    $scope.loadInvoiceData(projId);
                }

            })
            .error(function (data) {
                $rootScope.errorMessage = data;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });


    }

    /*Get Invoices by project id*/
    $scope.loadInvoiceData = function (projId) {
        var data = {
            operation: "getInvoicesByProjectId",
            data: projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/InvoiceFacade.php", null, config)
            .success(function (data) {
                if (data.status != "Successful") {
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                    return;
                }

                for (var i = 0; i < data.message.length; i++) {
                    $scope.projectInvoice.push({
                        invoiceNo: data.message[i].InvoiceNo,
                        quotationId: data.message[i].QuotationId,
                        invoiceDate:data.message[i].InvoiceDate,
                        formattedInvoiceDate:AppService.getFormattedDate(data.message[i].InvoiceDate),
                        invoiceTitle: data.message[i].InvoiceTitle,
                        totalAmount: data.message[i].TotalAmount,
                        invoiceBLOB: data.message[i].InvoiceBLOB,
                        isPaymentRetention: data.message[i].isPaymentRetention,
                        CreatedBy: data.message[i].CreatedBy,
                        quotationTitle: data.message[i].QuotationTitle,
                        quotationDate:AppService.getFormattedDate( data.message[i].DateOfQuotation),
                        refNo: data.message[i].RefNo,
                        companyId: data.message[i].CompanyId,
                        contactPerson: data.message[i].ContactPerson,
                        PurchasersVATNo: data.message[i].PurchasersVATNo,
                        pan: data.message[i].PAN,
                        grandTotal: data.message[i].GrandTotal,
                        roundOff: data.message[i].RoundingOffFactor,
                        workOrderNo: data.message[i].WorkOrderNo,
                        workOrderDate: AppService.getFormattedDate(data.message[i].ReceivedDate),
                        workorderName:data.message[i].WorkOrderName
                    });
                }


                myService.set($scope.projectInvoice);
                if ($scope.projectInvoice.length > 0) {
                    $scope.loadPaymentData(projId);
                }

            })
            .error(function (data) {
                $rootScope.errorMessage = data;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });


    }


    $scope.loadPaymentData = function (projId) {
        console.log(projId);
        var data = {
            operation: "getPaymentPaidAndTotalAmount",
            data: projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/ProjectPaymentFacade.php", null, config)
            .success(function (data) {
                if (data.status != "Successful") {
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                    return;
                }

                for (var i = 0; i < data.message.length; i++) {
                    $scope.PaidPaymentDetails.push({
                        invoiceNo: data.message[i].InvoiceNo,
                        amountPaid: data.message[i].AmountPaid,
                        totalAmount: data.message[i].ProjectAmount,
                        invoiceTitle: data.message[i].InvoiceTitle
                    });
                }

            })
            .error(function (data) {
                $rootScope.errorMessage = data;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });

    }

    $scope.openInNewWindow = function (filePath) {
        window.open(filePath, '_blank');
    }


    $scope.checkAvailability = function (filePath) {

        if (filePath === null || filePath === undefined) {

            return false;
        } else if (filePath.trim() === '') {

            return false;
        }

        return true;
    }

    $scope.isQuotationApproaved = function (isApproaved) {

        if (isApproaved == null || isApproaved == undefined) {
            return true;
        }
        if (isApproaved === '0')
            return true;
        if (isApproaved == '1')
            return false;

        if (isApproaved.trim() == '')
            return true;

        return true;
    }


    $scope.workorder = {
        projId: $scope.projDetailsData.projectId,
        //porjName: proj.project_name,
        //quotationId: projDetailsData.QuotationId
    };
    console.log("final scope is ");
    console.log($scope.workorder);

    $scope.workOrderDate = function(){
        $scope.workOrder.opened = true;
    };

    $scope.workOrder = {
        opened:false
    };

    $scope.createWorkorder = function () {

        if ($scope.workOrderForm.$invalid) {
            $scope.workorderErrorMessage="All Fields are mandatory";
            $scope.showError = true;
            return;
        }
        $scope.showError = false;
        console.log("IN");
        console.log("company id is :" + JSON.stringify($scope.CompanyName));
        var uploadQuotationLocation = "upload/Workorders/";
        var fileName = uploadQuotationLocation + $scope.myFile.name;

        var viewValue=new Date($scope.workorder.date);
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
        $scope.workorder.date=viewValue.toISOString().substring(0, 10);

        var workorderData = {
            ProjectId: $scope.workorder.projId,
            WorkOrderName: $scope.workorder.title,
            ReceivedDate: $scope.workorder.date,
            WorkOrderBlob: fileName,
            CompanyId: $scope.workOrderDetails.CompanyId,
            QuotationId: $scope.workOrderDetails.QuotationId,
            workOrderNumber: $scope.workorder.number
        };
        console.log("workorder data is ");
        console.log(workorderData);
        var data = {
            operation: "createWorkorder",
            data: workorderData

        };

        var config = {
            params: {
                data: data
            }
        };

        var data1 = {
            operation: "isWorkorderAlreadyUploaded",
            workorderBlob:fileName

        };

        var config1 = {
            params: {
                data: data1
            }
        };

        $http.post("Process/php/workorderFacade.php",null,config1)
            .success(function (data) {
                if (data.status == "Successful") {
                    ///Upload Workorder
                    var fd = new FormData();
                    fd.append('file', $scope.myFile);
                    $http.post("Process/php/uploadWorkorder.php", fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                        .success(function (data) {
                            if (data.status == "Successful") {
                                console.log("Upload Successful");
                                ////Create Workorder
                                $http.post("Process/php/workorderFacade.php", null, config)
                                    .success(function (data) {
                                        console.log(data);

                                        if (data.status == "Successful") {

                                            $rootScope.warningMessage = "Workorder Created Successfully";
                                            $('#warning').css('display', 'block');
                                            setTimeout(function () {
                                                $('#warning').css('display', 'none');
                                            }, 3000);
                                            $scope.workorder = {};
                                            $('#viewDetails').modal('hide');
                                            $scope.loadWorkOrderData(projId);
                                        } else {
                                            $scope.showError = true;
                                            $scope.workorderErrorMessage=data.message;
                                        }
                                    })
                                    .error(function (data) {
                                        $scope.showError = true;
                                        $scope.workorderErrorMessage="Error in Workorder Creation:"+data;

                                    })
                                //End Create Workorder
                            } else {
                                $scope.showError = true;
                                $scope.workorderErrorMessage=data.message;
                            }
                        })
                        .error(function () {
                            $scope.showError = true;
                            $scope.workorderErrorMessage="Something went wrong can not upload workorder";
                        });
                    //End Upload Workorder

                } else {
                    $scope.showError = true;
                    $scope.workorderErrorMessage="Workorder with same name already uploaded..Please change the name of workorder document";
                }

            })
            .error(function () {
                $scope.showError = true;
                $scope.workorderErrorMessage="Something went wrong can not check for already uploaded workorder";

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

    $scope.scheduleFollowup = function (size, q, type) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Applicator/html/paymentFollowup.html',

            controller: function ($scope, $uibModalInstance, $rootScope, $http) {
                // console.log("quotation is "+JSON.stringify(q));
                AppService.getUsers($scope, $http);

                $scope.openFollowDate = function(){
                    $scope.followup.opened = true;
                };

                $scope.followup = {
                    opened:false
                };


                $scope.ok = function () {

                    // ApplicatorService.savePaymentDetails($scope, $http, paymentDetails);
                    var viewValue=new Date($scope.applicatorDetails.followupdate);
                    viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                    $scope.applicatorDetails.followupdate=viewValue.toISOString().substring(0, 10);

                    var FollowupDate = $scope.applicatorDetails.followupdate;
                    var AssignEmployee = $scope.applicatorDetails.followupemployeeId;
                    var FollowupTitle = $scope.applicatorDetails.followTitle;

                    var followupData = {
                        FollowupDate: FollowupDate,
                        AssignEmployee: AssignEmployee,
                        FollowupTitle: FollowupTitle
                    };
                    var data = {};
                    if (type === "invoice") {
                        data = {
                            operation: "CreatePaymentFollowup",
                            id: q.invoiceNo,
                            data: followupData
                        };

                    } else {
                        data = {
                            operation: "CreateQuotationFollowup",
                            id: q.QuotationId,
                            data: followupData

                        };
                    }

                    var config = {
                        params: {
                            data: data
                        }
                    };
                    $('#loader').css("display", "block");
                    $http.post('Process/php/followupFacade.php', null, config)
                        .success(function (data, status, headers) {
                            console.log(data);

                            if (data.status == "Successful") {
                                //$scope.PostDataResponse = data;
                                $('#loader').css("display", "none");
                                $rootScope.warningMessage = "Followup Created Successfully";
                                $('#warning').css("display", "block");
                            }
                            else {
                                $rootScope.errorMessage = data.message;
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
                            $rootScope.errorMessage = data;
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
        var data = {
            operation: "closeProject",
            data: projId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php", null, config)
            .success(function (data) {
                $rootScope.warningMessage = data;
                $('#warning').css("display", "block");
                setTimeout(function () {
                    $('#warning').css("display", "none");
                    window.location = "dashboard.php#/Process";
                }, 1000);

            })
            .error(function (data) {

            });

    }

});


myApp.controller('QuotationController', function (fileUpload, $scope, $http, $uibModal, AppService, $stateParams,$rootScope) {
    //alert("in quotation");

    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.taxDetails = [];

    $scope.totalAmnt = 0;
    $scope.QuotationDetails = {
        quotationItemDetails: []
    };
    $scope.currentItemList = [];

    $scope.projects = [];
    AppService.getAllProjects($http, $scope.projects);

    /*Autocomplete start */

    $scope.noProject=false;
    $scope.projectSelected=function($item,$model,$label){
        $scope.QuotationDetails.projectId=$model.id;
    }


    $scope.Companies = [];
    if ($stateParams.projectId !== null || $stateParams.projectId !== undefined) {
        $scope.QuotationDetails.projectId = $stateParams.projectId;
        console.log("Calling");
        AppService.getCompaniesForProject($http, $scope.QuotationDetails.projectId, $scope.Companies);
    }

    $scope.getCompaniesForProject = function () {
        $scope.Companies=[];
        AppService.getCompaniesForProject($http, $scope.QuotationDetails.projectId, $scope.Companies);
    }


    $scope.quotationDate = function () {
        $scope.showQdate.opened = true;
    };

    $scope.showQdate = {
        opened: false
    };

    var totalAmount = 0;
    var remainingTotal = 0;

    Math.round = (function() {
        var originalRound = Math.round;
        return function(number, precision) {
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (originalRound(number * multiplier) / multiplier);
        };
    })();

    $scope.createQuotation = function () {
        var b = [];
        var data = [];
        var projectId = $scope.QuotationDetails.projectId;
        var companyId = $scope.QuotationDetails.companyName.company_id;
        var companyName = $scope.QuotationDetails.companyName.company_name;
        var fileName = "";

        for (var i = 0; i < $scope.noOfRows; i++) {
            b.push({
                'Title': $scope.QuotationDetails.quotationItemDetails[i].quotationItem,
                'Decription': $scope.QuotationDetails.quotationItemDetails[i].quotationDescription,
                'Quantity': $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity,
                'Unit': $scope.QuotationDetails.quotationItemDetails[i].quotationUnit,
                'UnitRate': $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate
            });

        }

        var viewValue=new Date($scope.QuotationDetails.quotationDate);
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
        $scope.QuotationDetails.quotationDate=viewValue.toISOString().substring(0, 10);


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

        if ($scope.myFile != undefined) {
            if ($scope.myFile.name != undefined) {
                var uploadQuotationLocation = "upload/Quotations/";
                fileName = uploadQuotationLocation + $scope.myFile.name;

                var data = {
                    operation: "isQuotationAlreadyUploaded",
                    QuotationBlob: fileName

                };
                var config = {
                    params: {
                        data: data
                    }
                };

                $('#loader').css("display", "block");
                $http.post("Process/php/quotationFacade.php", null, config)
                    .success(function (data) {
                        if (data.status == "Successful") {
                                $scope.postUploadQuotation(QuotationData);

                        } else {
                            $('#loader').css("display", "none");
                            $rootScope.errorMessage = "Quotation File with same name is already uploaded..Please Change the name of file ";
                            console.log($rootScope.errorMessage);
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                $('#error').css("display", "none");
                            }, 3000);
                        }
                    })
                    .error(function (data) {
                        $('#loader').css("display", "none");
                        $rootScope.errorMessage = "Error Occured while Checking uploaded quotation";
                        console.log($rootScope.errorMessage);
                        $('#error').css("display", "block");
                        setTimeout(function () {
                            $('#error').css("display", "none");
                        }, 3000);
                    });
            }

        } else {
            $scope.postQuotationData(QuotationData);
        }
    }


    $scope.postUploadQuotation=function(quotationData){
        var uploadQuotationLocation = "upload/Quotations/";
        fileName = uploadQuotationLocation + $scope.myFile.name;
        quotationData.Quotation.QuotationBlob = fileName;
        var fd = new FormData();
        fd.append('file', $scope.myFile);
        $('#loader').css("display", "block");
        $http.post("Process/php/uploadQuotation.php", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function (data) {

                if (data.status == "Successful") {
                    console.log("Upload Successful");
                    $('#loader').css("display", "none");
                    $scope.postQuotationData(quotationData);
                } else {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    console.log($rootScope.errorMessage);
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                }
            })
            .error(function () {
                $rootScope.errorMessage = "Something went wrong can not upload quotation";
                $('#error').css("display", "block");
            });

    }

    $scope.postQuotationData=function(QuotationData){
        var data = {
            operation: "createQuotation",
            data: QuotationData

        };
        var config = {
            params: {
                data: data
            }
        };


        $('#loader').css("display", "block");
        $http.post("Process/php/quotationFacade.php", null, config)
            .success(function (data) {
                if (data.status == "Successful") {
                    $('#loader').css("display", "none");
                    $rootScope.warningMessage = data.message;
                    console.log($rootScope.warningMessage);
                    $('#warning').css("display", "block");
                    $scope.clearForm();
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);

                } else {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    console.log($rootScope.errorMessage);
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                }
            })
            .error(function (data) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Unable to create Quotation..Please try again";
                console.log($rootScope.errorMessage);
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
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
        $scope.QuotationDetails.quotationItemDetails[index].amount= Math.round($scope.QuotationDetails.quotationItemDetails[index].amount, 2);
    }

    $scope.calculateTotal = function (amount,index) {
        $scope.totalAmnt = 0;
        for (var i = 0; i < $scope.QuotationDetails.quotationItemDetails.length; i++) {
            $scope.totalAmnt = $scope.totalAmnt + $scope.QuotationDetails.quotationItemDetails[i].amount;
        }
        $scope.totalAmnt= Math.round($scope.totalAmnt, 2);

        $scope.reviseTaxAmount(index);

    }


    $scope.removeQuotationItem = function (index) {

        $scope.totalAmnt = $scope.totalAmnt - $scope.QuotationDetails.quotationItemDetails[index].amount;
        $scope.totalAmnt= Math.round($scope.totalAmnt, 2);
        $scope.QuotationDetails.quotationItemDetails.splice(index, 1);//remove item by index


    };

    $scope.removeTaxItem = function (index) {
        $scope.TaxAmnt = $scope.TaxAmnt - $scope.taxDetails[index].amount;
        $scope.taxDetails.splice(index, 1);
        $scope.TaxAmnt= Math.round($scope.TaxAmnt, 2);
    };

    $scope.addTax = function (size) {
        var allTax = false;
        if ($scope.taxSelected <= 0) {
            $scope.taxableAmount = $scope.totalAmnt;
            allTax = true;
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Process/html/AddTax.html',
            controller: function ($scope, $uibModalInstance, amount,$rootScope) {
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
                    $scope.tax.amount= Math.round($scope.tax.amount, 2);
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
            var itemString = "All";
            var itemArray = [];
            if (!allTax) {
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

            $scope.TaxAmnt = 0;

            for (var s = 0; s < $scope.taxDetails.length; s++) {

                $scope.TaxAmnt = $scope.TaxAmnt + $scope.taxDetails[s].amount;
            }
            $scope.TaxAmnt=Math.round($scope.TaxAmnt, 2);

        }, function () {
            console.log("modal Dismiss");
        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        if (allTax)
            $scope.taxableAmount = 0;
    }


    $scope.clearForm = function () {
        $scope.formSubmitted = false;
        $scope.totalAmnt = 0;
        $scope.TaxAmnt = 0;
        ;
        $scope.QuotationDetails = {
            projectId: '',
            quotationTitle: '',
            quotationDate: '',
            quotationSubject: '',
            companyName: '',
            referenceNo: '',
            quotationItemDetails: []
        };
        $scope.currentItemList = [];
        $scope.taxDetails = [];

    }


    $scope.reviseTaxAmount=function(itemNumber){

        $scope.TaxAmnt=0;
        for(var i=0;i<$scope.taxDetails.length;i++){
            if($scope.taxDetails[i].taxApplicableTo=="All"){
                $scope.taxDetails[i].amount=$scope.totalAmnt * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);
            }else{
                var taxableAmount=0;
                for(var j=0;j<$scope.taxDetails[i].taxArray.length;j++){
                    var quotationDetailsNo=$scope.taxDetails[i].taxArray[j]-1;
                    taxableAmount = taxableAmount + $scope.QuotationDetails.quotationItemDetails[quotationDetailsNo].amount;
                }
                $scope.taxDetails[i].amount=taxableAmount * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);
            }
            $scope.TaxAmnt=$scope.TaxAmnt+$scope.taxDetails[i].amount;
        }
        $scope.TaxAmnt=Math.round($scope.TaxAmnt, 2);
    }

});

myApp.controller('InvoiceController', function ($scope, $http, $uibModal, $rootScope, $stateParams) {

    console.log("in add invoice");
    var workDetail = $stateParams.workOrder;
    //console.log("workorder no is "+JSON.stringify(workDetail));
    var qId = workDetail.quotationId;
    //console.log("Quotation id is "+qId);
    $scope.roundingOff = 0;
    var totalAmount = 0;

    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.taxDetails = [];
    $scope.totalAmnt = 0;
    $scope.currentItemList = [];
    $scope.taxDetails = [];
    $scope.roundingOff=0;

    $scope.InvoiceDetails = {
        invoiceItemDetails: [],
        workoOrderNumber: workDetail.workOrderNo,
        quotationNumber: workDetail.quotationId,
        quotationDate: workDetail.dateOfQuotation,
        workOrderDate: workDetail.receivedDate,
        refNo: workDetail.refNo,
        purchaserVatNo: '',
        pan: '',
        contactPerson: ''
    }


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
                $rootScope.errorMessage = data.message;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
                return;
            }

            var qData = data.message;
            $scope.qDetails = [];

            $scope.totalAmnt = 0;
            for (var i = 0; i < qData.length; i++) {
                $scope.InvoiceDetails.invoiceItemDetails.push({
                    'quotationItem': qData[i].Title,
                    'quotationDescription': qData[i].Description,
                    'quotationQuantity': qData[i].Quantity,
                    'quotationUnitRate': parseFloat(qData[i].UnitRate),
                    'amount': parseFloat(qData[i].Amount),
                    'quotationQuantity': parseFloat(qData[i].Quantity),
                    'detailID': qData[i].DetailID,
                    'detailNo': qData[i].DetailNo,
                    quotationUnit: qData[i].Unit
                });
                $scope.totalAmnt = $scope.totalAmnt + parseFloat(qData[i].Amount);
            }
            $scope.calculateGrandTotal();
            console.log("totalAmount is" + $scope.totalAmount);
        }).error(function (data) {

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
                $rootScope.errorMessage = "Error Occurred while getting tax details";
                ;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
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
                    'quotationId': qtData[i].QuotationId,
                    'taxId': qtData[i].TaxID,
                    'taxTitle': qtData[i].TaxName,
                    'taxPercentage': qtData[i].TaxPercentage,
                    'amount': parseFloat(qtData[i].TaxAmount),
                    taxApplicableTo: taxApplicableTo,
                    'taxArray': itemArray
                });
                $scope.TaxAmnt = $scope.TaxAmnt + parseFloat(qtData[i].TaxAmount);

            }
            $scope.calculateGrandTotal();
            console.log($scope.TaxAmnt);
        })
        .error(function (data) {
            $rootScope.errorMessage = data;
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 3000);
        });

    /************************************/
    $scope.invoiceDate = function () {
        $scope.showQdate.opened = true;
    };

    $scope.showQdate = {
        opened: false
    };

    var totalAmount = 0;
    var remainingTotal = 0;

    Math.round = (function() {
        var originalRound = Math.round;
        return function(number, precision) {
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (originalRound(number * multiplier) / multiplier);
        };
    })();

    $scope.createInvoice = function () {

        console.log("in createInvoice");
        var totalAmount = parseFloat($scope.totalAmnt) + parseFloat($scope.TaxAmnt);
        var grandTotal = (+totalAmount ) + +$scope.roundingOff;

        var viewValue=new Date($scope.InvoiceDetails.invoiceDate);
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
        $scope.InvoiceDetails.invoiceDate=viewValue.toISOString().substring(0, 10);

        var invoiceData = {
            "InvoiceNo": $scope.InvoiceDetails.invoiceNumber,
            "InvoiceTitle": $scope.InvoiceDetails.invoiceTitle,
            "TotalAmount": totalAmount,
            "RoundingOffFactor": $scope.roundingOff,
            "GrandTotal": grandTotal,
            "InvoiceBLOB": " ",
            "PurchasersVATNo": $scope.InvoiceDetails.purchaserVatNo,
            "PAN": $scope.InvoiceDetails.pan,
            "QuotationId": $scope.InvoiceDetails.quotationNumber,
            "ContactPerson": $scope.InvoiceDetails.contactPerson,
            "InvoiceDate": $scope.InvoiceDetails.invoiceDate,
        }


        taxData = $scope.taxDetails;
        var invoiceDetails = $scope.InvoiceDetails.invoiceItemDetails;
        var InvoiceData = {
            Invoice: invoiceData,
            Details: invoiceDetails,
            taxDetails: taxData
        };

        console.log(InvoiceData);
        $scope.InvoiceData = InvoiceData;
        console.log($scope.myFile);

        var data = {
            operation: "createInvoice",
            data: InvoiceData

        };
        var config = {
            params: {
                data: data
            }
        };


        if ($scope.myFile != undefined) {
            if ($scope.myFile.name != undefined) {
                var uploadQuotationLocation = "upload/Invoices/";
                fileName = uploadQuotationLocation + $scope.myFile.name;
                InvoiceData.Invoice.InvoiceBLOB = fileName;
                console.log(InvoiceData);
                var fd = new FormData();
                fd.append('file', $scope.myFile);
                $('#loader').css("display", "block");

                var data = {
                    operation: "isInvoiceAlreadyUploaded",
                    InvoiceBlob:InvoiceData.Invoice.InvoiceBLOB
                };
                var config1 = {
                    params: {
                        data: data
                    }
                };
                $http.post("Process/php/InvoiceFacade.php", null, config1)
                    .success(function (data) {

                        if (data.status == "Successful") {
                            $scope.postUploadInvoice(fd,config);

                        } else {
                            $('#loader').css("display", "none");
                            $rootScope.errorMessage = "Invoice document is already uploaded with  same file name..Please change file Name";
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                $('#error').css("display", "none");
                            }, 3000);
                        }

                    })
                    .error(function (data) {
                        $('#loader').css("display", "none");
                        $rootScope.errorMessage = "Error :" + data;
                        console.log($rootScope.errorMessage);
                        $('#error').css("display", "block");
                        setTimeout(function () {
                            $('#error').css("display", "none");
                        }, 2000);
                    });
            }

        } else {
            $scope.postInvoiceData(config);
        }
    };

    $scope.postUploadInvoice=function(fd,config){
        $http.post("Process/php/uploadInvoice.php", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function (data) {
                if (data.status == "Successful") {
                    console.log("Upload Successful");
                    $scope.postInvoiceData(config);
                } else {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                }
            })
            .error(function () {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Something went wrong can not upload Invoice";
                $('#error').css("display", "block");
            });

    }

    $scope.postInvoiceData=function(config) {
        $('#loader').css("display", "block");
        $http.post("Process/php/InvoiceFacade.php", null, config)
            .success(function (data) {

                if (data.status == "Successful") {

                    $('#loader').css("display", "none");
                    $rootScope.warningMessage = "Invoice is Created Successfully...'";
                    console.log($rootScope.warningMessage);
                    $('#warning').css("display", "block");
                    //$scope.clearForm();
                    setTimeout(function () {
                        $('#warning').css("display", "none");

                    }, 3000);

                } else {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                }

            })
            .error(function (data) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Error :" + data;
                console.log($rootScope.errorMessage);
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 2000);
            });

    }

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

        $scope.totalAmnt = $scope.totalAmnt - $scope.InvoiceDetails.invoiceItemDetails[index].amount;
        $scope.InvoiceDetails.invoiceItemDetails.splice(index, 1); //remove item by index
        $scope.totalAmnt=Math.round($scope.totalAmnt, 2);
    };

    $scope.removeInvoiceTaxItem = function (index) {
        $scope.TaxAmnt = $scope.TaxAmnt - $scope.taxDetails[index].amount;
        $scope.taxDetails.splice(index, 1);
        $scope.TaxAmnt=Math.round($scope.TaxAmnt, 2);
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
        $scope.InvoiceDetails.invoiceItemDetails[index].amount = $scope.InvoiceDetails.invoiceItemDetails[index].quotationQuantity * $scope.InvoiceDetails.invoiceItemDetails[index].quotationUnitRate;
        $scope.InvoiceDetails.invoiceItemDetails[index].amount=Math.round($scope.InvoiceDetails.invoiceItemDetails[index].amount, 2);
        console.log("amount is " + $scope.InvoiceDetails.invoiceItemDetails[index].amount);
    }


    $scope.calculateTotal = function (amount) {

        $scope.totalAmnt = 0;
        for (var i = 0; i < $scope.InvoiceDetails.invoiceItemDetails.length; i++) {
            $scope.totalAmnt = $scope.totalAmnt + $scope.InvoiceDetails.invoiceItemDetails[i].amount;
        }
        $scope.totalAmnt=Math.round($scope.totalAmnt, 2);
        $scope.reviseTaxAmount();
        $scope.calculateGrandTotal()
    }

   $scope.calculateGrandTotal=function(){
       $scope.totalAmount=$scope.totalAmnt + $scope.TaxAmnt +parseFloat($scope.roundingOff);
       $scope.totalAmount=Math.round($scope.totalAmount, 2);
   }


    $scope.addTax = function (size) {
        var allTax = false;
        if ($scope.taxSelected <= 0) {
            $scope.taxableAmount = $scope.totalAmnt;
            allTax = true;
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Process/html/AddTax.html',
            controller: function ($scope, $uibModalInstance, amount,$rootScope) {
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
                    $scope.tax.amount=Math.round($scope.tax.amount, 2);
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
            var itemString = "All";
            var itemArray = [];
            if (!allTax) {
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

            $scope.TaxAmnt = 0;

            for (var s = 0; s < $scope.taxDetails.length; s++) {

                $scope.TaxAmnt = $scope.TaxAmnt + $scope.taxDetails[s].amount;
            }
            $scope.TaxAmnt=Math.round($scope.TaxAmnt, 2);
            $scope.calculateGrandTotal();

        }, function () {
            console.log("modal Dismiss");
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        if (allTax)
            $scope.taxableAmount = 0;


    }

    $scope.reviseTaxAmount=function(){

        $scope.TaxAmnt=0;
        for(var i=0;i<$scope.taxDetails.length;i++){
            if($scope.taxDetails[i].taxApplicableTo=="All"){
                $scope.taxDetails[i].amount=$scope.totalAmnt * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);
            }else{
                var taxableAmount=0;
                for(var j=0;j<$scope.taxDetails[i].taxArray.length;j++){
                    var quotationDetailsNo=$scope.taxDetails[i].taxArray[j]-1;
                    taxableAmount = taxableAmount + $scope.InvoiceDetails.invoiceItemDetails[quotationDetailsNo].amount;
                }
                $scope.taxDetails[i].amount=taxableAmount * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);

            }
            $scope.TaxAmnt=$scope.TaxAmnt+$scope.taxDetails[i].amount;
        }
        $scope.TaxAmnt=Math.round($scope.TaxAmnt, 2);
    }


    //$scope.CreateInvoiceDoc = function () {
    //    // console.log("in createInvoice DOc generation");
    //    var d1 = $filter('date')($scope.InvoiceDetails.invoiceDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
    //    var d2 = $filter('date')($scope.InvoiceDetails.quotationDate, 'yyyy/MM/dd', '+0530');
    //    var d3 = $filter('date')($scope.InvoiceDetails.workOrderDate, 'yyyy/MM/dd', '+0530');
    //    //var grandTotal = (+$scope.totalAmnt + +$scope.TaxAmnt) - +$scope.roundingOff;
    //    var totalAt = $scope.totalAmnt;
    //    var totalTat = $scope.TaxAmnt;
    //    var totalAmount = +totalAt + +totalTat;
    //    var roundingOff = $scope.roundingOff;
    //    var grandTotal = +totalAmount - +roundingOff;
    //    /* var invoicData = '{"InvoiceNo":"'+$scope.InvoiceDetails.invoiceNumber+'","InvoiceTitle":"Invoice Title","TotalAmount":"1000","RoundingOffFactor":"10","GrandTotal":"1000","InvoiceBLOB":" ","isPaymentRetention":"1","PurchasersVATNo":"11","PAN":"123456","CreatedBy":"1","QuotationId":"'+$scope.InvoiceDetails.quotationNumber+'","WorkOrderNumber":"'+$scope.InvoiceDetails.workOrderNumber+'","ContactPerson":"'+$scope.InvoiceDetails.contactPerson+'","InvoiceDate":"'+d1+'","QuotationDate":"'+d2+'","WorkOrderDate":"'+d3+'"';
    //     var b = [];
    //     var data = [];
    //     console.log("row size is "+$scope.noOfRows);
    //     for(var i=0; i<$scope.noOfRows;i++){
    //
    //     // b.push({'Title': $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem, 'Decription': $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription,'Quantity': $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity,'Unit': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit,'UnitRate': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate,'Amount': $scope.InvoiceDetails.invoiceItemDetails[i].amount});
    //     data[i] = '{"DetailNo":"'+i+'","Title":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription+'","Quantity":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity+'","UnitRate":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit+'","Amount":"'+$scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate+'"}';
    //     console.log("data is "+data[i]);
    //     }
    //     var taxDetails =JSON.stringify($scope.taxDetails);
    //     console.log("tax is  data "+taxDetails);
    //
    //     var jsonData = [];
    //     jsonData = ',"Quotation":['+data+']';
    //     var taxData =[];
    //     var taxJson = [];
    //     taxData =JSON.stringify($scope.taxDetails);
    //     taxJson = ', "TaxJson":'+taxData+' }';
    //     var invoiceAllData = invoicData+" "+jsonData+""+taxJson;
    //     //console.log("Final invoice data is "+invoiceAllData);*/
    //    var invoicData = {
    //        "InvoiceNo": $scope.InvoiceDetails.invoiceNumber,
    //        "InvoiceTitle": "Invoice Title",
    //        "TotalAmount": totalAmount,
    //        "RoundingOffFactor": $scope.roundingOff,
    //        "GrandTotal": grandTotal,
    //        "InvoiceBLOB": " ",
    //        "isPaymentRetention": "1",
    //        "PurchasersVATNo": "11",
    //        "PAN": "123456",
    //        "CreatedBy": "1",
    //        "QuotationId": $scope.InvoiceDetails.quotationNumber,
    //        "WorkOrderNumber": $scope.InvoiceDetails.workOrderNumber,
    //        "ContactPerson": $scope.InvoiceDetails.contactPerson,
    //        "InvoiceDate": d1,
    //        "QuotationDate": d2,
    //        "WorkOrderDate": d3
    //    };
    //    //var invoiceAbstract = '{"TaxName":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationItem+'","Description":"'+$scope.InvoiceDetails.invoiceItemDetails.quotationDescription+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'","":"'+$scope.InvoiceDetails.invoiceItemDetails+'"}';
    //    var b = [];
    //    var data = [];
    //    //console.log("data is "+invoicData);
    //    //console.log("noOfRows "+$scope.noOfRows);
    //    for (var i = 0; i < $scope.noOfRows; i++) {
    //
    //        b.push({
    //            'Title': $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem,
    //            'Decription': $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription,
    //            'Quantity': $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity,
    //            'Unit': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit,
    //            'UnitRate': $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate
    //        });
    //        data[i] = '{"DetailNo":"1","Title":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationItem + '","Description":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationDescription + '","Quantity":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationQuantity + '","UnitRate":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnit + '","Amount":"' + $scope.InvoiceDetails.invoiceItemDetails[i].quotationUnitRate + '"}';
    //        //  console.log("data is "+data[i]);
    //    }
    //    var taxDetails = JSON.stringify($scope.taxDetails);
    //    // console.log("tax is  data "+taxDetails);
    //
    //    var jsonData = [];
    //    jsonData = ',"Details":[' + data + ']';
    //    var taxData = [];
    //    var taxJson = [];
    //    taxData = JSON.stringify($scope.taxDetails);
    //    taxJson = ', "taxDetails":' + taxData + ' }';
    //    var invoiceAllData = invoicData + " " + jsonData + "" + taxJson;
    //    //console.log("111 "+invoiceAllData);
    //
    //    var invoiceDetails = $scope.InvoiceDetails.invoiceItemDetails;
    //    //console.log("invoice details is313 "+invoiceDetails);
    //    var taxDetails = $scope.taxDetails;
    //    var InvoiceData = {
    //        Invoice: invoicData,
    //        Details: invoiceDetails,
    //        taxDetails: taxDetails
    //    };
    //    //console.log("doc gen is"+JSON.stringify(InvoiceData));
    //
    //    $.ajax({
    //        type: "POST",
    //        url: 'php/api/GenDoc/Invoice',
    //        data: JSON.stringify(InvoiceData),
    //        dataType: 'json',
    //        cache: false,
    //        contentType: 'application/json',
    //        processData: false,
    //        success: function (data) {
    //            alert("success gen doc invoice " + JSON.stringify(data));
    //
    //        },
    //        error: function (data) {
    //            alert("error in gen doc invoice " + JSON.stringify(data));
    //        }
    //    });
    //
    //
    //};


});




myApp.controller('ModifyInvoiceController', function ($scope, $http, $uibModal, $rootScope, $stateParams) {

    console.log("in Modify invoice");

    var data = $stateParams.InvoiceToModify;
    console.log(data);


    $scope.InvoiceDetails = {
        invoiceNumber: data.invoiceNo,
        refNo: data.refNo,
        invoiceDate: data.invoiceDate,
        quotationDate: data.quotationDate,
        companyId: data.companyId,
        contactPerson: data.contactPerson,
       // grandTotal: data.grandTotal,
        pan: data.pan,
        purchaserVatNo: data.PurchasersVATNo,
        //totalAmount: data.totalAmount,
        workoOrderNumber: data.workOrderNo,
        workOrderDate: data.workOrderDate,
        quotationNumber: data.quotationId,
        invoiceTitle:data.invoiceTitle
    };

    $scope.oldInvoiceNo=data.invoiceNo;
    $scope.invoiceBLOB=data.invoiceBLOB;
    $scope.roundingOff= data.roundOff;
    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.currentItemList = [];
    $scope.taxDetails=[];
    $scope.totalAmount=0;

    $scope.checkAvailability = function () {

        if ($scope.invoiceBLOB === null || $scope.invoiceBLOB === undefined) {

            return false;
        } else if ($scope.invoiceBLOB.trim() === '') {

            return false;
        }

        return true;
    }

    var data = {
        operation: "getInvoiceDetails",
        data: $scope.InvoiceDetails.invoiceNumber

    };
    var config = {
        params: {
            data: data
        }
    };

    $http.post("Process/php/InvoiceFacade.php", null, config)
        .success(function (data) {

            if (data.status != "Successful") {

                $rootScope.errorMessage = "Error Occurred Getting Quotation Data";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
                return;
            }

            var qData = data.message;

            $scope.InvoiceDetails.invoiceItemDetails=[];
            $scope.totalAmnt = 0;
            for (var i = 0; i < qData.length; i++) {
                $scope.InvoiceDetails.invoiceItemDetails.push({
                    quotationItem: qData[i].Title,
                    quotationDescription: qData[i].Description,
                    quotationUnitRate: parseFloat(qData[i].UnitRate),
                    amount: parseFloat(qData[i].Amount),
                    quotationQuantity: parseFloat(qData[i].Quantity),
                    'detailNo': qData[i].DetailNo,
                    quotationUnit: qData[i].unit
                });
                $scope.totalAmnt = $scope.totalAmnt + parseFloat(qData[i].Amount);
            }
            $scope.totalAmnt=Math.round($scope.totalAmnt, 2);
            $scope.totalAmount=$scope.totalAmnt+$scope.TaxAmnt;
            $scope.totalAmount=Math.round($scope.totalAmount, 2);
            console.log("totalAmount is" + $scope.totalAmnt);
        }).error(function (data) {
        $rootScope.errorMessage = data;
        $('#error').css("display", "block");
        setTimeout(function () {
            $('#error').css("display", "none");
        }, 3000);
    });


    data = {
        operation: "getInvoiceTaxDetails",
        data: $scope.InvoiceDetails.invoiceNumber

    };
    config = {
        params: {
            data: data
        }
    };


    $http.post("Process/php/InvoiceFacade.php", null, config)
        .success(function (data) {
            if (data.status != "Successful") {
                //alert("Error Occurred while getting tax details");
                $rootScope.errorMessage= "Error Occurred Getting Tax Details";
                $('#error').css("display","block");
                setTimeout(function() {
                    $('#error').css("display","none");
                }, 3000);
                return;
            }

            var qtData = data.message;
            $scope.qTaxDetails = [];
            $scope.TaxAmnt = 0;
            $scope.taxDetails = [];
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
                    taxTitle: qtData[i].TaxName,
                    taxPercentage: qtData[i].TaxPercentage,
                    amount: parseFloat(qtData[i].TaxAmount),
                    taxApplicableTo: taxApplicableTo,
                    'taxArray': itemArray
                });
                $scope.TaxAmnt = $scope.TaxAmnt + parseFloat(qtData[i].TaxAmount);

            }
            $scope.TaxAmnt=Math.round($scope.TaxAmnt, 2);
            $scope.totalAmount=$scope.totalAmnt+$scope.TaxAmnt;
            $scope.totalAmount=Math.round($scope.totalAmount, 2);
            console.log($scope.TaxAmnt);
        })
        .error(function (data) {
            $rootScope.errorMessage= data;
            $('#error').css("display","block");
            setTimeout(function() {
                $('#error').css("display","none");
            }, 3000);
        });
    /************************************/
    $scope.quotationDate = function () {
        $scope.showQdate.opened = true;
    };

    $scope.showQdate = {
        opened: false
    };

    var totalAmount = 0;
    var remainingTotal = 0;

    Math.round = (function() {
        var originalRound = Math.round;
        return function(number, precision) {
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (originalRound(number * multiplier) / multiplier);
        };
    })();

    $scope.modifyInvoice = function () {

        console.log("in modifyInvoice");
        var totalAmount = parseFloat($scope.totalAmnt) + parseFloat($scope.TaxAmnt);
        var grandTotal = (+totalAmount ) + +$scope.roundingOff;

        var viewValue=new Date($scope.InvoiceDetails.invoiceDate);
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
        $scope.InvoiceDetails.invoiceDate=viewValue.toISOString().substring(0, 10);

        var invoiceData = {
            "InvoiceNo": $scope.InvoiceDetails.invoiceNumber,
            "InvoiceTitle": $scope.InvoiceDetails.invoiceTitle,
            "TotalAmount": totalAmount,
            "RoundingOffFactor": $scope.roundingOff,
            "GrandTotal": grandTotal,
            "InvoiceBLOB": $scope.invoiceBLOB,
            "PurchasersVATNo": $scope.InvoiceDetails.purchaserVatNo,
            "PAN": $scope.InvoiceDetails.pan,
            "QuotationId": $scope.InvoiceDetails.quotationNumber,
            "ContactPerson": $scope.InvoiceDetails.contactPerson,
            "InvoiceDate": $scope.InvoiceDetails.invoiceDate,
            oldInvoiceNo:$scope.oldInvoiceNo
        }


        taxData = $scope.taxDetails;
        var invoiceDetails = $scope.InvoiceDetails.invoiceItemDetails;
        var InvoiceData = {
            Invoice: invoiceData,
            Details: invoiceDetails,
            taxDetails: taxData
        };

        var data = {
            operation: "modifyInvoice",
            data: InvoiceData

        };
        var config = {
            params: {
                data: data
            }
        };

        if ($scope.myFile != undefined) {
            if ($scope.myFile.name != undefined) {
                var uploadQuotationLocation = "upload/Invoices/";
                fileName = uploadQuotationLocation + $scope.myFile.name;
                InvoiceData.Invoice.InvoiceBLOB = fileName;
                console.log(InvoiceData);
                var fd = new FormData();
                fd.append('file', $scope.myFile);
                $('#loader').css("display", "block");

                var data = {
                    operation: "isInvoiceAlreadyUploadedForOtherInvoice",
                    InvoiceNo: InvoiceData.Invoice.InvoiceNo,
                    InvoiceBlob:InvoiceData.Invoice.InvoiceBLOB
                };
                var config1 = {
                    params: {
                        data: data
                    }
                };
                $http.post("Process/php/InvoiceFacade.php", null, config1)
                    .success(function (data) {

                        if (data.status == "Successful") {
                            $scope.postUploadInvoice(fd,config);

                        } else {
                            $('#loader').css("display", "none");
                            $rootScope.errorMessage = "Invoice document is already uploaded with  same file name..Please change file Name";
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                $('#error').css("display", "none");
                            }, 3000);
                        }

                    })
                    .error(function (data) {
                        $('#loader').css("display", "none");
                        $rootScope.errorMessage = "Error :" + data;
                        console.log($rootScope.errorMessage);
                        $('#error').css("display", "block");
                        setTimeout(function () {
                            $('#error').css("display", "none");
                        }, 2000);
                    });
            }

        } else {
            $scope.postInvoiceData(config);
        }
    };

    $scope.postUploadInvoice=function(fd,config){
                    $http.post("Process/php/uploadInvoice.php", fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                        .success(function (data) {
                            if (data.status == "Successful") {
                                console.log("Upload Successful");
                                $scope.postInvoiceData(config);
                            } else {
                                $('#loader').css("display", "none");
                                $rootScope.errorMessage = data.message;
                                $('#error').css("display", "block");
                                setTimeout(function () {
                                    $('#error').css("display", "none");
                                }, 3000);
                            }
                        })
                        .error(function () {
                            $('#loader').css("display", "none");
                            $rootScope.errorMessage = "Something went wrong can not upload Invoice";
                            $('#error').css("display", "block");
                        });

                }

    $scope.postInvoiceData=function(config){
                    $('#loader').css("display", "block");
                    $http.post("Process/php/InvoiceFacade.php", null, config)
                        .success(function (data) {

                            if (data.status == "Successful") {

                                $('#loader').css("display", "none");
                                $rootScope.warningMessage = "Invoice is Modified Successfully...'";
                                console.log($rootScope.warningMessage);
                                $('#warning').css("display", "block");
                                //$scope.clearForm();
                                setTimeout(function () {
                                    $('#warning').css("display", "none");

                                }, 3000);

                            } else {
                                $('#loader').css("display", "none");
                                $rootScope.errorMessage = data.message;
                                $('#error').css("display", "block");
                                setTimeout(function () {
                                    $('#error').css("display", "none");
                                }, 3000);
                            }

                        })
                        .error(function (data) {
                            $('#loader').css("display", "none");
                            $rootScope.errorMessage = "Error :" + data;
                            console.log($rootScope.errorMessage);
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                $('#error').css("display", "none");
                            }, 2000);
                        });
                }

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

    $scope.removeQuotationItem = function (index) {

        $scope.totalAmnt = $scope.totalAmnt - $scope.QuotationDetails.quotationItemDetails[index].amount;
        $scope.QuotationDetails.quotationItemDetails.splice(index, 1); //remove item by index
        $scope.totalAmnt=Math.round($scope.totalAmnt, 2);
    };

    $scope.removeInvoiceItem = function (index) {

        $scope.totalAmnt = $scope.totalAmnt - $scope.InvoiceDetails.invoiceItemDetails[index].amount;
        $scope.InvoiceDetails.invoiceItemDetails.splice(index, 1); //remove item by index
        $scope.totalAmnt=Math.round($scope.totalAmnt, 2);
    };

    $scope.removeInvoiceTaxItem = function (index) {
        $scope.TaxAmnt = $scope.TaxAmnt - $scope.taxDetails[index].amount;
        $scope.taxDetails.splice(index, 1);
        $scope.TaxAmnt=Math.round($scope.TaxAmnt, 2);
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
        $scope.InvoiceDetails.invoiceItemDetails[index].amount = $scope.InvoiceDetails.invoiceItemDetails[index].quotationQuantity * $scope.InvoiceDetails.invoiceItemDetails[index].quotationUnitRate;
        $scope.InvoiceDetails.invoiceItemDetails[index].amount= Math.round($scope.InvoiceDetails.invoiceItemDetails[index].amount, 2);
        console.log("amount is " + $scope.InvoiceDetails.invoiceItemDetails[index].amount);
    }

    $scope.calculateTotal = function (amount) {

        $scope.totalAmnt = 0;
        for (var i = 0; i < $scope.InvoiceDetails.invoiceItemDetails.length; i++) {
            $scope.totalAmnt = $scope.totalAmnt + $scope.InvoiceDetails.invoiceItemDetails[i].amount;
        }
        $scope.totalAmnt= Math.round($scope.totalAmnt, 2);
        $scope.reviseTaxAmount();
        $scope.calculateGrandTotal();
    }

    $scope.calculateGrandTotal=function(){
        $scope.totalAmount=$scope.totalAmnt + $scope.TaxAmnt + parseFloat($scope.roundingOff);
        $scope.totalAmount=Math.round($scope.totalAmount, 2);
    }

    $scope.addTax = function (size) {
        var allTax = false;
        if ($scope.taxSelected <= 0) {
            $scope.taxableAmount = $scope.totalAmnt;
            allTax = true;
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Process/html/AddTax.html',
            controller: function ($scope, $uibModalInstance, amount, $rootScope) {
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
                    $scope.tax.amount= Math.round($scope.tax.amount, 2);
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
            var itemString = "All";
            var itemArray = [];
            if (!allTax) {
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

            $scope.TaxAmnt = 0;
            for (var s = 0; s < $scope.taxDetails.length; s++) {

                $scope.TaxAmnt = $scope.TaxAmnt + $scope.taxDetails[s].amount;
            }
            $scope.TaxAmnt= Math.round($scope.TaxAmnt, 2);
            $scope.calculateGrandTotal();
        }, function () {
            console.log("modal Dismiss");
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        if (allTax)
            $scope.taxableAmount = 0;


    }


    $scope.reviseTaxAmount=function(){

        $scope.TaxAmnt=0;
        for(var i=0;i<$scope.taxDetails.length;i++){
            if($scope.taxDetails[i].taxApplicableTo=="All"){
                $scope.taxDetails[i].amount=$scope.totalAmnt * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);
            }else{
                var taxableAmount=0;
                for(var j=0;j<$scope.taxDetails[i].taxArray.length;j++){
                    var quotationDetailsNo=$scope.taxDetails[i].taxArray[j]-1;
                    taxableAmount = taxableAmount + $scope.InvoiceDetails.invoiceItemDetails[quotationDetailsNo].amount;
                }
                $scope.taxDetails[i].amount=taxableAmount * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);
            }
            $scope.TaxAmnt=$scope.TaxAmnt+$scope.taxDetails[i].amount;
        }
        $scope.TaxAmnt= Math.round($scope.TaxAmnt, 2);
    }

});


    myApp.controller('ProjectPaymentController', function ($scope, $http, $uibModal, $log, $filter, AppService,$rootScope) {
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
    $scope.allPaymentDetails=[];
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

   /*Autocomplet start*/
        $scope.noProject=false;

     $scope.hidePaymentDetails=function(){

         $scope.showPaymentDetails=false;
     }

    $scope.viewProjectPaymentDetails = function ($item, $model, $label) {
        project_id=$model.id;
        $scope.Invoices = [];
        var invoice = [];
        console.log(project_id);
        AppService.getAllInvoicesOfProject($http, $scope.Invoices, project_id);
        AppService.getAmountPaidForAllInvoices(project_id, $scope.allPaymentDetails, $http);
        var data = {
            operation: "getAllPaymentForProject",
            projectId: project_id

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $('#loader').css("display", "block");
        $http.post("Process/php/ProjectPaymentFacade.php", null, config)
            .success(function (data) {

                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    if (data.message != null) {
                        paymentdetails = data.message;
                    }

                    $scope.totalPayableAmount = data.message.total_project_amount;
                    $scope.totalAmtPaid = data.message.total_project_amount_paid;
                    $scope.projectPayment.total_project_amount = data.message.total_project_amount;
                    $scope.previousAmountPaid = data.message.total_project_amount_paid;

                }

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $rootScope.errorMessage = data.message;
                $('#error').css("display", "block");
            });

        $scope.showPaymentDetails = true;

    }

    $scope.getInvoicePayment = function (invoicenumber) {

        for (var i = 0; i < $scope.allPaymentDetails.length; i++) {

            if($scope.allPaymentDetails[i].InvoiceNo==invoicenumber){
                $scope.totalPayableAmount=$scope.allPaymentDetails[i].GrandTotal;
                $scope.totalAmtPaid=$scope.allPaymentDetails[i].AmountPaid;

            }
        }
    }
    $scope.getPendingAmount = function () {
         console.log("In Pending amount function");
        $scope.pendingAmount = parseInt($scope.packageAmount) - parseInt($scope.paymentDetails.amountPaid) - parseInt($scope.previousAmountPaid);
        console.log($scope.pendingAmount);
    }
    $scope.submitPaymentDetails = function (size, paymentDetails, quotation_id) {
        console.log("branch number is ");
        console.log(paymentDetails);
        var iscash = 0;

        if(paymentDetails.paymentDate!=undefined && paymentDetails.paymentDate!==''){
            var viewValue=new Date(paymentDetails.paymentDate);
            viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            paymentDetails.paymentDate=viewValue.toISOString().substring(0, 10);
        }

        var paydate = paymentDetails.paymentDate;
        if (paymentDetails.paymentMode == 'cash') {
            iscash = 1;
            //var data = '{"AmountPaid":"'+paymentDetails.amountPaid+'", "PaymentDate":"'+paydate+'", "IsCashPayment":"'+iscash+'", "PaidTo":"'+paymentDetails.paidTo+'","InstrumentOfPayment":"'+paymentDetails.paymentMode+'"}'
            var data = {
                "InvoiceNo": paymentDetails.InvoiceNo,
                "AmountPaid": paymentDetails.amountPaid,
                "PaymentDate": paydate,
                "IsCashPayment": iscash,
                "PaidTo": paymentDetails.paidTo.id,
                "InstrumentOfPayment": paymentDetails.paymentMode,
                "IDOfInstrument": "",
                "BankName": "",
                "BranchName": "",
                "City": ""
            };
        }
        else {
            var data = {
                "InvoiceNo": paymentDetails.InvoiceNo,
                "AmountPaid": paymentDetails.amountPaid,
                "PaymentDate": paydate,
                "IsCashPayment": iscash,
                "PaidTo": paymentDetails.paidTo.id,
                "InstrumentOfPayment": paymentDetails.paymentMode,
                "IDOfInstrument": paymentDetails.uniqueNumber,
                "BankName": paymentDetails.bankName,
                "BranchName": paymentDetails.branchName,
                "City": paymentDetails.branchCity
            };
        }
        console.log("dta is " + data);

        var data = {
            operation: "saveProjectPayment",
            //projectId: project_id,
            data: data

        };
        var config = {
            params: {
                data: data
            }
        };
        $('#loader').css("display", "block");
        $http.post("Process/php/ProjectPaymentFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");

                }
                //setTimeout(function () {
                //    $('#warning').css("display", "none");
                //    window.location = "dashboard.php#/Process";
                //}, 1000);

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $rootScope.errorMessage = data.message;
                $('#error').css("display", "block");
            });

        $scope.formSubmitted = false;
        console.log($scope.paymentDetails.pendingAmount)
        if ($scope.paymentDetails.pendingAmount == 0) {

            paymentDetails.paymentStatus = 'Yes';
            console.log(paymentDetails);

        }
        else if ($scope.paymentDetails.pendingAmount != 0) {


            paymentDetails.paymentStatus = 'No';

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Applicator/html/paymentFollowup.html',
                controller: function ($scope, $uibModalInstance, paymentDetails, AppService,$rootScope) {
                    AppService.getUsers($scope, $http);
                    $scope.paymentDetails = paymentDetails;
                    $scope.ok = function () {
                        //console.log($scope.paymentDetails);
                        console.log("on Ok click");
                        AppService.schedulePaymentFollowup($http, $scope, $filter, paymentDetails.InvoiceNo,$rootScope);

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

    $scope.ProjectPerPage = 10;
    $scope.currentPage = 1;
    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;

    $scope.searchKeyword = "";
    $scope.isCostCenterAvailable = function (project) {
        if (project.isCostCenterAvailable === "true")
            return false;
        else
            return true;
    }
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
            $('#loader').css("display", "block");
            $http.post('Process/php/projectFacade.php', null, config)
                .success(function (data, status, headers) {
                    console.log("In View Project=");
                    console.log(data);
                    $rootScope.loading = true;

                    $('#loader').css("display", "none");
                    if (data.status == "Successful") {
                        for (var i = 0; i < data.message.length; i++) {
                            project.push({
                                'project_name': data.message[i].ProjectName,
                                'projectId': data.message[i].ProjectId,
                                'project_status': data.message[i].ProjectStatus,
                                'project_manager': data.message[i].ProjectManagerId,
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
                                'projectManagerId': data.message[i].ProjectManagerId,
                                'isCostCenterAvailable': data.message[i].isCostCenterAvailable

                            });
                            //$scope.Projects = b;
                        }

                        $rootScope.projectSearch = project;
                        if ($rootScope.projectSearch.length == 0) {
                            $rootScope.errorMessage = "No Data Found For Search Criteria..";
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                $('#error').css("display", "none");
                            }, 3000);
                            //alert("No Data Found For Search Criteria");
                        }
                    } else {
                        $rootScope.errorMessage = data.message;
                        $('#error').css("display", "block");
                        setTimeout(function () {
                            $('#error').css("display", "none");
                        }, 3000);
                        //alert(data.message);
                    }

                }).error(function (data, status, headers) {
                $rootScope.errorMessage = data.message;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });
            // $http.get("php/api/projects/search/" + $scope.searchBy + "/" + $scope.searchKeyword).then(function (response) {


        } else {
            $rootScope.errorMessage = "Please Select Search By From SelectList..";
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 3000);
            //alert("Please Select Search By From SelectList");
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
                $rootScope.errorMessage = "Something Went wrong";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
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

    $scope.CustomerPerPage = 10;
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
            $('#loader').css("display", "block");
            $http.post("Process/php/customerFacade.php", null, config)
                .success(function (data) {
                    console.log(data);
                    if (data.status == "Successful") {
                        $rootScope.loading = true;
                        $('#loader').css("display", "none");
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
                        $scope.length=$rootScope.customerSearch.length;

                    } else {
                        $rootScope.errorMessage = response.data.message;
                        $('#error').css("display", "block");
                        setTimeout(function () {
                            $('#error').css("display", "none");
                        }, 3000);
                        //alert(response.data.message);
                    }

                })
                .error(function (data, status, headers, config) {
                    $rootScope.errorMessage = "Error occurred..";
                    $('#error').css("display", "block");
                    console.log($rootScope.errorMessage);
                    setTimeout(function () {
                            $('#error').css("display", "none");
                    }, 3000);
                    //alert("Error Occured" + data);
                });
        }
        else {
            $rootScope.errorMessage = "Please select search by list..";
            $('#error').css("display", "block");
            console.log($rootScope.errorMessage);
            setTimeout(function () {
                    $('#error').css("display", "none");
            }, 3000);
            //alert("Please select search by list");
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


myApp.controller('ModifyProjectController', function ($scope, $http, $stateParams, AppService, $rootScope) {

    $scope.customers = [];
    AppService.getAllCustomers($http, $scope.customers);

   // $scope.projectManagers = [];
    //AppService.getProjectManagers($http, $scope.projectManagers);


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
        customerName: $stateParams.projectToModify.customerName
    };
    $scope.autoComplete=function($item,$model,$label,projectDetails){
        projectDetails.customerId=$model.customerId;
        console.log("Modify="+$model.customerId);
    }
    var companiesInvolved;
    $scope.companies = [];
    var data = {
        operation: "getExcludedCompaniesForProject",
        data: $scope.projectDetails.projectId

    };
    var config = {
        params: {
            data: data
        }
    };


    $http.post("Process/php/projectFacade.php", null, config)
        .success(function (data) {

            if (data.status == "Successful") {
                for (var i = 0; i < data.message.length; i++) {
                    $scope.companies.push({
                        checkVal: false,
                        companyId: data.message[i].companyId,
                        companyName: data.message[i].companyName
                    });
                }
            } else {
                //alert("Error Occurred Getting Company Information For This Project");
                $rootScope.errorMessage = "Error Occurred Getting Company Information For This Project";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);

            }
        })
        .error(function (data) {
            console.log(data);
        });


    $scope.modifyProject = function () {
        if ($scope.ProjectInfoForm.$pristine) {
            $rootScope.errorMessage = "Fields are not modified";
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 3000);
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

        $('#loader').css("display", "block");
        $http.post("Process/php/projectFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data.status == "Successful") {
                    $('#loader').css("display", "none");
                    //alert("Customer created Successfully");
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        //window.location.reload(1);
                        window.location = "dashboard.php#/Process/viewProjects";
                    }, 1000);

                    //alert("Project Updated Successfully");
                } else {

                    $('#loader').css("display", "none");
                    //alert("Customer created Successfully");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                        //window.location.reload(1);
                    }, 3000);


                }


            })
            .error(function (data) {
                $('#loader').css("display", "none");
                //alert("Customer created Successfully");
                $rootScope.errorMessage = "Technical error Occured Please contact administrator";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                    //window.location.reload(1);
                }, 3000);
                console.log(data);
            });

    }

});


myApp.controller('ViewInvoiceDetails', function ($scope, $http, $stateParams,$rootScope) {

    var data = $stateParams.InvoiceToView;
    console.log(data);


    $scope.invoiceDetail = {
        invoiceNumber: data.invoiceNo,
        quotationNumber: data.refNo,
        invoiceDate: data.invoiceDate,
        quotationDate: data.quotationDate,
        companyId: data.companyId,
        contactPerson: data.contactPerson,
        grandTotal: data.grandTotal,
        pan: data.pan,
        purchaserVatNo: data.PurchasersVATNo,
        totalAmount: data.totalAmount,
        roundingOff: data.roundOff,
        workOrderNo: data.workOrderNo,
        workOrderDate: data.workOrderDate

    };


    Math.round = (function() {
        var originalRound = Math.round;
        return function(number, precision) {
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (originalRound(number * multiplier) / multiplier);
        };
    })();

    var qId = $scope.invoiceDetail.quotationNumber;
    var iId = $scope.invoiceDetail.invoiceNumber;
    var cId = $scope.invoiceDetail.companyId;

    $scope.InvoiceItemDetails = [];
    $scope.taxDetails = [];

    var data = {
        operation: "getInvoiceDetails",
        data: $scope.invoiceDetail.invoiceNumber

    };
    var config = {
        params: {
            data: data
        }
    };

    $http.post("Process/php/InvoiceFacade.php", null, config)
        .success(function (data) {

            if (data.status != "Successful") {

                $rootScope.errorMessage = "Error Occurred Getting Quotation Data";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
                return;
            }

            var qData = data.message;

            $scope.InvoiceItemDetails = [];
            $scope.totalAmnt = 0;
            for (var i = 0; i < qData.length; i++) {
                $scope.InvoiceItemDetails.push({
                    'title': qData[i].Title,
                    'description': qData[i].Description,
                    'unitRate': parseFloat(qData[i].UnitRate),
                    'amount': parseFloat(qData[i].Amount),
                    'quantity': parseFloat(qData[i].Quantity),
                    'detailNo': qData[i].DetailNo,
                    unit: qData[i].unit
                });
                $scope.totalAmnt = $scope.totalAmnt + parseFloat(qData[i].Amount);
            }
            $scope.totalAmnt= Math.round($scope.totalAmnt, 2);
            console.log("totalAmount is" + $scope.totalAmnt);
        }).error(function (data) {
            $rootScope.errorMessage = data;
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 3000);
    });


    data = {
        operation: "getInvoiceTaxDetails",
        data: $scope.invoiceDetail.invoiceNumber

    };
    config = {
        params: {
            data: data
        }
    };


    $http.post("Process/php/InvoiceFacade.php", null, config)
        .success(function (data) {
            if (data.status != "Successful") {
                //alert("Error Occurred while getting tax details");
                $rootScope.errorMessage= "Error Occurred Getting Tax Details";
                $('#error').css("display","block");
                setTimeout(function() {
                    $('#error').css("display","none");
                }, 3000);
                return;
            }

            var qtData = data.message;
            $scope.qTaxDetails = [];
            $scope.TaxAmnt = 0;
            $scope.taxDetails = [];
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
                    'taxArray': itemArray
                });
                $scope.TaxAmnt = $scope.TaxAmnt + parseFloat(qtData[i].TaxAmount);

            }
            $scope.TaxAmnt= Math.round($scope.TaxAmnt, 2);
            console.log($scope.TaxAmnt);
        })
        .error(function (data) {
            $rootScope.errorMessage= data;
            $('#error').css("display","block");
            setTimeout(function() {
                $('#error').css("display","none");
            }, 3000);
        })

});


myApp.controller('QuotationFollowupHistoryController', function ($scope, $http, AppService,$rootScope) {

    $scope.projects = [];
    var project = [];

    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;
    $scope.followups = [];
    $scope.QuotationHistoryPerPage=10;
    $scope.currentPage=1;
    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.QuotationHistoryPerPage;
        end = begin + $scope.QuotationHistoryPerPage;
        index =  $scope.followups.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    AppService.getAllProjects($http, $scope.projects);
    console.log("in QuotationFollowupHistoryController");

    $scope.noProject=false;
    $scope.selectProject = function ($item, $model, $label) {
        projectId=$model.id;
        $scope.quotations = [];
        var quotation = []
        console.log("changed" + projectId);
        AppService.getAllQuotationOfProject($http, $scope.quotations, projectId);
    }
    $scope.showQuotationHistory = function () {

        var data = {
            operation: "getQuotationFollow",
            quotationId: $scope.selectedQuotationId
        };
        var config = {
            params: {
                data: data
            }
        };
        $('#loader').css("display", "block");
        $http.post('Process/php/followupFacade.php', null, config)
            .success(function (data) {
                console.log("quote Followup");
                console.log(data);
                if (data.status !== "Successful") {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);

                } else {
                    $('#loader').css("display", "none");
                    for (var i = 0; i < data.message.length; i++) {
                        $scope.followups.push({
                            followup_id: data.message[i].FollowupId,
                            followup_date: AppService.getFormattedDate(data.message[i].FollowupDate),
                            followup_title: data.message[i].FollowupTitle,
                            followup_description: data.message[i].Description,
                            followup_conductionDate:AppService.getFormattedDate( data.message[i].ConductDate),
                            followup_by: data.message[i].firstName + " " + data.message[i].lastName
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Could not fetch data";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);

            });
    }
    $scope.selectQuotation = function (quotationId) {
        $scope.followups = [];
        var followup = [];
        console.log("Quotation ID");
        console.log(quotationId);
    }
});

myApp.controller('PaymentFollowupHistoryController', function ($scope, $http, AppService,$rootScope) {

    $scope.projects = [];
    $scope.selectedProjectId = "";
    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = true;
    $scope.PaymentHistoryPerPage=10;
    $scope.currentPage=1;
    $scope.followups = [];
    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.PaymentHistoryPerPage;
        end = begin + $scope.PaymentHistoryPerPage;
        index =  $scope.followups.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    AppService.getAllProjects($http, $scope.projects);
    $scope.noProject=false;
    $scope.selectProject = function ($item, $model, $label) {
        $scope.selectedProjectId=$model.id;
        $scope.invoices = [];
        console.log("In payment followup history");
        AppService.getAllInvoicesOfProject($http, $scope.invoices, $scope.selectedProjectId);
    }

    $scope.show = function () {

        var data = {
            operation: "getInvoiceFollowups",
            invoiceId: $scope.selectedInvoiceId
        };
        var config = {
            params: {
                data: data
            }
        };

        $('#loader').css("display", "block");
        $http.post('Process/php/followupFacade.php', null, config)
            .success(function (data) {
                console.log(data);
                if (data.status != "Successful") {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                } else {
                    $('#loader').css("display", "none");
                    for (var i = 0; i < data.message.length; i++) {
                        $scope.followups.push({
                            followup_id: data.message[i].FollowupId,
                            followup_date:AppService.getFormattedDate( data.message[i].FollowupDate),
                            followup_title: data.message[i].FollowupTitle,
                            followup_description: data.message[i].Description,
                            followup_conductionDate: AppService.getFormattedDate(data.message[i].ConductDate),
                            followup_by: data.message[i].firstName + " " + data.message[i].lastName
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Could not fetch data";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });

    }

});

myApp.controller('SiteTrackingFollowupHistoryController', function ($scope, $http, AppService,$rootScope) {

    $scope.projects = [];
    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;
    AppService.getAllSiteTrackingProjects($http, $scope.projects);
    $scope.followups = [];
    $scope.SiteTrackingHistoryPerPage=1;
    $scope.currentPage=1;
    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.SiteTrackingHistoryPerPage;
        end = begin + $scope.SiteTrackingHistoryPerPage;
        index =  $scope.followups.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };

    $scope.noProject=false;
    $scope.selectProject=function($item,$model,$label){
        $scope.selectedProjectId=$model.id;
    }
    $scope.show = function () {

        //getProjectSiteFollowup
        var data = {
            operation: "getProjectSiteFollowup",
            projectId: $scope.selectedProjectId
        };
        var config = {
            params: {
                data: data
            }
        };

        $('#loader').css("display", "block");
        $http.post("Process/php/projectFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data.status != "Successful") {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                } else {
                    $('#loader').css("display", "none");
                    for (var i = 0; i < data.message.length; i++) {
                        $scope.followups.push({
                            followup_id: data.message[i].FollowupId,
                            followup_date: AppService.getFormattedDate(data.message[i].FollowupDate),
                            followup_title: data.message[i].FollowupTitle,
                            followup_description: data.message[i].Description,
                            followup_conductionDate: AppService.getFormattedDate(data.message[i].ConductDate),
                            followup_by: data.message[i].firstName + " " + data.message[i].lastName
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Could not fetch data";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });
    }

});

myApp.controller('ViewQuotationDetailsController', function ($stateParams, $scope, $http,$rootScope) {
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


    Math.round = (function() {
        var originalRound = Math.round;
        return function(number, precision) {
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (originalRound(number * multiplier) / multiplier);
        };
    })();

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
                
                $rootScope.errorMessage= "Error Occurred Getting Quotation Data";
                $('#error').css("display","block");
                setTimeout(function() {
                    $('#error').css("display","none");
                }, 3000);
                return;
            }
            var qData = data.message;
            $scope.qDetails = [];

            $scope.totalAmount = 0;
            for (var i = 0; i < qData.length; i++) {
                $scope.totalAmount = $scope.totalAmount + parseFloat(qData[i].Amount);

            }
            $scope.totalAmount= Math.round($scope.totalAmount, 2);
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
        }).error(function (data, status, headers, config) {
        $rootScope.errorMessage= data;
        $('#error').css("display","block");
        setTimeout(function() {
            $('#error').css("display","none");
        }, 3000);
    });

    var data = {
        operation: "getQuotationTaxDetails",
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
                $rootScope.errorMessage= "Error Occurred Getting Tax Data";
                $('#error').css("display","block");
                setTimeout(function() {
                    $('#error').css("display","none");
                }, 3000);
                return;
            }

            var qtData = data.message;
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
                $scope.TotalTax = $scope.TotalTax + parseFloat(qtData[i].TaxAmount);
            }
            $scope.TotalTax= Math.round($scope.TotalTax, 2);
        }).error(function (data, status, headers, config) {
        console.log(data.error);
        $rootScope.errorMessage= data;
        $('#error').css("display","block");
        setTimeout(function() {
            $('#error').css("display","none");
        }, 3000);
    });


});

myApp.controller('PaymentHistoryController', function ($scope, $http, AppService,$rootScope) {

    console.log("in payment history controller");
    $scope.Projects = [];
    $scope.Invoices = [];
    $scope.InvoiceDetails = [];
    $scope.sortType = 'amountPaid'; // set the default sort type
    $scope.sortReverse = false;
    var project = [];

    $scope.paymentHistoryPerPage=10;
    $scope.currentPage=1;
    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.paymentHistoryPerPage;
        end = begin + $scope.paymentHistoryPerPage;
        index =  $scope.paymentHistoryData.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };


    AppService.getAllProjects($http, $scope.Projects);


    $scope.viewProjectInvoices = function ($item, $model, $label) {
        //console.log($model);
        project=$model.id;
        $scope.paymentHistoryData = [];
        $scope.Invoices = [];
        var invoice = [];
        console.log("project id is :" + project);
        $scope.viewProjectPayment(project);
        AppService.getAllInvoicesOfProject($http, $scope.Invoices, project);
    }


    $scope.viewProjectPayment = function (project_id) {
        $scope.Invoices = [];
        var invoice = [];
        console.log(project_id);
        var data = {
            operation: "getAllPaymentForProject",
            projectId: project_id

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $('#loader').css("display", "block");
        $http.post("Process/php/ProjectPaymentFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                if (data.status != "sucess") {
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                } else {
                    if (data.message != null) {
                        paymentdetails = data.message;
                    }
                    $scope.totalPayableAmount = data.message.total_project_amount;
                    $scope.totalAmtPaid = data.message.total_project_amount_paid;

                    $scope.previousAmountPaid = data.message.total_project_amount_paid;

                }

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $rootScope.errorMessage = data.message;
                $('#error').css("display", "block");
            });

        $scope.showPaymentDetails = true;

    }


    $scope.getInvoiceDetails = function (invoiceId) {
        $scope.paymentHistoryData = [];
        $scope.totalAmtPaid = "";
        $scope.totalPayableAmount = 0;
        var invoiceDetail = [];
        var totalAmountPaid = 0;
        var totalPayableAmt = 0;
        console.log("invoice id is " + invoiceId);
        AppService.getInvoicePaymentDetails(invoiceId, $scope, $http);

    }

    $scope.getPaymentHistoryData = function (pPaymentHistory) {
        $scope.viewHistory = pPaymentHistory;
    }
});


myApp.controller('CustomerController', function ($scope, $http,$rootScope) {

    $scope.submitted = false;
    $scope.submitted = false;

    $scope.customerDetails = {
        customer_name: "",
        customer_address: "",
        customer_city: "",
        customer_state: "",
        customer_country: "",
        customer_emailId: "",
        customer_landline: "",
        customer_phone: "",
        customer_faxNo: "",
        customer_vatNo: "",
        customer_cstNo: "",
        customer_serviceTaxNo: "",
        customer_panNo: ""
    };
    $scope.createCustomer = function () {
        console.log("Inside create customer");
        console.log($scope.customerDetails);
        var date = new Date();
        
        var data = {
            operation: "addCustomer",
            data: $scope.customerDetails

        };

        var config = {
            params: {
                data: data
            }
        };

        $('#loader').css("display", "block");
        $http.post('Process/php/customerFacade.php', null, config)
            .success(function (data, status, headers) {
                console.log(data);

                if (data.status == "Successful") {
                    $scope.postCustData = data;
                    $('#loader').css("display", "none");
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);

                } else {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                }
            })
            .error(function (data, status, header) {
                $('#loader').css("display", "none");
                console.log(data);
                $scope.ResponseDetails = "Data: " + data;
                $rootScope.errorMessage = "Unable to create Customer.Please try again";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);

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
    $scope.formSubmitted = false;

    $scope.modifyCustomer = function () {
        if ($scope.customerModifyForm.$pristine) {

            $rootScope.errorMessage = "Fields are not modified";
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 1000);
            //alert("Fields are not modified");
            return;
        }

        console.log($scope.customerDetails);
        $custId = $scope.customerDetails.customer_id;
        var custUpdate = '{"CustomerName":"' + $scope.customerDetails.customer_name + '","Address":"' + $scope.customerDetails.customer_address + '","City":"' + $scope.customerDetails.customer_city + '","State":"' + $scope.customerDetails.customer_state + '","Country":"' + $scope.customerDetails.customer_country + '","Mobileno":"' + $scope.customerDetails.customer_phone + '","Landlineno":"' + $scope.customerDetails.customer_landline + '","FaxNo":"' + $scope.customerDetails.customer_faxNo + '","EmailId":"' + $scope.customerDetails.customer_emailId + '","VATNo":"' + $scope.customerDetails.customer_vatNo + '","CSTNo":"' + $scope.customerDetails.customer_cstNo + '","PAN":"' + $scope.customerDetails.customer_panNo + '","ServiceTaxNo":"' + $scope.customerDetails.customer_serviceTaxNo + '"}';

        $('#loader').css("display", "block");

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
                $('#loader').css("display", "none");
                if (data.status == "Successful") {


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


                    $scope.postCustData = data;
                    //alert("Customer created Successfully");
                    console.log(data.message);
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location = "dashboard.php#/Process/Customers";
                    }, 1000);


                } else {

                    $('#loading').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 1000);
                }
            })
            .error(function (data, status, header) {
                console.log(data);
                $scope.ResponseDetails = "Data: " + data;
                $('#loading').css("display", "none");
                $rootScope.errorMessage = "Customer not Updated..";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);

            });

    }


});


myApp.controller('ReviseQuotationController', function ($scope, $http, $uibModal, $stateParams, $rootScope) {

    var reviseQuotationData = $stateParams.quotationToRevise;
    var qId = reviseQuotationData.QuotationId;
    $scope.QuotationDetails = {
        projectId: reviseQuotationData.ProjectId,
        ProjectName: $stateParams.projectName,
        quotationTitle: reviseQuotationData.QuotationTitle,
        quotationDate: reviseQuotationData.CreationDate,
        quotationSubject: reviseQuotationData.Subject,
        companyId: reviseQuotationData.CompanyId,
        companyName: reviseQuotationData.CompanyName,
        referenceNo: reviseQuotationData.RefNo,
        filePath: reviseQuotationData.filePath,
        quotationItemDetails: []
    };

    $scope.taxSelected = 0;
    $scope.taxableAmount = 0;
    $scope.noOfRows = 0;
    $scope.taxDetails = [];
    $scope.totalAmnt = 0;
    $scope.currentItemList = [];
    $scope.taxDetails = [];


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

                $rootScope.errorMessage = "Error Occurred while fetching quoation data";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);
                //alert("Error Occurred while fetching quoation data");
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
        }).error(function (data) {
        $rootScope.errorMessage = "Error Occurred Please contact administrator";
        $('#error').css("display", "block");
        setTimeout(function () {
            $('#error').css("display", "none");
        }, 1000);
        //alert(data);
    });

    $('#loader').css("display", "block");
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

                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Error Occurred while getting tax details";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);
                //alert("Error Occurred while getting tax details");
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
                    'taxArray': itemArray
                });
                $scope.TaxAmnt = $scope.TaxAmnt + parseFloat(qtData[i].TaxAmount);

            }
            console.log($scope.TaxAmnt);
        })
        .error(function (data) {
            $rootScope.errorMessage= data;
            $('#error').css("display","block");
            setTimeout(function() {
                $('#error').css("display","none");
            }, 3000);
        });


    $scope.quotationDate = function () {
        $scope.showQdate.opened = true;
    };

    $scope.showQdate = {
        opened: false
    };

    var totalAmount = 0;
    var remainingTotal = 0;


    Math.round = (function() {
        var originalRound = Math.round;
        return function(number, precision) {
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (originalRound(number * multiplier) / multiplier);
        };
    })();

    $scope.ModifyQuotation = function () {
        if ($scope.QuotationForm.$pristine) {

            $rootScope.errorMessage = "Fields are not modified";
            $('#error').css("display", "block");
            setTimeout(function () {
                $('#error').css("display", "none");
            }, 1000);
            //alert("Fields are not modified");
            return;
        }


        var b = [];
        var data = [];
        var projectId = $scope.QuotationDetails.projectId;
        var companyId = $scope.QuotationDetails.companyId;
        var companyName = $scope.QuotationDetails.companyName;
        var fileName = $scope.QuotationDetails.filePath;
        //$rootScope.warningMessage = "";
        //$rootScope.errorMessage = "";

        for (var i = 0; i < $scope.noOfRows; i++) {
            b.push({
                'Title': $scope.QuotationDetails.quotationItemDetails[i].quotationItem,
                'Decription': $scope.QuotationDetails.quotationItemDetails[i].quotationDescription,
                'Quantity': $scope.QuotationDetails.quotationItemDetails[i].quotationQuantity,
                'Unit': $scope.QuotationDetails.quotationItemDetails[i].quotationUnit,
                'UnitRate': $scope.QuotationDetails.quotationItemDetails[i].quotationUnitRate
            });

        }


        var viewValue=new Date($scope.QuotationDetails.quotationDate);
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
        $scope.QuotationDetails.quotationDate=viewValue.toISOString().substring(0, 10);

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

        if ($scope.myFile != undefined) {
            if ($scope.myFile.name != undefined) {
                var uploadQuotationLocation = "upload/Quotations/";
                fileName = uploadQuotationLocation + $scope.myFile.name;
                console.log("Check Quotation");
                var data = {
                    operation: "isQuotationAlreadyUploadedForOtherQuotation",
                    quotationId: qId,
                    QuotationBlob: fileName

                };
                var config = {
                    params: {
                        data: data
                    }
                };
                $('#loader').css("display", "block");
                $http.post("Process/php/quotationFacade.php", null, config)
                    .success(function (data) {

                        if (data.status == "Successful") {

                            $scope.postUploadQuotation(qId,QuotationData);
                        } else {
                            $('#loader').css("display", "none");
                            //$('#loading').css("display", "none");
                            $rootScope.errorMessage = "Quotation Document with same name already uploaded..Please change the name of quotation document";
                            console.log(data.message);
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                //$('#error').css("display", "none");
                            }, 1000);
                            // alert(data.message);
                        }

                    })
                    .error(function (data) {
                        $('#loader').css("display", "none");
                        $rootScope.errorMessage = "Error Occured Please contact administrator";
                        $('#error').css("display", "block");
                        setTimeout(function () {
                            //$('#error').css("display", "none");
                        }, 1000);
                        //alert(data);
                    });

            }
        } else {
            $scope.postQuotationData(qId,QuotationData);
        }
    }

    $scope.postUploadQuotation=function(qId,QuotationData){
        var uploadQuotationLocation = "upload/Quotations/";
        fileName = uploadQuotationLocation + $scope.myFile.name;
        QuotationData.Quotation.QuotationBlob = fileName;
        var fd = new FormData();
        fd.append('file', $scope.myFile);
        $('#loader').css("display", "block");
        console.log("Upload Quotation");
        $http.post("Process/php/uploadQuotation.php", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function (data) {

                if (data.status == "Successful") {
                    $scope.postQuotationData(qId,QuotationData);
                } else {
                    $('#loader').css("display", "none");
                    //$('#loading').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 1000);
                    //alert(data.message);
                }
            })
            .error(function () {
                $('#loader').css("display", "none");
                //$('#loading').css("display", "none");
                $rootScope.errorMessage = "Error Occured Please contact administrator";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 1000);

            });

    }


    $scope.postQuotationData=function(qId,QuotationData){
        var data = {
            operation: "modifyQuotation",
            quotationId: qId,
            data: QuotationData

        };
        var config = {
            params: {
                data: data
            }
        };

        console.log("Revise Quotation:"+QuotationData);
        $('#loader').css("display", "block");
        $http.post("Process/php/quotationFacade.php", null, config)
            .success(function (data) {

                if (data.status == "Successful") {

                    $('#loader').css("display", "none");
                    //alert("Customer created Successfully");
                    console.log(data.message);
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location = "dashboard.php#/Process/viewProjects";
                    }, 1000);
                    //alert("Quotation is Revised Successfully");

                } else {
                    $('#loader').css("display", "none");
                    //$('#loading').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    console.log(data.message);
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        //$('#error').css("display", "none");
                    }, 1000);
                    // alert(data.message);
                }

            })
            .error(function (data) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Error Occured Please contact administrator";
                $('#error').css("display", "block");
                setTimeout(function () {
                    //$('#error').css("display", "none");
                }, 1000);
                //alert(data);
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
        $scope.QuotationDetails.quotationItemDetails[index].amount= Math.round($scope.QuotationDetails.quotationItemDetails[index].amount, 2);
    }

    $scope.calculateTotal = function (amount) {
        $scope.totalAmnt = 0;
        for (var i = 0; i < $scope.QuotationDetails.quotationItemDetails.length; i++) {
            $scope.totalAmnt = $scope.totalAmnt + $scope.QuotationDetails.quotationItemDetails[i].amount;
        }
        $scope.totalAmnt= Math.round($scope.totalAmnt, 2);
        $scope.reviseTaxAmount();

    }


    $scope.removeQuotationItem = function (index) {

        $scope.totalAmnt = $scope.totalAmnt - $scope.QuotationDetails.quotationItemDetails[index].amount;
        $scope.QuotationDetails.quotationItemDetails.splice(index, 1); //remove item by index
        $scope.totalAmnt= Math.round($scope.totalAmnt, 2);
    };

    $scope.removeTaxItem = function (index) {
        $scope.TaxAmnt = $scope.TaxAmnt - $scope.taxDetails[index].amount;
        $scope.taxDetails.splice(index, 1);
        $scope.TaxAmnt= Math.round($scope.TaxAmnt, 2);
    };

    $scope.addTax = function (size) {
        var allTax = false;
        if ($scope.taxSelected <= 0) {
            $scope.taxableAmount = $scope.totalAmnt;
            allTax = true;
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Process/html/AddTax.html',
            controller: function ($scope, $uibModalInstance, amount,$rootScope) {
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
                    $scope.tax.amount= Math.round($scope.tax.amount, 2);
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
            var itemString = "All";
            var itemArray = [];
            if (!allTax) {
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

            $scope.TaxAmnt = 0;

            for (var s = 0; s < $scope.taxDetails.length; s++) {

                $scope.TaxAmnt = $scope.TaxAmnt + $scope.taxDetails[s].amount;

            }
            $scope.TaxAmnt= Math.round($scope.TaxAmnt, 2);

        }, function () {
            console.log("modal Dismiss");
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        if (allTax)
            $scope.taxableAmount = 0;
    }


    $scope.reviseTaxAmount=function(){

        $scope.TaxAmnt=0;
        for(var i=0;i<$scope.taxDetails.length;i++){
            if($scope.taxDetails[i].taxApplicableTo=="All"){
                $scope.taxDetails[i].amount=$scope.totalAmnt * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);
            }else{
                var taxableAmount=0;
                for(var j=0;j<$scope.taxDetails[i].taxArray.length;j++){
                    var quotationDetailsNo=$scope.taxDetails[i].taxArray[j]-1;
                    taxableAmount = taxableAmount + $scope.QuotationDetails.quotationItemDetails[quotationDetailsNo].amount;
                }
                $scope.taxDetails[i].amount=taxableAmount * ($scope.taxDetails[i].taxPercentage / 100);
                $scope.taxDetails[i].amount=Math.round($scope.taxDetails[i].amount, 2);
            }
            $scope.TaxAmnt=$scope.TaxAmnt+$scope.taxDetails[i].amount;
        }
        $scope.TaxAmnt= Math.round($scope.TaxAmnt, 2);
    }
});


myApp.controller('ViewTaskController', function (setInfo, $scope, $http, $filter, $rootScope,AppService) {
    $scope.completed=0;
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

    $scope.checkPercentage=function(){
        //console.log($scope.taskCompletionP);
        //if($scope.taskCompletionP==100){
        //    $scope.completed=1;
        //    console.log("completed");
        //}
    }
    $scope.taskEnd = {
        opened: false
    };
    var task = setInfo.get();
    console.log("task set is " + JSON.stringify(task));
    $scope.ViewTask = {
        task_id: task.TaskID,
        task_name: task.TaskName,
        task_desc: task.TaskDescripion,
        task_startDate: AppService.getFormattedDate(task.ScheduleStartDate),
        task_endDate:AppService.getFormattedDate(task.ScheduleEndDate),
        task_isCompleted: task.isCompleted
    };

    $scope.taskCompletionP=task.CompletionPercentage;
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
        $('#loader').css("display", "block");
        $http.post("Process/php/TaskFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data.status == 'sucess') {
                    $('#loader').css("display", "none");
                    for (var i = 0; i < data.message.length; i++) {
                        notes.push({
                            Note:data.message[i].ConductionNote,
                            AddedBy: data.message[i].firstName + " " + data.message[i].lastName,
                            NoteDate: AppService.getFormattedDate(data.message[i].DateAdded)
                        });
                    }
                    $scope.ViewNotes = notes;
                    setInfo.set(notes);
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Unable to get Note Details.Please contact Administrator";
                $('#error').css("display", "block");
            });

    }
    $scope.getViewNotes();
    $scope.setTaskCompletionPercentage= function () {
        if($scope.completed==1 ){
            $scope.taskCompletionP=100;
        }else{
            $scope.taskCompletionP=task.CompletionPercentage;
        }
    }
    $scope.updateTask = function (taskid) {
        var isCompleted = $scope.completed;
        console.log("completed " + isCompleted);

        var completed = 0;
        console.log("is completed" + completed);
        var crdate = new Date();
        var noteCreatedDate = $filter('date')(crdate, 'yyyy/MM/dd hh:mm:ss', '+0530');

            var viewValue1=new Date($scope.actualStartDate);
            viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
            $scope.actualStartDate=viewValue1.toISOString().substring(0, 10);
            var actualStart = $scope.actualStartDate;

            var viewValue=new Date($scope.actualEndDate);
            viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            $scope.actualEndDate=viewValue.toISOString().substring(0, 10);
        var actualEnd = $scope.actualEndDate;
        if($scope.completed!=undefined && $scope.completed==1 ){
            $scope.taskCompletionP=100;
        }
        var data = {
            "CompletionPercentage": $scope.taskCompletionP,
            "isCompleted": isCompleted,
            "ActualStartDate": actualStart,
            "ActualEndDate": actualEnd,
            "ConductionNote": $scope.note,
            "NoteAddedBy": "1",
            "NoteAdditionDate": noteCreatedDate
        };
        console.log("update task data is " + data);

        var data = {
            operation: "updateTask",
            data: data,
            taskId: taskid

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
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                            $('#error').css("display", "none");
                    }, 3000);
                } else {
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                            $('#warning').css("display", "none");
                        window.location="dashboard.php#/Process/SearchTask"
                    }, 2500);
                }
                $scope.getViewNotes();
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Unable to Update Task.Please contact Administrator.";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#erro').css("display", "none");
                }, 3000);
            });
    }
});


myApp.controller('SearchTaskController', function (setInfo, $rootScope, $scope, $http,$filter) {

    $scope.sortBy = "";
    $scope.searchKeyword = ""

    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;

    $scope.getAllTasks = function () {
        var task = [];
        var data = {
            operation: "getTasks",
            keyword: $scope.searchKeyword,
            sortBy: $scope.sortBy

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

                if (data.status == "sucess") {
                    $('#loader').css("display", "none");
                    for (var i = 0; i < data.message.length; i++) {
                        var date = new Date(data.message[i].CreationDate);
                        var creationDate = $filter('date')(date, 'dd/MM/yyyy', '+0530');
                        var viewValue=new Date(data.message[i].CreationDate);
                        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());

                        var startDate = viewValue.toISOString().substring(0, 10);


                        task.push({
                            "TaskID": data.message[i].TaskID,
                            "TaskName": data.message[i].TaskName,
                            "TaskDescripion": data.message[i].TaskDescripion,
                            "ScheduleStartDate": data.message[i].ScheduleStartDate,
                            "ScheduleEndDate": data.message[i].ScheduleEndDate,
                            "CompletionPercentage": data.message[i].CompletionPercentage,
                            "TaskAssignedTo": data.message[i].TaskAssignedTo,
                            "isCompleted": data.message[i].isCompleted,
                            "CreationDate":creationDate ,
                            "CreatedBy": data.message[i].CreatedBy,
                            "ActualStartDate": data.message[i].ActualStartDate,
                            "AcutalEndDate": data.message[i].AcutalEndDate,
                            "UserId": data.message[i].UserId,
                            "UserName": data.message[i].firstName + " " + data.message[i].lastName
                        });
                    }
                    $rootScope.tasks = task;
                    console.log($rootScope.tasks);
                }
                else {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Unable to fetch data.Please contact Administrator";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });

    }


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

    $scope.deleteTask = function (taskid ,index1){
        console.log("delete task " + taskid);
        console.log(index1);
        var data = {
            operation: "deleteTask",
            taskId: taskid
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
                if (data.status != "sucess") {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");

                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);

                } else {
                    $('#loader').css("display", "none");
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    $rootScope.tasks.splice(index1, 1);
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location = "dashboard.php#/Process/";
                    }, 1000);
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Unable to delete task.Please contact Administrator";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
            });
    }

});


myApp.controller('AssignTaskController', function ($scope, $http, AppService, $filter, $rootScope) {

    console.log("in AssignTaskController");
    $scope.users = [];
    AppService.getUsers($scope, $http);

    $scope.assignTask = function () {

        console.log("IN ASSIGN TASK");
        var date = new Date();
        var creationDate = $filter('date')(date, 'yyyy/MM/dd hh:mm:ss', '+0530');

        var viewValue=new Date($scope.task.startDate);
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
        $scope.task.startDate=viewValue.toISOString().substring(0, 10);
        var startDate = $scope.task.startDate;

        var viewValue1=new Date($scope.task.endDate);
        viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
        $scope.task.endDate=viewValue1.toISOString().substring(0, 10);
        var endDate = $scope.task.endDate;

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


        $scope.clearData = function () {
            $scope.task.taskname = "";
            $scope.task.description = "";
            $scope.task.startDate = "";
            $scope.task.endDate = "";
            $scope.task.assignedTo = "";
        }
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
        $('#loader').css("display", "block");
        $http.post("Process/php/TaskFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data.status != "sucess") {
                    $('#loader').css("display", "none");
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#erro').css("display", "none");
                    }, 3000);
                } else {
                    $('#loader').css("display", "none");
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display", "block");
                    $scope.clearData();
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);
                }
                $scope.formSubmitted = false;
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display", "none");
                $rootScope.errorMessage = "Unable to assign task.Please contact Administrator";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#erro').css("display", "none");
                }, 3000);
            });
    };


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



