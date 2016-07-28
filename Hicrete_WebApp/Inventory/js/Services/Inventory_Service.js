myApp.service('inventoryService', function () {

    var savedData = {};
    var companys = {};
    var warehouses = {};
    /***************************************************************************
     Get Product Details
     ****************************************************************************/
    this.getProducts = function ($scope, $http) {
        $scope.loading=true;
        $http.post("Inventory/php/ProductSearch.php", null)
            .success(function (data) {
                console.log("Items Present in database");
                console.log(data);
                savedData = data;
                $scope.loading=false;
                //$scope.getSavedProducts($scope,data);
            })
            .error(function (data, status, headers) {
                console.log(data);
                // $scope.messages.push(data.error);
            });
    };

    /***************************************************************************
     Get Product Details
     ****************************************************************************/
    this.getProductsForInwardand = function ($scope, $http) {
        $('#loader').css("display","block");
        var data = {
            module: 'getProductsForInward'
        }
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log("IN SERVICE OF Inventory PRODUCTS FOR INWARD OUTWARD=");
                console.log(data);
                $('#loader').css("display","none");
                $scope.doneFetching=true;
                $scope.materialsForOutwardInward = data;
            })
            .error(function (data, status, headers) {
                console.log("IN SERVICE OF Inventory Search Failure=");
                console.log(data);

            });
    }
    this.getProductsForOutward = function ($scope, $http) {
        $('#loader').css("display","block");
        var data = {
            module: 'getProductsForOutward'
        }
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log("IN SERVICE OF getting OUTWARD=");
                console.log(data);
                $('#loader').css("display","none");
                $scope.materialsForOutward= data;
            })
            .error(function (data, status, headers) {

                console.log(data);

            });
    }
    /***************************************************************************
     Get Material Types
     ****************************************************************************/
    this.getMaterialTypes = function ($scope, $http) {
        $('#loader').css("display","block");
        $http.get("Inventory/php/Material.php")
            .success(function (data) {
                console.log("IN MATERIAL");
                $('#loader').css("display","none");
                $scope.materialNames = data;
                console.log(data);
                console.log($scope.materialNames);
            });
    }

    /***************************************************************************
     Start of Get Company's
     ****************************************************************************/

    this.getCompanys = function ($scope, $http) {
        $('#loader').css("display","block");
        var data = {
            operation: "getCompanys",
        };
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {
                $('#loader').css("display","none");
                console.log("IN Company Get");
                companys = data;
                $scope.Company=companys;
                console.log(data);
            });
    }

    /***************************************************************************
     End of Get Company's
     ****************************************************************************/

    /***************************************************************************
     Start of Get Warehouses's
     ****************************************************************************/

    this.getWarehouses = function ($scope, $http) {
        $('#loader').css("display","block");
        var data = {
            operation: "getWarehouses",
        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {
                $('#loader').css("display","none");
                warehouses = data;
                $scope.warehouses=data;
                console.log(data);
            });
    }


    /***************************************************************************
     End of Get Warehouses's
     ****************************************************************************/


});
/***************************************************************************
 Get Material Types
 ****************************************************************************/
/***************************************************************************
 * Start of Supplier Service
 ****************************************************************************/
myApp.service('addSupplierService', function () {

    this.addSupplier = function ($scope,$rootScope, $http, supplier) {

        $('#loader').css("display","block");
        var config = {
            params: {
                supplier: supplier
            }
        };

       // $scope.errorMessage = "";
        //$scope.warningMessage = "";
        console.log("supllier");
        console.log(supplier);
        $http.post("Inventory/php/supplierSubmit.php", null, config)
            .success(function (data) {
                console.log("Supplier Data=");
                console.log(data);
                //$scope.warningMessage="Success";
                console.log(data.msg);
                //$scope.warningMessage=data.msg;
                if(data.msg!=""){
                    $rootScope.warningMessage=data.msg;
                    $("#warning").css("display","block");
                    setTimeout(function () {
                        if (data.msg != ""){
                            $("#warning").css("display","none");
                        }
                    }, 3000);
                    console.log( $rootScope.warningMessage);
                    //alert(data.msg);
                   // window.location="dashboard.php#/Inventory/addSupplier";
                    console.log("clearing ");
                    $scope.submitted=false;
                    $scope.clearData(supplier,'clear');

                }

                $('#loader').css("display","none");
                if (data.error != ""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");
                    //window.location="dashboard.php#/Inventory/addSupplier";
                    $scope.submitted=false;
                   //$scope.clearData(supplier,'clear');
                }
               // $scope.messages.push(data.msg);
               // $scope.clearData(supplier, 'submit');
            })
            .error(function (data, status, headers, config) {
                console.log(data.error);
                $('#loader').css("display","none");
                $scope.errorMessage="Problem While connecting to server.Please check internet connection";
                //$('#error').css("display","block");
            });
    };

});

