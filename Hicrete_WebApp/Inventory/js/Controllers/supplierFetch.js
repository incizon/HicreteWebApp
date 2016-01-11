
myApp.controller('supplierFetchController', function($scope, $http) {

$scope.supplier={

  supplierName:""
};


$scope.searchData=function(supplier){

var config = {
        params: {
          supplier: supplier
        }
      };

      console.log(supplier);
      $http.post("Inventory/php/supplierSearch.php", null)
        .success(function (data)
        {
         console.log(data);
         $scope.suppliers=data;
         console.log($scope.suppliers);
         /*$scope.messages.push(data.msg);
         $scope.clearData(supplier);*/ 
        })
        .error(function (data, status, headers)
        {
          console.log(data);
          // $scope.messages.push(data.error);
        });



};
 $http.post("Inventory/php/supplierSearch.php", null)
        .success(function (data)
        {
         console.log(data);
         $scope.suppliers=data;
         console.log($scope.suppliers);
         /*$scope.messages.push(data.msg);
         $scope.clearData(supplier);*/ 
        })
        .error(function (data, status, headers)
        {
          console.log(data);
          // $scope.messages.push(data.error);
        });
});