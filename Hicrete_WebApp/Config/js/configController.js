myApp.controller('roleController',function($scope,$http,configService){
 $scope.roleSubmitted=false;
 $scope.showAccessError=false;
 $scope.roleDisabled=false;
 $scope.roleName;
configService.getAllAccessPermission($http,$scope);
  
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
        	$scope.showAccessError=false;
        	$scope.roleSubmitted=false;


           var data={
            operation :"addRole",
            roleName:$scope.roleName,
            accessPermissions: $scope.accessList   
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
               $scope.roleDisabled=false;
             if(data.status=="Successful"){
                 $scope.loading=false;
                 $('#loader').css("display","none");
                 $scope.warningMessage="Role added Successfully..";
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
                     $scope.errorMessage="Role not added..";
                     $('#error').css("display","block");
                     setTimeout(function() {
                         $scope.$apply(function() {
                             $('#error').css("display","none");
                         });
                     }, 3000);
             }else{
                 $scope.loading=false;
                 $('#loader').css("display","none");
                 $scope.errorMessage="Role not added..";
                 $('#error').css("display","block");
                 setTimeout(function() {
                     $scope.$apply(function() {
                         $('#error').css("display","none");
                     });
                 }, 3000);
             } 
              clearRoleForm();       
           })
           .error(function (data, status, headers, config)
           {
               $scope.errorMessage="Role not added..";
               $('#error').css("display","block");
           });
   
           

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
                alert("Password is :"+data.message);
                 setTimeout(function(){
                     $scope.loading=false;
                     $('#loader').css("display","none");
                 },3000);

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
                //doShowAlert("Success","User created successfully");
                 setTimeout(function(){
                     window.location.reload(true);
                 },8000);
             }else if(data.status=="Unsuccessful"){
                  //doShowAlert("Failure",data.message);
                 $scope.errorMessage="User not Added";
                 $('#error').css("display","block");
                 console.log($scope.errorMessage);
             }else{
                  //doShowAlert("Failure",data.message);
                 $scope.errorMessage="User not Added";
                 $('#error').css("display","block");
                 //console.log($scope.errorMessage);
             } 
             $scope.clearUserForm();
                     
           })
           .error(function (data, status, headers, config)
           {
             //doShowAlert("Failure","Error Occurred");
             $scope.clearUserForm();
               $scope.errorMessage="User not Added";
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
                    /*if(data.msg!=""){
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
                     }*/


                    if (data.status == "successful") {
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
                    doShowAlert("Failure", "Error Occurred");


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

    $scope.UserPerPage=5;
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
                doShowAlert("Failure","Error Occured");
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
                    doShowAlert("Failure",data.message);
                }else{
                    $scope.roleAccessList=[];
                    configService.marshalledAccessList(data.message,$scope.roleAccessList);
                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
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
                    //doShowAlert("Failure",data.message);
                }else{
                    console.log(data);
                    $rootScope.AllAccessPermissions=data.message;

                    //console.log($scope.Companies);
                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
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
                    $('#error').css("display","block");
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $('#error').css("display","none");
                        });
                    }, 3000);

                }else if(data.status === "Successful"){
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
  phone:""
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
                   $scope.errorMessage="Role not added..";
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
             doShowAlert("Failure","Error Occurred");
             
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
             doShowAlert("Failure","Error Occurred");
             
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

myApp.controller('tempAccessController',function($scope,$http,configService){
$scope.requestId="56929ff47e6183070";
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
                          doShowAlert("Failure",data.message);
                       }else{
                            
                            $scope.tempAccess=data.message.requestDetails;
                            configService.marshalledAccessList(data.message.accessRequested,$scope.accessRequested);
                            $scope.buttonDisabled=false;  
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                       doShowAlert("Failure","Error Occured");
                     });


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
                          doShowAlert("Failure",data.message);
                       }else{
                          doShowAlert("Success","Operation Successful");      
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                       doShowAlert("Failure","Error Occured");
                     });
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
                          doShowAlert("Failure",data.message);
                       }else{
                            configService.marshalledAccessList(data.message,$scope.exemptedAccessList);
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                       doShowAlert("Failure","Error Occured");
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
                        
                       if(data.status!="Successful"){
                          doShowAlert("Failure",data.message);
                          $scope.submitDisable=false;
                          $scope.clearDisable=false;
                       }else{
                          doShowAlert("Success","Access Request Added");
                          $scope.clearForm();
                          window.location="http://localhost/Hicrete_webapp/dashboard.php#/Config";    
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                       doShowAlert("Failure","Error Occured");
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

                if(data.status!="Successful"){

                     console.log(data);

                    //doShowAlert("Failure",data.message);
                }else{
                    console.log(data);
                    $rootScope.Companies[$scope.companyIndex]=$scope.selectedCompany;
                    alert(data.message);
                    window.location= "dashboard.php#/Config/SearchCompany";



                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
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
                doShowAlert("Failure",data.message);
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
            alert("Fields not modified");
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
                    alert(data.message);
                    $rootScope.Roles[$stateParams.index].roleName=$scope.roleName;
                }else{
                    alert(data.message);
                }

            })
            .error(function (data, status, headers, config)
            {
                console.log(data);
                alert("Error Occured");
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
        //console.log($scope.selectedCompany);
        $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                if(data.status!="Successful"){
                    console.log(data);
                    //doShowAlert("Failure",data.message);
                }else{
                    console.log(data);
                    alert(data.message);

                    window.location= "dashboard.php#/Config/SearchWarehouse";



                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
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
                    alert("Super User Created...Credentials Sent to "+$scope.superUserInfo.email);
                } else {
                    alert(data.message);
                }
                //window.location="dashboard.php#";

            })
            .error(function (data, status, headers, config) {
                alert(data);
                //console.log(data);
            });

    }

});

myApp.controller('MyProfileController',function($scope,$http) {


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
        console.log("in Modifu user");
        if(!$scope.userForm.$pristine){
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

            $http.post("Config/php/configFacade.php", null, config)
                .success(function (data) {
                    console.log(data);
                       alert(data);

                })
                .error(function (data, status, headers, config) {
                    alert("Error Occurred");
                });


        }else{

            alert("Fields not updated");
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
