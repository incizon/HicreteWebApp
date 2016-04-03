var myApp = angular.module('hicreteApp', ['ui.router','ngCookies','ngMessages','ui.bootstrap']);
 
//Now Configure  our  routing

myApp.config(function($stateProvider, $urlRouterProvider) {
 
    //$urlRouterProvider.otherwise('');
    
    $stateProvider
        
        // Applicator STATES ========================================
        .state('Applicator', {
            url: '/Applicator',
            templateUrl: 'Applicator/html/ApplicatorWidget.php'
        })

        .state('Applicator.addDealer', {
            url: '/AddApplicator',
            templateUrl: 'Applicator/html/CreateApplicator.html',
            controller: 'ApplicatorController'
        })

        .state('Applicator.addPayment', {
            url: '/AddApplicatorPayment',
            templateUrl: 'Applicator/html/ApplicatorPayment.html',
            controller: 'ApplicatorPaymentController'
        })

        .state('Applicator.addPackage', {
            url: '/AddPackage',
            templateUrl: 'Applicator/html/CreatePackage.html',
            controller: 'PackageController'
        })

        .state('Applicator.viewPackages', {
            url: '/ViewPackages',
            templateUrl: 'Applicator/html/ViewPackages.html',
            controller: 'ViewPackageController'
        })

        .state('Applicator.tentetiveApplicator', {
            url: '/SearchTentativeApplicators',
            templateUrl: 'Applicator/html/SearchTentativeApplicator.php',
            controller: 'SearchTentativeApplicatorController'
        })
        .state('Applicator.tentativeApplicatorDetails', {
            url: '/ViewTentativeApplicatorDetails?applicator_id',
            templateUrl: 'Applicator/html/ViewTentativeApplicatorDetails.html',
            controller: 'ViewTentativeApplicatorController'

        })

        .state('Applicator.modifyTentativeApplicatorDetails',{
            url: '/ModifyTentativeApplicatorDetails?applicator_id',
            templateUrl: 'Applicator/html/modifyTentativeApplicatorDetails.html',
            controller: 'ModifyTentativeApplicatorController'

        })
        .state('Applicator.permanentApplicator', {
            url: '/SearchPermanentApplicators',
            templateUrl: 'Applicator/html/SearchPermanentApplicator.php',
            controller: 'SearchPermanentApplicatorController'
        })
        .state('Applicator.permanentApplicatorDetails', {
            url: '/ViewPermanentApplicatorDetails?applicator_id',
            templateUrl: 'Applicator/html/ViewPermanentApplicatorDetails.html',
            controller: 'ViewPermanentApplicatorController'

        })

        .state('Applicator.modifyPermanentApplicatorDetails',{
            url: '/ModifyPermanentApplicatorDetails?applicator_id',
            templateUrl: 'Applicator/html/ModifyPermanentApplicatorDetails.html',
            controller: 'ModifyPermanentApplicatorController'

        })
        .state('Inventory', {
            url: '/Inventory',
            templateUrl: 'Inventory/html/inventoryWidgets.php',
            Controller:'inventoryCommonController'

        })
        .state('Inventory.addProduct', {
            url: '/addProduct',
            templateUrl: 'Inventory/html/Inventory_Add_Product.html',
            controller: 'productController'
        })

        // for production batch
        .state('Inventory.prodInit', {
            url: '/prodInit',
            templateUrl: 'Inventory/html/productionBatch/inventory_Production_Batch.html',
            controller: 'productionBatchController'
        })
        .state('Inventory.prodSearch', {
            url: '/prodSearch',
            templateUrl: 'Inventory/html/productionBatch/Inventory_prodBatch_Inq.html',
            controller: 'productionBatchController'
        })
        .state('Inventory.prodInq', {
            url: '/prodInq',
            templateUrl: 'Inventory/html/productionBatch/Inventory_prodBatch_InquiryAll.html',
            controller: 'productionBatchController'
        })

        //production batch entries end
        .state('Inventory.inwardItem', {
            url: '/inwardItem',
            templateUrl: 'Inventory/html/inward/Inventory_Inward_Form.html',
            controller: 'inwardController'
        })
        //.state('Inventory.inwardSearch', {
        //    url: '/inwardSearch',
        //    templateUrl: 'Inventory/html/search/Inventory_Inward_Search.html',
        //    controller: 'inwardController'
        //})
        .state('Inventory.outwardItem', {
            url: '/outwardItem',
            templateUrl: 'Inventory/html/outward/Inventory_Outward_steps.html',
            controller: 'outwardController'
        })
         .state('Inventory.addMaterialType', {
            url: '/addMaterial',
            templateUrl: 'Inventory/html/inventory_Add_MaterialType.html',
            controller: 'addMaterialType'
        })

        .state('Inventory.addSupplier', {
            url: '/addSupplier',
            templateUrl: 'Inventory/html/inventory_Add_Supplier.html',
            controller: 'addSupplierController'
        })

        .state('Inventory.searchProduct', {
            url: '/searchProduct',
            templateUrl: 'Inventory/html/search/Inventory_Items_Search.php',
            controller: 'ProductSearchController'
        })
        .state('Inventory.searchInward', {
            url: '/searchInward',
            templateUrl: 'Inventory/html/search/Inventory_Inward_Search.html',
            controller:'InwardSearchController'
        })
        .state('Inventory.searchOutward', {
            url: '/searchOutward',
            templateUrl: 'Inventory/html/search/Inventory_Outward_Search.html',
            controller:'OutwardSearchController'

        })
        .state('Inventory.searchInventory', {
            url: '/searchInventory',
            templateUrl: 'Inventory/html/search/Inventory_Search.html',
            controller: 'SearchController'
        })
        .state('Inventory.searchSupplier', {
            url: '/searchSupplier',
            templateUrl: 'Inventory/html/search/inventory_supplierSearch.php',
            controller: 'supplierFetchController'
        })
        .state('Inventory.scheduleFollowup', {
            url: '/scheduleFollowup',
            templateUrl: 'Inventory/html/scheduleFollowup.html',
            controller: 'FollowUpController'
        })
        .state('Expense', {
            url: '/Expense',
            templateUrl: 'Expense/html/ExpenseWidgets.html'
            
        })

        .state('Process.createCostCenter', {
            url: '/createCostCenter',
            templateUrl: 'Expense/html/CreateCostCenter.html',
            controller: 'costCenterController'
        })

        .state('Process.addSegment', {
            url: '/addSegment',
            templateUrl: 'Expense/html/AddBudgetSegment.html',
            controller: 'budgetSegmentController'
        })

        .state('Process.otherExpense', {
            url: '/otherExpense',
            templateUrl: 'Expense/html/AddOtherExpenses.html',
            controller: 'expenseEntryController'  
        })

        .state('Process.materialExpense', {
            url: '/materialExpense',
            templateUrl: 'Expense/html/AddMaterialExpense.html',
            controller: 'expenseEntryController'  
        })
        .state('Process.searchExpense', {
            url: '/searchExpense',
            templateUrl: 'Expense/html/ViewCostCenter.html',
            controller: 'costCenterSearchController',
            params : { costCenterForProject: null }
        })
        .state('Process.searchSegment', {
            url: '/searchSegment',
            templateUrl: 'Expense/html/SegmentSearch.php',
            controller: 'costCenterSearchController'
        })
        
        .state('Config', {
            url: '/Config',
            templateUrl: 'Config/html/ConfigWidget.html'
            
        })

        .state('Config.addCompany', {
            url: '/addCompany',
            templateUrl: 'Config/html/AddCompany.html',
            controller:'companyController'    
        })

        .state('Config.addWarehouse', {
            url: '/addWarehouse',
            templateUrl: 'Config/html/AddWarehouse.html',
            controller:'companyController'     
        })


         .state('Config.addRole', {
            url: '/addRole',
            templateUrl: 'Config/html/AddRole.html',
            controller: 'roleController'     
        })

        .state('Config.addUser', {
            url: '/addUser',
            templateUrl: 'Config/html/AddUser.html',
            controller: 'userController'    
        })
        


        .state('Config.viewRole', {
            url: '/SearchRole',
            templateUrl: 'Config/html/ViewRole.html',
            controller:'viewRoleController'

        })
        .state('Config.userSearch', {
            url: '/SearchUser',
            templateUrl: 'Config/html/viewUser.html',
            controller:'searchUserController'
        })

        .state('Config.companySearch', {
            url: '/SearchCompany',
            templateUrl: 'Config/html/viewCompany.html',
            controller:'companyController'

        })

        .state('Config.warehouseSearch', {
            url: '/SearchWarehouse',
            templateUrl: 'Config/html/ViewWarehouse.html',
            controller:'companyController'

        })

        .state('Config.modifyCompany', {
            url: '/ModifyCompany',
            templateUrl: 'Config/html/ModifyCompany.html',
            controller:'ModifyCompanyController',
            params : { selectedCompany: null,index:null }
        })

        .state('Config.modifyRole', {
            url: '/ModifyRole',
            templateUrl: 'Config/html/ModifyRole.html',
            controller:'ModifyRoleController',
            params : { selectedRole: null,index:null }
        })

        .state('Config.modifyWarehouse', {
            url: '/ModifyWarehouse?warehouseId',
            templateUrl: 'Config/html/ModifyWarehouse.html',
            controller:'ModifyWarehouseController'
        })
        .state('Config.modifyUser', {
            url: '/ModifyUser',
            templateUrl: 'Config/html/ModifyUser.html',
            controller:'ModifyUserController',
            params : { userToModify: null }
        })
        .state('myProfile', {
            url: '/myProfile',
            templateUrl: 'Config/html/MyProfile.html',
            controller:'MyProfileController'
        })

        .state('createSuperUser', {
            url: '/CreateSuperUser',
            templateUrl: 'Config/html/createSuperUser.html',
            controller:'superUserController'

        })

        .state('RequestAccess', {
            url: '/requestAccess',
            templateUrl: 'Config/html/RequestTemporaryAccess.html',
           controller: 'requestTempAccessController'

        })


        .state('Process', {
            url: '/Process',
            templateUrl: 'Process/html/ProcessWidget.php'

        })

        .state('Process.addCustomer', {
            url: '/addCustomer',
            templateUrl: 'Process/html/AddCustomer.html',
            controller:'CustomerController'
        })
        .state('Process.modifyCustomer', {
            url: '/ModifyCustomer',
            templateUrl: 'Process/html/ModifyCustomer.html',
            controller:'ModifyCustomerController',
            params : { customerToModify: null,index:null }
        })

        .state('Process.addProject', {
            url: '/addProject',
            templateUrl: 'Process/html/ProjectCreation.html',
            controller:'ProjectCreationController'
        })
        .state('Process.modifyProject', {
            url: '/ModifyProject',
            templateUrl: 'Process/html/ProjectModification.html',
            controller:'ModifyProjectController',
            params:{projectToModify:null}
        })

        .state('Process.addQuotation', {
            url: '/addQuotation',
            templateUrl:'Process/html/QuotationCreation.html',
            controller:"QuotationController",
            params:{projectId:null}
        })

        .state('Process.addInvoice', {
            url: '/addInvoice',
            templateUrl:"Process/html/InvoiceCreation.html",
            controller:"InvoiceController",
            params:{workOrder:null}
        })

        .state('Process.addPayment', {
            url: '/addPayment',
            templateUrl: 'Process/html/ProjectPayment.html',
            controller: 'ProjectPaymentController'
        })
        .state('Process.viewProject', {
            url: '/viewProjects',
            templateUrl:'Process/html/SearchProjects.php',
            controller:'viewProjectController'
        })
        .state('Process.ProjectDetails', {
            url: '/ProjectDetails',
            templateUrl:'Process/html/ProjectDetails.html',
            controller:'ProjectDetailsController',
            params : { projectToView: null }
        })

        .state('Process.quotationFollowupHistory', {
            url: '/QuotationFollowupHistory',
            templateUrl: 'Process/html/QuotationFollowupHistory.html',
            controller: 'QuotationFollowupHistoryController'
        })
        .state('Process.paymentFollowupHistory', {
            url: '/PaymentFollowupHistory',
            templateUrl:'Process/html/PaymentFollowupHistory.html',
            controller:'PaymentFollowupHistoryController'
        })
        .state('Process.siteTrackingFollowupHistory', {
            url: '/SiteTrackingFollowupHistory',
            templateUrl:'Process/html/SiteTrackingFollowupHistory.html',
            controller:'SiteTrackingFollowupHistoryController'
        })
        .state('Process.viewCustomers', {
            url: '/Customers',
            templateUrl:'Process/html/SearchCustomers.php',
            controller:'ViewCustomerController'
        })
        .state('Process.AttachWorkorder', {
            url: '/AttachWorkorder',
            templateUrl:'Process/html/CreateWorkOrder.html',

        })
        .state('Process.viewInvoice', {
            url: '/ViewInvoice',
            templateUrl:'Process/html/ViewInvoice.html',
            controller:'ViewInvoiceDetails',
            params:{InvoiceToView:null}
        })
        .state('Process.viewQuotation', {
            url: '/ViewQuotation',
            templateUrl:'Process/html/ViewQuotation.html',
            controller:'ViewQuotationDetailsController',
            params : {quotationToView: null,projectName:null}
        })

        .state('Process.paymentHistory', {
            url: '/PaymentHistory',
            templateUrl:'Process/html/PaymentHistory.html',
            controller:'PaymentHistoryController'
        })

        .state('Process.reviseQuotation', {
            url: '/ReviseQuotation',
            templateUrl:'Process/html/ReviseQuotation.html',
            controller:'ReviseQuotationController',
            params:{quotationToRevise:null,projectName:null}
        })

        .state('Process.searchTask', {
            url: '/SearchTask',
            templateUrl:'Process/html/schedule/SearchTasks.php',
            controller:'SearchTaskController'
        })

        .state('Process.assignTask', {
            url: '/AssignTask',
            templateUrl:'Process/html/schedule/AssignTasks.html',
            controller:'AssignTaskController'
        })

        .state('Process.viewTask', {
            url: '/ViewTask',
            templateUrl:'Process/html/schedule/ViewTask.html',
            controller:'ViewTaskController'
        })

        .state('ChangePassword', {
            url: '/ChangePassword',
            templateUrl:'Config/html/changePassword.html',
            controller:'chngPassController'

        })

        .state('MainPage', {
            url: '',
            templateUrl: 'MainPage.html',
            controller:'MainPageController'
        })
        .state('billApproval', {
            url: '/BillApproval',
            templateUrl:'Expense/html/BillApproval.html',
            controller:'BillApprovalController'
        })
        .state('leaveApproval', {
            url: '/LeaveApproval',
            templateUrl:'Payroll/html/LeaveApp.html',
            controller:'LeaveApprovalController'
        })
        .state('accessApproval', {
            url: '/AccessApproval',
            templateUrl:'Config/html/AccessApproval.html',
            controller:'AccessApprovalController'
        })

        .state('Payroll', {
            url: '/Payroll',
            templateUrl:'Payroll/html/PayrollWidget.php'
        })

        .state('Payroll.createYear', {
            url: '/CreateYear',
            templateUrl:'Payroll/html/CreateYear.html',
            controller:"CreateYearController"

        })
        .state('Payroll.configureHolidays', {
            url: '/ConfigureHolidays',
            templateUrl:'Payroll/html/ConfigureHolidays.html',
            controller:"ConfigureHolidaysController"

        })
        .state('Payroll.applyForLeave', {
            url: '/ApplyForLeave',
            templateUrl:'Payroll/html/ApplyForLeave.html',
            controller:"ApplyForLeaveController"

        })
        .state('Payroll.AddEmployeeToPayRoll', {
            url: '/AddEmployeeToPayRoll',
            templateUrl:'Payroll/html/AddEmployeeToPayRoll.html',
            controller:"AddEmployeeToPayRollController"
        })
        .state('Payroll.showLeaves', {
            url: '/ShowLeaves',
            templateUrl:'Payroll/html/ShowLeaves.html',
            controller:"ShowLeavesController"
        })

        .state('Payroll.searchLeavesByDate', {
            url: '/SearchLeavesByDate',
            templateUrl:'Payroll/html/SearchLeavesByDate.html',
            controller:"SearchLeaveByDateController"
        })
        .state('Payroll.searchLeavesByEmployee', {
            url: '/SearchLeavesByEmployee',
            templateUrl:'Payroll/html/SearchLeavesByEmployee.html',
            controller:"SearchLeaveByEmployeeController"
        })



        .state('SuperDashboard', {
            url: '',
            templateUrl: 'SuperMainPage.html',
            controller: 'MainPageController'
            
        });
        // Package State =================================
        


});

