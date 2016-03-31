myApp.controller('CreateYearController', function($scope,$http) {

    console.log("IN");

    $scope.yearDetails={

        weeklyOff:false,
        operation:""
    };

    $scope.today = function() {
        $scope.yearDetails.endDate = new Date();
        $scope.yearDetails.startDate = new Date();
    };
    $scope.today();

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openStartYearDate = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };
    $scope.openEndYearDate = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.createYear = function(){

        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.yearDetails.operation="createYear";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.yearDetails
            }
        };

        console.log($scope.yearDetails);
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if(data.msg!=""){
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");

                    setTimeout(function() {
                            if(data.msg!=""){
                                $('#warning').css("display","none");
                            }
                    }, 3000);

                    console.log(data);
                }
                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg==""){
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        if(data.msg!=""){
                            $('#error').css("display","none");
                        }
                    }, 3000);
                }
            })
            .error(function (data, status, headers, config) {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage=data.error;
                $('#error').css("display","block");
                setTimeout(function() {
                        $('#error').css("display","none");
                }, 3000);
            });

        }
});

myApp.controller('ConfigureHolidaysController', function($scope,$rootScope,$http) {

    $scope.holidaysDetails={
        operation:""
    };

    $scope.holidaysList=[];

    $scope.configureHoliday={
        operation:""
    };

    $scope.pickHolidayDate = function(){
        $scope.holidayDate.opened = true;
    };

    $scope.holidayDate = {
        opened:false
    };

    $scope.getCurrentYearDetails=function(){
        $scope.holidaysDetails.operation="getCurrentYearHolidayDetails";
        var config = {
            params: {
                details: $scope.holidaysDetails
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $scope.holidaysDetails=data;
                $scope.configureHoliday.caption_of_year=$scope.holidaysDetails.caption_of_year;
                $scope.configureHoliday.from_date=$scope.holidaysDetails.from_date;
                $scope.configureHoliday.to_date=$scope.holidaysDetails.to_date;

                $scope.holidaysList=$scope.holidaysDetails.holidaysList;
                console.log($scope.holidaysList);

            })
            .error(function (data, status, headers, config) {


            });
    }

    $scope.getCurrentYearDetails();


    $scope.addHoliday=function(){

        //
        //$scope.errorMessage="";
        //$scope.warningMessage="";
        $('#loader').css("display","block");

        $scope.configureHoliday.operation="createHoliday";

        var config = {
            params: {
                details: $scope.configureHoliday
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {

                if(data.msg!=""){
                    $rootScope.warningMessage=data.msg;
                    $('#warning').css("display","block");

                    setTimeout(function() {
                        if(data.msg!=""){
                            $('#warning').css("display","none");
                            window.location.reload(1);
                        }
                    }, 3000);

                    console.log(data);
                }
                //$scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg==""){
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");
                }
            })
            .error(function (data, status, headers, config) {

                $('#loader').css("display","none");
                $rootScope.errorMessage=data.error;
                $('#error').css("display","block");

            });

    }

    $scope.removeHoliday=function(index,holiday_date){
        $scope.holidaysList.splice(index,1); //remove item by index
        $scope.holidaysDetails.operation="removeHoliday";
        $scope.holidaysDetails.holiday_date=holiday_date;
        var config = {
                params: {
                    details: $scope.holidaysDetails
                }
            };
            $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);

            })
            .error(function (data, status, headers, config) {


            });
        }


});

