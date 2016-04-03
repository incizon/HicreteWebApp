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

                if(data.status!="Successful"){
                    alert("Failed:"+data.message);

                }else {
                    $companies=[];
                    for(var i=0;i<data.message.length;i++){
                        $companies.push({checkVal:false , companyId:data.message[i].companyId, companyName:data.message[i].companyName});
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

        var data={
            operation:"getCustomerList",


        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/customerFacade.php",null, config)
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
            .error(function(data){
                alert("Error  Occurred:"+data);
            });
        /*$http.post("php/api/customerlist", null)
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

            });*/



    }


    this.getAllProjects=function($http,$projects){

        var data={
            operation:"getProjectList",
        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php",null, config)
            .success(function (data) {
                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $projects.push({
                            id: data.message[i].ProjectId,
                            name: data.message[i].ProjectName

                        });
                    }
                }

            })
            .error(function(data){
                alert("Error  Occurred:"+data);
            });
       /* $http.post("php/api/projectlist", null)
            .success(function (data) {

                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $projects.push({
                            id: data.message[i].ProjectId,
                            name: data.message[i].ProjectName

                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });*/

    }

    this.getAllQuotationOfProject=function($http,$quotations,$projectId){

        var data={
            operation:"getQuotationList",
            data:$projectId

        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/quotationFacade.php",null, config)
            .success(function (data) {
                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $quotations.push({
                            id: data.message[i].QuotationId,
                            name: data.message[i].QuotationTitle,
                            refNo:data.message[i].RefNo
                        });
                    }
                }
            })
            .error(function(data){
                alert("Error  Occurred:"+data);
            });

        /*$http.post("php/api/quotationlist/"+$projectId, null)
            .success(function (data) {

                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $quotations.push({
                            id: data.message[i].QuotationId,
                            name: data.message[i].QuotationTitle,
                            refNo:data.message[i].RefNo
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });*/

    }

    this.getAllInvoicesOfProject=function($http,$invoices,$projectId){

        var data={
            operation:"getInvoiceOfProject",
            data:$projectId

        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php",null, config)
            .success(function (data) {
                console.log("IN Invoice Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $invoices.push({
                            id: data.message[i].InvoiceNo,
                            name: data.message[i].InvoiceTitle
                        });
                    }
                }
            })
            .error(function(data){
                alert("Error  Occurred:"+data);
            });
       /* $http.post("php/api/invoicelist/"+$projectId, null)
            .success(function (data) {

                console.log("IN Invoice Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $invoices.push({
                            id: data.message[i].InvoiceNo,
                            name: data.message[i].InvoiceTitle
                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });*/

    }



    this.getAllSiteTrackingProjects=function($http,$projects){

        var data={
            operation:"getSiteTrackingProjectList",


        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php",null, config)
            .success(function (data) {
                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $projects.push({
                            id: data.message[i].ProjectId,
                            name:data.message[i].ProjectName

                        });
                    }
                }
            })
            .error(function(data){
                alert("Error  Occurred:"+data);
            });
       /* $http.post("php/api/sitetrackingprojectlist", null)
            .success(function (data) {

                console.log("IN Project Get");
                console.log(data);
                if(data.status!="Successful"){
                    alert("Failed:"+data.message);
                }else {
                    for(var i=0;i<data.message.length;i++){
                        $projects.push({
                            id: data.message[i].ProjectId,
                            name:data.message[i].ProjectName

                        });
                    }
                }
            })
            .error(function (data, status, headers, config) {
                alert("Error  Occurred:"+data);

            });*/

    }

    this.uploadFileToUrl = function ($http,file, $scope) {
       console.log("File upload started");

        var fd = new FormData();
        fd.append('file', file);
        $http.post("Config/php/upload.php", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })

            .success(function (status) {
                $scope.warningMessage = status;
                $('#warning').css("display", "block");
                setTimeout(function () {
                    $('#warning').css("display", "none");
                    window.location.reload(1);
                }, 1500);
                console.log("in upload successs" + status);
            })

            .error(function () {
                $scope.errorMessage = "Something went wrong.File not uploaded";
                $('#error').css("display", "block");
                //setTimeout(function () {
                //    $('#error').css("display", "none");
                //}, 1000);
                console.log("In file upload error");
            });
    }

    this.getCompaniesForProject=function($http,$projectId,$companies){
        var data={
            operation :"getCompaniesForProject",
            data : $projectId

        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Process/php/projectFacade.php",null, config)
            .success(function (data) {
                console.log(data);
                if (data.status == "Successful") {
                    for (var i = 0; i < data.message.length; i++) {
                        $companies.push({
                            company_id: data.message[i].companyId,
                            company_name: data.message[i].companyName
                        });
                    }
                    console.log($companies);
                } else {
                    alert(data.message);
                }
            })
            .error(function(data){
                alert(data);
            });

    }



});