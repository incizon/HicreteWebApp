myApp.controller('budgetSegmentController', function ($scope, $http) {

    $scope.segments = [];
    $scope.materialSegment=false;
    $scope.addClicked = false;
    $scope.submitClicked = false;
    $scope.showDialog = false;
    $scope.showModal = false;
    $scope.add = function () {

        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.addField();
        };
        $scope.noOfElement = "";
        $scope.addClicked = false;
    };


    $scope.clear = function () {
        $scope.segments.splice(0, $scope.segments.length);
    };

    $scope.remove = function (index) {

        $scope.segments.splice(index, 1);

        if ($scope.segments.length == 0)
            $scope.isSegmentAdded = true;
    };

    $scope.addField = function () {

        $scope.segments.push({name: ""});
    };


    $scope.initializeMaterialSegment = function () {
        $scope.submitClicked = false;
        //$scope.materialSegment = $scope.segments[0].name;
        //$scope.showModal = true;
        console.log($scope.showModal);
        $scope.addSegment();
    };


    $scope.addSegment = function () {
        $scope.showModal = false;
        var data = {
            operation: "addSegment",
            segments: $scope.segments,
            materialSegment: $scope.materialSegment
        };


        var config = {
            params: {
                data: data
            }
        };

        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log("Dataa");
                console.log(data);
                if (data == "0"){
                  alert("Segments Added Successsfully.!!!");
                 }else{
                   alert(data);
                 }
                    //doShowAlert("Success", "Added Successfully");
                window.location = "dashboard.php#/Process";

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");

            });
    };
    $scope.clearSegmentFields = function () {
        console.log("remove");
        angular.forEach($scope.segments, function (segment) {
            console.log(segment.name);
            segment.name = "";
        });
    };
});


myApp.controller('costCenterController', function ($scope, $http,AppService) {
    $scope.createCostCenterClicked = false;

    $scope.projectList = [];
    //$scope.projectList.push({name: "Project1", id: "1"});
    //$scope.projectList.push({name: "Project2", id: "2"});
    AppService.getAllProjects($http,$scope.projectList);

    $scope.segmentList = [];

    $scope.costCenterDetails = {
        projectId: "",
        costCenterName: "",
        segments: null
    }

    $scope.remove = function (index) {

        $scope.segmentList.splice(index, 1);
        //remove item by index
    };

    var data = {
        operation: "getSegments",
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Expense/php/expenseUtils.php", null, config)
        .success(function (data) {
            console.log(data);
            $scope.segmentList = data;

        })
        .error(function (data, status, headers, config) {
            doShowAlert("Failure", "Error Occurred");

        });


    $scope.createCostCenter = function () {
        $scope.createCostCenterClicked = false;

        // $scope.costCenterDetails=$scope.segmentList;

        // angular.extend($scope.costCenterDetails, $scope.segmentList);
        console.log($scope.segmentList);
        var data = {
            operation: "createCostCenter",
            costCenterData: $scope.costCenterDetails,
            segments:$scope.segmentList

        };
        console.log(data);
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data == "0") {
                    doShowAlert("Success", "Costcenter created Successfully");
                    window.location = "dashboard.php#/Process";
                } else {
                    doShowAlert("Failure", "Cannot connect to database");
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");

            });

    }

});


