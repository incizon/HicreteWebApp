myApp.controller('roleController',function($scope,$rootScope,$http,configService,$uibModal){
 $scope.roleSubmitted=false;
 $scope.showAccessError=false;
 $scope.roleDisabled=false;
 $scope.roleName;
configService.getAllAccessPermission($http,$scope);

    $scope.loading=true;
    //$scope.errorMessage="";
    //$scope.warningMessage="";
    $scope.showAccessError=false;
    $scope.roleSubmitted=false;

    $('#loader').css("display","block");
        $scope.addRole=function(){

            $scope.roleDisabled=true;
            console.log("In addRole");
        	var accessSelected=false;
        	angular.forEach($scope.accessList, function(accessEntry) {
               accessSelected=accessSelected || accessEntry.read.val || accessEntry.write.val ;
               
            });
        	if(!accessSelected){
        		$scope.showAccessError=true;
        		return;
        	}

            var data={
                operation :"addRole",
                roleName:$scope.roleName,
                accessPermissions: $scope.accessList
            };
            var config = {
                params: {
                    data: data

                }
            };

            $http.post("Config/php/configFacade.php",null, config)
                .success(function (data)
                {
                    $scope.roleDisabled=false;
                    $scope.showAccessError=true;
                    $scope.roleSubmitted=true;
                    if(data.status=="Successful"){
                        $scope.loading=false;
                        $('#loader').css("display","none");
                        $rootScope.warningMessage="Role added Successfully..";
                        console.log($scope.warningMessage);
                        $('#warning').css("display","block");

                        setTimeout(function() {
                            $scope.$apply(function() {
                                $('#warning').css("display","none");
                            });
                        }, 3000);
                    }else if(data.status=="Unsuccessful"){
                        $scope.loading=false;
                        $('#loader').css("display","none");
                        $rootScope.errorMessage="Role not added..";
                        $('#error').css("display","block");
                        setTimeout(function() {
                            $scope.$apply(function() {
                                $('#error').css("display","none");
                            });
                        }, 3000);
                    }else{
                        $scope.roleDisabled=false;
                        $scope.showAccessError=true;
                        $scope.roleSubmitted=true;
                        $scope.loading=false;
                        $('#loader').css("display","none");
                        $rootScope.errorMessage="Role not added..";
                        $('#error').css("display","block");
                        setTimeout(function() {
                            $scope.$apply(function() {
                                $('#error').css("display","none");
                            });
                        }, 3000);
                    }
                    window.location.reload(true);

                })
                .error(function (data, status, headers, config)
                {
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $rootScope.errorMessage="Role not added..";
                    $('#error').css("display","block");
                });

            //var modalInstance = $uibModal.open({
            //    animation: $scope.animationsEnabled,
            //    templateUrl: 'utils/ConfirmDialog.html',
            //    controller:  function ($scope,$rootScope,$uibModalInstance,roleData) {
            //        $scope.save = function () {
            //            console.log("Ok clicked");
            //            console.log(roleData);
            //            $scope.createRole($scope, $http,roleData);
            //            $uibModalInstance.close();
            //        };
            //        $scope.cancel = function () {
            //            $uibModalInstance.dismiss('cancel');
            //        };
            //        $scope.createRole = function ($scope, $http, roleData) {
            //            var config = {
            //                params: {
            //                    data: roleData
            //
            //                }
            //            };
            //
            //            $http.post("Config/php/configFacade.php",null, config)
            //                .success(function (data)
            //                {
            //                    $scope.roleDisabled=false;
            //                    $scope.showAccessError=true;
            //                    $scope.roleSubmitted=true;
            //                    if(data.status=="Successful"){
            //                        $scope.loading=false;
            //                        $('#loader').css("display","none");
            //                        $rootScope.warningMessage="Role added Successfully..";
            //                        console.log($scope.warningMessage);
            //                        $('#warning').css("display","block");
            //
            //                        setTimeout(function() {
            //                            $scope.$apply(function() {
            //                                $('#warning').css("display","none");
            //                            });
            //                        }, 3000);
            //                    }else if(data.status=="Unsuccessful"){
            //                        $scope.loading=false;
            //                        $('#loader').css("display","none");
            //                        $rootScope.errorMessage="Role not added..";
            //                        $('#error').css("display","block");
            //                        setTimeout(function() {
            //                            $scope.$apply(function() {
            //                                $('#error').css("display","none");
            //                            });
            //                        }, 3000);
            //                    }else{
            //                        $scope.roleDisabled=false;
            //                        $scope.showAccessError=true;
            //                        $scope.roleSubmitted=true;
            //                        $scope.loading=false;
            //                        $('#loader').css("display","none");
            //                        $rootScope.errorMessage="Role not added..";
            //                        $('#error').css("display","block");
            //                        setTimeout(function() {
            //                            $scope.$apply(function() {
            //                                $('#error').css("display","none");
            //                            });
            //                        }, 3000);
            //                    }
            //                    window.location.reload(true);
            //
            //                })
            //                .error(function (data, status, headers, config)
            //                {
            //                    $scope.loading=false;
            //                    $('#loader').css("display","none");
            //                    $rootScope.errorMessage="Role not added..";
            //                    $('#error').css("display","block");
            //                });
            //
            //        };
            //    },
            //    resolve: {
            //        roleData: function () {
            //            return data;
            //        }
            //    }
            //
            //});

            //modalInstance.result.then(function () {
            //    console.log("In result");
            //}, function () {
            //    $log.info('Modal dismissed at: ' + new Date());
            //});
            //$scope.toggleAnimation = function () {
            //    $scope.animationsEnabled = !$scope.animationsEnabled;
            //};

        }

        $scope.checkAll = function(){
            console.log('CheckAll');
        };

        var clearRoleForm=function(){
            $scope.roleName="";
            angular.forEach($scope.accessList, function(accessEntry) {
                accessEntry.read.val=false;
                accessEntry.write.val=false;
               
            });

        }
        $scope.finish=function(){
        	 clearRoleForm();
            setTimeout(function() {
               window.location.reload(true);
            }, 3000);
        }
});


