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
                alert("Role created successfully");
             }else if(data.status=="Unsuccessful"){
                  alert(data.message);
             }else{
                  alert(data.message);
             } 
              clearRoleForm();       
           })
           .error(function (data, status, headers, config)
           {
               $scope.roleDisabled=false;
               alert("Error Occurred");
             
           });
   
           

        }

        var clearRoleForm=function(){
            $scope.roleName="";
            angular.forEach($scope.accessList, function(accessEntry) {
                accessEntry.read.val=false;
                accessEntry.write.val=false;
               
            });

        }
        $scope.finish=function(){
        	 clearRoleForm();

            window.location="dashboard.php#/Config";
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
                doShowAlert("Success","User created successfully");  
                window.location="http://localhost/Hicrete_webapp/dashboard.php#/Config";  
             }else if(data.status=="Unsuccessful"){
                  doShowAlert("Failure",data.message);
             }else{
                  doShowAlert("Failure",data.message);
             } 
             $scope.clearUserForm();
                     
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             $scope.clearUserForm();
             
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
        console.log($scope.newDetails);
        var data={
            operation :"ChangePassword",
            data:$scope.newDetails

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
                console.log(data.message);
                if(data.status=="Successful"){

                }else if(data.status=="Unsuccessful"){

                }else{

                }


            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occurred");


            });

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
                    $rootScope.Users=data.message;
                    $scope.totalItems=$rootScope.Users.length;
                    console.log($scope.totalItems);

                }
                else if(data.status==="NoRows")
                {
                    $rootScope.Users=[];
                    alert(data.message);

                }else{
                alert(data.message);
            }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
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


myApp.controller('modifyUserController',function($scope,$http,$stateParams,configService){

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
                    $rootScope.warehouses=data.message;

                    console.log($scope.Companies);
                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
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
                        //doShowAlert("Failure",data.message);
                    } else {
                        console.log(data);
                        $rootScope.Companies = data.message;
                        console.log($rootScope.Companies);

                       // console.log($scope.Companies);
                    }

                })
                .error(function (data, status, headers, config) {
                    doShowAlert("Failure", "Error Occured");
                });

        //}

    };
   // $scope.getCompanyData();





$scope.addCompany=function(){
    var data={
            operation :"addCompany",
            data:$scope.company
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
                doShowAlert("Success","Company created successfully");    
             }else if(data.status=="Unsuccessful"){
                  doShowAlert("Failure",data.message);
             }else{
                  doShowAlert("Failure",data.message);
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

      var config = {
                 params: {
                       data: data
                     }
      };

      $http.post("Config/php/configFacade.php",null, config)
           .success(function (data)
           {
           
             if(data.status=="Successful"){
                doShowAlert("Success","Warehouse created successfully");    
             }else if(data.status=="Unsuccessful"){
                  doShowAlert("Failure",data.message);
             }else{
                  doShowAlert("Failure",data.message);
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
    console.log($stateParams.companyId);

    for (var i = 0; i < $rootScope.Companies.length; i++) {
        if ($stateParams.companyId == $rootScope.Companies[i].companyId) {
            $scope.selectedCompany=$rootScope.Companies[i];
            break;
        }
    }
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



                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
            });

    };





});

myApp.controller('ModifyRoleController',function($scope,$http) {

     console.log("In");

    $scope.roleDetails={

        roleName:"Admin",
        accessList:[
            {
                moduleName: "Inventory",
                read:true,
                write:false
            },
            {
                moduleName: "Applicator",
                read:true,
                write:false
            },
            {
                moduleName: "Expense",
                read:false,
                write:true
            },
            {
                moduleName: "Payroll",
                read:true,
                write:false
            },
            {
                moduleName: "Business",
                read:false,
                write:true
            },
        ]
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



                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
            });

    }


});


