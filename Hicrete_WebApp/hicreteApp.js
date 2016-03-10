var myApp = angular.module('hicreteApp', ['ui.router','ngCookies','ngMessages','ui.bootstrap']);
 
//Now Configure  our  routing

myApp.config(function($stateProvider, $urlRouterProvider) {
 
    //$urlRouterProvider.otherwise('');
    
    $stateProvider
        
        // Applicator STATES ========================================
        .state('Applicator', {
            url: '/Applicator',
            templateUrl: 'Applicator/html/ApplicatorWidget.html'
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
            templateUrl: 'Applicator/html/SearchTentativeApplicator.html',
            controller: 'SearchTentativeApplicatorController'
        })
        .state('Applicator.tentativeApplicatorDetails', {
            url: '/ViewTentativeApplicatorDetails?applicator_id',
            templateUrl: 'Applicator/html/ViewTentativeApplicatorDetails.html',
            controller: 'ViewTentativeApplicatorController'

        })

        .state('Applicator.modifyTentativeApplicatorDetails',{
            url: '/ModifyTentativeApplicatorDetails?applicator_id',
            templateUrl: 'Applicator/html/ModifyTentativeApplicatorDetails.html',
            controller: 'ModifyTentativeApplicatorController'

        })
        .state('Applicator.permanentApplicator', {
            url: '/SearchPermanentApplicators',
            templateUrl: 'Applicator/html/SearchPermanentApplicator.html',
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
            templateUrl: 'Inventory/html/inventoryWidgets.html',
            Controller:'inventoryCommonController'

        })
        .state('Inventory.addProduct', {
            url: '/addProduct',
            templateUrl: 'Inventory/html/inventory_Add_Product.html',
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
        .state('Inventory.inwardSearch', {
            url: '/inwardSearch',
            templateUrl: 'Inventory/html/search/Inventory_Inward_Search.html',
            controller: 'inwardController'
        })
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
            templateUrl: 'Inventory/html/search/Inventory_Items_Search.html',
            controller: 'productController'
        })
        .state('Inventory.searchInward', {
            url: '/searchInward',
            templateUrl: 'Inventory/html/search/Inventory_Inward_Search.html',

        })
        .state('Inventory.searchOutward', {
            url: '/searchOutward',
            templateUrl: 'Inventory/html/search/Inventory_Outward_Search.html',

        })
        .state('Inventory.searchInventory', {
            url: '/searchInventory',
            templateUrl: 'Inventory/html/search/Inventory_Search.html',
            controller: 'SearchController'
        })
        .state('Inventory.searchSupplier', {
            url: '/searchSupplier',
            templateUrl: 'Inventory/html/inventory_supplierSearch.html',
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
            controller: 'costCenterSearchController'
        })
        .state('Process.searchSegment', {
            url: '/searchSegment',
            templateUrl: 'Expense/html/SegmentSearch.html',
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
        
        .state('Config.scheduleTempAccess', {
            url: '/scheduleTempAccess',
            templateUrl: 'Config/html/ScheduleTemporaryAccess.html',
            controller:'tempAccessController'    
        })

        .state('Config.userSearch', {
            url: '/SearchUser',
            templateUrl: 'Config/html/ViewUser.html',
            controller:'userController'
        })

        .state('Config.companySearch', {
            url: '/SearchCompany',
            templateUrl: 'Config/html/ViewCompany.html',
            controller:'companyController'

        })

        .state('Config.warehouseSearch', {
            url: '/SearchWarehouse',
            templateUrl: 'Config/html/ViewWarehouse.html'

        })

        .state('myProfile', {
            url: '/myProfile',
            templateUrl: 'Config/html/MyProfile.html',
            controller:'userController'
        })

        .state('createSuperUser', {
            url: '/CreateSuperUser',
            templateUrl: 'Config/html/CreateSuperUser.html'

        })

        .state('RequestAccess', {
            url: '/requestAccess',
            templateUrl: 'Config/html/RequestTemporaryAccess.html',
           controller: 'requestTempAccessController'

        })


        .state('Process', {
            url: '/Process',
            templateUrl: 'Process/html/processWidgets.html',
            controller:'ProcessWidgetController'
        })

        .state('Process.addCustomer', {
            url: '/addCustomer',
            templateUrl: 'Process/html/AddCustomer.html',
            controller:'CustomerController'
        })
        .state('Process.modifyCustomer', {
            url: '/ModifyCustomer',
            templateUrl: 'Process/html/ModifyCustomer.html',
            controller:'ModifyCustomerController'
        })

        .state('Process.addProject', {
            url: '/addProject',
            templateUrl: 'Process/html/ProjectCreation.html'

        })
        .state('Process.modifyProject', {
            url: '/ModifyProject',
            templateUrl: 'Process/html/ProjectModification.html',
            controller:'ModifyProjectController'
        })

        .state('Process.addQuotation', {
            url: '/addQuotation',
            templateUrl:'Process/html/QuotationCreation.html',
            controller:"QuotationController"
        })

        .state('Process.addInvoice', {
            url: '/addInvoice',
            templateUrl:"Process/html/InvoiceCreation.html",
            controller:"InvoiceController"
        })

        .state('Process.addPayment', {
            url: '/addPayment',
            templateUrl: 'Process/html/ProjectPayment.html',
            controller: 'ProjectPaymentController'
        })
        .state('Process.viewProject', {
            url: '/viewProjects',
            templateUrl:'Process/html/ViewProjects.html',
            controller:'viewProjectController'
        })
        .state('Process.ProjectDetails', {
            url: '/ProjectDetails',
            templateUrl:'Process/html/ProjectDetails.html',
            controller:'ProjectDetailsController'
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
            templateUrl:'Process/html/ViewCustomers.html',
            controller:'ViewCustomerController'
        })
        .state('Process.AttachWorkorder', {
            url: '/AttachWorkorder',
            templateUrl:'Process/html/CreateWorkOrder.html',

        })
        .state('Process.viewInvoice', {
            url: '/ViewInvoice',
            templateUrl:'Process/html/ViewInvoice.html',
            controller:'ViewInvoiceDetails'
        })
        .state('Process.viewQuotation', {
            url: '/ViewQuotation',
            templateUrl:'Process/html/ViewQuotation.html',
            controller:'ViewQuotationDetailsController'
        })

        .state('Process.paymentHistory', {
            url: '/PaymentHistory',
            templateUrl:'Process/html/PaymentHistory.html',
            controller:'PaymentHistoryController'
        })

        .state('Process.reviseQuotation', {
            url: '/ReviseQuotation',
            templateUrl:'Process/html/ReviseQuotation.html',
            controller:'ReviseQuotation'
        })

        .state('Process.searchTask', {
            url: '/SearchTask',
            templateUrl:'Process/html/schedule/SearchTasks.html',
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
            templateUrl:'Config/html/ChangePassword.html'

        })

        .state('MainPage', {
            url: '',
            templateUrl: 'MainPage.html'


        })

        .state('SuperDashboard', {
            url: '',
            templateUrl: 'SuperMainPage.html',
            controller: 'mainPageController'
            
        });
        // Package State =================================
        
        
});

myApp.run(function($rootScope,$http) {
    
    var data={
            operation :"getAccessPermission"
            
          };        

          var config = {
                     params: {
                           data: data

            }
          };


    $http.post("php/DashboardRenderer.php", null,config)
           .success(function (data)
           {
            if(data.status=="Successful"){
                $rootScope.accessPermission=data.message;
                //console.log($rootScope.accessPermission);
             }else{
                  doShowAlert("Failure",data.message);
             }         
            
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure",data.error);     
           });            

    //Applicator variables
    $rootScope.tentativeApplicators=[];
    console.log($rootScope.tentativeApplicators);
    $rootScope.permanentApplicators=[];

});





// create the controller and inject Angular's $scope
// set for Route Controller
myApp.controller('dashboardController', function($scope,$http,$cookieStore,$uibModal, $log) {
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

  $scope.open1 = function() {
      $scope.popup1.opened = true;
  };

    $scope.open2 = function() {
        $scope.popup1.opened = true;
    };


    $scope.popup1 = {
        opened: false
    };




        $scope.saveFollowupDetails=function(size,followupDetails){


            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'FollowupForm.html',
                controller:  function ($scope, $uibModalInstance,followupDetails) {


                    $scope.followupDetails = followupDetails;

                    $scope.Save = function () {
                        $uibModalInstance.close();
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

