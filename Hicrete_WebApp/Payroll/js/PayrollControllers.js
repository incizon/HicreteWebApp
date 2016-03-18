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
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display","none");
                $scope.errorMessage=data.error;
                $('#error').css("display","block");
            });

        }
});

myApp.controller('ConfigureHolidaysController', function($scope,$http) {


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


        $scope.errorMessage="";
        $scope.warningMessage="";
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
                }
            })
            .error(function (data, status, headers, config) {

                $('#loader').css("display","none");
                $scope.errorMessage=data.error;
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

        employee:"Namdev Devmare",
        approver:"Atul Dhatrak",
        status:"pending",
        remaining:10,
        operation:""
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


    ////count number of leaves applied
    //$scope.dayDiff = function(leaveDetails.fromDate,leaveDetails.toDate){
    //    var date2 = new Date($scope.formatString(leaveDetails.toDate));
    //    console.log(date2);
    //    var date1 = new Date($scope.formatString(leaveDetails.fromDate));
    //    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    //    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    //    alert(diffDays);
    //}
    //
    //$scope.formatString = function(format) {
    //    var day   = parseInt(format.substring(0,2));
    //    var month  = parseInt(format.substring(3,5));
    //    var year   = parseInt(format.substring(6,10));
    //    var date = new Date(year, month-1, day);
    //    return date;
    //}

    //console.log($scope.leaveDetails.fromDate);

    $scope.ApplyForLeave=function(){
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
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");

                    setTimeout(function() {
                        if(data.msg!=""){
                            $('#warning').css("display","none");
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
                $scope.LeaveApprovers=data.LeaveApprover;
                $scope.EmployeeDetails=data.EmployeeDetails;

                console.log($scope.LeaveApprovers);
                console.log($scope.EmployeeDetails);
            })
            .error(function (data, status, headers, config) {


            });

    }

    $scope.getEmployeeDetails();

    $scope.AddEmployee=function(){

        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.employeeDetails.operation="addEmployee";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.employeeDetails
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

    $scope.leaveDetails=[
        {
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        },
        {
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        },
        {
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        }


    ];

    $scope.leaves={
        operation:""
    }

    $scope.showFromDate = function(){
        $scope.showFrom.opened = true;
    };

    $scope.showFrom = {
        opened:false
    };

    $scope.showToDate = function(){
        $scope.showTo.opened = true;
    };

    $scope.showTo = {
        opened:false
    };

    $scope.SearchLeave=function(){

        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.leaves.operation="searchLeave";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.leaves
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

myApp.controller('SearchLeaveByEmployeeController', function($scope,$http) {

    $scope.leaveDetails=[
        {
            leaveBy:"Atul",
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        },
        {
            leaveBy:"Ajit",
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        },
        {
            leaveBy:"Namdev",
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        }


    ];

    $scope.leaves={
        opeartion:""
    }
    $scope.searchByEmployee=function(){

        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.leaves.operation="searchLeaveByEmployee";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.leaves
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

myApp.controller('SearchLeaveByDateController', function($scope,$http) {

    $scope.leaveDetails=[
        {
            leaveBy:"Namdev",
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        },
        {
            leaveBy:"Atul",
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        },
        {
            leaveBy:"Ajit",
            fromDate:"02-02-2016",
            toDate:"03-03-2016",
            reason:"Personal",
            type:"Paid",
            status:"rejeted",
            applicationDate:"01-01-2016"
        }


    ];

    $scope.leaves={
        opeartion:""
    }


    $scope.searchFrom = function(){
        $scope.from.opened = true;
    };

    $scope.from = {
        opened:false
    }

    $scope.searchTo = function(){
        $scope.to.opened = true;
    };

    $scope.to = {
        opened:false
    }

    $scope.searchByDate=function(){

        $scope.errorMessage="";
        $scope.warningMessage="";

        $scope.leaves.operation="searchLeaveByDate";

        $('#loader').css("display","block");

        var config = {
            params: {
                details: $scope.leaves
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