/**
 * Created by Atul on 19-03-2016.
 */
myApp.service('AppService', function () {

    this.getCompanyList=function($http,$scope){
        $('#loader').css("display","block");
        var data = {
            operation: "getCompanyList"
        };
        var config = {
            params: {
                data: data
            }
        };


        $http.post("Config/php/configFacade.php", null,config)
            .success(function (data) {
                $('#loader').css("display","none");
                console.log("IN Company Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $scope.Companies.push({checkVal:false,companyId:data.message[i].companyId,companyName:data.message[i].companyName});
                    }
                }
            })
            .error(function (data, status, headers, config) {
               alert("Error  Occurred:"+data);

            });



    }

    this.getProjectManagers=function($http,$scope){
        $('#loader').css("display","block");
        var data = {
            operation: "getAllProcessUser"
        };
        var config = {
            params: {
                data: data
            }
        };


        $http.post("Config/php/configFacade.php", null,config)
            .success(function (data) {
                $('#loader').css("display","none");
                console.log("IN Company Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $scope.projectManagers.push({checkVal:false,projectManagerId:data.message[i].userId,name:data.message[i].firstName+" "+data.message[i].lastName});
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });



    }

    this.getAllCustomers=function($http,$scope){
        $('#loader').css("display","block");

        $http.post("php/api/customerlist", null)
            .success(function (data) {
                $('#loader').css("display","none");
                console.log("IN Company Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $scope.customers.push({checkVal:false,customerId:data.message[i].CustomerId,customerName:data.message[i].CustomerName});
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });
    }

    this.getUsers=function($scope,$http){
        $scope.leaves={
            operation:""
        }
        $scope.leaves.operation="getEmployees";
        var config = {
            params: {
                details: $scope.leaves
            }
        };
        $http.post("Payroll/php/PayrollFacade.php", null, config)
            .success(function (data) {
                console.log(data);
                $scope.employees=data;
                console.log($scope.users);
                var user=[];
                for(var i = 0; i<data.length ; i++){
                            user.push({
                                        id: data[i].userId,
                                        name: data[i].firstName+" "+data[i].lastName

                            });
                        }
                       $scope.users = user;
            })
            .error(function (data, status, headers, config) {

            });
    }

});