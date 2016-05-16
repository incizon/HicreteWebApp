/**
 * Created by Atul on 19-03-2016.
 */
myApp.service('AppService', function () {

    this.getFormattedDate=function (input){
        var d = new Date(input);
        //var str = mydate.toString("dd-MM-yyyy");
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();

        return curr_date + "-" + curr_month + "-" + curr_year;
    }
    this.getCompanyList = function ($http, $companies) {
        $('#loader').css("display", "block");
        var data = {
            operation: "getCompanyList"
        };
        var config = {
            params: {
                data: data
            }
        };


        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                console.log("IN Company Get");
                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $companies.push({
                            checkVal: false,
                            companyId: data.message[i].companyId,
                            companyName: data.message[i].companyName
                        });
                    }

                }

            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:" + data);

            });

    }
    /*
     get Payment details of invoice
     */
    this.getInvoicePaymentDetails = function (invoiceId, $scope, $http) {
        $scope.paymentHistoryData = [];
        $scope.totalAmtPaid = "";
        $scope.totalPayableAmount = 0;
        var invoiceDetail = [];
        var totalAmountPaid = 0;
        var totalPayableAmt = 0;
        console.log("invoice id is " + invoiceId);
        //getPaymentPaidByInvoices
        var data = {
            operation: "getPaymentPaidByInvoices",
            invoiceId:invoiceId
        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/PaymentFacade.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                console.log(data);
                    if (data != null) {
                        for (var i = 0; i < data.message.length; i++) {
                            invoiceDetail.push({
                                amountPaid: data.message[i].AmountPaid,
                                paymentDate: data.message[i].PaymentDate,
                                recievedBy: data.message[i].FirstName + data.message[i].LastName,
                                amountRemaining: "----",
                                grandTotal: data.message[i].GrandTotal,
                                paymentMode: data.message[i].InstrumentOfPayment,
                                bankName: data.message[i].BankName,
                                branchName: data.message[i].BranchName,
                                unqiueNo: data.message[i].IDOfInstrument
                            });
                            var mydate = new Date(invoiceDetail[i].paymentDate);
                            var str = mydate.toString("dd-MM-yyyy");
                            invoiceDetail[i].paymentDate=str;
                            totalAmountPaid = totalAmountPaid + parseInt(data.message[i].AmountPaid);

                        }
                        //if(data.message[0].GrandTotal!=undefined)
                         totalPayableAmt = parseInt(data.message[0].GrandTotal);
                    }
                    $scope.totalAmtPaid = totalAmountPaid;
                    $scope.totalPayableAmount = totalPayableAmt;
                    console.log("total amount payable=" + totalPayableAmt);
                    console.log("total amount paid=" + totalAmountPaid);
                    $scope.paymentHistoryData = invoiceDetail;
                    console.log("paymentHistoryData  scope is " + JSON.stringify($scope.paymentHistoryData));
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:" + data);

            });


    }


    this.getUsers = function ($scope, $http) {
        $scope.leaves = {
            operation: ""
        }
        $scope.leaves.operation = "getEmployees";
        var config = {
            params: {
                details: $scope.leaves
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $scope.employees = data;

                var user = [];
                for (var i = 0; i < data.length; i++) {
                    user.push({
                        id: data[i].userId,
                        name: data[i].firstName + " " + data[i].lastName

                    });
                }
                $scope.users = user;
            })
            .error(function (data, status, headers, config) {

            });
    }

    this.getProjectManagers = function ($http, $projectManagers) {
        $('#loader').css("display", "block");
        var data = {
            operation: "getAllProcessUser"
        };
        var config = {
            params: {
                data: data
            }
        };


        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                console.log("IN Company Get");
                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $projectManagers.push({
                            checkVal: false,
                            projectManagerId: data.message[i].userId,
                            name: data.message[i].firstName + " " + data.message[i].lastName
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:" + data);

            });


    }

    this.getAllCustomers = function ($http, $customers) {
        $('#loader').css("display", "block");

        var data = {
            operation: "getCustomerList",


        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/customerFacade.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                console.log("IN Company Get");
                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $customers.push({
                            checkVal: false,
                            customerId: data.message[i].CustomerId,
                            customerName: data.message[i].CustomerName
                        });
                    }
                }
            })
            .error(function (data) {
                alert("Error  Occurred:" + data);
            });
        /*$http.post("php/api/customerlist", null)
         .success(function (data) {
         $('#loader').css("display","none");
         console.log("IN Company Get");
         console.log(data);
         if(data.status!="Successful"){
         alert("Failed:"+data.message);
         }else {
         for(var i=0;i<data.message.length;i++){
         $customers.push({checkVal:false,customerId:data.message[i].CustomerId,customerName:data.message[i].CustomerName});
         }
         }
         })
         .error(function (data, status, headers, config) {
         alert("Error  Occurred:"+data);

         });*/


    }


    this.getAllProjects = function ($http, $projects) {

        var data = {
            operation: "getProjectList",
        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php", null, config)
            .success(function (data) {
                console.log("IN Project Get");
                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $projects.push({
                            id: data.message[i].ProjectId,
                            name: data.message[i].ProjectName

                        });
                    }
                }

            })
            .error(function (data) {
                alert("Error  Occurred:" + data);
            });
        /* $http.post("php/api/projectlist", null)
         .success(function (data) {

         console.log("IN Project Get");
         console.log(data);
         if(data.status!="Successful"){
         alert("Failed:"+data.message);
         }else {
         for(var i=0;i<data.message.length;i++){
         $projects.push({
         id: data.message[i].ProjectId,
         name: data.message[i].ProjectName

         });
         }
         }
         })
         .error(function (data, status, headers, config) {
         alert("Error  Occurred:"+data);

         });*/

    }

    this.getAllQuotationOfProject = function ($http, $quotations, $projectId) {

        var data = {
            operation: "getQuotationList",
            data: $projectId

        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/quotationFacade.php", null, config)
            .success(function (data) {
                console.log("IN Project Get");
                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $quotations.push({
                            id: data.message[i].QuotationId,
                            name: data.message[i].QuotationTitle,
                            refNo: data.message[i].RefNo
                        });
                    }
                }
            })
            .error(function (data) {
                alert("Error  Occurred:" + data);
            });

    }

    this.getAllInvoicesOfProject = function ($http, $invoices, $projectId) {
        console.log($projectId);
        var data = {
            operation: "getInvoiceOfProject",
            projectId: $projectId

        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php", null, config)
            .success(function (data) {
                console.log("IN Invoice Get");
                console.log(data);
                if (data.status == "success") {
                    //alert("Failed:"+data.message);
                    console.log("else block");
                    for (var i = 0; i < data.message.length; i++) {
                        $invoices.push({
                            id: data.message[i].InvoiceNo,
                            name: data.message[i].InvoiceTitle
                        });

                    }

                } else {
                    //  alert("Failed:"+data.message);
                }
            })
            .error(function (data) {
                alert("Error  Occurred:" + data);
            });
        /* $http.post("php/api/invoicelist/"+$projectId, null)
         .success(function (data) {

         console.log("IN Invoice Get");
         console.log(data);
         if(data.status!="Successful"){
         alert("Failed:"+data.message);
         }else {
         for(var i=0;i<data.message.length;i++){
         $invoices.push({
         id: data.message[i].InvoiceNo,
         name: data.message[i].InvoiceTitle
         });
         }
         }
         })
         .error(function (data, status, headers, config) {
         alert("Error  Occurred:"+data);

         });*/

    }


    this.getAllSiteTrackingProjects = function ($http, $projects) {

        var data = {
            operation: "getSiteTrackingProjectList",

        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php", null, config)
            .success(function (data) {
                console.log("IN Project Get");
                console.log(data);
                if (data.status != "Successful") {
                    alert("Failed:" + data.message);
                } else {
                    for (var i = 0; i < data.message.length; i++) {
                        $projects.push({
                            id: data.message[i].ProjectId,
                            name: data.message[i].ProjectName

                        });
                    }
                }
            })
            .error(function (data) {
                alert("Error  Occurred:" + data);
            });
        /* $http.post("php/api/sitetrackingprojectlist", null)
         .success(function (data) {

         console.log("IN Project Get");
         console.log(data);
         if(data.status!="Successful"){
         alert("Failed:"+data.message);
         }else {
         for(var i=0;i<data.message.length;i++){
         $projects.push({
         id: data.message[i].ProjectId,
         name:data.message[i].ProjectName

         });
         }
         }
         })
         .error(function (data, status, headers, config) {
         alert("Error  Occurred:"+data);

         });*/

    }

    this.uploadFileToUrl = function ($http, file, $scope) {
        console.log("File upload started");

        var fd = new FormData();
        fd.append('file', file);
        $http.post("Config/php/upload.php", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })

            .success(function (status) {
                $scope.warningMessage = status;
                $('#warning').css("display", "block");
                setTimeout(function () {
                    $('#warning').css("display", "none");
                    window.location.reload(1);
                }, 1500);
                console.log("in upload successs" + status);
            })

            .error(function () {
                $scope.errorMessage = "Something went wrong.File not uploaded";
                $('#error').css("display", "block");
                //setTimeout(function () {
                //    $('#error').css("display", "none");
                //}, 1000);
                console.log("In file upload error");
            });
    }

    this.schedulePaymentFollowup = function ($http, $scope, $filter, invoiceNo,$rootScope) {

        var FollowupDate = $filter('date')($scope.applicatorDetails.followupdate, 'yyyy/MM/dd hh:mm:ss', '+0530');
        var AssignEmployee = $scope.applicatorDetails.followupemployeeId;
        var FollowupTitle = $scope.applicatorDetails.followTitle;
        console.log("In schedulePaymentFollowup ");
        var followupData = {FollowupDate: FollowupDate, AssignEmployee: AssignEmployee, FollowupTitle: FollowupTitle};
        console.log(followupData);

        data = {
            operation: "CreatePaymentFollowup",
            id: invoiceNo,
            data: followupData
        };


        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/followupFacade.php', null, config)
            .success(function (data, status, headers) {
                console.log(data);
                if (data.status === "Successful") {
                    $('#loader').css("display", "block");
                    //$scope.PostDataResponse = data;
                    $('#loader').css("display", "none");
                    $rootScope.warningMessage = "Followup Created Successfully";
                    $('#warning').css("display", "block");

                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 2000);
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
                $scope.errorMessage = data;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
                //alert(data);
            });

    }

    this.getCompaniesForProject=function($http,$projectId,$companies){
        var data={
            operation :"getCompaniesForProject",
            data : $projectId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php",null, config)
            .success(function (data) {
                console.log(data);
                if (data.status == "Successful") {
                    for (var i = 0; i < data.message.length; i++) {
                        $companies.push({
                            company_id: data.message[i].companyId,
                            company_name: data.message[i].companyName
                        });
                    }
                    console.log($companies);
                } else {
                    alert(data.message);
                }
            })
            .error(function(data){
                alert(data);
            });

    }

    this.getTaskAssignedToUser=function($http,$errorMessage,$Tasks){
        var data = {
            operation: "getAllTaskForUser",
            includeCompleted:false
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
                $Tasks=[];
                var b=[];
                for (var i = 0; i < data.message.length; i++) {

                    b.push({
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
                $Tasks=b;

                console.log("get task on dashboard");

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                $('#loader').css("display", "none");
                $errorMessage = data.message;
                $('#error').css("display", "block");
            });

    }


    this.getPaymentFollowup=function($http,$errorMessage,$paymentFollowup){
        var data={
            operation :"getPaymentFollowup"
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/followupFacade.php',null,config)
            .success(function (data, status, headers) {
                console.log(data);

                if(data.status == "Successful") {

                    $paymentFollowup=[];
                    console.log("Success");
                    for(var i = 0; i<data.message.length ; i++){
                        $paymentFollowup.push({
                            followupId: data.message[i].FollowupId,
                            assignEmployee: data.message[i].AssignEmployee,
                            followupDate: data.message[i].FollowupDate,
                            invoiceId:data.message[i].InvoiceId,
                            followupDate:data.message[i].FollowupDate,
                            followupTitle:data.message[i].FollowupTitle,
                            creationDate:data.message[i].CreationDate,
                            createdBy: data.message[i].CreatedBy,
                            type : 'Payment'
                        });
                    }


                }else{
                    alert("Database error occurred while fetching payment followup");
                }

            })
            .error(function (data, status, header) {
                alert("Error Occured while fetching payment followup");
            });

    }

    this.getQuotationFollowup=function($http,$errorMessage,$quotationFollowup){
        var data={
            operation :"getQuotationFollowup"
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/followupFacade.php',null,config)
            .success(function (data, status, headers) {
                console.log(data);

                if(data.status == "Successful") {
                    console.log("Success");
                    $quotationFollowup = [];
                    var b = [];

                    for(var i = 0; i<data.message.length ; i++){
                        $quotationFollowup.push({
                            followupId: data.message[i].FollowupId,
                            quotationId: data.message[i].QuotationId,
                            assignEmployee:data.message[i].AssignEmployee,
                            followupDate:data.message[i].FollowupDate,
                            followupTitle: data.message[i].FollowupTitle,
                            creationDate:data.message[i].CreationDate,
                            createdBy :data.message[i].CreatedBy,
                            type : 'Quotation'
                        });
                    }


                }else{
                    alert("Database error occurred while fetching Quotation followup");
                }

            })
            .error(function (data, status, header) {
                alert("Error Occured while fetching Quotation followup");
            });


    }


    this.getSiteTrackingFollowup=function($http,$errorMessage,$sitetrackingFollowup){
        var data={
            operation :"getSitetrackingFollowup"
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/followupFacade.php',null,config)
            .success(function (data, status, headers) {

                console.log(data);

                if(data.status == "Successful") {
                    console.log("Success");
                    $sitetrackingFollowup = [];
                    var b = [];

                    for(var i = 0; i<data.message.length ; i++){
                        $sitetrackingFollowup.push({
                            followupId: data.message[i].FollowupId,
                            projectId: data.message[i].ProjectId,
                            assignEmployee:data.message[i].AssignEmployee,
                            followupDate:data.message[i].FollowupDate,
                            followupTitle: data.message[i].FollowupTitle,
                            creationDate:data.message[i].CreationDate,
                            createdBy :data.message[i].CreatedBy,
                            type : 'SiteTracking'
                        });
                    }


                }else{
                    alert("Database error occurred while fetching SiteTracking followup");
                }

            })
            .error(function (data, status, header) {
                alert("Error Occured while fetching SiteTracking followup");
            });


    }


    this.getApplicatorFollowup=function($http,$errorMessage,$ApplicatorPaymentFollowup){
        var data={
            operation :"getApplicatorFollowup"
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post('Process/php/followupFacade.php',null,config)
            .success(function (data, status, headers) {
                console.log(data);

                if(data.status == "Successful") {
                    console.log("Success");
                    $ApplicatorPaymentFollowup = [];
                    var b = [];

                    for(var i = 0; i<data.message.length ; i++){
                        $ApplicatorPaymentFollowup.push({
                            followupId: data.message[i].follow_up_id,
                            ApplicatorId: data.message[i].enrollment_id,
                            assignEmployee:data.message[i].assignEmployeeId,
                            followupDate:data.message[i].date_of_follow_up,
                            followupTitle: data.message[i].followup_title,
                            creationDate:data.message[i].creation_date,
                            createdBy :data.message[i].created_by,
                            type : 'Applicator'
                        });
                    }


                }else{
                    alert("Database error occurred while fetching Applicator followup");
                }

            })
            .error(function (data, status, header) {
                alert("Error Occured while fetching Applicator followup");
            });


    }





});