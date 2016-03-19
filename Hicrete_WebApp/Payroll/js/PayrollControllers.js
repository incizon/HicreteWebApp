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
                $scope.employeeData=data;

            })
            .error(function (data, status, headers, config) {


            });

    }

    $scope.getEmployeeDetails();

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