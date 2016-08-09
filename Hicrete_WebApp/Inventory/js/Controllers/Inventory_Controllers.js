myApp.controller('reportController', function ($scope, $http, $uibModal, $log) {

    $scope.availableStockCount = 0;
    $scope.critialStock = 0;
    $scope.isShowCritical = false;
    var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'Inventory/html/filter.html',
        scope: $scope,
        controller: function ($scope, $uibModalInstance, criticalStock, AppService, $rootScope) {
            AppService.getUsers($scope, $http);

            $scope.SaveFilter = function () {
                //console.log($scope.paymentDetails);
                console.log("on Ok click");
                document.getElementById('availableStockDiv').style.display = 'none';
                var data = {
                    module: 'getCriticalStock'
                }
                var config = {
                    params: {
                        data: data
                    }
                };

                $http.post("Inventory/php/InventoryIndex.php", null, config)
                    .success(function (data) {
                        console.log(data);
                        if (data.status == 'Successful') {
                            $scope.criticalStock = data.message;
                            $scope.availableStockCount = $scope.criticalStock.totalCount;
                            $scope.critialStock = $scope.criticalStock.totalCriticalCount;
                            $scope.critial = ($scope.critialStock / $scope.availableStockCount) * 100;
                            $scope.available = 100 - $scope.critial;
                            $scope.showChart();
                        }


                    })
                    .error(function (data, status, headers) {
                        console.log(data);
                    });

                $scope.currentPage = 1;
                $scope.CriticalMaterialPerPage = 10;

                $scope.paginateCriticalMaterial = function (value) {
                    //console.log("In Paginate");
                    var begin, end, index;
                    begin = ($scope.currentPage - 1) * $scope.CriticalMaterialPerPage;
                    end = begin + $scope.CriticalMaterialPerPage;
                    index = $scope.criticalStock.criticalMaterial.indexOf(value);
                    //console.log(index);
                    return (begin <= index && index < end);
                };
                $scope.availableMaterialPerPage = 10;
                $scope.paginateavailableMaterial = function (value) {
                    //console.log("In Paginate");
                    var begin, end, index;
                    begin = ($scope.currentPage - 1) * $scope.availableMaterialPerPage;
                    end = begin + $scope.availableMaterialPerPage;
                    index = $scope.criticalStock.availableMaterial.indexOf(value);
                    //console.log(index);
                    return (begin <= index && index < end);
                };
                $scope.showChart = function () {
                    $('#chartContainer').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie',

                        },
                        title: {
                            text: 'Critical Stock in inventory'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Percentage',
                            colorByPoint: true,
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        //alert('Category: ' + this.name + ', value: ' + this.y);
                                        if (this.name == "Available stock") {

                                            document.getElementById('availableStockDiv').style.display = 'block';
                                            document.getElementById('criticalStockDiv').style.display = 'none';

                                        } else if (this.name == "Critical stock") {
                                            document.getElementById('availableStockDiv').style.display = 'none';
                                            document.getElementById('criticalStockDiv').style.display = 'block';

                                        }
                                    }
                                }
                            },
                            data: [{
                                name: 'Available stock',
                                y: $scope.available
                            }, {
                                name: 'Critical stock',
                                y: $scope.critial
                            }]
                        }]
                    });
                }
                $uibModalInstance.close();

            };
            $scope.Cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        },

        resolve: {
            criticalStock: function () {
                return $scope.criticalStock;
            }

        }
    });

    modalInstance.result.then(function (criticalStock) {
        //$scope.criticalStock = criticalStock.message;
        //$scope.availableStockCount = $scope.criticalStock.totalCount;
        //$scope.critialStock = $scope.criticalStock.totalCriticalCount;
        //$scope.critial = ($scope.critialStock / $scope.availableStockCount) * 100;
        //$scope.available = 100 - $scope.critial;
    }, function () {
        $log.info('Modal dismissed at: ' + new Date());
    });
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    //Highcharts.chart('container', {
    //
    //    title: {
    //        text: 'Categorized chart'
    //    },
    //
    //    xAxis: {
    //        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    //    },
    //
    //    series: [{
    //        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    //    }]
    //
    //});


    //$(function () {
    //    $('#container').highcharts({
    //        chart: {
    //            type: 'bar'
    //        },
    //        title: {
    //            text: 'Company Profit'
    //        },
    //        xAxis: {
    //            categories: ['Project1', 'Project2', 'Project3']
    //        },
    //        yAxis: {
    //            title: {
    //                text: 'Profit in Lacs'
    //            }
    //        },
    //        series: [{
    //            name: 'Hi-Crete',
    //            data: [5, 7, 4]
    //        }, {
    //            name: 'Hi-TechFlooring',
    //            data: [5, 7, 3]
    //        },
    //            {
    //                name: 'Hi-TechEngg',
    //                data: [5, 7, 3]
    //            }
    //        ],
    //    });
    //});
});



/**********************************************************************************
 * Start of Product controller
 *
 ***********************************************************************************/
myApp.controller('productController', function ($scope, $http, inventoryService) {

    $scope.currentPage = 1;
    $scope.InventoryItemsPerPage = 10;
    //Initialize all the variables
    $scope.data = {};
    //Init product object
    $scope.product = {
        description: "",
        color: "",
        alertquantity: "",
        packaging: "",
        unitofmeasure: "",
        materialtypeid: "",
        abbrevation: " ",
        productname: ""
    };
    $scope.submitted = false;
    $scope.submittedModal = false;
    $scope.loading = "";
    var isProductMasterTable = false;
    var isMaterialTable = false;
    var isPrductDetailsTable = false;
    var isProductPkgingTable = false;


    /**********************************************************************************
     * Purpose- This function will Add product details into database
     * @param1- product (all product details)
     * Return- success msg or failure msg
     ***********************************************************************************/
    $scope.addProduct = function (product) {
        //Set Extra attribute in object to identify operation to be performed
        product.opertaion = "insert";
        $scope.submitted = false;
        $scope.loading = true;

        $scope.errorMessage = "";
        $scope.warningMessage = "";
        $('#loader').css("display", "block");

        var config = {
            params: {
                product: product
            }
        };
        //call service
        $http.post("Inventory/php/InventoryProduct.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                if (data.msg != "") {
                    $scope.warningMessage = data.msg;
                    //alert(data.msg);
                    $('#warning').css("display", "block");
                }
                setTimeout(function () {
                    $scope.$apply(function () {
                        if (data.msg != "") {
                            $('#warning').css("display", "none");
                        }
                    });
                }, 3000);

                $scope.loading = false;

                if (data.msg == "") {
                    $scope.errorMessage = data.error;
                    //alert(data.error);
                    $('#error').css("display", "block");
                }

                $scope.clearFields(product);

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);

                //alert(data);
                $('#loader').css("display", "none");
                $scope.errorMessage = data.error;
                $('#error').css("display", "block");
            });

    };
    /**********************************************************************************
     *End of add product function
     **********************************************************************************/


    /**********************************************************************************
     * Purpose- This function will Clear all fileds of form
     * @param1- product (all product details)
     * Return- nothing
     ***********************************************************************************/
    $scope.clearFields = function (product) {
        product.description = "";
        product.color = "";
        product.alertquantity = "";
        product.packaging = "";
        product.unitofmeasure = "";
        product.materialtypeid = "";
        product.abbrevation = "";
        product.productname = "";
    };
    /**********************************************************************************
     *End of add product function
     **********************************************************************************/


    /**********************************************************************************
     * Purpose- This function will Update the product details
     * @param1- product (all product details)
     * Return- Success or Failure
     ***********************************************************************************/
    $scope.updateProductInfo = function (product) {
        console.log("Product in Update Info function");
        //Set Extra attribute in object to identify operation to be performed as update
        product.opertaion = "modify";
        //Check which tables should get affected
        product.isProductMasterTable = isProductMasterTable;
        product.isProductDetailsTable = isPrductDetailsTable;
        product.isProductPackagingTable = isProductPkgingTable;
        product.isProductMaterialTable = isMaterialTable;
        $scope.loading = "";
        $scope.warningMessage = "";
        $scope.errorMessage = "";

        // Create json object
        var config = {
            params: {
                product: product
            }
        };
        $scope.loading = true;
        $('#loader').css("display", "block");
        //call add product service
        $http.post("Inventory/php/InventoryProduct.php", null, config)
            .success(function (data) {

                $scope.lodaing = false;
                $('#loader').css("display", "none");
                if (data.msg != "") {
                    //alert("Success", data.msg);
                    $scope.warningMessage = data.msg;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $scope.$apply(function () {
                            if (data.message != "") {
                                $('#warning').css("display", "none");
                            }
                        });
                    }, 3000);
                }
                else {
                    //alert("Success", data.error);
                    $scope.errorMessage = data.error;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $scope.$apply(function () {
                            if (data.message != "") {
                                $('#error').css("display", "none");
                            }
                        });
                    }, 3000);
                }

                window.location.reload = true;

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);
                //alert(data);
                $scope.lodaing = false;
                $('#loader').css("display", "none");
                $scope.errorMessage = data.error;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $scope.$apply(function () {
                        if (data.message != "") {
                            $('#error').css("display", "none");
                        }
                    });
                }, 3000);
            });

    }
    /**********************************************************************************
     *End of Update product function
     **********************************************************************************/


    /**********************************************************************************
     * Get Particular product details to show on modal
     **********************************************************************************/
    $scope.getProduct = function (product) {
        $scope.selectedProduct = product;
        console.log($scope.selectedProduct);
    }
    /**********************************************************************************
     *End of Getter
     **********************************************************************************/


    /***************************************************************************
     * Start of Get Material Types
     ****************************************************************************/
    $http.get("Inventory/php/Material.php")
        .success(function (data) {
            console.log("IN MATERIAL");
            $scope.materialNames = data;
            console.log(data);
        });
    /***************************************************************************
     * End of Get Material Types
     ****************************************************************************/
    /*************************************************************************
     No Material Found Variable Autocomplte
     *************************************************************************/
    $scope.noMaterial=false;

    $scope.materialTypeSelected=function(material){

        $scope.product.materialtypeid=material.materialtypeid;
        console.log($scope.product);

    }
});
/**********************************************************************************
 * End of Product controller
 *
 ***********************************************************************************/


