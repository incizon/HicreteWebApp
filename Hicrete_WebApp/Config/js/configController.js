myApp.controller('roleController', function ($scope, $http, configService) {
    $scope.roleSubmitted = false;
    $scope.showAccessError = false;
    $scope.roleDisabled = false;
    $scope.roleName;
    configService.getAllAccessPermission($http, $scope);

    $scope.addRole = function () {
        var accessSelected = false;
        angular.forEach($scope.accessList, function (accessEntry) {
            accessSelected = accessSelected || accessEntry.read.val || accessEntry.write.val;

        });
        if (!accessSelected) {
            $scope.showAccessError = true;
            return;
        }
        $scope.showAccessError = false;
        $scope.roleSubmitted = false;


        var data = {
            operation: "addRole",
            roleName: $scope.roleName,
            accessPermissions: $scope.accessList
        };

        var config = {
            params: {
                data: data

            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status == "Successful") {
                    doShowAlert("Success", "Role created successfully");
                } else if (data.status == "Unsuccessful") {
                    doShowAlert("Failure", data.message);
                } else {
                    doShowAlert("Failure", data.message);
                }
                clearRoleForm();
            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");

            });


    }

    var clearRoleForm = function () {
        $scope.roleName = "";
        angular.forEach($scope.accessList, function (accessEntry) {
            accessEntry.read.val = false;
            accessEntry.write.val = false;

        });

    }
    $scope.finish = function () {
        clearRoleForm();
        if ($scope.isFromUser) {
            $scope.isFromUser = false;
            window.location = "dashboard.php#/Config/addUser";
        } else
            window.location = "dashboard.php#/Config";
    }
});