myApp.run(function($rootScope,$http) {
    
    //var data={
    //        operation :"getAccessPermission"
    //
    //      };
    //
    //      var config = {
    //                 params: {
    //                       data: data
    //
    //        }
    //      };
    //
    //
    //$http.post("php/DashboardRenderer.php", null,config)
    //       .success(function (data)
    //       {
    //        if(data.status=="Successful"){
    //            $rootScope.accessPermission=data.message;
    //            //console.log($rootScope.accessPermission);
    //         }else{
    //              alert("Unable To Render Database:"+data.message);
    //         }
    //
    //       })
    //       .error(function (data, status, headers, config)
    //       {
    //         alert("Error Occurred:"+data);
    //       });

    //Applicator variables
    $rootScope.tentativeApplicators=[];
    console.log($rootScope.tentativeApplicators);
    $rootScope.permanentApplicators=[];
    $rootScope.Companies=[];
    $rootScope.warehouses=[];
    $rootScope.Users=[];
    $rootScope.Roles=[];
    $rootScope.AllAccessPermissions=[];
    $rootScope.suppliers=[];
    $rootScope.prodInq=[];
    $rootScope.prodInqAll=[];
    $rootScope.customerSearch=[];
    $rootScope.projectSearch=[];
    $rootScope.tasks=[];
    $rootScope.warningMessage="";
    $rootScope.errorMessage="";
});





