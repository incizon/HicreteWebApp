var inventoryApp = angular.module('Inventory', ['ngRoute','ui.bootstrap']);

    inventoryApp.config(['$routeProvider', function($routeProvider){
        $routeProvider


            .when('/inventoryWidgets',{
                templateUrl:'Inventory/html/inventoryWidgets.php'

            }).

            when('/inventoryAddSupplier', {
                templateUrl:'Inventory/html/inventory_Add_Supplier.html'
            }).

            when('/inventoryAddMaterialType', {
                templateUrl:'Inventory/html/inventory_Add_MaterialType.html'
            }).

            when('/inventoryAddProduct', {
                templateUrl:'Inventory/html/Inventory_Add_Product.html'
            });

//            otherwise({
//                redirectTo:'/inventoryWidgets'
//            });

       /* inventoryApp.controller('addWidgetController', function($scope) {
            $scope.message = "This page will be used to display add student form";
        });*/
    }]);