myApp.controller('ModifyUserController',function($scope,$http,$rootScope,configService){

    $scope.refreshRoleList=true;
    //$scope.step=1;
    $scope.userInfoSubmitted=false;
    $scope.accessInfoSubmitted=false;
    $scope.showCompanyError=false;

    $scope.roleAccessList=[];
    $scope.selectedRole={"roleId":""};
    $scope.otherAccessList=[];
    $scope.isFromUser=true;

    $scope.userInfo={
        name:"Atul Dhatrak"
    };


    configService.getRoleList($http,$scope);

    //$scope.nextStep = function() {
    //    $scope.step++;
    //}
    //
    //$scope.prevStep = function() {
    //    $scope.step--;
    //}


    //$scope.clearUserForm=function(){
    //    $scope.step=1;
    //    $scope.userInfo={
    //        firstName:"",
    //        lastName:"",
    //        dob:"",
    //        address:"",
    //        city:"",
    //        state:"",
    //        country:"",
    //        pincode:"",
    //        email:"",
    //        mobile:"",
    //        designation:"",
    //        userType:""
    //    };
    //    $scope.roleAccessList=[];
    //    $scope.otherAccessList=[];
    //    $scope.selectedRole={"roleId":""};
    //    //window.location="http://localhost/Hicrete_webapp/dashboard.php#/Config/addUser";
    //
    //}


    $scope.selectUserForModify= function(user)
    {
        $scope.userInfo=user;
        console.log($scope.userInfo);

    }

    $scope.modifyUser=function(){
        console.log($scope.userInfo);
               var data={
            operation :"modifyUser",
            userInfo:$scope.userInfo

        };

        var config = {
            params: {
                data: data

            }
        };

       /* $http.post("Config/php/configFacade.php",null, config)
            .success(function (data)
            {

                console.log(data.status);
                console.log(data.message);
                if(data.status=="Successful"){
                    console.log(data);
                   // window.location="http://localhost/Hicrete_webapp/dashboard.php#/Config";
                }else if(data.status=="Unsuccessful"){
                    //doShowAlert("Failure",data.message);
                    console.log(data);
                }else{
                    //doShowAlert("Failure",data.message);
                    console.log(data);
                }
                $scope.clearUserForm();

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occurred");
                $scope.clearUserForm();

            });*/

        $scope.userInfoSubmitted=false;
        $scope.accessInfoSubmitted=false;
        $scope.showCompanyError=false;
    }





    $scope.loadAccessPermission=function(){

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
                    doShowAlert("Failure",data.message);
                }else{
                    configService.marshalledAccessList(data.message,$scope.roleAccessList);
                }

            })
            .error(function (data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
            });
    }


    var populateOtherAccessList=function(){

        console.log($scope.accessList);
        console.log($scope.roleAccessList);
        angular.forEach($scope.accessList, function(accessEntry) {
            var addThisEntry=true;
            angular.forEach($scope.roleAccessList, function(roleAccessEntry) {
                if(accessEntry.moduleName===roleAccessEntry.moduleName){
                    addThisEntry=false;
                    if(!roleAccessEntry.read.ispresent){
                        accessEntry.write.ispresent=false;
                        $scope.otherAccessList.push(accessEntry);

                    }else if(!roleAccessEntry.write.ispresent){
                        accessEntry.read.ispresent=false;
                        $scope.otherAccessList.push(accessEntry);

                    }
                }
            });
            if(addThisEntry){
                $scope.otherAccessList.push(accessEntry);
            }
        });
        console.log($scope.otherAccessList);
    }


    $scope.loadExtraAccessPermission=function(){

        $scope.accessList=[];
        var data={
            operation :"getAccessPermission"
        };
        var config = {
            params: {
                data: data
            }
        };

        $http.post("Config/php/configFacade.php",null, config)
            .success(function(data){
                if(data.status!="Successful"){
                    //doShowAlert("Failure",data.message);
                }else{

                    configService.marshalledAccessList(data.message,$scope.accessList);
                    populateOtherAccessList();
                }
            })
            .error(function(data, status, headers, config)
            {
                doShowAlert("Failure","Error Occured");
                $scope.loaded=true;
            });
    }






    $scope.addExtraAccessPermission=function(){
        angular.forEach($scope.otherAccessList, function(otherAccessEntry) {
            var addThisEntry=true;
            angular.forEach($scope.roleAccessList, function(roleAccessEntry) {
                if(roleAccessEntry.moduleName===otherAccessEntry.moduleName){
                    addThisEntry=false;
                    if(otherAccessEntry.read.val){
                        roleAccessEntry.read.ispresent=	true;
                        roleAccessEntry.read.val= true;
                        roleAccessEntry.read.accessId=otherAccessEntry.read.accessId ;

                    }else if(otherAccessEntry.write.val){

                        roleAccessEntry.write.ispresent= true;
                        roleAccessEntry.write.val= true;
                        roleAccessEntry.write.accessId=otherAccessEntry.write.accessId ;

                    }
                }
            });
            if(addThisEntry){

                if(otherAccessEntry.read.val)
                    otherAccessEntry.read.ispresent=otherAccessEntry.read.val;

                if(otherAccessEntry.write.val)
                    otherAccessEntry.write.ispresent=otherAccessEntry.write.val;

                $scope.roleAccessList.push(otherAccessEntry);
            }
        });
    }


});
