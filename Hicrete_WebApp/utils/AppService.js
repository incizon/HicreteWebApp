/**
 * Created by Atul on 19-03-2016.
 */
myApp.service('AppService', function () {

    this.getCompanyList=function($http,$companies){
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
                        $companies.push({checkVal:false,companyId:data.message[i].companyId,companyName:data.message[i].companyName});
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
    this.getProjectManagers=function($http,$projectManagers){
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
                        $projectManagers.push({checkVal:false,projectManagerId:data.message[i].userId,name:data.message[i].firstName+" "+data.message[i].lastName});
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });



    }

    this.getAllCustomers=function($http,$customers){
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
                        $customers.push({checkVal:false,customerId:data.message[i].CustomerId,customerName:data.message[i].CustomerName});
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });



    }


    this.getAllProjects=function($http,$projects){

        $http.post("php/api/projectlist", null)
            .success(function (data) {

                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $projects.push({
                            id: response.data.message[i].ProjectId,
                            name: response.data.message[i].ProjectName

                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });

    }

    this.getAllQuotationOfProject=function($http,$quotations,$projectId){

        $http.post("php/api/quotationlist/"+$projectId, null)
            .success(function (data) {

                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $quotations.push({
                            id: response.data.message[i].QuotationId,
                            name: response.data.message[i].QuotationTitle,
                            refNo:response.data.message[i].RefNo
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });

    }

    this.getAllInvoicesOfProject=function($http,$invoices,$projectId){

        $http.post("php/api/invoicelist/"+$projectId, null)
            .success(function (data) {

                console.log("IN Invoice Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $invoices.push({
                            id: response.data.message[i].InvoiceNo,
                            name: response.data.message[i].InvoiceTitle
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });

    }



    this.getAllSiteTrackingProjects=function($http,$projects){

        $http.post("php/api/sitetrackingprojectlist", null)
            .success(function (data) {

                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $projects.push({
                            id: response.data.message[i].ProjectId,
                            name: response.data.message[i].ProjectName

                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });

    }



});