myApp.controller('userController', function ($scope, $http, configService) {

    $scope.refreshRoleList = true;
    $scope.step = 1;
    $scope.userInfoSubmitted = false;
    $scope.accessInfoSubmitted = false;
    $scope.showCompanyError = false;

    $scope.roleAccessList = [];
    $scope.selectedRole = {"roleId": ""};
    $scope.otherAccessList = [];
    $scope.isFromUser = true;


    $scope.userInfo = {
        firstName: "",
        lastName: "",
        dob: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        email: "",
        mobile: "",
        designation: "",
        userType: ""
    };

    $scope.selectUser = function (user) {
        $scope.selectedUser = user;
    }

/////////////////////////////////////////////////////////////////////////////////
// Function to get User details
/////////////////////////////////////////////////////////////////////////////////
    $scope.getUserData = function () {

        var data = {
            operation: "getUserDetails"
        };
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status != "Successful") {
                    console.log(data);
                    //doShowAlert("Failure",data.message);
                } else {
                    console.log("User= "+data.message);
                    $scope.Users = data.message;
                    $scope.userInfo=data.message[0];
                    var collectionDate=$scope.userInfo.dateOfBirth;
                    $scope.userInfo.newDate=new Date(collectionDate);
                    console.log("USERINFO");
                    console.log($scope.userInfo);
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occured");
            });


    };
    $scope.getUserData();
    configService.getRoleList($http, $scope);

    $scope.nextStep = function () {
        $scope.step++;
    }

    $scope.prevStep = function () {
        $scope.step--;
    }

    $scope.modifyUserInfo=function(){
        console.log("Modify My Profile");
        console.log($scope.userInfo);

    }
    $scope.clearUserForm = function () {
        $scope.step = 1;
        $scope.userInfo = {
            firstName: "",
            lastName: "",
            dob: "",
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            email: "",
            mobile: "",
            designation: "",
            userType: ""
        };
        $scope.roleAccessList = [];
        $scope.otherAccessList = [];
        $scope.selectedRole = {"roleId": ""};
        //window.location="http://localhost/Hicrete_webapp/dashboard.php#/Config/addUser";

    }


    $scope.addUser = function () {
        // var companySelected=false;
        // angular.forEach($scope.companyList, function(company) {
        //       companySelected=companySelected || company.value;
        //    });
        // if(!companySelected){
        // 	$scope.showCompanyError=true;
        // 	return;
        // }


        var data = {
            operation: "addUser",
            userInfo: $scope.userInfo,
            roleId: $scope.selectedRole.roleId,
            accessPermissions: $scope.roleAccessList
        };

        var config = {
            params: {
                data: data

            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                console.log(data.status);
                console.log(data.message);
                if (data.status == "Successful") {
                    alert("Password is :" + data.message);
                    doShowAlert("Success", "User created successfully");
                    window.location = "http://localhost/Hicrete_webapp/dashboard.php#/Config";
                } else if (data.status == "Unsuccessful") {
                    doShowAlert("Failure", data.message);
                } else {
                    doShowAlert("Failure", data.message);
                }
                $scope.clearUserForm();

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");
                $scope.clearUserForm();

            });

        $scope.userInfoSubmitted = false;
        $scope.accessInfoSubmitted = false;
        $scope.showCompanyError = false;
    }


    $scope.loadAccessPermission = function () {

        var data = {
            operation: "getAccessForRole",
            roleId: $scope.selectedRole.roleId
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status != "Successful") {
                    doShowAlert("Failure", data.message);
                } else {
                    configService.marshalledAccessList(data.message, $scope.roleAccessList);
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occured");
            });
    }


    var populateOtherAccessList = function () {

        console.log($scope.accessList);
        console.log($scope.roleAccessList);
        angular.forEach($scope.accessList, function (accessEntry) {
            var addThisEntry = true;
            angular.forEach($scope.roleAccessList, function (roleAccessEntry) {
                if (accessEntry.moduleName === roleAccessEntry.moduleName) {
                    addThisEntry = false;
                    if (!roleAccessEntry.read.ispresent) {
                        accessEntry.write.ispresent = false;
                        $scope.otherAccessList.push(accessEntry);

                    } else if (!roleAccessEntry.write.ispresent) {
                        accessEntry.read.ispresent = false;
                        $scope.otherAccessList.push(accessEntry);

                    }
                }
            });
            if (addThisEntry) {
                $scope.otherAccessList.push(accessEntry);
            }
        });
        console.log($scope.otherAccessList);
    }


    $scope.loadExtraAccessPermission = function () {

        $scope.accessList = [];
        var data = {
            operation: "getAccessPermission"
        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {
                if (data.status != "Successful") {
                    doShowAlert("Failure", data.message);
                } else {

                    configService.marshalledAccessList(data.message, $scope.accessList);
                    populateOtherAccessList();
                }
            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occured");
                $scope.loaded = true;
            });
    }


    $scope.addExtraAccessPermission = function () {
        angular.forEach($scope.otherAccessList, function (otherAccessEntry) {
            var addThisEntry = true;
            angular.forEach($scope.roleAccessList, function (roleAccessEntry) {
                if (roleAccessEntry.moduleName === otherAccessEntry.moduleName) {
                    addThisEntry = false;
                    if (otherAccessEntry.read.val) {
                        roleAccessEntry.read.ispresent = true;
                        roleAccessEntry.read.val = true;
                        roleAccessEntry.read.accessId = otherAccessEntry.read.accessId;

                    } else if (otherAccessEntry.write.val) {

                        roleAccessEntry.write.ispresent = true;
                        roleAccessEntry.write.val = true;
                        roleAccessEntry.write.accessId = otherAccessEntry.write.accessId;

                    }
                }
            });
            if (addThisEntry) {

                if (otherAccessEntry.read.val)
                    otherAccessEntry.read.ispresent = otherAccessEntry.read.val;

                if (otherAccessEntry.write.val)
                    otherAccessEntry.write.ispresent = otherAccessEntry.write.val;

                $scope.roleAccessList.push(otherAccessEntry);
            }
        });
    }


});


myApp.controller('companyController', function ($scope, $http) {
    $scope.company = {
        name: "",
        abbrevation: "",
        startdate: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        email: "",
        phone: ""
    };
    console.log("Inside company controller");

    $scope.warehouse = {
        name: "",
        abbrevation: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        phone: ""
    };


    $scope.submitted = false;
    $scope.warehouseSubmitted = false;
/////////////////////////////////////////////////////////////////////////////////
// Function to get comapny details
/////////////////////////////////////////////////////////////////////////////////
    $scope.getCompanyData = function () {

        var data = {
            operation: "getCompanyDetails"
        };
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status != "Successful") {
                    console.log(data);
                    //doShowAlert("Failure",data.message);
                } else {
                    console.log(data);
                    $scope.Companies = data.message;

                    console.log($scope.Companies);
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occured");
            });


    };
    $scope.getCompanyData();


    $scope.addCompany = function () {
        var data = {
            operation: "addCompany",
            data: $scope.company
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status == "Successful") {
                    doShowAlert("Success", "Company created successfully");
                } else if (data.status == "Unsuccessful") {
                    doShowAlert("Failure", data.message);
                } else {
                    doShowAlert("Failure", data.message);
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");

            });
        $scope.submitted = false;
        clearCompanyForm();
        return true;
    }


    $scope.addWarehouse = function () {

        var data = {
            operation: "addWarehouse",
            data: $scope.warehouse
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status == "Successful") {
                    doShowAlert("Success", "Warehouse created successfully");
                } else if (data.status == "Unsuccessful") {
                    doShowAlert("Failure", data.message);
                } else {
                    doShowAlert("Failure", data.message);
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occurred");

            });
        $scope.warehouseSubmitted = false;
        clearWarehouseForm();
        return true;

    }


    var clearCompanyForm = function () {
        $scope.company = {
            name: "",
            abbrevation: "",
            startdate: "",
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            email: "",
            phone: ""
        };
    }

    var clearWarehouseForm = function () {
        $scope.warehouse = {
            name: "",
            abbrevation: "",
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            phone: ""
        };

    }


});