myApp.controller('userController',function($scope,$http,$rootScope,configService){


$scope.step=1;
$scope.userInfoSubmitted=false;
$scope.accessInfoSubmitted=false;
$scope.showCompanyError=false;

$scope.roleAccessList=[];
$scope.selectedRole={"roleId":""};
$scope.otherAccessList=[];




$scope.userInfo={
firstName:"",
lastName:"",
dob:"",
address:"",
city:"",
state:"",
country:"",
pincode:"",
email:"",
mobile:"",
designation:"",
userType:""
};

    $scope.clearFields= function(page)
    {
        if(page=='init')
        {
            $scope.userInfo.firstName="";
            $scope.userInfo.lastName="";
            $scope.userInfo.dob="";
            $scope.userInfo.address="";
            $scope.userInfo.city="";
            $scope.userInfo.state="";
            $scope.userInfo.country="";
            $scope.userInfo.email="";
            $scope.userInfo.mobile="";

        }
        else if(page=='Access')
        {
            $scope.userInfo.designation="";
            $scope.userInfo.userType="";
        }

    }

    configService.getRoleList($http,$scope);


    $scope.nextStep = function() {
            $scope.step++;
        }
 
        $scope.prevStep = function() {
            $scope.step--;
        }

    $scope.today = function(){
        $scope.userInfo.dob = new Date();
    };

    $scope.today();

    $scope.openDob = function(){
        $scope.showPicker.opened = true;
    };

    $scope.showPicker = {
        opened:false
    };
        
        $scope.clearUserForm=function(){
              $scope.step=1;     
              $scope.userInfo={
                firstName:"",
                lastName:"",
                dob:"",
                address:"",
                city:"",
                state:"",
                country:"",
                pincode:"",
                email:"",
                mobile:"",
                designation:"",
                userType:""
              };
              $scope.roleAccessList=[];
              $scope.otherAccessList=[];
              $scope.selectedRole={"roleId":""};
            $scope.userInfoSubmitted=false;
              //window.location="http://localhost/Hicrete_webapp/dashboard.php#/Config/addUser"; 
  
        }

        $scope.addUser=function(){

          var data={
            operation :"addUser",
            userInfo:$scope.userInfo,
            roleId: $scope.selectedRole.roleId,
          };

            $scope.loading=true;
            $scope.errorMessage="";
            $scope.warningMessage="";
            $('#loader').css("display","block");

          var config = {
                     params: {
                           data: data

                         }
          };

          $http.post("Config/php/configFacade.php",null, config)
           .success(function (data)
           {
               
             console.log(data.status);
             console.log(data.message);
             if(data.status=="Successful"){
                //alert("User added successfully. Password is :"+data.message);
                 setTimeout(function(){
                     $scope.loading=false;
                     $('#loader').css("display","none");
                 },1000);

                 $scope.warningMessage= "User added successfully...Credential send to "+$scope.userInfo.email;
                 $('#warning').css("display","block");
                 console.log($scope.warningMessage);
                 setTimeout(function() {
                     $scope.$apply(function() {
                         if(data.message!=""){
                             $('#warning').css("display","none");
                         }
                     });
                 }, 3000);

                /* $scope.clearUserForm();

                 $scope.userInfoSubmitted= false;
                 $scope.step=1;
*/
                //doShowAlert("Success","User created successfully");
                 setTimeout(function(){
                    //window.location.reload(true);
                     window.location = "dashboard.php#/Config";
                 },1000);
             }else if(data.status=="Unsuccessful"){
                  //doShowAlert("Failure",data.message);
                 $scope.errorMessage=data.message;
                 $('#loader').css("display","none");
                 $('#error').css("display","block");
                 console.log($scope.errorMessage);
             }else{
                  //doShowAlert("Failure",data.message);
                 $scope.errorMessage="User not Added";
                 $('#loader').css("display","none");
                 $('#error').css("display","block");
                 //console.log($scope.errorMessage);
             } 
             //window.location.reload=true;
            // $scope.clearUserForm();
                     
           })
           .error(function (data, status, headers, config)
           {
             //doShowAlert("Failure","Error Occurred");
             $scope.clearUserForm();
               $scope.errorMessage="User not Added";
               $('#loader').css("display","none");
               $('#error').css("display","block");
               console.log($scope.errorMessage);
           });

           $scope.userInfoSubmitted=false;
              $scope.accessInfoSubmitted=false;
              $scope.showCompanyError=false;
        }

        $scope.loadAccessPermission=function(){
        		    
              console.log($scope.selectedRole.roleId);
                var data={
                      operation :"getAccessForRole",
                      roleId: $scope.selectedRole.roleId   
                };        

                var config = {
                           params: {
                                 data: data
                               }
                };

                $http.post("Config/php/configFacade.php",null, config)
                     .success(function (data)
                     {
                     
                       if(data.status!="Successful"){
                          alert(data.message);
                       }else{
                           $scope.roleAccessList=[];
                            configService.marshalledAccessList(data.message,$scope.roleAccessList);
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                       alert("Error Occured");
                     });
            }



});

myApp.controller('chngPassController',function($scope,$rootScope,$http,configService) {

    $scope.typeOfPassField = 'password';
    $scope.error=false;
    $scope.loading=true;
    $scope.errorMessage="";
    $scope.warningMessage="";
    $('#loader').css("display","block");

    console.log($scope.typeOfPassField);
    $scope.checkFieldType =function()
    {
        if($scope.showPass == true)
        {
            $scope.typeOfPassField = 'text';
        }
        else
        {
            $scope.typeOfPassField = 'password';

        }
    }
    $scope.cancelChangePass= function()
    {
        window.location ='dashboard.php';
    }
    $scope.changePassword =function()
    {
        if($scope.newDetails.newPassRe != $scope.newDetails.newPass)
        {
            $scope.error=true;
            $scope.message="Password do not match";
        }
        else
            $scope.error=false;
        console.log($scope.newDetails);
        if(!$scope.error) {
            var data = {
                operation: "ChangePassword",
                data: $scope.newDetails

            };

            var config = {
                params: {
                    data: data

                }
            };

            $http.post("Config/php/configFacade.php", null, config)
                .success(function (data) {

                    console.log(data);
                    console.log(data.message);

                    if (data.status == "Successful") {
                        $scope.warningMessage = data.message;
                        $('#warning').css("display", "block");
                        $scope.newDetails.newPassRe='';
                        $scope.newDetails.newPass='';
                        $scope.newDetails.oldPass='';

                    }
                    else if (data.status == "WrongPass") {
                        $scope.errorMessage = data.message;
                        $('#error').css("display", "block");
                    } else {
                        $scope.errorMessage = data.message;
                        $('#error').css("display", "block");
                    }


                })
                .error(function (data, status, headers, config) {
                    alert("Error Occurred:"+data);


                });
        }
    }
});


myApp.controller('searchUserController',function($scope,$rootScope,$http,configService){


    $scope.isFromUser=true;
    $scope.searchKeyword="";
    $scope.searchAttribute="";


    $scope.userInfo={
        firstName:"",
        lastName:"",
        dob:"",
        address:"",
        city:"",
        state:"",
        country:"",
        pincode:"",
        email:"",
        mobile:"",
        designation:"",
        userType:""
    };

    $scope.UserPerPage=10;
    $scope.currentPage=1;

    $scope.selectUser = function(user)
    {
        $scope.selectedUser=user;
        console.log($scope.selectedUser);
    }


    $scope.getUserData = function(keyword){

        console.log(keyword);
        console.log($scope.searchAttribute);

        var data={
            operation:"getUserDetails",
            keyword:keyword,
            searchBy:$scope.searchAttribute
        };

        $scope.loading=true;
        $scope.errorMessage="";
        $scope.warningMessage="";
        $('#loader').css("display","block");

        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status==="Successful"){
                    console.log(data);
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.warningMessage="Data found Successfully..";
                    console.log($scope.warningMessage);
                    $('#warning').css("display","block");

                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#warning').css("display","none");
                        });
                    }, 3000);
                    $rootScope.Users=data.message;
                    $scope.totalItems=$rootScope.Users.length;
                    console.log($scope.totalItems);

                }
                else if(data.status==="NoRows")
                {
                    $rootScope.Users=[];
                    //alert(data.message);
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage="Data not found..";
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);

                }else{
                //alert(data.message);
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage="Data not found..";
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);
            }

            })
            .error(function (data, status, headers, config)
            {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage="Data not found..";
                $('#error').css("display","block");
                setTimeout(function() {
                    $scope.$apply(function() {
                        $('#error').css("display","none");
                    });
                }, 3000);
            });


    };



    $scope.deleteUser = function(user)
    {
        var data={
            operation:"deleteUser",
            key:user.userId

        };
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status=="Successful"){
                    var index = $rootScope.Users.indexOf(user);
                    $rootScope.Users.splice(index, 1);
                    alert("Deleted successfully");
                }
                else
                {
                   alert(data.message);


                }

            })
            .error(function (data, status, headers, config)
            {
                alert("Error Occured"+data);
            });


    };

    $scope.paginate = function(value) {
        //console.log("In Paginate");
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.UserPerPage;
        end = begin + $scope.UserPerPage;
        index = $rootScope.Users.indexOf(value);
        //console.log(index);
        return (begin <= index && index < end);
    };

});


