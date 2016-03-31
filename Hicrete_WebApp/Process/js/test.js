/**
 * Created by LENOVO on 03/24/16.
 */

myApp.controller('ViewQuotationDetailsController', function (setInfo, $scope, $http) {
    var viewQuotDetail = setInfo.get();
    var qId = viewQuotDetail.QuotationId;
    $scope.viewQuotationDetail = {
        projectName: viewQuotDetail.ProjectName,
        quotationTitle: viewQuotDetail.QuotationTitle,
        companyId: viewQuotDetail.CompanyId,
        creationDate: viewQuotDetail.CreationDate,
        projectName: viewQuotDetail.ProjectName,
        subject: viewQuotDetail.Subject,
        refNo: viewQuotDetail.RefNo
    }

    $http({
        method: "GET",
        url: "php/api/quotation/details/" + qId
    }).then(function mySucces(response) {
        $scope.qData = response.data;
        $scope.qDetails = [];
        var b = [];
        var length = $scope.qData.length;
        //alert("length is "+$scope.qData.length);
        $scope.getTotalAmount = function () {
            var total = 0;
            var amount313 = 0;
            for (var i = 0; i < $scope.qData.length; i++) {
                var amount313 = $scope.qData[i].Amount;
                total = +total + +amount313;
            }
            console.log("totalAmount is" + total);
            return total;
        }

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
                'detailNo': $scope.qData[i].DetailNo
            });
            $scope.qDetails = b;
        }
        $scope.qDetails;
        //console.log("aaaaaaaaa "+JSON.stringify($scope.qDetails));
    }, function myError(response) {
        $scope.error = response.statusText;
    });

    $http({
        method: "GET",
        url: "php/api/quotation/taxDetails/" + qId
    }).then(function mySucces(response) {
        $scope.qtData = response.data;
        $scope.qTaxDetails = [];
        var b = [];
        var length = $scope.qtData.length;
        //alert("length is "+$scope.qData.length);
        $scope.getTotalTax = function () {
            var total = 0;
            var amount313 = 0;
            for (var i = 0; i < $scope.qtData.length; i++) {
                var amount313 = $scope.qtData[i].TaxAmount;
                total = +total + +amount313;
            }
            console.log("totalAmount is" + total);
            return total;
        }

        for (var i = 0; i < length; i++) {
            b.push({
                'quotationId': $scope.qtData[i].QuotationId,
                'taxId': $scope.qtData[i].TaxID,
                'taxName': $scope.qtData[i].TaxName,
                'taxPercentage': $scope.qtData[i].TaxPercentage,
                'taxAmount': $scope.qtData[i].TaxAmount
            });
            $scope.qTaxDetails = b;
        }
        $scope.qTaxDetails;
        console.log("qTaxDetails is " + JSON.stringify($scope.qTaxDetails));
    }, function myError(response) {
        $scope.error = response.statusText;
    });

//myApp.controller('ViewQuotationDetailsController',function($scope,$http){


});

myApp.controller('PaymentHistoryController', function ($scope, $http) {

    console.log("in payment history controller");
    $scope.Projects = [];
    $scope.Invoices = [];
    $scope.InvoiceDetails = [];
    var project = [];

    $http.get("php/api/projects").then(function (response) {
        console.log(response.data.length);
        if (response.data != null) {
            for (var i = 0; i < response.data.length; i++) {
                project.push({
                    project_id: response.data[i].ProjectId,
                    project_name: response.data[i].ProjectName
                });
            }
        }
        $scope.Projects = project;
        console.log("projects scope is " + JSON.stringify($scope.Projects));
    })

    $scope.viewProjectInvoices = function (project) {
        $scope.paymentHistoryData = [];
        $scope.Invoices = [];
        var invoice = [];
        console.log("project id is :" + project);

        $http.get("php/api/projects/invoices/" + project).then(function (response) {
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
        var invoiceDetail = [];
        console.log("invoice id is " + invoiceId);
        $http.get("php/api/paymentDetails/Invoice/" + invoiceId).then(function (response) {
            console.log(response.data.length);
            if (response.data != null) {
                for (var i = 0; i < response.data.length; i++) {
                    invoiceDetail.push({
                        amountPaid: response.data[i].AmountPaid,
                        paymentDate: response.data[i].PaymentDate,
                        recievedBy: response.data[i].PaidTo,
                        amountRemaining: "----",
                        paymentMode: response.data[i].InstrumentOfPayment,
                        bankName: response.data[i].BankName,
                        branchName: response.data[i].BranchName,
                        unqiueNo: response.data[i].IDOfInstrument
                    });
                }
            }
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


