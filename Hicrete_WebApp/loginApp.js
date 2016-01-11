var app = angular.module('loginApp', []);

app.controller('loginController', function($scope,$http) {
    $scope.vm=this;
    $scope.vm.error="";
    $scope.vm.username=undefined;
    $scope.vm.password=undefined;
    $scope.vm.dataLoading = false;

    $scope.login=login;

    function login(){
      //alert("inside");
        $scope.vm.dataLoading = false; 
        var data=$scope.vm;           
        
         $http.post("authenticate.php", data)
           .success(function (data)
           {
             console.log(data);             
             if(data.result==="true"){
               window.location="dashboard.php";
            }  
            else{
                $scope.vm.error="Username or password is incorrect";
            }

            
           })
           .error(function (data, status, headers, config)
           {
             console.log(data.error);
             
           });            
            
        }
    


    


});