myApp.controller('ApplyForLeaveController', function($scope,$http) {

    $scope.leaveDetails={
        userId:"",
        status:"pending",
        fromDate:"",
        toDate:"",
        remaining:0,
        operation:"",
        hideOption:"",
        numberOfLeaves:0,
        caption_of_year:""
    };

    $scope.leaveFrom = function(){
        $scope.from.opened = true;
    };

    $scope.from = {
        opened:false
    };

    $scope.leaveTo = function(){
        $scope.to.opened = true;
    };

    $scope.to = {
        opened:false
    };

    $scope.employeeDetails={
        operation:""
    };


    $scope.getEmployeeDetails=function(){

        $scope.employeeDetails.operation="getEmployeeDetailsForLeave";
        var config = {
            params: {
                details: $scope.employeeDetails
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {

                console.log(data);
                $scope.employeeName=data.employeeName;
                $scope.approverName=data.approverName;
                $scope.leaveDetails.userId=data.userId;
                $scope.leaveDetails.caption_of_year=data.caption_of_year;
                $scope.leaveDetails.leaves_remaining=data.leaves_remaining;
                if(parseInt($scope.leaveDetails.leaves_remaining)<=0){
                    console.log("In if");
                    $scope.hideOption=true;
                }
                else{
                    $scope.hideOption=false;
                }

            })
            .error(function (data, status, headers, config) {

            });

    }


    $scope.getEmployeeDetails();


    $scope.getNoOfLeaves=function(){

            if(($scope.leaveDetails.fromDate!="" && $scope.leaveDetails.toDate!="")&&($scope.leaveDetails.fromDate!=undefined && $scope.leaveDetails.toDate!=undefined)){

                $scope.leaveDetails.operation="getNoOfLeaves";
                var config = {
                    params: {
                        details: $scope.leaveDetails
                    }
                };

                $http.post("Payroll/php/PayrollFacade.php", null, config)
                    .success(function (data) {
                        console.log(data);
                        $scope.leaveDetails.numberOfLeaves=data;
                        console.log($scope.leaveDetails.numberOfLeaves);
                        console.log($scope.leaveDetails.leaves_remaining);
                        if(parseInt($scope.leaveDetails.numberOfLeaves) > parseInt($scope.leaveDetails.leaves_remaining)){
                            $scope.hideOption=true;
                            console.log("In If");
                        }
                        else{
                            $scope.hideOption=false;
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });

            }

    }
    $scope.ApplyForLeave=function(){

        console.log($scope.leaveDetails);

        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.leaveDetails.operation="createLeave";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.leaveDetails
            }
        };
        console.log($scope.leaveDetails);
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {

                if(data.msg!=""){
                    console.log(data);
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");

                    setTimeout(function() {
                        if(data.msg!=""){
                            $('#warning').css("display","none");
                            window.location.reload(1);
                        }
                    }, 3000);
                }
                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg==""){
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display","none");
                $scope.errorMessage=data.error;
                $('#error').css("display","block");
            });
        }
});

myApp.controller('AddEmployeeToPayRollController', function($scope,$http) {

    $scope.employeeDetails={
        operation:""
    }

    $scope.payrollDetails={

        operation:"",
        employee:[]

    };
    $scope.getEmployeeDetails=function(){

        $scope.employeeDetails.operation="getEmployeeDetails";
        var config = {
            params: {
                details: $scope.employeeDetails
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {

                console.log(data);
                $scope.payrollEmployeeDetails=data;
                $scope.modifyObject();
            })
            .error(function (data, status, headers, config) {


            });

    }

    $scope.getEmployeeDetails();

   $scope.modifyObject=function(){

       for(var i=0;i<$scope.payrollEmployeeDetails.EmployeeDetails.length;i++){

           $scope.payrollEmployeeDetails.EmployeeDetails[i].val=false;
       }
       console.log($scope.payrollEmployeeDetails.EmployeeDetails);

   }

    $scope.AddEmployee=function(){

        console.log($scope.payrollEmployeeDetails.EmployeeDetails);

        for(var i=0;i<$scope.payrollEmployeeDetails.EmployeeDetails.length;i++){

             if($scope.payrollEmployeeDetails.EmployeeDetails[i].val===true){

                    $scope.payrollDetails.employee.push($scope.payrollEmployeeDetails.EmployeeDetails[i]);
             }
        }

        console.log($scope.payrollDetails);

        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.payrollDetails.operation="addEmployeeToPayroll";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.payrollDetails
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if(data.msg!=""){
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");

                    setTimeout(function() {
                        if(data.msg!=""){
                            $('#warning').css("display","none");
                            window.location.reload(1);
                        }
                    }, 3000);
                }
                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg==""){
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display","none");
                $scope.errorMessage=data.error;
                $('#error').css("display","block");
            });

    }
});

