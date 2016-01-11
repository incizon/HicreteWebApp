
/**
 * Created by Purva-PC on 10/24/2015.
 */
//var inventoryApp1 = angular.module('Inventory', ['ngRoute']);

inventoryApp.config(['$routeProvider', function($routeProvider){
    $routeProvider



        when('/inventoryAddSupplier', {
            templateUrl: '../../html/inventory_Add_Supplier.html'
        });



    /* inventoryApp.controller('addWidgetController', function($scope) {
     $scope.message = "This page will be used to display add student form";
     });*/
}]);