/***********************************************************************************************************
 * Start of Inward Controlller
 *
 ************************************************************************************************************/

myApp.controller('inwardController', function ($scope, $rootScope, $http, inwardService, inventoryService, $log, $uibModal, AppService) {
    $scope.InwardData = {
        inwardNumber: "",
        date: "",
        companyName: "",
        warehouseName: "",
        suppervisor: "",
        hasTransportDetails: "",

        transportMode: "",
        vehicleNumber: "",
        transportCost: "",
        transportRemark: "",
        transportAgency: "",
        driver: "",
        transportPayable: "",
        inwardMaterials: [
            {
                material: "",
                materialQuantity: "",
                packageUnit: "",
                suppplierName: "",
                size: ""
            }
        ]
    };
    // $scope.inventoryData={};
    $scope.material = {};
    $scope.step = 1;
    $scope.showModal = false;
    $scope.submitted = false;
    //$scope.errorMessage="";
    //$scope.warningMessage="";


    /***********************************************
     *Start of Clear Fields Function
     ************************************************/
    $scope.clearFields = function (InwardData) {

        console.log("clearing");
        $scope.InwardData.inwardNumber = "";
        $scope.InwardData.material = "";
        $scope.InwardData.packageUnit = "";
        $scope.InwardData.companyName = "";
        $scope.InwardData.suppplierName = "";
        $scope.InwardData.date = "";
        $scope.InwardData.materialQuantity = "";
        $scope.InwardData.warehouseName = "";
        $scope.InwardData.suppervisor = "";

        $scope.InwardData.transportMode = "";
        $scope.InwardData.vehicleNumber = "";
        $scope.InwardData.transportCost = "";
        $scope.InwardData.transportRemark = "";
        $scope.InwardData.transportAgency = "";
        $scope.InwardData.driver = "";
        $scope.InwardData.transportPayable = "";
        $scope.InwardData.hasTransportDetails = "";
        $scope.InwardData.inwardMaterials.splice(0, $scope.InwardData.inwardMaterials.length);
        $scope.InwardData.inwardMaterials.push({
            material: "",
            materialQuantity: "",
            packageUnit: "",
            suppplierName: "",
            size: ""
        });
    };

    /*************************************************
     *End of Clear Fields Function
     **************************************************/
    /*Auto complete start*/

    $scope.noMaterial=false;
    $scope.noSupplier=false;

    $scope.materialSelected=function($item,$model,$label,materials){
        materials.material=$model.materialid;
        console.log($model);
    }

    $scope.supplierSelected=function($item,$model,$label,materials){
        console.log($model);
        materials.suppplierName=$model.supplierid;
    }

    $scope.getNoOfMaterials = function () {
        return $scope.InwardData.inwardMaterials.length;
    }
    inventoryService.getProductsForInwardand($scope, $http);
    //Get Warehouses
    inventoryService.getWarehouses($scope, $http);
    // Get Company
    inventoryService.getCompanys($scope, $http);

    //GetUsers
    AppService.getUsers($scope, $http);

    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];

    $scope.filters = [
        {filterName: 'Product Name', id: 1},
        {filterName: 'Company Name', id: 2},
        {filterName: 'Warehouse Name', id: 3},
        {filterName: 'Available Inventory', id: 4}
    ];
    $scope.SearchTerm = $scope.filters[2].filterName;

    var isInwardTable = false;
    var isInwardDetailsTable = false;
    var isInwardTransportTable = false;
    $scope.stepa = 1;
    /**********************************
     Add material fields
     *******************************/
    var data = {
        module: 'getSuppliers',
    }
    var config = {
        params: {
            data: data
        }
    };
    $http.post("Inventory/php/InventoryIndex.php", null, config)
        .success(function (data) {
            console.log(data);
            $scope.suppliers = data;
        })
        .error(function (data, status, headers) {
            console.log(data);
        });
    $scope.getUnitOfMeasure = function (pMaterialId) {
        var qty;

        for (var i = 0; i < $scope.materialsForOutwardInward.length; i++) {
            if (pMaterialId == $scope.materialsForOutwardInward[i].materialid) {
                // qty = $scope.materialsForOutward[i].totalquantity;
                $scope.availableTotalquantity = qty;
                $scope.unitofMeasure = $scope.materialsForOutwardInward[i].unitofmeasure;
                qty = $scope.unitofMeasure;
            }
        }

        return qty;
    }

    $scope.addFields = function () {
        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.InwardData.inwardMaterials.push({
                material: "",
                materialQuantity: "",
                packageUnit: "",
                suppplierName: ""
            });
        }
        ;
    }
    /**********************************
     End of Add material fields
     *******************************/
    $scope.remove = function (index) {

        $scope.InwardData.inwardMaterials.splice(index, 1); //remove item by index
    };

    $scope.nextForm = function () {

        if ($scope.InwardData.hasTransportDetails == 'No') {
            // $scope.showModal=true;
            //alert("if");
            $scope.addInwardDetails();
        } else if ($scope.InwardData.hasTransportDetails == 'Yes') {
            $scope.step = 2;
            $scope.submitted = false;
        }

    }
    $scope.nextStep = function () {
        //alert("next step:"+$scope.InwardData.hasTransportDetails);

        if ($scope.InwardData.hasTransportDetails == 'No') {
            $scope.addInwardDetails($scope.InwardData);
        } else if ($scope.InwardData.hasTransportDetails == 'Yes') {
            $scope.step++;
            $scope.submitted = false;
        }
    }

    $scope.prevStep = function () {
        $scope.step--;
    }

    $scope.today = function () {
        $scope.InwardData.date = new Date();
    };
    $scope.today();

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openDate = function () {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

   // $scope.InwardData.date= new Date($scope.InwardData.date);
    //console.log($scope.InwardData.date);
    $scope.addInwardDetails = function (inwardData) {

        console.log("Add inwardDetails function =");
        console.log($scope.InwardData);
       // inwardData.date= new Date(inwardData.date);
       //console.log(inwardData.date);
        var viewValue1=new Date(inwardData.date);
        viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
        inwardData.date=viewValue1.toISOString().substring(0, 10);

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'utils/ConfirmDialog.html',
            controller: function ($scope, $rootScope, $uibModalInstance, inwardData) {

                $scope.clearFields = function (InwardData) {

                    InwardData.inwardNumber = "";
                    InwardData.material = "";
                    InwardData.packageUnit = "";
                    InwardData.companyName = "";
                    InwardData.suppplierName = "";
                    InwardData.date = "";
                    InwardData.materialQuantity = "";
                    InwardData.warehouseName = "";
                    InwardData.suppervisor = "";

                    InwardData.transportMode = "";
                    InwardData.vehicleNumber = "";
                    InwardData.transportCost = "";
                    InwardData.transportRemark = "";
                    InwardData.transportAgency = "";
                    InwardData.driver = "";
                    InwardData.transportPayable = "";
                    InwardData.hasTransportDetails = "";
                    InwardData.inwardMaterials.splice(0, InwardData.inwardMaterials.length);
                    InwardData.inwardMaterials.push({
                        material: "",
                        materialQuantity: "",
                        packageUnit: "",
                        suppplierName: "",
                        size: ""
                    });


                };

                $scope.save = function () {

                    $scope.inwardEntry($scope, $rootScope, $http, inwardData);
                    $uibModalInstance.close();
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.inwardEntry = function ($scope, $rootScope, $http, inwardData) {

                    $('#loader').css("display", "block");
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

                    $http.post("Inventory/php/InventoryIndex.php", null, config)
                        .success(function (data) {
                            $('#loader').css("display", "none");
                            if (data.msg != "") {
                                $rootScope.warningMessage = data.msg;
                                $('#warning').css("display", "block");
                                setTimeout(function () {
                                    $('#warning').css("display", "none");
                                    //window.location="dashboard.php#/Inventory";
                                }, 2000);
                                $scope.clearFields(inwardData);
                                // $scope.submitted= false;
                                $scope.step = 1;
                            } else {
                                $rootScope.errorMessage = data.error;
                                $('#error').css("display", "block");
                            }
                            $('#loader').css("display", "none");

                        })
                        .error(function (data, status, headers) {
                            $('#loader').css("display", "none");
                            $('#error').css("display", "block");
                        });
                };
            },
            resolve: {
                inwardData: function () {
                    return $scope.InwardData;
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


        //inwardService.inwardEntry($scope, $http, $scope.InwardData);
        $scope.submitted = false;
        $scope.step = 1;
    }

    /***************************************************************************
     * Purpose- This function will update inward entry into DB
     * @param1- inwardData (data which needs to be updated)
     * Return- Success or Failure while updating
     ****************************************************************************/
    $scope.updateInwardEntry = function (inwardData) {

        inwardData.isInwardTable = isInwardTable;
        inwardData.isInwardDetailsTable = isInwardDetailsTable;
        inwardData.isInwardTransportTable = isInwardTransportTable;

        var data = {
            inwardData: inwardData,
            module: 'inward',
            operation: 'update'
        }
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {

                if (data.msg != "") {
                    doShowAlert("Success", data.msg);
                    setTimeout(function () {
                        window.location = "dashboard.php#/Inventory";
                    }, 1000);
                } else if (data.error != "")
                    doShowAlert("Failure", data.error);
            })
            .error(function (data, status, headers) {
                console.log(data);

            });
    }
    /***************************************************************************
     * End of update inward entry function
     ****************************************************************************/

    /**********************************************************************************
     *Setters to set true/false for tables to modify
     **********************************************************************************/
    $scope.setInwardTable = function () {
        isInwardTable = true;
    }
    $scope.setInwardDetailsTable = function () {
        isInwardDetailsTable = true;

    }
    $scope.setInwardTransport = function () {
        isInwardTransportTable = true;

    }
    /**********************************************************************************
     *End of Setters
     **********************************************************************************/

});

/***********************************************************************************************************
 * End of Inward Controller
 *
 ************************************************************************************************************/


/***********************************************************************************************************
 * Start of Outward Controlller
 *
 ************************************************************************************************************/

myApp.controller('outwardController', function ($scope, $rootScope, $http, outwardService, inventoryService, AppService, $uibModal) {
    //$scope.errorMessage="";
    //$scope.warningMessage="";
    $scope.productsToModify = [];
    $scope.productAvailable = [];
    $scope.OutwardData = {

        outwardMaterials: [
            {
                material: "",
                materialQuantity: "",
                packageUnit: "",
                suppplierName: ""
            }
        ]
    };
    $scope.material = {};
    $scope.step = 1;
    $scope.submitted = false;

    AppService.getUsers($scope, $http);
    $scope.getNoOfMaterials = function () {

        return $scope.OutwardData.outwardMaterials.length;
    }
    var isOutwardTable = false;
    var isOutwardDetailsTable = false;
    var isOutwardTransportTable = false;

    $scope.todayDate = function () {
        $scope.OutwardData.date = new Date();
    };
    $scope.todayDate();

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    //Get Warehouses
    inventoryService.getWarehouses($scope, $http);
    // Get Company
    inventoryService.getCompanys($scope, $http);

    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];


    inventoryService.getProductsForOutward($scope, $http);

    $scope.getProduct = function (product) {
        $scope.selectedProduct = product;
    }


    $scope.getAvailableQty = function (pMaterialId) {
        var qty;
       console.log(pMaterialId);

        for (var i = 0; i < $scope.materialsForOutward.length; i++) {
            if (pMaterialId == $scope.materialsForOutward[i].materialid) {
                qty = $scope.materialsForOutward[i].totalquantity;
                $scope.availableTotalquantity = qty;
                $scope.unitofMeasure = $scope.materialsForOutward[i].unitofmeasure;
                break;
            }

        }
       console.log("Available Quantity:"+$scope.availableTotalquantity);
        return qty;
    }

    $scope.showErrorMessage=function(availableQty,Qty){
        if(availableQty < Qty)
          return true;
        else
          return false;
    }

    $scope.getUnit = function (pMaterialId) {
        var qty;

        for (var i = 0; i < $scope.materialsForOutward.length; i++) {
            if (pMaterialId == $scope.materialsForOutward[i].materialid) {
                $scope.unitofMeasure = $scope.materialsForOutward[i].unitofmeasure;
                qty = $scope.unitofMeasure;

            }
        }

        return qty;
    }

    /*Auto complete start*/
    $scope.noMaterial=false;
    $scope.materialSelected=function($item,$model,$label,materials){

        materials.material=$model.materialid;
        console.log($model);
    }
    /**********************************
     Add material fields
     *******************************/
    $scope.addFields = function () {
        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.OutwardData.outwardMaterials.push({
                material: "",
                materialQuantity: "",
                packageUnit: "",
            });
        }
        ;
        //$scope.getAvailableQty();
    }
    /**********************************
     End of Add material fields
     *******************************/
    $scope.remove = function (index) {
        $scope.OutwardData.outwardMaterials.splice(index, 1); //remove item by index
    };


    /************************************************************
     * Purpose- This function opens next forms or Modal depends on condition
     * Return- Nothing
     *************************************************************/
    $scope.nextStep = function () {
        if ($scope.OutwardData.hasTransportDetails == 'No') {
            $scope.addOutwardDetails($scope.OutwardData);
        } else if ($scope.OutwardData.hasTransportDetails == 'Yes') {
            $scope.step = 2;
            $scope.submitted = false;

        }
    }
    $scope.prevStep = function () {
        $scope.step--;
    }
    /************************************************************
     * End of NExt and Prev step functions
     *************************************************************/

    /************************************************************
     * Purpose- This function will addd  Outward Entry
     * @param1- outward data
     * Return- success or failure
     *************************************************************/
    $scope.addOutwardDetails = function (outwardData) {

        var viewValue1=new Date(outwardData.date);
        viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
        outwardData.date=viewValue1.toISOString().substring(0, 10);

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'utils/ConfirmDialog.html',
            controller: function ($scope, $rootScope, $uibModalInstance, outwardData) {

                $scope.clearFields = function (OutwardData) {
                    OutwardData.OutwardNumber = "";
                    OutwardData.material = "";
                    OutwardData.packageUnit = "";
                    OutwardData.companyName = "";
                    OutwardData.date = "";
                    OutwardData.materialQuantity = "";
                    OutwardData.warehouseName = "";
                    OutwardData.suppervisor = "";

                    OutwardData.transportMode = "";
                    OutwardData.vehicleNumber = "";
                    OutwardData.transportCost = "";
                    OutwardData.transportRemark = "";
                    OutwardData.transportAgency = "";
                    OutwardData.driver = "";
                    OutwardData.transportPayable = "";
                    OutwardData.hasTransportDetails = "";
                    OutwardData.outwardMaterials.splice(0, OutwardData.outwardMaterials.length);
                    OutwardData.outwardMaterials.push({
                        material: "",
                        materialQuantity: "",
                        packageUnit: "",
                        suppplierName: "",
                        size: ""
                    });
                };
                $scope.save = function () {
                    $scope.outwardEntry($scope, $http, outwardData);
                    $uibModalInstance.close();
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.outwardEntry = function ($scope, $http, outwardData) {
                    $('#loader').css("display", "block");
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
                            $('#loader').css("display", "none");

                            if (data.msg != "") {
                                $('#loader').css("display", "none");
                                $rootScope.warningMessage = data.msg;
                                $('#warning').css("display", "block");
                                setTimeout(function () {
                                    $('#warning').css("display", "none");
                                    window.location = "dashboard.php#/Inventory";
                                }, 2000);
                                $scope.submitted = false;

                                $scope.clearFields(outwardData);
                                $scope.submitted = false;
                                $scope.step = 1;

                            } else {
                                $('#loader').css("display", "none");
                                $rootScope.errorMessage = data.error;
                                $('#error').css("display", "block");
                                setTimeout(function () {
                                    $('#error').css("display", "none");
                                }, 3000);
                            }
                            $scope.submitted = false;

                        })
                        .error(function (data, status, headers) {
                            console.log(data);
                            $('#loader').css("display", "none");
                            $rootScope.errorMessage = data.error;
                            $('#error').css("display", "block");
                            setTimeout(function () {
                                $('#error').css("display", "none");
                            }, 3000);
                        });
                };
            },
            resolve: {
                outwardData: function () {
                    return $scope.OutwardData;
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

        $scope.submitted = false;
        $scope.step = 1;
    }
    /***********************************************
     *End of add Outward function
     *************************************************/


    /************************************************************
     * Purpose- This function will update the Outward Entry
     * @param1- outward entry to modufy
     * Return- success or failure
     *************************************************************/
    $scope.updateOutwardInfo = function (selectedProduct) {

        selectedProduct.isOutwardTable = isOutwardTable;
        selectedProduct.isOutwardDetailsTable = isOutwardDetailsTable;
        selectedProduct.isOutwardTransportTable = isOutwardTransportTable;
        // pUpdatedProduct.isProductMaterialTable=isMaterialTable;

        var data = {
            selectedProduct: selectedProduct,
            module: 'outward',
            operation: 'modify'
        };
        // Create json object
        var config = {
            params: {
                data: data
            }
        };
        //call add product service
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {

                doShowAlert("Success", data.msg);
                setTimeout(function () {
                    window.location = "dashboard.php#/Inventory";
                }, 1000);


            })
            .error(function (data, status, headers, config) {
                console.log("IN POST Outward Error in UPDATE OPERATION:");
                doShowAlert("Failure", data.msg);
            });
    }
    /***********************************************
     *End of Update Outward function
     *************************************************/


    /***********************************************
     * STart of clear field controller
     *************************************************/
    $scope.clearFields = function (OutwardData) {
        //console.log("clearing");
        OutwardData.OutwardNumber = "";
        OutwardData.material = "";
        OutwardData.packageUnit = "";
        OutwardData.companyName = "";
        OutwardData.date = "";
        OutwardData.materialQuantity = "";
        OutwardData.warehouseName = "";
        OutwardData.suppervisor = "";

        OutwardData.transportMode = "";
        OutwardData.vehicleNumber = "";
        OutwardData.transportCost = "";
        OutwardData.transportRemark = "";
        OutwardData.transportAgency = "";
        OutwardData.driver = "";
        OutwardData.transportPayable = "";
        OutwardData.hasTransportDetails = "";
        OutwardData.outwardMaterials.splice(0, OutwardData.outwardMaterials.length);
        OutwardData.outwardMaterials.push({
            material: "",
            materialQuantity: "",
            packageUnit: "",
            suppplierName: "",
            size: ""
        });
    };
    /***********************************************
     * END of clear field controller
     *************************************************/

    /***************************************************
     *Setters to set true/false for tables to modify
     ****************************************************/
    $scope.setOutwardTable = function () {
        isOutwardTable = true;
    }
    $scope.setOutwardDetailsTable = function () {
        isOutwardDetailsTable = true;
    }
    $scope.setOutwardTransport = function () {
        isOutwardTransportTable = true;
    }
    /***************************************************
     *End of Setters
     ****************************************************/
});

