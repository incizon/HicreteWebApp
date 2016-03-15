
myApp.controller('supplierFetchController', function($scope, $http,$rootScope) {
    $scope.currentPage = 1;
    $scope.supplierPerPage = 5;
$scope.Keywords="";

    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.supplierPerPage;
        end = begin + $scope.supplierPerPage;
        index = $rootScope.suppliers.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };

$scope.getSupplier=function(supplier)
    {
        $scope.selectedSupplier=supplier;
    }

    $scope.modifySupplier=function()
    {
        var status="modify";
        var data = {
            operation: "modify",
            data: $scope.selectedSupplier

        };

        var config = {
            params: {
                data: data

            }
        };

        $http.post("Inventory/php/supplierSearch.php",null, config)
            .success(function (data)
            {
                console.log(data);
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

                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg==""){
                    $scope.errorMessage=data.error;
                    $('#error').css("display","block");
                }

                //console.log($scope.suppliers);
                /*$scope.messages.push(data.msg);
                 $scope.clearData(supplier);*/
            })
            .error(function (data, status, headers)
            {
                console.log(data);
                // $scope.messages.push(data.error);
            });



    }
$scope.searchData=function(supplier){

    var data = {
        operation: "search",
        data: supplier

    };

    var config = {
        params: {
            data: data

        }
    };

      console.log(supplier);
      $http.post("Inventory/php/supplierSearch.php", null,config)
        .success(function (data)
        {
         console.log(data);
            $rootScope.suppliers=data;
         console.log($scope.suppliers);
            $scope.totalItems=$rootScope.suppliers.length;
         /*$scope.messages.push(data.msg);
         $scope.clearData(supplier);*/ 
        })
        .error(function (data, status, headers)
        {
          console.log(data);
          // $scope.messages.push(data.error);
        });



};

});