// create the controller and inject Angular's $scope
// set for Route Controller
myApp.controller('dashboardController', function($scope,$http,$cookieStore,$uibModal, $log,AppService) {
  /** create $scope.template **/



 $scope.logout=function(){



      $http.post("logout.php", null)
           .success(function (data)
           {
              window.location="index.html";

           })
           .error(function (data, status, headers, config)
           {
             console.log(data.error);

           });
            
        }


  /** now after this ng-include in uirouter.html set and take template from their respective path **/
  $scope.saveFollowupDetails=function(size,followupDetails,type){

      var paymentFollowupdata =followupDetails;
      console.log("data sis "+JSON.stringify(paymentFollowupdata));
      $scope.payment = paymentFollowupdata;


      var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          controller: 'dashboardController',
          templateUrl: 'FollowupForm.html',
          scope:$scope,
          controller:  function ($scope,$rootScope, $uibModalInstance,followupDetails,$filter) {

              $scope.followupFormDate = function(){
                  $scope.followup.opened = true;
              };

              $scope.followup = {
                  opened:false
              };
              AppService.getUsers($scope,$http);
              $scope.followupDetails = followupDetails;
              $scope.reFollowupDate = function(){
                  $scope.reFollowup.opened = true;
              };

              $scope.reFollowup = {
                  opened:false
              };

              console.log("in uibModal "+JSON.stringify($scope.payment));
              $scope.Save = function () {
                  var conductDate = $filter('date')($scope.payment.startDate, 'yyyy/MM/dd', '+0530');
                  var followupData= {Description:$scope.payment.note,ConductDate:conductDate};

                  var followupTitle = $scope.payment.newFollowupTitle;
                  var assignedTo = $scope.payment.assignee;
                  var followupDate = $filter('date')($scope.payment.dateOfBill, 'yyyy/MM/dd', '+0530');
                  var scheduledata = {AssignEmployee:assignedTo,FollowupDate:followupDate,FollowupTitle:followupTitle};

                  if($scope.payment.type == 'Payment'){
                      console.log("In payment followup schedule");
                      var data={
                          operation :"ConductPaymentFollowup",
                          id:$scope.payment.followupId,
                          data:followupData
                      };

                      var config = {
                          params: {
                              data: data
                          }
                      };

                      $http.post('Process/php/followupFacade.php',null,config)
                          .success(function (data, status, headers) {

                              if(data.status=="Successful"){
                                  if($scope.payment.isRescheduleFollowup){

                                      console.log("Posting data is "+data);
                                      var data={
                                          operation :"CreatePaymentFollowup",
                                          id:$scope.payment.invoiceId,
                                          data:scheduledata
                                      };

                                      var config = {
                                          params: {
                                              data: data
                                          }
                                      };

                                      $http.post('Process/php/followupFacade.php',null,config)
                                          .success(function (data, status, headers) {
                                              if(data.status=="Successful"){
                                                  $rootScope.warningMessage = "Operation Successful";
                                                  $('#warning').css('display','block');
                                                  setTimeout(function(){
                                                      $('#warning').css('display','none');
                                                  },1000);
                                                  console.log("Pahila if cha success if status is successful");
                                                  //alert("Operation Successful");
                                              }else{
                                                  $rootScope.errorMessage = data.message;
                                                  $('#error').css('display','block');
                                                  setTimeout(function(){
                                                      $('#error').css('display','none');
                                                  },1000);
                                                  console.log("Pahila if cha error if status is not successful");
                                                  //alert(data.message);
                                              }

                                          })
                                          .error(function (data, status) {
                                              $rootScope.errorMessage = $scope.ResponseDetails ;
                                              $('#error').css('display','block');
                                              setTimeout(function(){
                                                  $('#error').css('display','none');
                                              },1000);
                                              console.log("Pahila if chya atla  error");
                                              //alert($scope.ResponseDetails );
                                          });
                                  }

                              }else{
                                  $rootScope.errorMessage = data.message;
                                  $('#error').css('display','block');
                                  setTimeout(function(){
                                      $('#error').css('display','none');
                                  },1000);
                                  console.log("Pahila else if status is not successful");
                                  //alert(data.message);
                              }

                          })
                          .error(function (data, status) {
                              $rootScope.errorMessage = data;
                              $('#error').css('display','block');
                              setTimeout(function(){
                                  $('#error').css('display','none');
                              },1000);
                              console.log("Pahila if cha error");
                              //alert(data );
                          });



                  }
                  else if($scope.payment.type == 'Quotation'){
                      console.log("In payment followup schedule");
                      var data={
                          operation :"ConductQuotationFollowup",
                          id:$scope.payment.followupId,
                          data:followupData
                      };

                      var config = {
                          params: {
                              data: data
                          }
                      };

                      $http.post('Process/php/followupFacade.php',null,config)
                          .success(function (data, status, headers) {
                              if(data.status=="Successful") {
                                  if ($scope.payment.isRescheduleFollowup) {

                                      console.log("Posting data is " + data);
                                      var data = {
                                          operation: "CreateQuotationFollowup",
                                          id: $scope.payment.quotationId,
                                          data: scheduledata
                                      };

                                      var config = {
                                          params: {
                                              data: data
                                          }
                                      };

                                      $http.post('Process/php/followupFacade.php', null, config)
                                          .success(function (data, status, headers) {
                                              if (data.status == "Successful") {
                                                  $rootScope.warningMessage = "Operation Successful";
                                                  $('#warning').css('display','block');
                                                  setTimeout(function(){
                                                      $('#warning').css('display','none');
                                                  },1000);
                                                  console.log("payment followup schedule cha pahila success chya atla if");
                                                  //alert("Operation Successful");
                                              } else {
                                                  $rootScope.errrorMessage = data.message;
                                                  $('#error').css('display','block');
                                                  setTimeout(function(){
                                                      $('#error').css('display','none');
                                                  },1000);
                                                  console.log("payment followup schedule cha pahila success chya atla else");
                                                  //alert(data.message);
                                              }

                                          })
                                          .error(function (data, status) {
                                              $rootScope.errrorMessage = $scope.ResponseDetails;
                                              $('#error').css('display','block');
                                              setTimeout(function(){
                                                  $('#error').css('display','none');
                                              },1000);
                                              console.log("payment followup schedule cha pahila error");
                                              //alert($scope.ResponseDetails);
                                          });
                                  }
                              }else{
                                  $rootScope.errorMessage = data.message;
                                  $('#error').css('display','block');
                                  setTimeout(function(){
                                      $('#error').css('display','none');
                                  },1000);
                                  console.log("payment followup schedule cha pahila success chya atla if");
                                  //alert(data.message);
                              }

                          })
                          .error(function (data, status) {
                              $rootScope.errorMessage = data;
                              $('#error').css('display','block');
                              setTimeout(function(){
                                  $('#error').css('display','none');
                              },1000);
                              console.log("payment followup schedule cha pahila error");
                              //alert(data );
                          });




                  }
                  else if($scope.payment.type == 'SiteTracking'){
                      console.log("In payment followup schedule");
                      var data={
                          operation :"ConductSiteTrackingFollowup",
                          id:$scope.payment.followupId,
                          data:followupData
                      };

                      var config = {
                          params: {
                              data: data
                          }
                      };

                      $http.post('Process/php/followupFacade.php',null,config)
                          .success(function (data, status, headers) {
                              if(data.status=="Successful") {

                                  if ($scope.payment.isRescheduleFollowup) {

                                      console.log("Posting data is " + data);
                                      var data = {
                                          operation: "CreateSiteTrackingFollowup",
                                          id: $scope.payment.projectId,
                                          data: scheduledata
                                      };

                                      var config = {
                                          params: {
                                              data: data
                                          }
                                      };

                                      $http.post('Process/php/followupFacade.php', null, config)
                                          .success(function (data, status, headers) {
                                              if (data.status == "Successful") {
                                                  $rootScope.warningMessage = "Operation Successful";
                                                  $('#warning').css('display','block');
                                                  setTimeout(function(){
                                                      $('#warning').css('display','none');
                                                  },1000);
                                                  console.log("Sitetracking cha pahila success chya atla if");
                                                  //alert("Operation Successful");
                                              } else {
                                                  $rootScope.errorMessage = data.message;
                                                  $('#error').css('display','block');
                                                  setTimeout(function(){
                                                      $('#error').css('display','none');
                                                  },1000);
                                                  console.log("Sitetracking cha pahila success chya atla else");
                                                  //alert(data.message);
                                              }

                                          })
                                          .error(function (data, status) {
                                              $rootScope.errorMessage = $scope.ResponseDetails;
                                              $('#error').css('display','block');
                                              setTimeout(function(){
                                                  $('#error').css('display','none');
                                              },1000);
                                              console.log("Sitetracking cha pahila error");
                                              //alert($scope.ResponseDetails);
                                          });
                                  }
                              }else{
                                  $rootScope.errorMessage = data.message;
                                  $('#error').css('display','block');
                                  setTimeout(function(){
                                      $('#error').css('display','none');
                                  },3000);
                                  console.log("Sitetracking cha pahila success chya atla last else");
                                  //alert(data.message);
                              }

                          })
                          .error(function (data, status) {
                              $rootScope.errorMessage = data;
                              $('#error').css('display','block');
                              setTimeout(function(){
                                  $('#error').css('display','none');
                              },3000);
                              console.log("Sitetracking cha pahila error");
                              //alert(data);
                          });


                  }else{
                      console.log("In Applicator followup schedule");
                      var data={
                          operation :"ConductApplicatorFollowup",
                          id:$scope.payment.followupId,
                          data:followupData
                      };

                      var config = {
                          params: {
                              data: data
                          }
                      };

                      $http.post('Process/php/followupFacade.php',null,config)
                          .success(function (data, status, headers) {
                              if(data.status=="Successful") {
                                  if ($scope.payment.isRescheduleFollowup) {

                                      console.log("Posting data is " + data);
                                      var data = {
                                          operation: "CreateApplicatorFollowup",
                                          id: $scope.payment.ApplicatorId,
                                          data: scheduledata
                                      };

                                      var config = {
                                          params: {
                                              data: data
                                          }
                                      };

                                      $http.post('Process/php/followupFacade.php', null, config)
                                          .success(function (data, status, headers) {
                                              if (data.status == "Successful") {
                                                  $rootScope.warningMessage = "Operation Successful";
                                                  $('#warning').css('display','block');
                                                  setTimeout(function(){
                                                      $('#warning').css('display','none');
                                                  },3000);
                                                  console.log("Applicator Followup schedule cha pahila success chya atla if");
                                                  //alert("Operation Successful");
                                              } else {
                                                  $rootScope.errorMessage = data.message;
                                                  $('#error').css('display','block');
                                                  setTimeout(function(){
                                                      $('#error').css('display','none');
                                                  },3000);
                                                  console.log("Applicator Followup schedule cha pahila success chya atla else");
                                                  //alert(data.message);
                                              }

                                          })
                                          .error(function (data, status) {
                                              $rootScope.errorMessage = $scope.ResponseDetails;
                                              $('#error').css('display','block');
                                              setTimeout(function(){
                                                  $('#error').css('display','none');
                                              },3000);
                                              console.log("Applicator Followup schedule cha pahila error");
                                              //alert($scope.ResponseDetails);
                                          });
                                  }
                              }else{
                                  $rootScope.errorMessage = data.message;
                                  $('#error').css('display','block');
                                  setTimeout(function(){
                                      $('#error').css('display','none');
                                  },3000);
                                  console.log("Applicator Followup schedule cha else");
                                  //alert(data.messsage);
                              }

                          })
                          .error(function (data, status) {
                              $rootScope.errorMessage = data;
                              $('#error').css('display','block');
                              setTimeout(function(){
                                  $('#error').css('display','none');
                              },3000);
                              console.log("Applicator Followup schedule cha pahila error chya atla if");
                              //alert(data);
                          });


                  }
                  setTimeout(function(){
                      $uibModalInstance.close();
                  },3000);

              };

              $scope.Cancel = function () {
                  $uibModalInstance.dismiss('cancel');
              };
          },
          size: size,
          resolve: {
              followupDetails: function () {
                  return $scope.followupDetails;
              }
          }
      });

      modalInstance.result.then(function (followupDetails) {
          $scope.followupDetails = followupDetails;
      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });
      $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
      };
  }


});