myApp.controller('ShowLeavesController', function($scope,$http) {

    $scope.leavePerPage=10;
    $scope.currentPage=1;

    $scope.leaves={
        operation:"",
        fromDate:"",
        toDate:""
    }

    $scope.showFromDate=function(){

        $scope.showFrom.opened=true;
    };

    $scope.showToDate=function(){
        $scope.showTo.opened=true;
    };

    $scope.showTo={
        opened:false
    };
    $scope.showFrom={
        opened:false
    };

    $scope.SearchLeave=function(){

        $scope.errorMessage="";
        $scope.warningMessage="";
        $('#loader').css("display","block");

        $scope.leaves.operation="searchLeave";

        var config = {
            params: {
                details: $scope.leaves
            }
        };

        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data.status==="success") {
                    $scope.leavesDetails = data.message;
                    $scope.totalItems = $scope.leavesDetails.length;
                    $('#loader').css("display","none");
                }
                else{
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage=data.message;
                    $('#error').css("display","block");
                }
            })
            .error(function (data, status, headers) {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage="Could Not Fetch Data";
                $('#error').css("display","block");
            });
    }

    $scope.changeStatus=function(applicationId){

        for(var i=0;i<$scope.leavesDetails.length;i++){

                if(applicationId==$scope.leavesDetails[i].application_id){
                    $scope.leavesDetails[i].status='cancel';
                }
        }

        $scope.errorMessage="";
        $scope.warningMessage="";
        $('#loader').css("display","block");

        $scope.leaves.applicationId=applicationId;
        $scope.leaves.operation="changeLeaveStatus";

        var config = {
            params: {
                details: $scope.leaves
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)

            .success(function (data) {
                console.log(data);
                if(data.status==="success") {
                    $scope.warningMessage = data.message;
                    $('#warning').css("display","block");
                    $('#loader').css("display","none");
                }
                else{
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage=data.message;
                    $('#error').css("display","block");
                }
            })
            .error(function (data, status, headers) {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage="Could not send ";
                $('#error').css("display","block");
            });

    }
    $scope.paginate = function(value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.leavePerPage;
        end = begin + $scope.leavePerPage;
        index = $scope.leavesDetails.indexOf(value);

        return (begin <= index && index < end);
    };
});

myApp.controller('SearchLeaveByEmployeeController', function($scope,$http) {

    $scope.leavePerPage=10;
    $scope.currentPage=1;

    $scope.leaveDetails=[];

    $scope.employees=[];

    $scope.leaves={
        operation:""
    }
    $scope.searchDetails= {
        employee: "",
        operation:""
    }


    $scope.getEmployeeDetails=function(){

        $scope.leaves.operation="getEmployees";
        var config = {
            params: {
                details: $scope.leaves
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $scope.employees=data;
            })
            .error(function (data, status, headers, config) {

            });
    }

    $scope.getEmployeeDetails();

    $scope.searchByEmployee=function(){


        console.log($scope.searchDetails);
        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.searchDetails.operation="searchLeaveByEmployee";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.searchDetails
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
        .success(function (data) {
            console.log(data);
            if(data.status==="success") {
                $scope.leavesDetails = data.message;
                $scope.totalItems = $scope.leavesDetails.length;
                $('#loader').css("display","none");
            }
            else{
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage=data.message;
                $('#error').css("display","block");
            }
        })
            .error(function (data, status, headers) {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage="Could Not Fetch Data";
                $('#error').css("display","block");
            });
    }

    $scope.paginate = function(value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.leavePerPage;
        end = begin + $scope.leavePerPage;
        index = $scope.leavesDetails.indexOf(value);

        return (begin <= index && index < end);
    };
});