myApp.controller('tempAccessController', function ($scope, $http, configService) {
    $scope.requestId = "56929ff47e6183070";
    $scope.tempSubmitted = false;
    $scope.accessRequested = [];
    $scope.tempAccess = {};
    $scope.remark = "";
    $scope.buttonDisabled = true;
    var data = {
        operation: "getTempAccessRequestDetails",
        requestId: $scope.requestId
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Config/php/configFacade.php", null, config)
        .success(function (data) {

            if (data.status != "Successful") {
                doShowAlert("Failure", data.message);
            } else {

                $scope.tempAccess = data.message.requestDetails;
                configService.marshalledAccessList(data.message.accessRequested, $scope.accessRequested);
                $scope.buttonDisabled = false;
            }

        })
        .error(function (data, status, headers, config) {
            doShowAlert("Failure", "Error Occured");
        });


    $scope.AddAccessRequestAction = function (actionStatus) {
        $scope.buttonDisabled = true;
        $scope.tempSubmitted = false;
        var data = {
            operation: "TempAccessRequestAction",
            requestId: $scope.requestId,
            remark: $scope.remark,
            status: actionStatus,


        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status != "Successful") {
                    doShowAlert("Failure", data.message);
                } else {
                    doShowAlert("Success", "Operation Successful");
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occured");
            });
    }

});

myApp.controller('requestTempAccessController', function ($scope, $http, configService) {

    $scope.showAccessError = false;
    $scope.accessRequestSubmitted = false;
    $scope.submitDisable = false;
    $scope.clearDisable = false;
    $scope.accessRequest = {
        fromDate: new Date(),
        toDate: new Date(),
        description: ""
    };
    $scope.exemptedAccessList = [];

    var data = {
        operation: "getExemptedAccessList"
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Config/php/configFacade.php", null, config)
        .success(function (data) {

            if (data.status != "Successful") {
                doShowAlert("Failure", data.message);
            } else {
                configService.marshalledAccessList(data.message, $scope.exemptedAccessList);
            }

        })
        .error(function (data, status, headers, config) {
            doShowAlert("Failure", "Error Occured");
        });

    $scope.clearForm = function () {
        $scope.requestAccessForm = {
            fromDate: new Date(),
            toDate: new Date(),
            description: ""
        };
    }


    $scope.requestTemporaryAccess = function () {
        $scope.showAccessError = false;
        $scope.submitDisable = true;
        $scope.clearDisable = true;
        var accessSelected = false;
        angular.forEach($scope.exemptedAccessList, function (accessEntry) {
            accessSelected = accessSelected || accessEntry.read.val || accessEntry.write.val;

        });
        if (!accessSelected) {
            $scope.showAccessError = true;
            return;
        }


        var data = {
            operation: "addTempAcccessRequest",
            accessRequest: $scope.accessRequest,
            accessList: $scope.exemptedAccessList
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                if (data.status != "Successful") {
                    doShowAlert("Failure", data.message);
                    $scope.submitDisable = false;
                    $scope.clearDisable = false;
                } else {
                    doShowAlert("Success", "Access Request Added");
                    $scope.clearForm();
                    window.location = "http://localhost/Hicrete_webapp/dashboard.php#/Config";
                }

            })
            .error(function (data, status, headers, config) {
                doShowAlert("Failure", "Error Occured");
                $scope.submitDisable = false;
                $scope.clearDisable = false;
            });


        $scope.accessRequestSubmitted = false;

    }
});