myApp.controller('expenseEntryController', function ($scope, $http,AppService) {

    $scope.otherExpenseClicked = false;
    $scope.materialExpenseClicked = false;
    $scope.expenseDetails = {
        costCenter: "",
        segmentName: "",
        amount: "",
        desc: "",
        isBillApplicable: false
    };

    $scope.billDetails = {
        billNo: "",
        firmName: "",
        dateOfBill: ""
    };

    $scope.billDate=function(){
        $scope.dateOfBill.opened=true;
    };

    $scope.dateOfBill={
        opened:false
    };

    $scope.otherBillDate=function(){
        $scope.otherDateOfBill.opened=true;
    };

    $scope.otherDateOfBill={
        opened:false
    };

     $scope.projectList=[];
    AppService.getAllProjects($http,$scope.projectList);

    var data = {
        module: 'getProducts'
    }
    var config = {
        params: {
            data: data
        }
    };
    $http.post("Inventory/php/InventoryIndex.php", null, config)
        .success(function (data) {
            console.log("Items For expense");
            console.log(data);
            $scope.materialEntryList = data;
        })
        .error(function (data, status, headers) {
            console.log("IN SERVICE OF Inventory Search Failure=");
            console.log(data);

        });


    /*
     START of getting segment list
     */
    var data = {
        operation: "getSegments",
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Expense/php/expenseUtils.php", null, config)
        .success(function (data) {
            console.log(data);
            if (data == "1") {

            } else {
                $scope.segmentList = data;
            }

        })
        .error(function (data, status, headers, config) {
            doShowAlert("Failure", "Error Occurred");

        });

    $scope.addOtherExpense = function () {
        $scope.otherExpenseClicked = false;
        var data = {
            operation: "addOtherExpense",
            otherExpenseData: $scope.expenseDetails,
            billDetails: $scope.billDetails

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log("config");
        console.log(config);
        console.log($scope.billDetails);
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $("#loading").css("display","block");
                if (data == "0") {
                    $('#loading').css("display","none");
                    $scope.warningMessage = "Other Expense Details Added successfully";
                    console.log($scope.warningMessage);
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 3000);
                    //doShowAlert("Success", "Other Expense Details Added successfully");
                } else {
                    $("#loading").css("display","none");
                    $scope.errorMessage = "Other Expense Details Not Added";
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                    }, 3000);
                    //doShowAlert("Failure", "Cannot connect to database");
                }

            })
            .error(function (data, status, headers, config) {
                //doShowAlert("Failure", "Error Occurred");
                $("#loading").css("display","none");
                $scope.errorMessage = "Other Expense Details Not Added";
                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                }, 3000);
            });
        //alert($scope.expenseDetails.costCenter);
    }

    $scope.addMaterialExpense = function () {
        $scope.materialExpenseClicked = false;
        var data = {
            operation: "addMaterialExpense",
            materialExpenseData: $scope.expenseDetails,
            billDetails: $scope.billDetails
        };

        var config = {
            params: {
                data: data
            }
        };
        console.log("config add material expense: ");
        console.log($scope.expenseDetails);
        console.log($scope.billDetails);
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loading').css('display','block');
                if (data == "0") {
                    $('#loading').css('display','none');
                    $scope.warningMessage = "Material Expense Details Added successfully";
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                    }, 3000);
                    //doShowAlert("Success", "Material Expense Details Added successfully");
                } else {
                    $('#loading').css('display','none');
                    $scope.errorMessage = "Material Expense Details Not Added";
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $('#error').css("display", "none");
                    }, 3000);
                    //doShowAlert("Failure", "Cannot connect to database");
                }

            })
            .error(function (data, status, headers, config) {
                $('#loading').css('display','block');
                $('#loading').css('display','none');
                $scope.errorMessage = "Material Expense Details Not Added";
                $('#error').css("display", "block");
                setTimeout(function () {
                    $('#error').css("display", "none");
                }, 3000);
                //doShowAlert("Failure", "Error Occurred");

            });
        //alert($scope.expenseDetails.costCenter);
    }


});


myApp.controller('costCenterSearchController', function ($scope, $rootScope,$http,$stateParams) {
    var projectid="";
    if($stateParams.costCenterForProject!=null){
        $scope.projectName=$stateParams.costCenterForProject.project_name;
        projectid=$stateParams.costCenterForProject.projectId;
    }

    console.log($stateParams.costCenterForProject);
    $scope.searchKewords=null;
    $scope.costCenterData={};

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.ItemsPerPage = 10;
    $scope.Segments = [];

    /*
     START of getting segment list
     */
    var data = {
        operation: "getSegments",
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Expense/php/expenseUtils.php", null, config)
        .success(function (data) {
            console.log(data);
                $scope.Segments = data;
                $scope.totalItems= $scope.Segments.length;

        })
        .error(function (data, status, headers, config) {
            doShowAlert("Failure", "Error Occurred");

        });
    /*
     End of getting segment list
     */

    //$scope.getExpenseDetails=function(){

        var keyword=$scope.searchKewords;
        //console.log(keyword);
        var data = {
            operation: "getExpenseDetails",
            projectId:projectid,
            //searchOn:$scope.Searchfilter
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Expense/php/expenseUtils.php", null, config)
            .success(function (data) {
                console.log("Expense Details= "+data);
                if (data == "1") {

                } else {
                    $rootScope.expenseDetails = data;
                    $scope.costCenterData=data;
                    console.log($rootScope.expenseDetails);
                  //  console.log($rootScope.expenseDetails[0].SegmentExpenseDetails[1].segmentName);
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");

            });

    //}


    $scope.paginateSegment = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.ItemsPerPage;
        end = begin + $scope.ItemsPerPage;
        index = $scope.Segments.indexOf(value);

        return (begin <= index && index < end);
    };

});

myApp.controller('BillApprovalController', function ($scope, $rootScope,$http,$stateParams) {


    $scope.currentPage=1;
    $scope.billApprovalPerPage=10;

    $scope.billApprovalList=[];

    $scope.getBillApproval=function(){

        var data = {
            operation: "getBillApproval"
        };

        var config = {
            params: {
                data: data
            }
        };
        $http.post("Expense/php/expenseUtils.php", null, config)
            .success(function (data) {
                console.log(data);

            })
            .error(function (data, status, headers, config) {
                alert("Error Occured..."+data);
            });
    }

    $scope.getBillApproval();


    $scope.paginate = function(value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.billApprovalPerPage;
        end = begin + $scope.billApprovalPerPage;
        index = $scope.billApprovalList.indexOf(value);

        return (begin <= index && index < end);
    };


});