myApp.controller('SearchLeaveByDateController', function($scope,$http) {

    $scope.currentPage=1;
    $scope.leavePerPage=10;
    $scope.hide=false;
    $scope.leavesDetails=[];

    $scope.searchDetails= {
        searchBy: 'Year',
        operation:""
    }

     $scope.leaves={
         operation:""
     }

    $scope.getYears=function(){

        $scope.leaves.operation="getYears";
        var config = {
            params: {
                details: $scope.leaves
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $scope.years=data;
            })
            .error(function (data, status, headers, config) {

            });
    }

    $scope.getYears();

    $scope.disableSearch=function(value){
        console.log("In");
        if(value=="Year") {
            $scope.hide = false;
        }
        if(value=="timePeriod") {
            $scope.hide = true;
        }
    }

    $scope.leaveFromDate=function(){

        $scope.leaveFrom.opened=true;
    };

    $scope.leaveToDate=function(){
        $scope.leaveTo.opened=true;
    };

    $scope.leaveTo={
        opened:false
    }

    $scope.leaveFrom={
        opened:false
    }


    $scope.searchByDate=function(){

        console.log($scope.searchDetails);
        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.searchDetails.operation="searchLeaveByDate";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.searchDetails
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if(data.status==="success") {
                    $scope.leavesDetails= data.message;
                    $scope.totalItems = $scope.leavesDetails.length;
                    $('#loader').css("display","none");
                }
                else{
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage=data.message;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $('#errror').css("display","none");
                    }, 3000);
                }
            })
            .error(function (data, status, headers) {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage="Could not send ";
                $('#error').css("display","block");
                setTimeout(function() {
                        $('#errror').css("display","none");
                }, 3000);
            });
    }
    $scope.paginate = function(value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.leavePerPage;
        end = begin + $scope.leavePerPage;
        index = $scope.leavesDetails.indexOf(value);

        return (begin <= index && index < end);
    };
});
myApp.controller('LeaveApprovalController', function($scope,$http) {

    $scope.currentPage=1;
    $scope.leaveApprovalPerPage=10;

    $scope.leavesApprovalList=[];

    $scope.approvalleaves={
        operation:""
    }
    $scope.getLeavesApproval=function(){

        $scope.approvalleaves.operation="getLeavesApproval";
        var config = {
            params: {
                details: $scope.approvalleaves
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if(data.status=="fail"){
                    alert(data.message);
                }
                else {
                    console.log(data.message);
                    $scope.leaveApprovalList = data.message;
                    $scope.totalItems = $scope.leaveApprovalList.length;
                }

            })
            .error(function (data, status, headers, config) {

                alert("Error Occured..."+data);
            });
    }

    $scope.getLeavesApproval();

    $scope.processLeaveApproval=function(actionStatus,applicationId){

        console.log(actionStatus);
        console.log(applicationId);
        var data={
            operation :"LeaveApprovalAction",
            applicationId : applicationId,
            status:actionStatus
        };

        var config = {
            params: {
                details: data
            }
        };

        $http.post("Payroll/php/PayrollFacade.php",null, config)

            .success(function (data)
            {
                console.log(data);
                if(data.status!="successful"){
                    alert(data.message);
                }else{
                    alert("Status Updated Successfully");
                }
            })
            .error(function (data, status, headers, config)
            {
                alert("Error Occured"+data);
            });

    }

    $scope.paginate = function(value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.leaveApprovalPerPage;
        end = begin + $scope.leaveApprovalPerPage;
        index = $scope.leaveApprovalList.indexOf(value);

        return (begin <= index && index < end);
    };
});