myApp.controller('ModifyUserController',function($scope,$http,$stateParams,configService){

    $scope.selectedUserInfo=$stateParams.userToModify;
    configService.getRoleList($http,$scope);

    $scope.roleAccessList=[];
    $scope.selectedRole={"roleId":""};


    configService.getRoleList($http,$scope);
    $scope.loadAccessPermission=function(){

        var data={
            operation :"getAccessForRole",
            roleId: $scope.selectedUserInfo.roleId
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    alert("Error Occured"+data.message);
                }else{
                    $scope.roleAccessList=[];
                    configService.marshalledAccessList(data.message,$scope.roleAccessList);
                }

            })
            .error(function (data, status, headers, config)
            {
                alert("Error Occured"+data);
            });
    }
    $scope.loadAccessPermission();


    $scope.modifyUser=function(){

        if($scope.modifyUserForm.$pristine){
            alert("Fields are not modified");
            return;
        }

        console.log($scope.selectedUserInfo);
        var data={
            operation :"modifyUser",
            userInfo:$scope.selectedUserInfo

        };

        var config = {
            params: {
                data: data

            }
        };

         $http.post("Config/php/configFacade.php",null, config)
         .success(function (data)
         {

         console.log(data);

         if(data.status=="Successful"){
            alert("User Modified Successfully");

         }else if(data.status=="Unsuccessful"){
            console.log(data.message);
            alert(data.message);
         }else{
             console.log(data.message);
            alert(data.message);
         }


         })
         .error(function (data, status, headers, config)
         {
            alert("Failure -Error Occurred");

         });


    }


});

