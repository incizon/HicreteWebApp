myApp.controller('budgetSegmentController', function ($scope, $http,$rootScope) {

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

        $("#loader").css("display","block");
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {

                console.log(data);

                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $rootScope.warningMessage =data.message;
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                           window.location = "dashboard.php#/Process";
                    }, 1000);
                 }
                if(data.status=="failure"){
                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);
                 }
            })
            .error(function (data, status, headers, config) {

                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While creating segment";
                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                    window.location = "dashboard.php#/Process";
                }, 1000);
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


myApp.controller('costCenterController', function ($scope, $http,AppService,$rootScope,$uibModal,$log,inventoryService) {
    $scope.createCostCenterClicked = false;

    $scope.projectList = [];

    var data = {
        operation: "getProjectListWithoutCostCenter"
    };
    var config = {
        params: {
            data: data
        }
    };

    $http.post("Process/php/projectFacade.php", null, config)
        .success(function (data) {
            console.log("IN Project Get");
            console.log(data );
            if (data.status != "Successful") {
                alert("Failed:" + data.message);
            } else {
                for (var i = 0; i < data.message.length; i++) {
                    $scope.projectList.push({
                        id: data.message[i].ProjectId,
                        name: data.message[i].ProjectName

                    });
                }
            }

        })
        .error(function (data) {
            alert("Error  Occurred:" + data);
        });




    $scope.segmentList = [];
    $scope.costCentermaterials=[];
    $scope.costCenterDetails = {
        projectId: "",
        costCenterName: "",
        segments: null
    }

    /*Autocomplete start*/

    $scope.noProject=false;
    $scope.projectSelected=function($item,$model,$label){
        $scope.costCenterDetails.projectId=$model.id;
        console.log($scope.costCenterDetails);
    }

    $scope.removeSegments = function (index) {

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


        });

    $scope.addFields = function () {
        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.costCentermaterials.push({
                material: "",
                allocatedBudget: "",
                alertLevel: ""
            });
        }
        ;
    }

    $scope.remove = function (index) {
        $scope.costCentermaterials.splice(index, 1); //remove item by index
    };

    inventoryService.getProductsForInwardand($scope, $http);
    $scope.getNoOfMaterials = function () {
        return $scope.costCentermaterials.length;
    }
    $scope.createCostCenter = function () {
        $scope.createCostCenterClicked = false;

       console.log("cost center material");
        console.log($scope.costCentermaterials);
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'utils/ConfirmDialog.html',
            controller:  function ($scope,$rootScope,$uibModalInstance,costCenterData,segmentList,costCentermaterials) {

                 $scope.save = function () {
                    console.log("Ok clicked");
                    console.log(costCenterData);
                     console.log(segmentList);
                    $scope.saveCostCenter($scope,$rootScope, $http,costCenterData,segmentList,costCentermaterials);
                    $uibModalInstance.close();
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.saveCostCenter = function ($scope,$rootScope, $http, costCenterData,segmentList,costCentermaterials) {
                    var data = {
                        operation: "createCostCenter",
                        costCenterData: costCenterData,
                        segments:segmentList,
                        materials:costCentermaterials
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
                            $("#loader").css("display","block");
                            if (data.status == "success"){
                                $('#loader').css("display","none");
                                $rootScope.warningMessage =data.message;
                                $("#warning").css("display", "block");
                                setTimeout(function () {
                                    $("#warning").css("display", "none");
                                    window.location = "dashboard.php#/Process";
                                }, 1000);
                            }
                            if(data.status=="failure"){
                                $('#loader').css("display","none");
                                $rootScope.errorMessage =data.message;
                                $("#error").css("display", "block");
                                setTimeout(function () {
                                    $("#error").css("display", "none");
                                    window.location = "dashboard.php#/Process";
                                }, 1000);
                            }
                        })
                        .error(function (data, status, headers, config) {
                            $('#loader').css("display","none");
                            $rootScope.errorMessage ="Error Occur While creating cost center";
                            $("#error").css("display", "block");
                            setTimeout(function () {
                                $("#error").css("display", "none");
                                window.location = "dashboard.php#/Process";
                            },1000);
                        });
                };
            },
            resolve: {
                costCenterData: function () {
                    return $scope.costCenterDetails;
                },
                segmentList:function(){
                    return $scope.segmentList;
                },
                costCentermaterials:function(){
                    return $scope.costCentermaterials;
                }
            }

        });

        modalInstance.result.then(function () {
            console.log("In result");
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

        }
});