myApp.controller('TabController', function () {
    this.tab = 1;

    this.setTab = function (tabId) {
        this.tab = tabId;
    };

    this.isSet = function (tabId) {
        return this.tab === tabId;
    };




});

myApp.controller('TabController', function () {
    this.tab = 1;

    this.setTab = function (tabId) {
        this.tab = tabId;
    };

    this.isSet = function (tabId) {
        return this.tab === tabId;
    };
});


myApp.directive('hicretemodal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
          $(element).modal({
              show: false,
              keyboard: attrs.keyboard,
              backdrop: attrs.backdrop
          });

          scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });


myApp.controller('MainPageController' , function(setInfo,$scope,$http,$filter){
    console.log("in main page controller");
    $scope.Tasks = [];
    var task = [];

    var data = {
        operation: "getAllTaskForUser",
        includeCompleted:false
    };
    var config = {
        params: {
            data: data
        }
    };
    console.log(config);
    $('#loader').css("display", "block");
    $http.post("Process/php/TaskFacade.php", null, config)
        .success(function (data) {
            console.log(data);
            $('#loader').css("display", "none");

            for (var i = 0; i < data.message.length; i++) {

                task.push({
                    "TaskID": data.message[i].TaskID,
                    "TaskName": data.message[i].TaskName,
                    "TaskDescripion": data.message[i].TaskDescripion,
                    "ScheduleStartDate": data.message[i].ScheduleStartDate,
                    "ScheduleEndDate": data.message[i].ScheduleEndDate,
                    "CompletionPercentage": data.message[i].CompletionPercentage,
                    "TaskAssignedTo": data.message[i].TaskAssignedTo,
                    "isCompleted": data.message[i].isCompleted,
                    "CreationDate": data.message[i].CreationDate,
                    "CreatedBy": data.message[i].CreatedBy,
                    "ActualStartDate": data.message[i].ActualStartDate,
                    "AcutalEndDate": data.message[i].AcutalEndDate,
                    "UserId": data.message[i].UserId,
                    "UserName": data.message[i].firstName + " " + data.message[i].lastName

                });
            }
            $scope.Tasks = task;
            console.log("get task on dashboard");

        })
        .error(function (data, status, headers, config) {
            console.log(data.error);

            $('#loader').css("display", "none");
            $scope.errorMessage = data.message;
            $('#error').css("display", "block");
        });



    //$http.get("php/api/assignedtask").then(function(response) {
    //    console.log(response.data.length);
    //    if(response.data != null){
    //        for(var i = 0; i<response.data.length ; i++){
    //            task.push({
    //                TaskID:response.data[i].TaskID,
    //                TaskName: response.data[i].TaskName,
    //                ScheduleStartDate: response.data[i].ScheduleStartDate,
    //                TaskDescripion:response.data[i].TaskDescripion,
    //                ScheduleEndDate:response.data[i].ScheduleEndDate
    //            });
    //        }
    //    }
    //    $scope.Tasks = task;
    //    console.log("task scope is "+JSON.stringify($scope.Tasks));
    //})
    $scope.saveScope = function(scope){
        //console.log("scope is "+scope);
        setInfo.set(scope);
    }




    var data={
        operation :"getPaymentFollowup"
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post('Process/php/followupFacade.php',null,config)
        .success(function (data, status, headers) {
            console.log(data);

            if(data.status == "Successful") {
                $scope.paymentFollowup = [];
                var b = [];
                console.log("Success");
                for(var i = 0; i<data.message.length ; i++){
                    b.push({
                        followupId: data.message[i].FollowupId,
                        assignEmployee: data.message[i].AssignEmployee,
                        followupDate: data.message[i].FollowupDate,
                        invoiceId:data.message[i].InvoiceId,
                        followupDate:data.message[i].FollowupDate,
                        followupTitle:data.message[i].FollowupTitle,
                        creationDate:data.message[i].CreationDate,
                        createdBy: data.message[i].CreatedBy,
                        type : 'Payment'
                    });
                }

                $scope.paymentFollowup = b;
            }else{
                alert("Database error occurred while fetching payment followup");
            }

        })
        .error(function (data, status, header) {
            alert("Error Occured while fetching payment followup");
        });


    var data={
        operation :"getQuotationFollowup"
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post('Process/php/followupFacade.php',null,config)
        .success(function (data, status, headers) {
            console.log(data);

            if(data.status == "Successful") {
                console.log("Success");
                $scope.quotationFollowup = [];
                var b = [];

                for(var i = 0; i<data.message.length ; i++){
                    b.push({
                        followupId: data.message[i].FollowupId,
                        quotationId: data.message[i].QuotationId,
                        assignEmployee:data.message[i].AssignEmployee,
                        followupDate:data.message[i].FollowupDate,
                        followupTitle: data.message[i].FollowupTitle,
                        creationDate:data.message[i].CreationDate,
                        createdBy :data.message[i].CreatedBy,
                        type : 'Quotation'
                    });
                }

                $scope.quotationFollowup = b;
            }else{
                alert("Database error occurred while fetching Quotation followup");
            }

        })
        .error(function (data, status, header) {
            alert("Error Occured while fetching Quotation followup");
        });


    var data={
        operation :"getSitetrackingFollowup"
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post('Process/php/followupFacade.php',null,config)
        .success(function (data, status, headers) {

            console.log(data);

            if(data.status == "Successful") {
                console.log("Success");
                $scope.sitetrackingFollowup = [];
                var b = [];

                for(var i = 0; i<data.message.length ; i++){
                    b.push({
                        followupId: data.message[i].FollowupId,
                        projectId: data.message[i].ProjectId,
                        assignEmployee:data.message[i].AssignEmployee,
                        followupDate:data.message[i].FollowupDate,
                        followupTitle: data.message[i].FollowupTitle,
                        creationDate:data.message[i].CreationDate,
                        createdBy :data.message[i].CreatedBy,
                        type : 'SiteTracking'
                    });
                }

                $scope.sitetrackingFollowup = b;
            }else{
                alert("Database error occurred while fetching SiteTracking followup");
            }

        })
        .error(function (data, status, header) {
            alert("Error Occured while fetching SiteTracking followup");
        });


    var data={
        operation :"getApplicatorFollowup"
    };

    var config = {
        params: {
            data: data
        }
    };

    $http.post('Process/php/followupFacade.php',null,config)
        .success(function (data, status, headers) {
            console.log(data);

            if(data.status == "Successful") {
                console.log("Success");
                $scope.ApplicatorPaymentFollowup = [];
                var b = [];

                for(var i = 0; i<data.message.length ; i++){
                    b.push({
                        followupId: data.message[i].follow_up_id,
                        ApplicatorId: data.message[i].enrollment_id,
                        assignEmployee:data.message[i].assignEmployeeId,
                        followupDate:data.message[i].date_of_follow_up,
                        followupTitle: data.message[i].followup_title,
                        creationDate:data.message[i].creation_date,
                        createdBy :data.message[i].created_by,
                        type : 'Applicator'
                    });
                }

                $scope.ApplicatorPaymentFollowup = b;
            }else{
                alert("Database error occurred while fetching Applicator followup");
            }

        })
        .error(function (data, status, header) {
            alert("Error Occured while fetching Applicator followup");
        });





});