/***********************************************************************************************************
 * End of Outward Controller
 *
 ************************************************************************************************************/

/***********************************************************************************************************
 * MATERIAL TYPE CONTROLLER
 * Add Material Type to Inventory
 *
 ************************************************************************************************************/

myApp.controller('addMaterialType', function ($scope, $http, addMaterialTypeService) {
    $scope.materialType = [];
    $scope.materialTypePerPage=7;

    $scope.currentPage = 1;
    //$scope.InventoryOutwardItemsPerPage = 10;
    $scope.submitted = false;
    $scope.errorMessage = "";
    $scope.warningMessage = "";
    $scope.materialType.push({
        type: ""
    });
    $scope.paginate = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.materialTypePerPage;
        end = begin + $scope.materialTypePerPage;
        index = $scope.fetchedMaterialTypes.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    $scope.sizeCheck = function () {
        if ($scope.materialType.length == 0) {
            return 0;
        }
        else
            return 1;
    }

    $scope.submit = function (materialType) {

        addMaterialTypeService.addMaterialtype($scope, $http, materialType)
        //$scope.clear();
        $scope.submitted = false;

    };
    $scope.addFields = function () {

        for (var i = 0; i < $scope.noOfMaterials; i++) {
            $scope.addField();
        }
        ;
        $scope.noOfMaterials = "";
    };

    $scope.deleteMaterialType = function(materialType)
    {
        var data = {
            operation: 'Delete',
            data:materialType
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

                    setTimeout(function () {
                        $('#error').css("display","none");
                    }, 3000);

                }

                console.log(data);
                //$scope.submitted = false;
                //$scope.fetchedMaterialTypes[index]=materialType;
                $scope.fetchMaterialTypes();
                //$scope.clear();
                //$scope.addField();
            })
            .error(function (data, status, headers, config) {
                console.log("Error calling php");
                $('#loader').css("display","none");
                $scope.errorMessage="Problem While connecting to server.Please check internet connection";
                $('#error').css("display","block");
                //$scope.messages=data.error;
                //$scope.messages.push(data.error);
            });


    }

    $scope.modifyMaterialtype =function(materialType,index)
    {
        var data = {
            operation: 'Modify',
            data:materialType
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
                //$scope.submitted = false;
                //$scope.fetchedMaterialTypes[index]=materialType;
                $scope.fetchMaterialTypes();
                //$scope.clear();
                //$scope.addField();
            })
            .error(function (data, status, headers, config) {
                console.log("Error calling php");
                $('#loader').css("display","none");
                $scope.errorMessage="Problem While connecting to server.Please check internet connection";
                $('#error').css("display","block");
                //$scope.messages=data.error;
                //$scope.messages.push(data.error);
            });
    }

    $scope.fetchMaterialTypes =function()
    {
        $('#loader').css("display","block");
        var data = {
            operation: 'fetch'
        }
        var config = {
            params: {
                data: data
            }
        };
        //console.log("inside controller check"+materialType);
        $http.post("Inventory/php/inventory_Add_MaterialType.php",  null, config)
            .success(function (data) {
                if(data.msg!=""){
                    //$scope.warningMessage=data.msg;
                    console.log(data);
                    $scope.fetchedMaterialTypes=data.data;
                    $scope.length=$scope.fetchedMaterialTypes.length;
                   // $('#warning').css("display","block");
                }

                $('#loader').css("display","none");
                if (data.error != ""){
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");
                }


            })
            .error(function (data, status, headers, config) {
                console.log("Error calling php");
                $('#loader').css("display","none");
                $scope.errorMessage="Problem While connecting to server.Please check internet connection";
                $('#error').css("display","block");
                //$scope.messages=data.error;
                //$scope.messages.push(data.error);
            });
    }

    $scope.fetchMaterialTypes();
    $scope.clear = function () {
        $scope.materialType.splice(0, $scope.materialType.length);
    };

    $scope.remove = function (index) {
        $scope.materialType.splice(index, 1);
    };

    $scope.addField = function () {

        $scope.materialType.push({
            type: ""
        });
    };


});
/*********************************************************************************************
 * End of Material Type Controller
 *********************************************************************************************/


