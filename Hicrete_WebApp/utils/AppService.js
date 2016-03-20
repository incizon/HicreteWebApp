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



});