/***************************************************************************
 * End of Supplier Service
 ****************************************************************************/

/***************************************************************************
 * Start of Material Type Service
 ****************************************************************************/
myApp.service('addMaterialTypeService', function () {

    this.addMaterialtype = function ($scope, $http, materialType) {
        $('#loader').css("display","block");
        //console.log("inside controller check"+materialType);
        var data = {
            operation: 'Add',
            data:materialType,
        }
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Inventory/php/inventory_Add_MaterialType.php",  null, config)
            .success(function (data) {
                if(data.msg!=""){
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                }
                setTimeout(function () {
                    if (data.msg != ""){
                        $scope.warningMessage=data.msg;
                        $('#warning').css("display","none");
                    }
                }, 3000);
                $('#loader').css("display","none");
                 if (data.error != ""){
                     $scope.errorMessage=data.error;
                     $('#error').css("display","block");
                 }

                console.log(data);
                $scope.submitted = false;
                $scope.fetchMaterialTypes();
                $scope.clear();
                $scope.addField();
            })
            .error(function (data, status, headers, config) {
                console.log("Error calling php");
                $('#loader').css("display","none");
                $scope.errorMessage="Problem While connecting to server.Please check internet connection";
                $('#error').css("display","block");
                //$scope.messages=data.error;
                //$scope.messages.push(data.error);
            });
    };

});

/*****************************************************************************
 * END of Material Type Service
 ****************************************************************************/

/*****************************************************************************
 * START OF INWARD  Service
 ****************************************************************************/
myApp.service('inwardService', function () {

    this.inwardEntry = function ($scope,$rootScope, $http, inwardData) {
        console.log("IN SERVICE OF INWARD=");
        $('#loader').css("display","block");
        var data = {
            inwardData: inwardData,
            module: 'inward',
            operation: 'insert'
        }
        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                $('#loader').css("display","none");
                console.log("IN SERVICE OF INWARD=");
                console.log(data);
                $rootScope.warningMessage=data.msg;
                if(data.msg!=""){
                    $rootScope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                    setTimeout(function () {
                        $('#warning').css("display","none");
                        window.location="dashboard.php#/Inventory";
                    }, 2000);
                }

                $('#loader').css("display","none");
                if (data.error == ""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");
                }
            })
            .error(function (data, status, headers) {
                $('#loader').css("display","none");
                $('#error').css("display","block");
            });
    };

});
/************************************************************************
 * End Of Inward Service
 *************************************************************************/

/*****************************************************************************
 * START OF OUTWARD  Service
 ****************************************************************************/
myApp.service('outwardService', function () {

    this.outwardEntry = function ($scope, $http, outwardData) {
        $scope.errorMessage="";
        $scope.warningMessage="";
        var data = {
            outwardData: outwardData,
            module: 'outward',
            operation: 'insert'
        }
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log("IN SERVICE OF INWARD=");
                console.log(data);
                console.log(outwardData);
                $scope.outwardData = data;
                if (data.msg != "") {
                    //doShowAlert("Success", data.msg);
                    $scope.clearFields(outwardData);
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                    setTimeout(function () {
                        $('#warning').css("display","none");
                        window.location="dashboard.php#/Inventory";
                    }, 3000);
                } else if (data.error == ""){
                    $scope.errorMessage="Outward Details not added successfully..";
                    $('#error').css("display","block");
                    setTimeout(function () {
                        $('#error').css("display","none");
                    }, 3000);
                }else{
                    $scope.errorMessage="Outward Details not added successfully..";
                    $('#error').css("display","block");
                    setTimeout(function () {
                        $('#error').css("display","none");
                    }, 3000);
                }
                   // doShowAlert("Failure", data.error);
            })
            .error(function (data, status, headers) {
                console.log(data);
                $scope.errorMessage="Outward Details not added successfully..";
                $('#error').css("display","block");
                setTimeout(function () {
                    $('#error').css("display","none");
                }, 3000);
            });
    };

    this.getMaterialTypes = function ($scope, $http) {
        $http.get("Inventory/php/Material.php")
            .success(function (data) {
                console.log("IN MATERIAL");
                $scope.materialNames = data;
                $scope.material = data;
                console.log($scope.materialNames);
                for (var i = 0; i < $scope.materialNames.length; i++) {
                    $scope.availableMaterials.push($scope.materialNames[i].materialtype);
                }
            });
    }

    this.getSupplierList = function ($scope, $http) {
        $http.get("Inventory/php/Material.php")
            .success(function (data) {
                console.log("IN MATERIAL");
                $scope.materialNames = data;
                $scope.material = data;
                console.log($scope.materialNames);
                for (var i = 0; i < $scope.materialNames.length; i++) {
                    $scope.availableMaterials.push($scope.materialNames[i].materialtype);
                }

            });
    }
});
/************************************************************************
 * End Of OUTWARD Service
 *************************************************************************/