myApp.controller('expenseEntryController', function ($scope, $http,AppService,$rootScope) {

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
    //AppService.getAllProjects($http,$scope.projectList);
    //Fetching project list only for those whose cost center is created
    //Start
    var data = {
        operation: "getProjectListForExpense",
    };
    var config = {
        params: {
            data: data
        }
    };

    $http.post("Expense/php/expenseFacade.php", null, config)
        .success(function (data) {
            console.log("IN Project Get");
            console.log(data);
            if (data.status != "success") {
                alert("Failed:" + data.message);
            } else {
                for (var i = 0; i < data.message.length; i++) {
                    $scope.projectList.push({
                        id: data.message[i].ProjectId,
                        name: data.message[i].ProjectName

                    });
                }
            }

        })
        .error(function (data) {
            //alert("Error  Occurred:" + data);
        });


    /*Auto complete starts*/
    $scope.noProject=false;
    $scope.noProject1=false;
    $scope.noMaterial=false;
    $scope.projectSelected=function($item,$model,$label){

        console.log($model);
        $scope.expenseDetails.project=$model.id;
        console.log($scope.expenseDetails);
    }

    $scope.materialSelected=function($item,$model,$label,materials){
            console.log($model);
            materials.material=$model.materialid;
            console.log($scope.materialsExpense);

    }
    //END
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
    $scope.getProjectSegments=function($item, $model, $label){

        console.log($model);
        projectId=$model.id;
        $scope.expenseDetails.project=$model.id;

        console.log("IN Project Segment Get");
        var data = {
            operation: "getProjectWiseSegments",
            projectId:projectId
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


            });
    }
    $scope.addOtherExpense = function () {


        $scope.otherExpenseClicked = false;
        if($scope.expenseDetails.isBillApplicable){
            var viewValue=new Date($scope.billDetails.dateOfBill);
            viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            $scope.billDetails.dateOfBill=viewValue.toISOString().substring(0, 10);

        }

        var data = {
            operation: "addOtherExpense",
            otherExpenseData: $scope.expenseDetails,
            billDetails: $scope.billDetails
        };
        console.log(data);
        var config = {
            params: {
                data: data
            }
        };
        $("#loader").css("display","block");
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $rootScope.warningMessage =data.message;
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);
                }
                if(data.status=="failure"){
                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);
                }
            })
            .error(function (data, status, headers, config) {

                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While Adding Other Expense Details";

                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                    window.location = "dashboard.php#/Process";
                },1000);
            });

    }

    $scope.materialsExpense=[];
    $scope.addFields = function () {
        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.materialsExpense.push({
                material: "",
                amount: "",
                description: "",
                isBillApplicable:true,
                billno: "",
                billIssuingEntity: "",
                billdate: "",
            });
        }
        ;
    }
    $scope.remove = function (index) {

        $scope.materialsExpense.splice(index, 1);
    };

    $scope.addMaterialExpense = function () {
        $scope.materialExpenseClicked = false;

        console.log($scope.expenseDetails);

        if($scope.materialsExpense.billdate!=undefined){
            var viewValue=new Date($scope.materialsExpense.billdate);
            viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            $scope.materialsExpense.billdate=viewValue.toISOString().substring(0, 10);
        }
        console.log("Material Expenses");
        console.log($scope.materialsExpense);

        var data = {
            operation: "addMaterialExpense",
            projectId: $scope.expenseDetails.project,
            materialsExpense: $scope.materialsExpense
        };

        var config = {
            params: {
                data: data
            }
        };

        $("#loader").css("display","block");
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display","none");
                if (data.status === "success"){
                    $('#loader').css("display","none");
                    $rootScope.warningMessage =data.message;
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 3000);
                }
                if(data.status==="failure"){
                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 3000);
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While Adding Material Expense Details";

                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                    window.location = "dashboard.php#/Process";
                },1000);
            });
    }

});