/***********************************************************************************************
 * START OF SUPPLIER CONTROLLER
 *Add Supplier controller
 **************************************************************************************************/
myApp.controller('addSupplierController', function ($scope, $rootScope, $http, addSupplierService) {

    $scope.submitted = false;
    $scope.supplier = {
        supplierName: "",
        contactNo: "",
        address: "",
        city: "",
        country: "",
        pinCode: ""

    };
    //$scope.errorMessage="";
    //$scope.warningMessage="";
    $scope.messages = [];
    //for clearing the fields
    $scope.clearData = function (supplier, msg) {
        supplier.supplierName = "";
        supplier.contactNo = "";
        supplier.address = "";
        supplier.city = "";
        supplier.country = "";
        supplier.pinCode = "";
        supplier.pointOfContact = "";
        supplier.officeNo = "";
        supplier.VATNo = "";
        supplier.CSTNo = "";

        if (msg == 'clear') {
            $scope.messages[0] = "";
        }
    };


    $scope.submitData = function (supplier) {


        addSupplierService.addSupplier($scope, $rootScope, $http, supplier);
    };


});
/*
 * End of Supplier Controller
 */

//Start of outward search controller
myApp.controller('OutwardSearchController', function ($http, $scope, $rootScope) {

    $scope.keyword = "";
    $scope.totalOutwardItems = 0;
    $scope.currentOutwardPage = 1;
    $scope.InventoryOutwardItemsPerPage = 10;

    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;

    $scope.paginateOutward = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentOutwardPage - 1) * $scope.InventoryOutwardItemsPerPage;
        end = begin + $scope.InventoryOutwardItemsPerPage;
        index = $scope.OutwardSearchData.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };

    $scope.getProduct = function (product) {
        $scope.selectedProduct = product;
        $scope.viewMaterials = $scope.selectedProduct.materialDetails;

    }
    $scope.getOutwardDetails = function () {
        $scope.materialDetails = [];
        var data = {
            module: 'outward',
            operation: 'search',
            keyword: $scope.keyword,
            SearchTerm: $scope.SearchTerm
        }
        var config = {
            params: {
                data: data
            }
        };
        $('#loader').css("display", "block");
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");

                $rootScope.OutwardSearchData = data;
                $scope.totalOutwardItems = $rootScope.OutwardSearchData.length;
            })
            .error(function (data, status, headers) {
                console.log("IN SERVICE OF Inward Search Failure=");
                console.log(data);
                $scope.loading = false;
                $('#loader').css("display", "none");
            });

    };


});

