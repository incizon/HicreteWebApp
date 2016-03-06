
myApp.controller('inventoryCommonController', function ($scope, $http, inventoryService) {

    //get Material Tyepes
    inventoryService.getMaterialTypes($scope, $http);

    //Available Products
    inventoryService.getProducts($scope, $http);

    ////Get Warehouses
    //inventoryService.getWarehouses($scope,$http);
    //// Get Company
    //inventoryService.getCompanys($scope,$http);



});


/**********************************************************************************
 * Start of Product controller
 *
 ***********************************************************************************/
myApp.controller('productController', function ($scope, $http, inventoryService) {

    //Pagination variables
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.InventoryItemsPerPage = 5;
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
    $scope.loading=false;
    var isProductMasterTable = false;
    var isMaterialTable = false;
    var isPrductDetailsTable = false;
    var isProductPkgingTable = false;

// inventoryService.getProductsForInwardandOutward($scope,$http);

    //Available Products
    //inventoryService.getProducts($scope, $http);
    inventoryService.getSavedProducts($scope);
    /*
     Start of Pagination Function
     */
    $scope.paginate = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.InventoryItemsPerPage;
        end = begin + $scope.InventoryItemsPerPage;
        index = $scope.products.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    /*
     End of Pagination Function
     */
    /**********************************************************************************
     * Purpose- This function will Add product details into database
     * @param1- product (all product details)
     * Return- success msg or failure msg
     ***********************************************************************************/
    $scope.addProduct = function (product) {
        //Set Extra attribute in object to identify operation to be performed
        product.opertaion = "insert";
        $scope.submitted = false;
        $scope.loading=true;
        $scope.errorMessage="";
        $scope.warningMessage="";

        $('#loader').css("display","block");
        var config = {
            params: {
                product: product
            }
        };
        console.log("Loader"+$scope.loading);
        //call service
        $http.post("Inventory/php/InventoryProduct.php", null, config)
            .success(function (data) {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.warningMessage=data.msg;
                        $('#warning').css("display","block");
                    });
                }, 2000);
                $scope.loading=false;
                $('#loader').css("display","none");
                $('#error').css("display","block");

                $scope.errorMessage=data.msg;

                console.log("IN POST OF add product success");
                console.log(data);
                console.log("Loader"+$scope.loading);
                $scope.clearFields(product);

            })
            .error(function (data, status, headers, config) {
                console.log(data.error);
                //doShowAlert("Failure", data.msg);
                $scope.errorMessage=data.msg;
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

        // Create json object
        var config = {
            params: {
                product: product
            }
        };
        //call add product service
        $http.post("Inventory/php/InventoryProduct.php", null, config)
            .success(function (data) {
                console.log("IN POST UPDATE OPERATION:");
                console.log(data);
                doShowAlert("Success", data.msg);
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000);
            })
            .error(function (data, status, headers, config) {
                console.log(data.error);
                doShowAlert("Failure", data.msg);
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
    }
    /**********************************************************************************
     *End of Getter
     **********************************************************************************/

    /***************************************************************************
     * Purpose- This function will retrieve the product details from database
     * @param1- $scope and $http
     * Return- Items available in database
     ****************************************************************************/
        // CALLL THIS FUNCTION ON WIDGET SEARCH CLICK_____IMPPPPPPP
        // $scope.productSearch=function($scope,$http){
    $http.post("Inventory/php/ProductSearch.php", null)
        .success(function (data) {
            console.log("Items Present in database");
            console.log(data);
            $scope.products = data;
            $scope.totalItems = $scope.products.length;
        })
        .error(function (data, status, headers) {
            console.log(data);

        });
    // };
    /***************************************************************************
     * End of Get Product Details
     ****************************************************************************/

    /**********************************************************************************
     *Setters to set true/false for tables to modify
     **********************************************************************************/
    $scope.setMasterTable = function () {
        isProductMasterTable = true;
        console.log("IN ng CHANGE");
    }
    $scope.setProductDetailsTable = function () {
        isPrductDetailsTable = true;
        console.log("IN ng CHANGE");
    }
    $scope.setProductPackagingTable = function () {
        isProductPkgingTable = true;
        console.log("IN ng CHANGE");
    }
    $scope.setProductMaterialTable = function () {
        isMaterialTable = true;
        console.log("IN ng CHANGE");
    }
    /**********************************************************************************
     *End of Setters
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

});
/**********************************************************************************
 * End of Product controller
 *
 ***********************************************************************************/


/***********************************************************************************************************
 * Start of Inward Controlller
 *
 ************************************************************************************************************/

myApp.controller('inwardController', function ($scope, $http,$location, inwardService, inventoryService) {
    $scope.InwardData = {
        inwardNumber: "",
        date: "",
        companyName: "",
        warehouseName: "",
        suppervisor: "",
        hasTransportDetails:"",

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
                suppplierName: ""
            }
        ]
    };
    // $scope.inventoryData={};
    $scope.material = {};
    $scope.step = 1;
    $scope.showModal = false;
    $scope.submitted = false;

    $scope.getNoOfMaterials=function(){
        //console.log($scope.InwardData.inwardMaterials.length);
        return $scope.InwardData.inwardMaterials.length;
    }
    inventoryService.getProductsForInwardandOutward($scope,$http);
    //Get Warehouses
    inventoryService.getWarehouses($scope,$http);
    // Get Company
    inventoryService.getCompanys($scope,$http);

    inventoryService.getSavedCompanys($scope);
    inventoryService.getSavedWarehouses($scope);

    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];

    $scope.filters = [
        {filterName: 'Items', id: 1},
        {filterName: 'Inward', id: 2},
        {filterName: 'Outward', id: 3},
        {filterName: 'Available Inventory', id: 4}
    ];
    $scope.SearchTerm = $scope.filters[3].filterName;

    var isInwardTable = false;
    var isInwardDetailsTable = false;
    var isInwardTransportTable = false;
    $scope.stepa=1;
    /**********************************
     Add material fields
     *******************************/
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

    $scope.nextForm=function(){

        if ($scope.InwardData.hasTransportDetails == 'No') {
            // $scope.showModal=true;
            //alert("if");
            $scope.addInwardDetails();
        } else if ($scope.InwardData.hasTransportDetails == 'Yes') {
            $scope.stepa=2;
            //console.log("Step Value:" + $scope.stepa);
            $scope.submitted = false;
            //console.log("in nest form function");
        }

    }
    $scope.nextStep = function () {
        //alert("next step:"+$scope.InwardData.hasTransportDetails);
        if ($scope.InwardData.hasTransportDetails == 'No') {
            // $scope.showModal=true;
            alert("if");
            $scope.addInwardDetails();
        } else if ($scope.InwardData.hasTransportDetails == 'Yes') {
            $scope.step++;
            console.log("Step Value:" + $scope.step);
            $scope.submitted = false;
        }
    }

    $scope.prevStep = function () {
        $scope.stepa--;
    }

    $scope.addInwardDetails = function () {
        inwardService.inwardEntry($scope, $http, $scope.InwardData);
        $scope.submitted = false;
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
        console.log("Inward Data to be Updated");
        console.log(data);
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log("IN SERVICE OF INWARD=");
                console.log(data);
                if (data.msg != "") {
                    doShowAlert("Success", data.msg);
                    setTimeout(function () {
                        window.location.reload(true);
                        //window.location="http://localhost/Hicrete_WebAppGitRepo/Hicrete_WebApp/dashboard.php#/Inventory";
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
//Get Material from DB
        // inventoryService.getProductsForInwardandOutward($scope,$http);

        //Available Products
    //inventoryService.getProducts($scope, $http);
    inventoryService.getSavedProducts($scope);
    /**********************************************************************************
     *Setters to set true/false for tables to modify
     **********************************************************************************/
    $scope.setInwardTable = function () {
        isInwardTable = true;
        console.log("IN ng CHANGE");
    }
    $scope.setInwardDetailsTable = function () {
        isInwardDetailsTable = true;
        console.log("IN ng CHANGE");
    }
    $scope.setInwardTransport = function () {
        isInwardTransportTable = true;
        console.log("IN ng CHANGE");
    }
    /**********************************************************************************
     *End of Setters
     **********************************************************************************/


    /***********************************************
     *Start of Clear Fields Function
     ************************************************/
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
    };

    /*************************************************
     *End of Clear Fields Function
     **************************************************/

// inventoryService.getProducts($scope,$http);
// Get Suppliers From DB 
    $http.post("Inventory/php/supplierSearch.php", null)
        .success(function (data) {
            console.log(data);
            $scope.suppliers = data;
            console.log($scope.suppliers);
        })
        .error(function (data, status, headers) {
            console.log(data);
        });


});

/***********************************************************************************************************
 * End of Inward Controller
 *
 ************************************************************************************************************/


/***********************************************************************************************************
 * Start of Outward Controlller
 *
 ************************************************************************************************************/

myApp.controller('outwardController', function ($scope, $http, outwardService, inventoryService) {
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
    // $scope.availableMaterials = [];
    $scope.getNoOfMaterials=function(){
        //console.log($scope.InwardData.inwardMaterials.length);
        return $scope.OutwardData.outwardMaterials.length;
    }
    var isOutwardTable = false;
    var isOutwardDetailsTable = false;
    var isOutwardTransportTable = false;

    $scope.productsToModify = [];
    inventoryService.getProductsForInwardandOutward($scope,$http);

    //Get Warehouses
    inventoryService.getWarehouses($scope,$http);
    // Get Company
    inventoryService.getCompanys($scope,$http);

    inventoryService.getSavedCompanys($scope);
    inventoryService.getSavedWarehouses($scope);

    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];
    //$scope.availableTotalquantity=[];
//Get Material from DB
    // inventoryService.getProductsForInwardandOutward($scope,$http);
    //Available Products
    inventoryService.getProducts($scope, $http);
    inventoryService.getSavedProducts($scope);

    $scope.getProduct = function (product) {
        $scope.selectedProduct = product;
    }


    $scope.getAvailableQty = function (pMaterialId) {
        var qty;

        for (var i = 0; i < $scope.productsToModify.length; i++) {
            if (pMaterialId == $scope.productsToModify[i].materialid) {
                qty = $scope.productsToModify[i].totalquantity;
                $scope.availableTotalquantity=qty;
                //console.log(qty);
            }
        }
        ;
        return qty;
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
        //alert("next step:"+$scope.OutwardData.hasTransportDetails);
        if ($scope.OutwardData.hasTransportDetails == 'No') {
            // $scope.showModal=true;
            //alert("if");
            $scope.addOutwardDetails();
        } else if ($scope.OutwardData.hasTransportDetails == 'Yes') {
            // $scope.showModal=false;
            //alert("else");
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
    $scope.addOutwardDetails = function () {
        console.log($scope.OutwardData);
        // outwardService.outwardEntry($scope,$http,$OutwardData);
        var data = {
            outwardData: $scope.OutwardData,
            module: 'outward',
            operation: 'insert'
        }
        var config = {
            params: {
                data: data
            }
        };
        console.log("Outward Data::" + $scope.OutwardData);
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log("In Post of outward entry success:");
                console.log(data);
                 setTimeout(function(){
                  window.location.reload(true);
                     //window.location="http://localhost/Hicrete_WebAppGitRepo/Hicrete_WebApp/dashboard.php#/Inventory";
                },1000);
                $scope.outwardData = data;
                $scope.clearFields($scope.OutwardData);
                    $scope.submitted = false;

            })
            .error(function (data, status, headers) {
                console.log(data);

            });
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
        console.log("Product in Update Info function");
        //Set Extra attribute in object to identify operation to be performed as update

        //Check which tables should get affected
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
        console.log(data);
        //call add product service
        $http.post("Inventory/php/InventoryIndex.php", null, config)
            .success(function (data) {
                console.log("IN POST Outward UPDATE OPERATION:");
                console.log(data);
                doShowAlert("Success", data.msg);
                setTimeout(function () {
                    window.location.reload(true);
                    //window.location="http://localhost/Hicrete_WebAppGitRepo/Hicrete_WebApp/dashboard.php#/Inventory";
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
        OutwardData.inwardNumber = "";
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
    };
    /***********************************************
     * END of clear field controller
     *************************************************/

    /***************************************************
     *Setters to set true/false for tables to modify
     ****************************************************/
    $scope.setOutwardTable = function () {
        isOutwardTable = true;
        console.log("IN ng CHANGE");
    }
    $scope.setOutwardDetailsTable = function () {
        isOutwardDetailsTable = true;
        console.log("IN ng CHANGE");
    }
    $scope.setOutwardTransport = function () {
        isOutwardTransportTable = true;
        console.log("IN ng CHANGE");
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
    $scope.submitted = false;

    $scope.materialType.push({
        type: ""
    });


    $scope.submit = function (materialType) {
        console.log($scope.materialType);
        addMaterialTypeService.addMaterialtype($scope, $http, materialType)
        //$scope.clear();
        $scope.submitted = false;

    };
    $scope.addFields = function () {
        console.log($scope.noOfMaterials);
        for (var i = 0; i < $scope.noOfMaterials; i++) {
            $scope.addField();
        }
        ;
        $scope.noOfMaterials = "";
    };

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
myApp.controller('addSupplierController', function ($scope, $http, addSupplierService) {

    $scope.supplier = {
        supplierName: "",
        contactNo: "",
        address: "",
        city: "",
        country: "",
        pinCode: ""

    };
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

        console.log(msg);
        if (msg == 'clear') {
            $scope.messages[0] = "";
        }
    };


    $scope.submitData = function (supplier) {

        console.log(supplier.supplierName);
        console.log(supplier.contactNo);
        console.log(supplier.address);
        console.log(supplier.city);
        console.log(supplier.country);
        console.log(supplier.pinCode);

        addSupplierService.addSupplier($scope, $http, supplier);
    };


});
/*
 * End of Supplier Controller
 */


/*********************************************************************************************
 * START of Search Controller
 *********************************************************************************************/
myApp.controller('SearchController', function ($scope, $http, inventoryService) {
    //Pagination variables
    $scope.submitted = false;
    $scope.submittedModal = false;
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.InventoryAvailableItemsPerPage = 10;

    $scope.totalInwardItems = 0;
    $scope.currentInwardPage = 1;
    $scope.InventoryInwardItemsPerPage = 10;
    $scope.InwardSearchData = [];

    $scope.totalOutwardItems = 0;
    $scope.currentOutwardPage = 1;
    $scope.InventoryOutwardItemsPerPage = 10;
    $scope.OutwardSearchData = [];

    $scope.inventoryData = {};
    $scope.transportMode = [
        {transport: 'Air Transport', transportId: 1},
        {transport: 'Water Transport', transportId: 2},
        {transport: 'Road Transport', transportId: 3}
    ];


    /*************************************************
     * START of GETTING INVENTORY DATA
     **************************************************/
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
            $scope.inventoryData = data;
            $scope.paginateItemsPerPage = data;
            $scope.totalItems = $scope.inventoryData.length;
            console.log($scope.inventoryData);
        })
        .error(function (data, status, headers) {
            console.log("IN SERVICE OF Inventory Search Failure=");
            console.log(data);

        });
    $scope.getViewDataObject = function (product) {
        console.log(product);
        $scope.viewProduct = product;
    }
    $scope.getMaterialObject = function (product) {
        $scope.viewMaterials = product;
        console.log($scope.viewMaterials);
    }

    $scope.getDataObjectToModify = function (product) {
        $scope.modifyInwardData - product;
    }
    /*************************************************
     * END of GETTING INVENTORY DATA
     **************************************************/

    $scope.getProduct = function (product) {
        $scope.selectedProduct = product;
    }
    /*************************************************
     * START of GETTING INWARD DATA
     **************************************************/
        $scope.materialDetails=[];
    var data = {
        module: 'inward',
        operation: 'search'
    }
    var config = {
        params: {
            data: data
        }
    };

    $http.post("Inventory/php/InventoryIndex.php", null, config)
        .success(function (data) {

            console.log("IN INWARD Search");
            $scope.InwardSearchData = data;
            $scope.totalInwardItems = $scope.InwardSearchData.length;
            console.log(data);
        })
        .error(function (data, status, headers) {
            console.log("IN SERVICE OF Inward Search Failure=");
            console.log(data);

        });
    /*************************************************
     * END of GETTING INWARD DATA
     **************************************************/


    /*************************************************
     * START of GETTING OUTWARD DATA
     **************************************************/
    var data = {
        module: 'outward',
        operation: 'search'
    }
    var config = {
        params: {
            data: data
        }
    };
    $http.post("Inventory/php/InventoryIndex.php", null, config)
        .success(function (data) {

            console.log("IN Outward Search");
            $scope.OutwardSearchData = data;
            $scope.totalOutwardItems = $scope.OutwardSearchData.length;
            console.log(data);
        })
        .error(function (data, status, headers) {
            console.log("IN SERVICE OF Outward Search Failure=");
            console.log(data);

        });
    /*************************************************
     * END of GETTING INWARD DATA
     **************************************************/
    /*
     Start of Pagination Function
     */
    $scope.paginate = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.InventoryAvailableItemsPerPage;
        end = begin + $scope.InventoryAvailableItemsPerPage;
        index = $scope.paginateItemsPerPage.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    $scope.paginateInward = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentInwardPage - 1) * $scope.InventoryInwardItemsPerPage;
        end = begin + $scope.InventoryInwardItemsPerPage;
        index = $scope.InwardSearchData.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    $scope.paginateOutward = function (value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentOutwardPage - 1) * $scope.InventoryOutwardItemsPerPage;
        end = begin + $scope.InventoryOutwardItemsPerPage;
        index = $scope.OutwardSearchData.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };
    /*
     End of Pagination Function
     */

});

/*********************************************************************************************
 * END of Search Controller
 *********************************************************************************************/


/*********************************************************************************************
 * Start of of PRODUCTION BATCH
 *********************************************************************************************/

myApp.controller('productionBatchController', function ($scope, $filter, $http,inventoryService, ProductionBatchService) {

    $scope.qtyError=0;

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
            $scope.inventoryData = data;
            $scope.paginateItemsPerPage = data;
            $scope.totalItems = $scope.inventoryData.length;
            console.log($scope.inventoryData);
        })
        .error(function (data, status, headers) {
            console.log("IN SERVICE OF Inventory Search Failure=");
            console.log(data);

        });

    $scope.getAvailableQty = function (pMaterialId) {
        var qty;
        console.log("New function here");
        for (var i = 0; i < $scope.inventoryData.length; i++) {
            if (pMaterialId == $scope.inventoryData[i].materialid) {
                qty = $scope.inventoryData[i].totalquantity;
                $scope.availableTotalquantity=qty;
                console.log(qty);
                break;
            }
        }

        return qty;
    };

    $scope.check= function(quantity)
    {
        console.log(quantity);
        console.log($scope.availableTotalquantity);

        if($scope.availableTotalquantity<quantity)
        {
            //console.log("m alo nighalo");
            $scope.qtyError= 1;
        }
        else
        {
            //console.log("kai prob ahe rao");
            $scope.qtyError= 0;
        }
    };



    // check for fetching inventory details END



    inventoryService.getSavedCompanys($scope);
    inventoryService.getSavedWarehouses($scope);
    $scope.today = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.today1 = $filter("date")(Date.now(), 'dd-MM-yyyy');
    console.log($scope.today);
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

        console.log(prodBatchInfo.batchNo);
        console.log(prodBatchInfo.batchCodeName);
        console.log(prodBatchInfo.dateOfEntry);
        console.log(prodBatchInfo.startDate);
        console.log(prodBatchInfo.endDate);
        console.log(prodBatchInfo.supervisor);

        console.log(prodBatchInfo.tranReq);
        console.log(prodBatchInfo);
        prodBatchInfo.option = message;

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
            ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo);
            setTimeout(function () {
                window.location.reload(true);
            }, 1000);
        }
        else if (message == 'Modify') {
            console.log(prodBatchInfo);
            if (page == 'final') {
                prodBatchInfo.step = $scope.step;
                prodBatchInfo.option = message;
                ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo);
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000);
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
            //$scope.submitPart();
            console.log("submitting now with step" + $scope.prodBatchInfo.step);
            ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo);
            setTimeout(function () {
                window.location.reload(true);
            }, 1000);

        }
        else if (page == "Search" || page == 'Complete') {
            prodBatchInfo.option = message;
            prodBatchInfo.step = 0;
            ProductionBatchService.addProdBatchInfo($scope, $http, prodBatchInfo);
            if(page =='Complete')
            {
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000);
            }
        }

        $scope.submitted = false;
    };


    $scope.getProdInfo = function (prodInfo) {
        console.log(prodInfo);
        console.log("Inside this function");
        $scope.modProdBatchInfo = prodInfo;

        console.log($scope.modProdBatchInfo.rawMaterial);
        //console.log($scope.selectedProdBatchInfo);
    };

    $scope.clear = function (page) {
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