myApp.controller('viewRoleController',function($scope,$http,$rootScope,$stateParams,configService)
{
    $scope.searchKeyword="";



    $scope.getAllAccesspermissions= function()
    {
        var data={
            operation:"getAccessPermission",

        };
        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    console.log(data);
                    alert(data.message);

                }else{
                    console.log(data);
                    $rootScope.AllAccessPermissions=data.message;

                    //console.log($scope.Companies);
                }

            })
            .error(function (data, status, headers, config)
            {
                alert("Error Occured"+data);

            });

    }
    $scope.getAllAccesspermissions();

    $scope.getRoleDetails = function()
    {
        console.log($scope.searchKeyword);
        var data={
            operation:"getRoleDetails",
            key:$scope.searchKeyword
        };

        $scope.loading=true;
        $scope.errorMessage="";
        $scope.warningMessage="";
        $('#loader').css("display","block");

        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    console.log(data);
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage="Data not found..";
                   // $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                     //       $('#error').css("display","none");
                        });
                    }, 3000);

                }else if(data.status === "Successful"){
                    console.log(data);
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage="Data not found..";
                   // $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                           // $('#error').css("display","none");
                        });
                    }, 3000);

                    $rootScope.Roles=data.message;
                }else{
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage="Data not found..";
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);

                    //console.log($scope.Companies);
                }

            })
            .error(function (data, status, headers, config)
            {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.warningMessage="Data found Successfully..";
                console.log($scope.warningMessage);
                $('#warning').css("display","block");

                setTimeout(function() {
                    $scope.$apply(function() {
                        $('#warning').css("display","none");
                    });
                }, 3000);
            });

    }

});


myApp.controller('companyController',function($scope,$rootScope,$http){
    $scope.keyword="";
    $scope.searchkeyword="";
 $scope.company={
 	name:"",
    abbrevation:"",
    startdate:"",
    address:"",
    city:"",
    state:"",
    country:"",
    pincode:"",
    email:"",
    phone:"",
     bankName:"",
     accountName:"",
     accountType:"",
     bankBranch:"",
     accountNo:"",
     IFSCCode:""

 };
    console.log("Inside company controller");

$scope.warehouse={
  name:"",
  abbrevation:"",
  address:"",
  city:"",
  state:"",
  country:"",
  pincode:"",
  phone:""
 };

    $scope.openCompDate = function(){
        $scope.compDate.opened = true;
    };

    $scope.compDate = {
        opened:false
    }

    ///////////////////////////////////////////////////////////////////////
    // function to modify Company-Start
    //////////////////////////////////////////////////////////////////
    $scope.selectForModifyCmpny= function(comp)
    {
        $scope.companyDetails=comp;
        console.log($scope.companyDetails);

    };
    $scope.modifyCompDetails=function()
    {
        console.log($scope.companyDetails);
    }

    ///////////////////////////////////////////////////////////////////////
    // function to modify Company-End
    //////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Function to get Ware house details
/////////////////////////////////////////////////////////////////////////////////
    $scope.getWareHouseDetails = function(keyword)
    {
        console.log(keyword);
        var data={
            operation:"getWareHouseDetails",
            key:keyword
        };

        $scope.loading=true;
        $scope.errorMessage="";
        $scope.warningMessage="";
        $('#loader').css("display","block");

        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    console.log(data);
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage="Data not found..";
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);
                }else{
                    console.log(data);
                    $rootScope.warehouses=data.message;
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    console.log($scope.Companies);
                }

            })
            .error(function (data, status, headers, config)
            {
                $scope.loading=false;
                $('#loader').css("display","none");
                $scope.errorMessage="Data not found..";
                $('#error').css("display","block");
                setTimeout(function() {
                    $scope.$apply(function() {
                        $('#error').css("display","none");
                    });
                }, 3000);
            });

    };
    //$scope.getWareHouseDetails();

 $scope.submitted=false;
 $scope.warehouseSubmitted=false;
