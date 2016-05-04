myApp.controller('CreateYearController', function($scope,$http,$rootScope) {

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


        $scope.yearDetails.operation="createYear";


        if($scope.yearDetails.startDate!=undefined && $scope.yearDetails.startDate!==''){
            var viewValue=new Date($scope.yearDetails.startDate);
            viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            $scope.yearDetails.startDate=viewValue.toISOString().substring(0, 10);

        }

        if($scope.yearDetails.endDate!=undefined && $scope.yearDetails.endDate!==''){
            var viewValue1=new Date($scope.yearDetails.endDate);
            viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
            $scope.yearDetails.endDate=viewValue1.toISOString().substring(0, 10);

        }

        var config = {
            params: {
                details: $scope.yearDetails
            }
        };


        $('#loader').css("display","block");
        $http.post("Payroll/php/PayrollFacade.php", null, config)

            .success(function (data) {
                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $rootScope.warningMessage =data.message;
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                        window.location = "dashboard.php#/Payroll";
                    }, 1000);
                }
                if(data.status=="failure"){
                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");

                    }, 3000);
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While Creating Year";
                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                    window.location = "dashboard.php#/Payroll";
                },1000);
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
        $('#loader').css("display","block");
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);

                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $scope.holidaysDetails=data.message;
                    $scope.configureHoliday.caption_of_year=$scope.holidaysDetails.caption_of_year;
                    $scope.configureHoliday.from_date=$scope.holidaysDetails.from_date;
                    $scope.configureHoliday.to_date=$scope.holidaysDetails.to_date;

                    $scope.holidaysList=$scope.holidaysDetails.holidaysList;
                    console.log($scope.holidaysList);
                }
                if(data.status=="failure"){

                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                    }, 3000);
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While Fetching Details";
                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                },3000);
            });
    }

    $scope.getCurrentYearDetails();


    $scope.addHoliday=function(){



        $scope.configureHoliday.operation="createHoliday";

        if($scope.configureHoliday.holidayDate!=undefined && $scope.configureHoliday.holidayDate!==''){
            var viewValue1=new Date($scope.configureHoliday.holidayDate);
            viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
            $scope.configureHoliday.holidayDate=viewValue1.toISOString().substring(0, 10);

        }

        var config = {
            params: {
                details: $scope.configureHoliday
            }
        };


        $('#loader').css("display","block");

        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {

                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $rootScope.warningMessage =data.message;
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                        window.location = "dashboard.php#/Payroll/ConfigureHolidays";
                    }, 1000);
                }
                if(data.status=="failure"){
                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                    }, 3000);
                }
            })
            .error(function (data, status, headers, config) {

                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While Creating Holiday";
                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                },3000);
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
            $('#loader').css("display","block");
            $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $rootScope.warningMessage =data.message;
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                        window.location = "dashboard.php#/Payroll";
                    }, 1000);
                }
                if(data.status=="failure"){
                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                    }, 3000);
                }
            })
            .error(function (data, status, headers, config) {

                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While Removing Holiday";
                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                },3000);

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

                var viewValue=new Date($scope.leaveDetails.fromDate);
                viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                $scope.leaveDetails.fromDate=viewValue.toISOString().substring(0, 10);



                var viewValue1=new Date($scope.leaveDetails.toDate);
                viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
                $scope.leaveDetails.toDate=viewValue1.toISOString().substring(0, 10);


                $scope.leaveDetails.operation="getNoOfLeaves";
                var config = {
                    params: {
                        details: $scope.leaveDetails
                    }
                };
                console.log(JSON.stringify($scope.leaveDetails));
                $http.post("Payroll/php/PayrollFacade.php", null, config)
                    .success(function (data) {
                        console.log(data);
                        $scope.leaveDetails.numberOfLeaves=data;
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
                            window.location = "dashboard.php#/Payroll";
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

                //console.log(data);
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
                            window.location = "dashboard.php#/Payroll";
                        }
                    }, 1000);
                }

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

        if($scope.leaves.fromDate!=undefined && $scope.leaves.fromDate!==""){
            var viewValue1=new Date($scope.leaves.fromDate);
            viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
            $scope.leaves.fromDate=viewValue1.toISOString().substring(0, 10);

        }

        if($scope.leaves.toDate!=undefined && $scope.leaves.toDate!==""){
            var viewValue=new Date($scope.leaves.toDate);
            viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            $scope.leaves.toDate=viewValue.toISOString().substring(0, 10);

        }

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

                    $('#loader').css("display","none");
                }
                else{
                    $scope.loading=false;
                    $scope.leavesDetails = [];
                    $('#loader').css("display","none");
                    $scope.errorMessage=data.message;
                    $('#error').css("display","block");
                }
                $scope.totalItems = $scope.leavesDetails.length;
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

                $('#loader').css("display","none");
            }
            else{
                $scope.loading=false;
                $scope.leavesDetails=[];
                $('#loader').css("display","none");
                $scope.errorMessage=data.message;
                $('#error').css("display","block");
            }
            $scope.totalItems = $scope.leavesDetails.length;
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
        console.log(value);
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

        if($scope.yearDetails!=undefined ){
            if($scope.yearDetails.fromDate!=undefined && $scope.yearDetails.fromDate!==""){
                var viewValue=new Date($scope.searchDetails.fromDate);
                viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                $scope.yearDetails.fromDate=viewValue.toISOString().substring(0, 10);
            }
            if($scope.yearDetails.toDate!=undefined && $scope.yearDetails.toDate!==""){
                var viewValue1=new Date($scope.searchDetails.toDate);
                viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
                $scope.yearDetails.toDate=viewValue1.toISOString().substring(0, 10);
            }
        }




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

                    $('#loader').css("display","none");
                }
                else{
                    $scope.leavesDetails=[];

                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage=data.message;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $('#errror').css("display","none");
                    }, 3000);
                }
                $scope.totalItems = $scope.leavesDetails.length;
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

    $scope.processLeaveApproval=function(actionStatus,applicationId,index){

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
                if(data.status!="success"){

                    alert(data.message);
                }else{
                    //console.log(index);
                    $scope.leaveApprovalList.splice(index, 1);
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