myApp.controller('costCenterSearchController', function ($scope, $rootScope,$http,$stateParams,AppService) {

    var projectid="";


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

    if($stateParams.costCenterForProject!=undefined){
        $scope.projectName=$stateParams.costCenterForProject.project_name;
        projectid=$stateParams.costCenterForProject.projectId;
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
                console.log("Expense DETAILSD= ");
                console.log(data);
                if (data == "1") {

                } else {
                    $rootScope.expenseDetails = data;
                    $scope.costCenterData=data;

                    console.log("Budget Values=");
                    console.log($scope.costCenterData[0].SegmentBudgetDetails);
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");

            });


    }


    //}

    $scope.getTotalMaterialExpense=function($materialId,$costCenterData){
        var totalMaterialExpense=0;
        if($costCenterData.materialExpenseDetails!=null || $costCenterData.materialExpenseDetails!=undefined){
            for(var i=0;i<$costCenterData.materialExpenseDetails.length;i++){
                if(parseInt($materialId)==parseInt($costCenterData.materialExpenseDetails[i].materialID)){
                    totalMaterialExpense=totalMaterialExpense+parseInt($costCenterData.materialExpenseDetails[i].amountMaterialExpenseDetails);
                }
            }
        }
        return totalMaterialExpense;
    }
    $scope.deleteSegment=function($segmentId,$index){
        var data = {
            operation: "deleteSegment",
            segmentId:$segmentId
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if(data.status=="Success"){
                    $scope.Segments.splice($index,1);
                    alert(data.message);
                }else{
                    alert(data.message);
                }

            })
            .error(function (data, status, headers, config) {
                alert("Failure : Error Occurred");
            });

    }

    $scope.getTotalSegmentExpense=function(segment){

        var totalExpense=0;
        for (var i = 0; i < segment.length; i++) {
            totalExpense=totalExpense+ parseInt(segment[i].amountExpenseDetails);
        }
        return totalExpense;

    }
    $scope.paginateSegment = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.ItemsPerPage;
        end = begin + $scope.ItemsPerPage;
        index = $scope.Segments.indexOf(value);

        return (begin <= index && index < end);
    };

});

myApp.controller('BillApprovalController', function ($scope,$http,$rootScope) {

    console.log("In billApproval");
    $scope.totalItems=0;
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
        $("#loader").css("display","block");
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $scope.billApprovalList=data.message;
                    $scope.totalItems=$scope.billApprovalList.length;
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
                $rootScope.errorMessage ="Could not fetch Bill Approvals";
                $("#error").css("display", "block");
            });
    }

    $scope.getBillApproval();

    $scope.viewBillDetails=function(expenseDetailsId){

        var data = {
            operation: "getBillDetails",
            expenseDetailsId:expenseDetailsId
        };

        var config = {
            params: {
                data: data
            }
        };

        $("#loader").css("display","block");
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $scope.billDetails=data.message;
                }
                if(data.status=="failure"){
                    console.log("In Fail");
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
                $rootScope.errorMessage ="Could not fetch Bill Details";
                $("#error").css("display", "block");
            });
    }
    $scope.billAction=function(billId,status){

        var data = {
            operation: "updateBillStatus",
            billId:billId,
            status:status
        };
        var config = {
            params: {
                data: data
            }
        };
        $("#loader").css("display","block");
        $http.post("Expense/php/expenseFacade.php", null, config)
            .success(function (data) {
                if (data.status == "success"){
                    $('#loader').css("display","none");
                    $rootScope.warningMessage =data.message;
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);
                }
                if(data.status=="failure"){
                    $('#loader').css("display","none");
                    $rootScope.errorMessage =data.message;
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                        window.location = "dashboard.php#/Process";
                    }, 1000);
                }
            })
            .error(function (data, status, headers, config) {
                $('#loader').css("display","none");
                $rootScope.errorMessage ="Error Occur While Updating Bill Status";
                $("#error").css("display", "block");
                setTimeout(function () {
                    $("#error").css("display", "none");
                    window.location = "dashboard.php#/Process";
                },1000);
            });
        }
    $scope.paginate = function(value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.billApprovalPerPage;
        end = begin + $scope.billApprovalPerPage;
        index = $scope.billApprovalList.indexOf(value);
        return (begin <= index && index < end);
    };

});