/////////////////////////////////////////////////////////////////////////////////
// Function to get comapny details
/////////////////////////////////////////////////////////////////////////////////
    $scope.getCompanyData = function(searchkeyword){
        console.log("Inside company fetch data ");
        var data={
            operation:"getCompanyDetails",
            keyword:searchkeyword
        };

        $scope.loading=true;
        $scope.errorMessage="";
        $scope.warningMessage="";
        $('#loader').css("display","block");

        var config = {
            params: {
                data: data
            }
        };
       //if($rootScope.Companies.length==0) {
            $http.post("Config/php/configFacade.php", null, config)
                .success(function (data) {

                    if (data.status != "Successful") {
                        console.log(data);
                        $scope.loading=false;
                        $('#loader').css("display","none");
                        $scope.errorMessage="Data not found..";
                        $('#error').css("display","block");
                        setTimeout(function() {
                            $scope.$apply(function() {
                                $('#error').css("display","none");
                            });
                        }, 3000);

                    } else {
                        console.log(data);
                        $scope.loading=false;
                        $('#loader').css("display","none");
                        $rootScope.Companies = data.message;
                        console.log($rootScope.Companies);

                       // console.log($scope.Companies);
                    }

                })
                .error(function (data, status, headers, config) {
                    $scope.loading=false;
                    $('#loader').css("display","none");
                    $scope.errorMessage="Data not found..";
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);
                });

        //}

    };
   // $scope.getCompanyData();





$scope.addCompany=function(){
    var data={
            operation :"addCompany",
            data:$scope.company
      };
    $scope.loading=true;
    $scope.errorMessage="";
    $scope.warningMessage="";
    $('#loader').css("display","block");

      var config = {
                 params: {
                       data: data
                     }
      };

      $http.post("Config/php/configFacade.php",null, config)
           .success(function (data)
           {

               if(data.status=="Successful"){
                   $scope.loading=false;
                   $('#loader').css("display","none");
                   $scope.warningMessage="Company added Successfully..";
                   console.log($scope.warningMessage);
                   $('#warning').css("display","block");

                   setTimeout(function() {
                       $scope.$apply(function() {
                           $('#warning').css("display","none");
                       });
                   }, 3000);
               }else if(data.status=="Unsuccessful"){
                   $scope.loading=false;
                   $('#loader').css("display","none");
                   $scope.errorMessage="Company not added..";
                   $('#error').css("display","block");
                   setTimeout(function() {
                       $scope.$apply(function() {
                           $('#error').css("display","none");
                       });
                   }, 3000);
               }else{
                   $scope.loading=false;
                   $('#loader').css("display","none");
                   $scope.errorMessage="Company not added..";
                   $('#error').css("display","block");
                   setTimeout(function() {
                       $scope.$apply(function() {
                           $('#error').css("display","none");
                       });
                   }, 3000);
               }

           })
           .error(function (data, status, headers, config)
           {
               alert("Error Occured"+data);
             
           });
      $scope.submitted=false;
      clearCompanyForm();
      return true;
}


$scope.addWarehouse=function(){
   
   var data={
            operation :"addWarehouse",
            data:$scope.warehouse
      };        

    $scope.loading=true;
    $scope.errorMessage="";
    $scope.warningMessage="";
    $('#loader').css("display","block");

      var config = {
                 params: {
                       data: data
                     }
      };

      $http.post("Config/php/configFacade.php",null, config)
           .success(function (data)
           {

               if(data.status=="Successful"){
                   $scope.loading=false;
                   $('#loader').css("display","none");
                   $scope.warningMessage="Warehouse created Successfully..";
                   console.log($scope.warningMessage);
                   $('#warning').css("display","block");

                   setTimeout(function() {
                       $scope.$apply(function() {
                           $('#warning').css("display","none");
                       });
                   }, 3000);
               }else if(data.status=="Unsuccessful"){
                   $scope.loading=false;
                   $('#loader').css("display","none");
                   $scope.errorMessage="Warehouse not created..";
                   $('#error').css("display","block");
                   setTimeout(function() {
                       $scope.$apply(function() {
                           $('#error').css("display","none");
                       });
                   }, 3000);
               }else{
                   $scope.loading=false;
                   $('#loader').css("display","none");
                   $scope.errorMessage="Warehouse not created..";
                   $('#error').css("display","block");
                   setTimeout(function() {
                       $scope.$apply(function() {
                           $('#error').css("display","none");
                       });
                   }, 3000);
               }

           })
           .error(function (data, status, headers, config)
           {
               alert("Error Occured"+data);
             
           });
      $scope.warehouseSubmitted=false;
      clearWarehouseForm();
      return true;

  }


 var clearCompanyForm=function(){
  $scope.company={
    name:"",
    abbrevation:"",
    startdate:"",
    address:"",
    city:"",
    state:"",
    country:"",
    pincode:"",
    email:"",
    phone:""
   };
}

var clearWarehouseForm=function(){
    $scope.warehouse={
    name:"",
    abbrevation:"",
    address:"",
    city:"",
    state:"",
    country:"",
    pincode:"",
    phone:""
   };

}



});        