//End of outward search controller


/////////////////////////////////////////////////////////////////////////////////////
//Start of inward search controller
/////////////////////////////////////////////////////////////////////////////////////

myApp.controller('InwardSearchController', function ($http, $scope, $rootScope) {
    $scope.keyword = "";
    $scope.totalInwardItems = 0;
    $scope.currentInwardPage = 1;
    $scope.InventoryInwardItemsPerPage = 10;
    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;
    $scope.paginateInward = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentInwardPage - 1) * $scope.InventoryInwardItemsPerPage;
        end = begin + $scope.InventoryInwardItemsPerPage;
        index = $rootScope.InwardSearchData.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };

    $scope.getViewDataObject = function (product, materialDetails) {
        $scope.viewMaterials = {};
        $scope.viewProduct = product;
        $scope.viewMaterials = $scope.viewProduct.materialDetails;
    }
    $scope.getInwardDetails = function () {
        $scope.materialDetails = [];
        var data = {
            module: 'inward',
            operation: 'search',
            keyword: $scope.keyword,
            SearchTerm: $scope.SearchTerm
        }
        var config = {
            params: {
                data: data
            }
        };
        $('#loader').css("display", "block");
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                console.log("Inward Search=");
                console.log(data);
                $rootScope.InwardSearchData = data;
                $scope.totalInwardItems = $rootScope.InwardSearchData.length;

            })
            .error(function (data, status, headers) {
                console.log("IN SERVICE OF Inward Search Failure=");
                console.log(data);
                $scope.loading = false;
                $('#loader').css("display", "none");
            });

    };


});


/////////////////////////////////////////////////////////////////////////////////////
//End of inward search controller
/////////////////////////////////////////////////////////////////////////////////////


/*********************************************************************************************
 * START of product Search Controller
 *********************************************************************************************/


/*********************************************************************************************
 * End of product Search Controller
 *********************************************************************************************/

myApp.controller('ProductSearchController', function ($scope, $http, $rootScope) {

    //$scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.InventoryItemsPerPage = 10;
    $scope.keyword = "";
    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;

    var isProductMasterTable = false;
    var isMaterialTable = false;
    var isPrductDetailsTable = false;
    var isProductPkgingTable = false;

    $http.get("Inventory/php/Material.php")
        .success(function (data) {
            $scope.materialNames = data;
        });
    $scope.paginate = function (value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.InventoryItemsPerPage;
        end = begin + $scope.InventoryItemsPerPage;
        index = $rootScope.products.indexOf(value);
        return (begin <= index && index < end);
    };

    $scope.getProduct = function (product) {
        $scope.selectedProduct = product;
    }

    $scope.getProductDetails = function () {
        $scope.lodaing = "";
        var data = {

            keyword: $scope.keyword,
            SearchTerm: $scope.SearchTerm
        }
        var config = {
            params: {
                data: data
            }
        };
        $('#loader').css("display", "block");
        $http.post("Inventory/php/ProductSearch.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                $rootScope.products = data;
                $rootScope.totalProducts = $rootScope.products.length;
            })
            .error(function (data, status, headers) {
                console.log(data);
                $scope.lodaing = false;
                $('#loader').css("display", "none");
            });
    }


    /**********************************************************************************
     *Setters to set true/false for tables to modify
     **********************************************************************************/
    $scope.setMasterTable = function ($item,$model,$label) {
        console.log($model);
        $scope.selectedProduct.materialtypeid=$model.materialtypeid;
        isProductMasterTable = true;
    }
    $scope.setProductDetailsTable = function () {
        isPrductDetailsTable = true;
    }
    $scope.setProductPackagingTable = function () {
        isProductPkgingTable = true;
    }
    $scope.setProductMaterialTable = function () {
        isMaterialTable = true;

    }


    /*Autocomplet start */
    $scope.noMaterial=false;

    /**********************************************************************************
     *End of Setters
     **********************************************************************************/
    /**********************************************************************************
     * Purpose- This function will Update the product details
     * @param1- product (all product details)
     * Return- Success or Failure
     ***********************************************************************************/
    $scope.updateProductInfo = function (product) {

        console.log(product);
        //Set Extra attribute in object to identify operation to be performed as update
        product.opertaion = "modify";
        //Check which tables should get affected
        product.isProductMasterTable = isProductMasterTable;
        product.isProductDetailsTable = isPrductDetailsTable;
        product.isProductPackagingTable = isProductPkgingTable;
        product.isProductMaterialTable = isMaterialTable;
        $scope.loading = "";
        $scope.warningMessage = "";
        $scope.errorMessage = "";

        // Create json object
        var config = {
            params: {
                product: product
            }
        };
        $scope.loading = true;
        $('#loader').css("display", "block");
        //call add product service
        $http.post("Inventory/php/InventoryProduct.php", null, config)
            .success(function (data) {
                $scope.lodaing = false;
                console.log(data);
                $('#loader').css("display", "none");
                if (data.msg != "") {
                    //alert("Success", data.msg);
                    $scope.warningMessage = data.msg;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $scope.$apply(function () {
                            if (data.message != "") {
                                $('#warning').css("display", "none");
                            }
                        });
                    }, 3000);
                }
                else {
                    //alert("Success", data.error);
                    $scope.errorMessage = data.error;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $scope.$apply(function () {
                            if (data.message != "") {
                                $('#error').css("display", "none");
                            }
                        });
                    }, 3000);
                }

                window.location.reload = true;

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);
                //alert(data);
                $scope.lodaing = false;
                $('#loader').css("display", "none");
                $scope.errorMessage = data.error;
                $('#error').css("display", "block");
                setTimeout(function () {
                    $scope.$apply(function () {
                        if (data.message != "") {
                            $('#error').css("display", "none");
                        }
                    });
                }, 3000);
            });

    }
    /**********************************************************************************
     *End of Update product function
     **********************************************************************************/


});



/*********************************************************************************************
 * START of Search Controller
 *********************************************************************************************/
myApp.controller('SearchController', function ($scope, $http, inventoryService, $rootScope) {
    //Pagination variables
    $scope.submitted = false;
    $scope.submittedModal = false;
    //$scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.InventoryAvailableItemsPerPage = 10;
    $scope.filters = [
        {filterName: 'ProductName', id: 1},
        {filterName: 'CompanyName', id: 2},
        {filterName: 'WarehouseName', id: 3},
    ];

    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];
    $scope.SearchTerm = $scope.filters[0].filterName
    $scope.loading = ""

    $scope.keywords = "";

    $scope.getValues = function(product){

        $('#loader').css("display", "block");
        var data = {
            module: 'getHistory',
            data: product
        }
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                $rootScope.inventoryHistory = data;
                $rootScope.inventoryHistoryInward=$rootScope.inventoryHistory.InwardMaterial;
                //console.log($scope.inventoryHistoryInward[0].inwardno);
                $rootScope.inventoryHistoryOutward=$rootScope.inventoryHistory.outwardMaterial;
                $rootScope.productName = $rootScope.inventoryHistory.commonDetails[0].productName;
            })
            .error(function (data, status, headers) {
                console.log("IN SERVICE OF Inventory Search Failure=");
                console.log(data);
                $('#loader').css("display", "none");

            });

    }

    /*************************************************
     * START of GETTING INVENTORY DATA
     **************************************************/
    $scope.getInventoryData = function () {
        $('#loader').css("display", "block");
        var data = {
            module: 'inventorySearch',
            searchBy: $scope.SearchTerm,
            searchKeyword: $scope.keywords
        }
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log(data);
                $('#loader').css("display", "none");
                $rootScope.inventoryData= data;

                //$scope.InventoryAvailableItemsPerPage = data;
                //$rootScope.totalItems = $scope.inventoryData.length;

            })
            .error(function (data, status, headers) {
                console.log("IN SERVICE OF Inventory Search Failure=");
                console.log(data);
                $('#loader').css("display", "none");

            });
    }

    $scope.paginate = function (value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.InventoryAvailableItemsPerPage;
        end = begin + $scope.InventoryAvailableItemsPerPage;
        index = $rootScope.inventoryData.indexOf(value);
        return (begin <= index && index < end);
    };

    $scope.getViewDataObject = function (product, materialDetails) {

        $scope.viewMaterials = {};
        $scope.viewProduct = product;
        $scope.viewMaterials = $scope.viewProduct.materialDetails;
    }
    $scope.getMaterialObject = function (product) {
        $scope.viewMaterials = product;

    }

    $scope.getDataObjectToModify = function (product) {
        $scope.modifyInwardData = product;
    }
    /*************************************************
     * END of GETTING INVENTORY DATA
     **************************************************/

    $scope.getProduct = function (product) {
        $scope.selectedProduct = product;
        $scope.viewMaterials = $scope.selectedProduct.materialDetails;

    }


});

