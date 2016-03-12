myApp.controller('CreateYearController', function($scope,$http) {

    console.log("IN");

    $scope.yearDetails={

        operation:""
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
        $http.post("Payroll/php/PayrollDemo.php", null, config)
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

myApp.controller('ConfigureHolidaysController', function($scope,$http) {

});

myApp.controller('ApplyForLeaveController', function($scope,$http) {

    $scope.leaveDetails={

        employee:"Namdev Devmare",
        approver:"Atul Dhatrak",
        remaining:10,
        operation:""
    };
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
        $http.post("Payroll/php/PayrollDemo.php", null, config)
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

        opeartion:""
    }

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
        $http.post("Payroll/php/PayrollDemo.php", null, config)
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

        $http.post("Payroll/php/PayrollDemo.php", null, config)
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

        $http.post("Payroll/php/PayrollDemo.php", null, config)
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

        $http.post("Payroll/php/PayrollDemo.php", null, config)
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