myApp.controller('requestTempAccessController',function($scope,$http,configService){

$scope.showAccessError=false;
$scope.accessRequestSubmitted=false;
$scope.submitDisable=false;
$scope.clearDisable=false;
$scope.accessRequest={
  fromDate:new Date(),
  toDate:new Date(),
  description:""
};
    $scope.requestFromDate=function(){
        $scope.from.opened=true;
    };

    $scope.from={
        opened:false
    };

    $scope.requestToDate=function(){
        $scope.to.opened=true;
    };

    $scope.to={
        opened:false
    };
$scope.exemptedAccessList=[];

                var data={
                      operation :"getExemptedAccessList"   
                };        

                var config = {
                           params: {
                                 data: data
                               }
                };

                $http.post("Config/php/configFacade.php",null, config)
                     .success(function (data)
                     {
                     
                       if(data.status!="Successful"){
                           alert(data.message);
                       }else{
                            configService.marshalledAccessList(data.message,$scope.exemptedAccessList);
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                         alert("Error Occured"+data);
                     });

          $scope.clearForm=function(){
              $scope.requestAccessForm={
                  fromDate:new Date(),
                  toDate:new Date(),
                  description:""
                };
          }     


          $scope.requestTemporaryAccess=function(){
              $scope.showAccessError=false;
              $scope.submitDisable=true;
              $scope.clearDisable=true;
              var accessSelected=false;
              angular.forEach($scope.exemptedAccessList, function(accessEntry) {
                   accessSelected=accessSelected || accessEntry.read.val || accessEntry.write.val ;
                   
                });
              if(!accessSelected){
                $scope.showAccessError=true;
                return;
              }


               var data={
                      operation :"addTempAcccessRequest",
                      accessRequest : $scope.accessRequest,
                      accessList: $scope.exemptedAccessList
                };        

                var config = { 
                           params: {
                                 data: data
                               }
                };

                $http.post("Config/php/configFacade.php",null, config)
                     .success(function (data)
                     {
                         $('#loading').css("display","block");
                       if(data.status!="Successful"){
                           $('#loading').css("display","none");
                           $scope.errorMessage = data.message;
                           console.log($scope.errorMessage);
                           $("#error").css("display", "block");
                           setTimeout(function () {
                               $("#error").css("display", "none");
                           }, 3000);
                           //alert(data.message);
                           $scope.submitDisable=false;
                          $scope.clearDisable=false;
                       }else{
                           $('#loading').css("display","none");
                           $scope.warningMessage = "Access Request Added..";
                           console.log($scope.warningMessage);
                           $("#warning").css("display", "block");
                           setTimeout(function () {
                               $("#warning").css("display", "none");
                               window.location="dashboard.php#/Config";
                           }, 3000);
                          //alert("Access Request Added");
                          $scope.clearForm();
                          //window.location="dashboard.php#/Config";
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                         $('#loading').css("display","none");
                         $scope.errorMessage = "Access Request Not Added..";
                         console.log($scope.errorMessage);
                         $("#error").css("display", "block");
                         setTimeout(function () {
                             $("#error").css("display", "none");
                             window.location.reload(1);
                         }, 3000);
                         //alert("Error Occured"+data);
                       $scope.submitDisable=false;
                        $scope.clearDisable=false;
                     });


              $scope.accessRequestSubmitted=false;

          }      
});
myApp.controller('ModifyCompanyController',function($scope,$http,$rootScope, $stateParams) {

        console.log("IN");
    console.log($stateParams);
    $scope.selectedCompany=$stateParams.selectedCompany;
    $scope.companyIndex=$stateParams.index;
    console.log($scope.companyIndex);
   /* for (var i = 0; i < $rootScope.Companies.length; i++) {
        if ($stateParams.companyId == $rootScope.Companies[i].companyId) {
            $scope.selectedCompany=$rootScope.Companies[i];
            break;
        }
    }*/
    console.log($scope.selectedCompany);


    $scope.modifyCompanyDetails =function()
    {
        var data={
            operation:"modifyCompanyDetails",
            data:$scope.selectedCompany

        };
        var config = {
            params: {
                data: data
            }
        };
        console.log($scope.selectedCompany);
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                $('#loader').css("display","none");
                if(data.status!="Successful"){

                    console.log(data);
                    $('#loader').css("display","none");
                    $scope.errorMessage=data.message;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);
                    //alert(data.message);
                    //doShowAlert("Failure",data.message);
                }else{
                    console.log(data);
                    $scope.Companies[$scope.companyIndex]=$scope.selectedCompany;
                    //alert(data.message);
                    $('#loader').css("display","none");
                    $rootScope.warningMessage=data.message;
                    $('#warning').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#warning').css("display","none");
                            window.location= "dashboard.php#/Config/SearchCompany";
                        });
                    }, 3000);




                }

            })
            .error(function (data, status, headers, config)
            {
                $('#loader').css("display","block");
                if(data.status != "Successfull") {
                    $('#loader').css("display", "none");
                    $scope.errorMessage = data.message;
                    $('#error').css("display", "block");
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $('#error').css("display", "none");
                        });
                    }, 3000);
                }
                //alert("Error Occured"+data);
            });

    };





});