/*********************************************************************************************
 * END of Search Controller
 *********************************************************************************************/
/*********************************************************************************************
 * Start of modifyOutwardcontroller
 *********************************************************************************************/

myApp.controller('modifyOutwardController', function ($scope, $rootScope,$stateParams, $filter, $http, inventoryService, inwardService, AppService) {

    $scope.step=1;
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };
    $scope.openDate = function () {
        $scope.popup1.opened = true;
    };
    //inventoryService.getProductsForInwardand($scope, $http);
    inventoryService.getProductsForOutward($scope, $http);
    //Get Warehouses
    inventoryService.getWarehouses($scope, $http);
    // Get Company
    inventoryService.getCompanys($scope, $http);

    //GetUsers
    AppService.getUsers($scope, $http);

    $scope.autoComplete=function($item,$model,$label,materials){
        materials.materialid=$model.materialid;
        console.log("Modify="+$model.materialid);
    }
    var data = {
        module: 'getSuppliers',
    }
    var config = {
        params: {
            data: data
        }
    };
    $http.post("Inventory/php/InventoryIndex.php", null, config)
        .success(function (data) {
            console.log(data);
            $scope.suppliers = data;
        })
        .error(function (data, status, headers) {
            console.log(data);
        });

    $scope.getNoOfMaterials = function () {
        return $scope.OutwardDataModify.materialDetails.length;
    }

    $scope.getUnit = function (pMaterialId) {
        var qty;

        for (var i = 0; i < $scope.materialsForOutward.length; i++) {
            if (pMaterialId == $scope.materialsForOutward[i].materialid) {
                $scope.unitofMeasure = $scope.materialsForOutward[i].unitofmeasure;
                qty = $scope.unitofMeasure;

            }
        }

        return qty;
    }


    /*$scope.getNoOfMaterials = function () {
        return $scope.InwardDataModify.inwardMaterials.length;
    }
*/


    console.log($stateParams.selectedOutward);
    $scope.OutwardDataModify=$stateParams.selectedOutward;

    //$scope.InwardDataModify.inwardMaterials=$stateParams.selectedInward.materialDetails;
    //$scope.InwardDataModify.inwardMaterials=$stateParams.selectedInward.materialDetails;




    if($scope.OutwardDataModify.drivername == "--")
    {
        $scope.OutwardDataModify.hasTransportDetails="No";
    }else
    {
        $scope.OutwardDataModify.hasTransportDetails="Yes";
    }
    //console.log($scope.OutwardDataModify);

    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];

    $scope.remove = function (index) {

        $scope.OutwardDataModify.materialDetails.splice(index, 1); //remove item by index
    };
    $scope.prevStep = function () {
        $scope.step--;
    }

    $scope.addFields = function () {
        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.OutwardDataModify.materialDetails.push({
                material: "",
                materialQuantity: "",
                packageUnit: "",
                suppplierName: ""
            });
        }
        ;
    }



    $scope.getAvailableQty1 = function (pMaterialId) {
        var qty;

       // console.log($scope.materialsForOutward);
        for (var i = 0; i < $scope.materialsForOutward.length; i++) {
            if (pMaterialId == $scope.materialsForOutward[i].materialid) {
                qty = $scope.materialsForOutward[i].totalquantity;
                $scope.availableTotalquantity = qty;
                $scope.unitofMeasure = $scope.materialsForOutward[i].unitofmeasure;
                break;
            }

        }
        console.log("Available Quantity:"+$scope.availableTotalquantity);
        return qty;
    }

    $scope.modifyOutwardDetails=function (OutwardDataModify)
    {
        $('#loader').css("display", "block");
        var data = {
            outwardData: OutwardDataModify,
            module: 'outward',
            operation: 'Modify'
        }
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                if (data.msg != "") {
                    console.log(data);
                    $rootScope.warningMessage = data.msg;
                     $('#warning').css("display", "block");
                     setTimeout(function () {
                     $('#warning').css("display", "none");
                     window.location="dashboard.php#/Inventory";
                     }, 2000);
                     // $scope.submitted= false;
                     $scope.step = 1;

                } else {
                    console.log(data);
                    $rootScope.errorMessage = data.error;
                     $('#error').css("display", "block");
                }


            })
            .error(function (data, status, headers) {
                console.log(data);
                $('#loader').css("display", "none");
                 $('#error').css("display", "block");
            });

    }




    $scope.nextStep = function () {
        //alert("next step:"+$scope.InwardData.hasTransportDetails);

        if ($scope.OutwardDataModify.hasTransportDetails == 'No') {
            $scope.modifyOutwardDetails($scope.OutwardDataModify);
        } else if ($scope.OutwardDataModify.hasTransportDetails == 'Yes') {
            $scope.step++;
            $scope.submitted = false;
        }
    }

});


/*********************************************************************************************
 *END of modifyOutwardcontroller
 *********************************************************************************************/





/*********************************************************************************************
 * Start of modifyInwardcontroller
 *********************************************************************************************/
myApp.controller('modifyInwardController', function ($scope, $rootScope,$stateParams, $filter, $http, inventoryService, inwardService, AppService) {

    $scope.step=1;

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };
    $scope.openDate = function () {
        $scope.popup1.opened = true;
    };

    $scope.autoComplete=function($item,$model,$label,materials){
        materials.materialid=$model.materialid;
        console.log("Modify="+$model.materialid);
    }
    $scope.autoCompleteSupplier=function($item,$model,$label,materials){
        materials.supplierid=$model.supplierid;
        console.log("Modify="+$model.supplierid);
    }
    inventoryService.getProductsForInwardand($scope, $http);
    //Get Warehouses
    inventoryService.getWarehouses($scope, $http);
    // Get Company
    inventoryService.getCompanys($scope, $http);

    //GetUsers
    AppService.getUsers($scope, $http);

    var data = {
        module: 'getSuppliers',
    }
    var config = {
        params: {
            data: data
        }
    };
    $http.post("Inventory/php/InventoryIndex.php", null, config)
        .success(function (data) {
            console.log(data);
            $scope.suppliers = data;
        })
        .error(function (data, status, headers) {
            console.log(data);
        });

    $scope.getUnit = function (pMaterialId) {
        var qty;

        for (var i = 0; i < $scope.materialsForOutwardInward.length; i++) {
            if (pMaterialId == $scope.materialsForOutwardInward[i].materialid) {
                $scope.unitofMeasure = $scope.materialsForOutwardInward[i].unitofmeasure;
                qty = $scope.unitofMeasure;

            }
        }

        return qty;
    }
/*
    $scope.getUnitOfMeasure = function (pMaterialId) {
        var qty;

        for (var i = 0; i < $scope.materialsForOutwardInward.length; i++) {
            if (pMaterialId == $scope.materialsForOutwardInward[i].materialid) {
                // qty = $scope.materialsForOutward[i].totalquantity;
                $scope.availableTotalquantity = qty;
                $scope.unitofMeasure = $scope.materialsForOutwardInward[i].unitofmeasure;
                qty = $scope.unitofMeasure;
            }
        }

        return qty;
    }*/

    $scope.getNoOfMaterials = function () {
       // console.log( $scope.InwardDataModify.inwardMaterials.length);
        return $scope.InwardDataModify.inwardMaterials.length;
    }

    $scope.addFields = function () {
        for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.InwardDataModify.inwardMaterials.push({
                material: "",
                materialQuantity: "",
                packageUnit: "",
                suppplierName: ""
            });
        }
        ;
    }


    console.log($stateParams.selectedInward);
    $scope.InwardDataModify=$stateParams.selectedInward;

    $scope.InwardDataModify.inwardMaterials=$stateParams.selectedInward.materialDetails;
    //$scope.InwardDataModify.inwardMaterials=$stateParams.selectedInward.materialDetails;



    if($scope.InwardDataModify.drivername == "--")
    {
        $scope.InwardDataModify.hasTransportDetails="No";
    }else
    {
        $scope.InwardDataModify.hasTransportDetails="Yes";
    }
    console.log($scope.InwardDataModify);

    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];

    $scope.remove = function (index) {

        $scope.InwardDataModify.inwardMaterials.splice(index, 1); //remove item by index
    };
    $scope.prevStep = function () {
        $scope.step--;
    }

    $scope.modifyInwardDetails=function (InwardDataModify)
    {
        InwardDataModify.dateofentry = $filter("date")(InwardDataModify.dateofentry, 'dd-MM-yyyy');
        $('#loader').css("display", "block");
        var data = {
            inwardData: InwardDataModify,
            module: 'inward',
            operation: 'Modify'
        }
        var config = {
            params: {
                data: data
            }
        };
        console.log("Modify Inward");
        console.log(data);
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                $('#loader').css("display", "none");
                if (data.msg != "") {
                    console.log(data);
                    $rootScope.warningMessage = data.msg;
                    $('#warning').css("display", "block");
                    setTimeout(function () {
                        $('#warning').css("display", "none");
                        window.location="dashboard.php#/Inventory";
                    }, 2000);
                    //$scope.clearFields(inwardData);
                    // $scope.submitted= false;
                    $scope.step = 1;
                   // window.location="dashboard.php#/Inventory";
                } else {
                    console.log(data);
                    $rootScope.errorMessage = data.error;
                    $('#error').css("display", "block");
                }
                //$('#loader').css("display", "none");

            })
            .error(function (data, status, headers) {
                console.log(data);
                $('#loader').css("display", "none");
                $('#error').css("display", "block");
            });

    }




    $scope.nextStep = function () {
        //alert("next step:"+$scope.InwardData.hasTransportDetails);
        console.log($scope.InwardDataModify.hasTransportDetails);
        if ($scope.InwardDataModify.hasTransportDetails == 'No') {
            $scope.modifyInwardDetails($scope.InwardDataModify);
        } else if ($scope.InwardDataModify.hasTransportDetails == 'Yes') {
            $scope.step++;
            $scope.submitted = false;
        }
    }

});
/*********************************************************************************************
 * End of modifyInwardcontroller
 *********************************************************************************************/




