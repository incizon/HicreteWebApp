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

    this.getSavedProducts = function ($scope) {
        console.log("In get saved products");
        $scope.products = savedData;
        $scope.productsToModify = savedData;
    }
    /***************************************************************************
     Get Product Details
     ****************************************************************************/
    this.getProductsForInwardandOutward = function ($scope, $http) {
        $('#loader').css("display","block");
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
                console.log("IN SERVICE OF Inventory PRODUCTS FOR INWARD OUTWARD=");
                console.log(data);
                $('#loader').css("display","none");
                $scope.materialsForOutwardInward = data;
            })
            .error(function (data, status, headers) {
                console.log("IN SERVICE OF Inventory Search Failure=");
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

    this.getSavedCompanys = function ($scope) {
        console.log("IN Saved Company Get");
        $scope.Company = companys;
        console.log(companys);
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

    this.getSavedWarehouses = function ($scope) {
        console.log("IN Saved Warehouse Get");
        $scope.warehouses = warehouses;
        console.log(warehouses);
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

    this.addSupplier = function ($scope, $http, supplier) {

        $('#loader').css("display","block");
        var config = {
            params: {
                supplier: supplier
            }
        };
        console.log("supllier");
        console.log(supplier);
        $http.post("Inventory/php/supplierSubmit.php", null, config)
            .success(function (data) {
                console.log("Supplier Data=");
                console.log(data);
                $scope.warningMessage="Success";
                if(data.msg!=""){
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                }
                setTimeout(function () {
                    if (data.msg != ""){
                        $('#warning').css("display","none");
                    }
                }, 3000);
                $('#loader').css("display","none");
                if (data.error != ""){
                    $scope.errorMessage=data.error;
                    //$('#error').css("display","block");
                }
                //$scope.messages.push(data.msg);
                //$scope.clearData(supplier, 'submit');
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
        $http.post("Inventory/php/inventory_Add_MaterialType.php", materialType)
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
                $scope.clear();
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

    this.inwardEntry = function ($scope, $http, inwardData) {
        console.log("IN SERVICE OF INWARD=");
        $('#loader').css("display","block");
        var data = {
            inwardData: $scope.InwardData,
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
                $scope.warningMessage=data.msg;
                if(data.msg!=""){
                    $scope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                    alert(data.msg);
                }

                setTimeout(function () {
                    if (data.msg != ""){
                        $('#warning').css("display","none");
                    }
                }, 3000);
                $('#loader').css("display","none");
                if (data.error != ""){
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");
                    alert(data.error);
                }

                window.location="dashboard.php#/Inventory";

                //$scope.inwardData=[];
                setTimeout(function(){
                    //window.location.reload(true);
                    // window.location="dashboard.php#/Inventory";
                },1000);
            })
            .error(function (data, status, headers) {
                console.log(data);
                alert(data);
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
                    doShowAlert("Success", data.msg);
                    $scope.clearFields(outwardData);
                } else if (data.error != "")
                    doShowAlert("Failure", data.error);
            })
            .error(function (data, status, headers) {
                console.log(data);

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
                    $rootScope.prodInq = data;
                    $scope.totalItems= $rootScope.prodInq.length;
                }
                //$scope.clear();
                if (data.msg != "" && prodBatchInfo.option != 'Inquiry' && prodBatchInfo.option != 'InquiryAll') {
                    //doShowAlert("Success", data.msg);
                    if(data.msg!=""){
                        $scope.warningMessage=data.msg;
                        $('#warning').css("display","block");
                    }
                    setTimeout(function() {
                        $scope.$apply(function() {
                            if(data.msg!=""){
                                $('#warning').css("display","none");
                            }
                        });
                    }, 3000);

                }
                else if (data.error != "" && prodBatchInfo.option != 'Inquiry' && prodBatchInfo.option != 'InquiryAll') {
                    //doShowAlertFailure("Failure", data.error);
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");

                }
                $scope.step = 1;
                $scope.clear('All');


                //$scope.messages.push(data.msg);
                // $scope.clearData(supplier,'submit');
            })
            .error(function (data, status, headers, config) {
                console.log("Error calling php");
                //$scope.messages=data.error;
                $scope.errorMessage=data.error;
                $('#error').css("display","block");
                $('#loader').css("display","none");
                //$scope.messages.push(data.error);
            });
    };

});

/************************************************************************
 * End Of PRODUCTION Service
 *************************************************************************/