myApp.controller('ModifyRoleController',function($scope,$http,$rootScope,$stateParams,configService) {

    $scope.roleName=$stateParams.selectedRole.roleName;
    $scope.roleId=$stateParams.selectedRole.roleId;

    console.log($stateParams.selectedRole);
    console.log($stateParams.index);
    $scope.access=[];
    $scope.roleAccessList=[];

    var data={
        operation :"getAccessForRole",
        roleId: $scope.roleId
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post("Config/php/configFacade.php",null, config)
        .success(function (data)
        {

            if(data.status!="Successful"){
                alert(data.message);
            }else{
                configService.marshalledAccessList(data.message,$scope.roleAccessList);
                console.log($scope.roleAccessList);
                configService.marshalledAccessList($rootScope.AllAccessPermissions,$scope.access);

                for(var j=0;j<$scope.roleAccessList.length;j++) {

                    for (var i = 0; i < $scope.access.length; i++) {

                        if($scope.roleAccessList[j].moduleName == $scope.access[i].moduleName)
                        {
                            $scope.access[i].read.val=$scope.roleAccessList[j].read.ispresent;
                            $scope.access[i].write.val=$scope.roleAccessList[j].write.ispresent;
                            break;
                        }

                    }

                }
                console.log($scope.access);
            }

        })
        .error(function (data, status, headers, config)
        {
            alert("Error Occured");
        });






    $scope.modifyRole=function(){
        if($scope.modifyRoleForm.$pristine){
            //alert("Fields not modified");
            $rootScope.errorMessage = "Fields not modified..";
            $('#error').css("display","block");
            setTimeout(function() {
                $scope.$apply(function() {
                        $('#error').css("display","none");
                });
            }, 3000);
            return;
        }
        var data={
            operation:"modifyRole",
            roleId:$scope.roleId,
            roleName:$scope.roleName,
            accessList:$scope.access
        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {
                console.log(data);


                if(data.status!="Successful"){
                    $rootScope.errorMessage = data.message;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);
                    //alert(data.message);
                    $rootScope.Roles[$stateParams.index].roleName=$scope.roleName;
                    window.location="dashboard.php#/Config/SearchRole";
                }else{
                    //alert(data.message);
                    $rootScope.warningMessage = data.message;
                    $('#warning').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#warning').css("display","none");
                        });
                    }, 3000);
                }

            })
            .error(function (data, status, headers, config)
            {
                console.log(data);
                //alert("Error Occured");
                $rootScope.errorMessage = "Error Occured..";
                $('#error').css("display","block");
                setTimeout(function() {
                    $scope.$apply(function() {
                        $('#error').css("display","none");
                    });
                }, 3000);
            });



    }


});

myApp.controller('ModifyWarehouseController',function($scope,$http,$rootScope,$stateParams) {

    console.log("In");

    for (var i = 0; i < $rootScope.warehouses.length; i++) {
        if ($stateParams.warehouseId == $rootScope.warehouses[i].warehouseId) {
            $scope.selectedWarehouse=$rootScope.warehouses[i];
            break;
        }
    }
    console.log($scope.selectedWarehouse);


    $scope.modifyWarehouse =function()
    {
        var data={
            operation:"modifyWareHouseDetails",
            data:$scope.selectedWarehouse

        };
        var config = {
            params: {
                data: data
            }
        };
        $('#loader').css("display","block");
        //console.log($scope.selectedCompany);
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    console.log(data);
                    $('#loader').css("display","none");
                    $scope.errorMessage=data.message;
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);
                    //alert(data.message);
                    //doShowAlert("Failure",data.message);
                }else{
                    console.log(data);

                    //alert(data.message);
                    $('#loader').css("display","none");
                    $scope.warningMessage=data.message;
                    $('#warning').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#warning').css("display","none");
                            window.location= "dashboard.php#/Config/SearchWarehouse";
                        });
                    }, 3000);



                }

            })
            .error(function (data, status, headers, config)
            {
                //alert("Error Occured"+data);
                $('#loader').css("display","none");
                $scope.errorMessage="Error Occurred";
                $('#error').css("display","block");
                setTimeout(function() {
                    $scope.$apply(function() {
                        $('#error').css("display","none");
                    });
                }, 3000);

            });

    }


});

//SUPER USER CONTROLLER
myApp.controller('superUserController', function ($scope, $rootScope, $http, configService) {

    $scope.superUserInfo={};
    $scope.today = function(){
        $scope.superUserInfo.dateOfBirth = new Date();
    };
    $scope.today();
    $scope.showDob = function(){
        $scope.showPicker.opened = true;
    };

    $scope.showPicker = {
        opened:false
    }
    $scope.addSuperUserInfo=function(){
        console.log($scope.superUserInfo);
        var data = {
            operation: "addSuperUser",
            superUserInfo: $scope.superUserInfo,
        };

        var config = {
            params: {
                data: data
            }
        };
        console.log(config);
        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {

                console.log(data);

                if (data.status == "Success") {
                    //alert("Super User Created...Credentials Sent to "+$scope.superUserInfo.email);
                    alert(data.message);
                } else {
                    alert(data.message);
                }
                window.location="dashboard.php#";

            })
            .error(function (data, status, headers, config) {
                alert(data);
                //console.log(data);
            });

    }

});