/************************************************************************
 * Start Of PRODUCTION SERVICE Service
 *************************************************************************/

myApp.service('ProductionBatchService', function () {


    this.addProdBatchInfo = function ($scope, $http, prodBatchInfo,$rootScope) {
        console.log("before submitting"+prodBatchInfo);
        //$scope.submitted=false;
        //console.log(prodBatchInfo.prodcdMaterial);
        //console.log("inside controller check"+materialType);
        $('#loader').css("display","block");
        console.log(prodBatchInfo);
        var config = {
            params: {
                prodBatchInfo: prodBatchInfo
            }
        };


        $http.post("Inventory/php/Inventory_Production_Batch.php", null, config)
            .success(function (data) {
                $('#loader').css("display","none");
                console.log(data);

                if (prodBatchInfo.option == 'Inquiry' || prodBatchInfo.option == 'InquiryAll') {
                    if(prodBatchInfo.option == 'Inquiry' ) {
                        $rootScope.prodInq = data;
                        $scope.totalItems = $rootScope.prodInq.length;
                    }
                    if(prodBatchInfo.option == 'InquiryAll')
                    {
                        $rootScope.prodInqAll = data;
                        $scope.totalItems = $rootScope.prodInqAll.length;

                    }
                }
                //$scope.clear();
                if (data.msg != "" && prodBatchInfo.option != 'Inquiry' && prodBatchInfo.option != 'InquiryAll') {
                    //doShowAlert("Success", data.msg);
                   /* if(prodBatchInfo.option=='complete')
                    {*/
                        //alert(data.msg);
                        $rootScope.warningMessage=data.msg;
                        console.log($rootScope.warningMessage);
                        $('#warning').css("display","block");
                        setTimeout(function() {
                            $('#warning').css("display","none");
                            window.location="dashboard.php#/Inventory";
                        }, 1000);


                    /*    $scope.clear('ALL');
                    $scope.submitted=false;
                    $scope.step=1;*/


                    if(prodBatchInfo.option=='complete')
                    {
                        $rootScope.prodInq.splice(prodBatchInfo.selectedIndex,1);

                    }
                    if(data.error!=""){
                        $rootScope.errorMessage=data.msg;
                        //alert(data.msg);
                        $('#error').css("display","block");
                        setTimeout(function() {
                            $('#error').css("display","none");
                            window.location="dashboard.php#/Inventory";
                        }, 3000);

                        $scope.submitted=false;
                    }


                }
                else if (data.error != "" && prodBatchInfo.option != 'Inquiry' && prodBatchInfo.option != 'InquiryAll') {
                    //doShowAlertFailure("Failure", data.error);
                    $rootScope.errorMessage=data.error;
                    //alert(data.error);
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $('#error').css("display","none");
                        //window.location="dashboard.php#/Inventory";
                    }, 3000);
                    $scope.submitted=false;
                    //window.location="dashboard.php#/Inventory";
                }
                //$scope.submitted=false;


            })
            .error(function (data, status, headers, config) {
                console.log("Error calling php");
                //$scope.messages=data.error;
                $('#loader').css("display","none");
                $rootScope.errorMessage=data.error;
                $('#error').css("display","block");
                setTimeout(function() {
                    $('#error').css("display","none");
                }, 3000);
                //$scope.messages.push(data.error);
            });
        //$scope.submitted=false;
    };

});

/************************************************************************
 * End Of PRODUCTION Service
 *************************************************************************/