/*********************************************************************************************
 * Start of of PRODUCTION BATCH
 *********************************************************************************************/

myApp.controller('productionBatchController', function ($scope, $rootScope, $filter, $http, inventoryService, ProductionBatchService) {

    $scope.nextStep = false;
    $scope.qtyError = 0;
    $scope.currentPage = 1;
    $scope.prodBatchPerPage = 10;
    $scope.submitted = false;
    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;

    inventoryService.getProductsForOutward($scope, $http);
    $scope.paginate = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.prodBatchPerPage;
        end = begin + $scope.prodBatchPerPage;
        index = $rootScope.prodInq.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    $scope.paginate1 = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.prodBatchPerPage;
        end = begin + $scope.prodBatchPerPage;
        index = $rootScope.prodInqAll.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    $scope.formatDate = function () {
        $scope.prodBatchInfo.endDate = $filter("date")($scope.prodBatchInfo.endDate, 'dd-MM-yyyy');
    }

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openPicker = function () {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.openStart = function () {
        $scope.showStart.opened = true;
    };

    $scope.showStart = {
        opened: false
    };

    $scope.openEnd = function () {
        $scope.showEnd.opened = true;
    };

    $scope.showEnd = {
        opened: false
    };
    var data = {
        module: 'inventorySearch'
    }
    var config = {
        params: {
            data: data
        }
    };

    $http.post("Inventory/php/InventoryIndex.php", null, config)
        .success(function (data) {
            console.log("IN SERVICE OF Inventory Search=");
            console.log(data);
            $scope.loading = true;
            $('#loader').css("display", "block");
            $scope.loading = false;
            $('#loader').css("display", "none");
            $scope.inventoryData = data;
            $scope.paginateItemsPerPage = data;
            $rootScope.totalItems = $scope.inventoryData.length;
            console.log($scope.inventoryData);
        })
        .error(function (data, status, headers) {
            console.log("IN SERVICE OF Inventory Search Failure=");
            console.log(data);
            $scope.loading = false;
            $('#loader').css("display", "none");
        });

    /*Autocomplete start*/
    $scope.noMaterial=false;
    $scope.noMaterialProduced=false;
    $scope.materialSelected=function($item,$model,$label,rawMat){
        console.log($model);
        rawMat.material=$model.materialid;
        $scope.getAvailableQty($model.materialid);

    }
    $scope.materialProducedSelected=function($item,$model,$label){
        $scope.prodBatchInfo.prodcdMaterial=$model.materialid;
        console.log($model);
    }

    $scope.getAvailableQty = function (pMaterialId) {

        var qty;
        // console.log("New function here");
        for (var i = 0; i < $scope.materialsForOutward.length; i++) {
            if (pMaterialId == $scope.materialsForOutward[i].materialid) {
                qty = $scope.materialsForOutward[i].totalquantity;
                if (qty != "undefined") {
                    //console.log("here");
                    $scope.availableTotalquantity = qty;
                }
                else {
                    $scope.availableTotalquantity = 0;
                    qty = 0;
                }
                //console.log(qty);
                //console.log($scope.availableTotalquantity);
                break;
            }
            else {
                qty = 0;
                $scope.availableTotalquantity = 0;

            }
        }
        //console.log($scope.availableTotalquantity);
        return qty;
    };

    $scope.check = function (quantity,materialName) {
        //console.log(materialName);
        //console.log($scope.availableTotalquantity)
       if(materialName===undefined || materialName===null || materialName==="")
         return false;

        if (parseInt($scope.availableTotalquantity) < parseInt(quantity) || parseInt($scope.availableTotalquantity) == 0) {

            $scope.qtyError = 1;
            console.log($scope.qtyError);
            return true;
        }
        else {
            $scope.qtyError = 0;
            return false;

        }
    };



    // check for fetching inventory details END


    inventoryService.getCompanys($scope, $http);
    inventoryService.getWarehouses($scope, $http);
    //$scope.today = $filter("date")(Date.now(), 'yyyy-MM-dd');
    //$scope.today1 = Date();
    $scope.today1 = $filter("date")(Date.now(), 'dd-MM-yyyy');
    console.log($scope.today1);
    $scope.submitted = false;
    $scope.prodBatchInfo = {};

    $scope.goBack = function () {

        $scope.step--;
    };



    $http.post("Inventory/php/fetch_materials.php", null)
        .success(function (data) {
            //console.log(data);
            $scope.existingMaterials = data;
            console.log($scope.existingMaterials);
            //$scope.messages.push(data.msg);
            // $scope.clearData(supplier,'submit');
        })
        .error(function (data, status, headers, config) {
            console.log("Error calling php");

        });

    $scope.prodBatchInfo = {
        batchNo: "",
        batchCodeName: "",
        dateOfEntry: "",
        startDate: "",
        endDate: "",
        rawMaterial: [],
        supervisor: "",
        prodcdMaterial: "",
        quantityProdMat: "",
        dateOfEntryAftrProd: "",
        pckgdUnits: "",
        company: "",
        wareHouse: "",
        modeOfTransport: "",
        vehicleNo: "",
        driver: "",
        TranspAgency: "",
        cost: "",
        tranReq: ""
    };

    $scope.modProdBatchInfo = {
        batchNo: "",
        batchCodeName: "",
        dateOfEntry: $filter("date")(new Date, 'dd-MM-yyyy'),
        startDate: $filter("date")(new Date, 'dd-MM-yyyy'),
        endDate: $filter("date")(new Date, 'dd-MM-yyyy'),
        rawMaterial: [],
        supervisor: "",
        prodcdMaterial: "",
        quantityProdMat: "",
        dateOfEntryAftrProd: "",
        pckgdUnits: "",
        company: "",
        wareHouse: "",
        modeOfTransport: "",
        vehicleNo: "",
        driver: "",
        TranspAgency: "",
        cost: "",
        tranReq: ""
    };
    $scope.prodBatchInfo.rawMaterial.push({
        material: "",
        quantity: ""
    });

    $scope.step = 1;

    $scope.addFields = function (Option) {
        var noOfMat = "";
        if (Option == 'Add') {
            noOfMat = $scope.prodBatchInfo.noOfMaterials;
        } else if (Option == 'Modify') {
            noOfMat = $scope.modProdBatchInfo.noOfMaterials;
        }

        //console.log($scope.prodBatchInfo.noOfMaterials);
        for (var i = 0; i < noOfMat; i++) {
            $scope.addField(Option);
        }
        $scope.noOfMaterials = "";
    };

    $scope.reset = function () {
        $scope.step = 1;
    }
    $scope.initProd = function (prodBatchInfo, page, message) {

        console.log(prodBatchInfo);
        prodBatchInfo.option = message;

        $scope.today = function () {
            $scope.prodBatchInfo.dateOfEntryAftrProd = new Date();
        };

        $scope.openDOE = function () {
            $scope.showPicker.opened = true;
        };

        $scope.showPicker = {
            opened: false
        }

        $scope.prodDOE = function () {
            $scope.dateOfEntry.opened = true;
        };

        $scope.dateOfEntry = {
            opened: false
        };

        if (prodBatchInfo.option == 'complete' && prodBatchInfo.tranReq != true) {
            prodBatchInfo.modeOfTransport = "";
            prodBatchInfo.vehicleNo = "";
            prodBatchInfo.driver = "";
            prodBatchInfo.TranspAgency = "";
            prodBatchInfo.cost = "";
            prodBatchInfo.tranReq = "";

        }

        if (message == "ModifyPart") {
            prodBatchInfo.modeOfTransport = "";
            prodBatchInfo.vehicleNo = "";
            prodBatchInfo.driver = "";
            prodBatchInfo.TranspAgency = "";
            prodBatchInfo.cost = "";
            prodBatchInfo.tranReq = "";
            prodBatchInfo.prodcdMaterial = "";
            prodBatchInfo.quantityProdMat = "";
            prodBatchInfo.dateOfEntryAftrProd = "";
            prodBatchInfo.pckgdUnits = "";
            prodBatchInfo.company = "";
            prodBatchInfo.wareHouse = "";

            prodBatchInfo.step = $scope.step;
            prodBatchInfo.option = message;

            ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo, $rootScope);
            $scope.submitted = false;
            setTimeout(function () {
                window.location = "dashboard.php#/Inventory/prodInit";
            }, 1000);
        }
        else if (message == 'Modify') {
            console.log(prodBatchInfo);
            if (page == 'final') {
                prodBatchInfo.step = $scope.step;
                prodBatchInfo.option = message;
                ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo, $rootScope);
                /*setTimeout(function () {
                 window.location="dashboard.php#/Inventory/prodInit";
                 }, 1000);*/
            }
            else {
                $scope.step++;
            }
        }
        else if ((prodBatchInfo.endDate <= $filter("date")(Date.now(), 'dd-MM-yyyy') && page == 'Raw') || page == 'Init') {
            $scope.step++;
        }
        else if ((prodBatchInfo.endDate > $filter("date")(Date.now(), 'dd-MM-yyyy') && page == 'Raw') || page == 'final') {
            $scope.prodBatchInfo.step = $scope.step;

            var viewValue1=new Date(prodBatchInfo.dateOfEntry);
            viewValue1.setMinutes(viewValue1.getMinutes() - viewValue1.getTimezoneOffset());
            prodBatchInfo.dateOfEntry=viewValue1.toISOString().substring(0, 10);

           /* var viewValue2=new Date(prodBatchInfo.endDate);
            viewValue2.setMinutes(viewValue2.getMinutes() - viewValue2.getTimezoneOffset());
            prodBatchInfo.endDate=viewValue2.toISOString().substring(0, 10);
*/
            var viewValue3=new Date(prodBatchInfo.startDate);
            viewValue3.setMinutes(viewValue3.getMinutes() - viewValue3.getTimezoneOffset());
            prodBatchInfo.startDate=viewValue3.toISOString().substring(0, 10);

            if(prodBatchInfo.dateOfEntryAftrProd != "") {
                var viewValue4 = new Date(prodBatchInfo.dateOfEntryAftrProd);
                viewValue4.setMinutes(viewValue4.getMinutes() - viewValue4.getTimezoneOffset());
                prodBatchInfo.dateOfEntryAftrProd = viewValue4.toISOString().substring(0, 10);
            }
            console.log("submitting now with step" + $scope.prodBatchInfo.step);
            ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo, $rootScope);
            //$scope.submitted=false;
            console.log($scope.submitted);
            /* setTimeout(function () {
             window.location="dashboard.php#/Inventory/prodInit";
             }, 1000);*/


        }
        else if (page == "Search" || page == 'Complete') {
            prodBatchInfo.option = message;
            prodBatchInfo.step = 0;
            if(prodBatchInfo.dateOfEntryAftrProd != "") {
                var viewValue4 = new Date(prodBatchInfo.dateOfEntryAftrProd);
                viewValue4.setMinutes(viewValue4.getMinutes() - viewValue4.getTimezoneOffset());
                prodBatchInfo.dateOfEntryAftrProd = viewValue4.toISOString().substring(0, 10);
            }
            ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo, $rootScope);
            if (page == 'Complete') {
                /* setTimeout(function () {
                 window.location="dashboard.php#/Inventory";
                 }, 1000);*/
            }
        }
        //$scope.submitted = false;
    };


    $scope.getProdInfo = function (prodInfo, index) {

        $scope.modProdBatchInfo = prodInfo;
        $scope.modProdBatchInfo.selectedIndex = index;


        //console.log($scope.selectedProdBatchInfo);
    };

    $scope.clear = function (page) {

        console.log('inside clear' + $scope.submitted);
        if (page == 'Init') {
            $scope.prodBatchInfo.batchNo = "";
            $scope.prodBatchInfo.batchCodeName = "";
            $scope.prodBatchInfo.dateOfEntry = $filter("date")(Date.now(), 'dd-MM-yyyy');
            $scope.prodBatchInfo.startDate = "";
            $scope.prodBatchInfo.endDate = "";
            $scope.prodBatchInfo.supervisor = "";
        }
        else if (page == 'Raw') {
            $scope.prodBatchInfo.rawMaterial.splice(0, $scope.prodBatchInfo.rawMaterial.length);
            $scope.prodBatchInfo.rawMaterial.push({
                material: "",
                quantity: ""
            });

        }
        else if (page == 'final') {
            $scope.prodBatchInfo.prodcdMaterial = "";
            $scope.prodBatchInfo.quantityProdMat = "";
            $scope.prodBatchInfo.dateOfEntryAftrProd = $filter("date")(Date.now(), 'dd-MM-yyyy');
            $scope.prodBatchInfo.pckgdUnits = "";
            $scope.prodBatchInfo.company = "";
            $scope.prodBatchInfo.wareHouse = "";


            $scope.prodBatchInfo.modeOfTransport = "";
            $scope.prodBatchInfo.vehicleNo = "";
            $scope.prodBatchInfo.driver = "";
            $scope.prodBatchInfo.TranspAgency = "";
            $scope.prodBatchInfo.cost = "";


        }
        else {
            $scope.prodBatchInfo.batchNo = "";
            $scope.prodBatchInfo.batchCodeName = "";
            $scope.prodBatchInfo.dateOfEntry = $filter("date")(Date.now(), 'dd-MM-yyyy');
            $scope.prodBatchInfo.startDate = "";
            $scope.prodBatchInfo.endDate = "";
            $scope.prodBatchInfo.supervisor = "";

            $scope.prodBatchInfo.rawMaterial.splice(0, $scope.prodBatchInfo.rawMaterial.length);
            $scope.prodBatchInfo.rawMaterial.push({
                material: "",
                quantity: ""
            });

            $scope.prodBatchInfo.prodcdMaterial = "";
            $scope.prodBatchInfo.quantityProdMat = "";
            $scope.prodBatchInfo.dateOfEntryAftrProd = $filter("date")(Date.now(), 'dd-MM-yyyy');
            $scope.prodBatchInfo.pckgdUnits = "";
            $scope.prodBatchInfo.company = "";
            $scope.prodBatchInfo.wareHouse = "";

            $scope.prodBatchInfo.modeOfTransport = "";
            $scope.prodBatchInfo.vehicleNo = "";
            $scope.prodBatchInfo.driver = "";
            $scope.prodBatchInfo.TranspAgency = "";
            $scope.prodBatchInfo.cost = "";


        }
        //$scope.submitted=false;

    };


    $scope.remove = function (index, Option) {
        if (Option == 'Add') {
            $scope.prodBatchInfo.rawMaterial.splice(index, 1);
        }
        else if (Option == 'Modify') {
            $scope.modProdBatchInfo.rawMaterial.splice(index, 1);
        }
    };

    $scope.addField = function (Option) {
        console.log("Inside function");
        if (Option == 'Add') {
            $scope.prodBatchInfo.rawMaterial.push({
                material: "",
                quantity: ""
            });
        }
        else if (Option == 'Modify') {
            $scope.modProdBatchInfo.rawMaterial.push({
                material: "",
                quantity: ""
            });
        }
    };

    $scope.submitPart = function () {
        console.log($scope.prodBatchInfo.rawMaterial);

    };

});


/*********************************************************************************************
 * END of PRODUCTION BATCH
 *********************************************************************************************/