myApp.controller('MyProfileController',function($scope,$http,$filter,AppService) {


    var data = {
        operation: "getUserDetails",
        keyword: "userId",
        searchBy: "userId"
    };
    var config = {
        params: {
            data: data
        }
    };

    $scope.showDOB = function () {
        $scope.pickDOB.opened = true;
    };

    $scope.pickDOB = {
        opened: false
    };

    $http.post("Config/php/configFacade.php", null, config)
        .success(function (data) {

            if (data.status === "Successful") {
                console.log("Successs= "+data.message[0]);
                $scope.userInfo=data.message[0];
                var collectionDate=$scope.userInfo.dateOfBirth;
                $scope.userInfo.newDate=new Date(collectionDate);
            }
            else if (data.status === "NoRows") {

                alert("No data found");
                console.log("Norows= "+data);
            } else {
                alert(data.message);
                console.log("Else= "+data.message);
            }

        })
        .error(function (data, status, headers, config) {
            alert("Error Occured");
        });

    $scope.modifyUser = function () {
        console.log("in ModifY user");
        var fileName = "";
        $scope.userInfo.profilePic="";
        if ($scope.myFile != undefined) {
            if ($scope.myFile.name != undefined) {
                var uploadLocation = "upload/ProfilePictures/";
                fileName = uploadLocation + $scope.myFile.name;
                $scope.userInfo.profilePic=fileName;
            }

        }

        if(!$scope.userForm.$pristine ||$scope.myFile != undefined ){
            console.log($scope.userInfo);
            $scope.userInfo.newDate = $filter('date')($scope.userInfo.newDate, 'yyyy/MM/dd hh:mm:ss', '+0530');
            console.log($scope.userInfo);
            var data = {
                operation: "modifyUserDetails",
                userInfo: $scope.userInfo
            };

            var config = {
                params: {
                    data: data
                }
            };
            $('#loading').css("display","block");

            $http.post("Config/php/configFacade.php", null, config)
                .success(function (data) {
                    console.log(data);
                    $('#loading').css("display","none");
                    $scope.warningMessage = data;
                    console.log($scope.warningMessage);
                    $("#warning").css("display", "block");
                    setTimeout(function () {
                        $("#warning").css("display", "none");
                      //  window.location.reload(1);
                    }, 1500);
                    var file = $scope.myFile;
                    AppService.uploadFileToUrl($http,file, $scope);

                })
                .error(function (data, status, headers, config) {
                    $('#loading').css("display","none");
                    $scope.errorMessage = "Fields not updated..";
                    console.log($scope.errorMessage);
                    $("#error").css("display", "block");
                    setTimeout(function () {
                        $("#error").css("display", "none");
                    }, 3000);
                   // alert("Error Occurred");
                });


        }else{

            $('#loading').css("display","none");
            $scope.errorMessage = "Fields not updated";
            console.log($scope.errorMessage);
            $("#error").css("display", "block");
            setTimeout(function () {
                $("#error").css("display", "none");
            }, 3000);
           // alert("Fields not updated");
        }

    }



    //$scope.modifyUserInfo=function(){
    //    console.log("Modify My Profile");
    //    console.log($scope.userInfo);
    //
    //    var data = {
    //        operation: "modifyUserDetails",
    //        userInfo: $scope.userInfo
    //    };
    //
    //    var config = {
    //        params: {
    //            data: data
    //
    //        }
    //    };
    //
    //    $http.post("Config/php/configFacade.php", null, config)
    //        .success(function (data) {
    //
    //            if(data.status==Successful){
    //                alert("Profile updated");
    //            }else{
    //                alert(data.message);
    //            }
    //            console.log("Modify User Profile");
    //            console.log(data);
    //
    //        })
    //        .error(function (data, status, headers, config) {
    //            alert(data);
    //            $scope.clearUserForm();
    //
    //        });
    //
    //}


});

myApp.controller('AccessApprovalController',function($scope,$http,configService) {

    console.log("In");
    $scope.AccessApprovalPerPage=10;
    $scope.currentPage=1;
    $scope.ApprovalList=[];


    $scope.getAccessApprovals=function(){

        var data = {
            operation: "getAccessApprovals"
        };

        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php", null, config)
            .success(function (data) {
                $scope.ApprovalList=data.message;
                $scope.totalItems=$scope.ApprovalList.length;
                console.log($scope.totalItems);
            })
            .error(function (data, status, headers, config) {


            });
    }
        $scope.getAccessApprovals();

    $scope.viewApproveDetails=function(requestId){

        console.log(requestId);
        $scope.requestId=requestId;
        $scope.tempSubmitted=false;
        $scope.accessRequested=[];
        $scope.tempAccess={};
        $scope.remark="";
        $scope.buttonDisabled=true;
        var data={
            operation :"getTempAccessRequestDetails",
            requestId : $scope.requestId
        };

        var config = {
            params: {
                data: data
            }
        };
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    alert(data.message);
                }else{

                    $scope.tempAccess=data.message.requestDetails;
                    configService.marshalledAccessList(data.message.accessRequested,$scope.accessRequested);
                    $scope.buttonDisabled=false;
                }

            })
            .error(function (data, status, headers, config)
            {
                alert("Error Occured"+data);
            });

    }
    $scope.AddAccessRequestAction=function(actionStatus){
        $scope.buttonDisabled=true;
        $scope.tempSubmitted=false;
        var data={
            operation :"TempAccessRequestAction",
            requestId : $scope.requestId,
            remark:$scope.remark,
            status:actionStatus,
        };

        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    alert(data.message);
                }else{

                    for(var i=0;i<$scope.ApprovalList.length;i++){
                        if($scope.ApprovalList[i].requestId==$scope.requestId){
                            $scope.ApprovalList.splice(i,1);
                            break;
                        }
                    }
                    alert("Request Added Successfully");
                }

            })
            .error(function (data, status, headers, config)
            {
                alert("Error Occured"+data);
            });
    }

    $scope.paginate = function(value) {

        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.AccessApprovalPerPage;
        end = begin + $scope.AccessApprovalPerPage;
        index = $scope.ApprovalList.indexOf(value);

        return (begin <= index && index < end);
    };
});