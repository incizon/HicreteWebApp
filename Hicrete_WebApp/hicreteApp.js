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
            url: '/addApplicator',
            templateUrl: 'Applicator/html/CreateApplicator.html',
            controller: 'ApplicatorController'
        })

        .state('Applicator.addPayment', {
            url: '/addApplicatorPayment',
            templateUrl: 'Applicator/html/ApplicatorPayment.html',
            controller: 'ApplicatorPaymentController'
        })

        .state('Applicator.addPackage', {
            url: '/addPackage',
            templateUrl: 'Applicator/html/CreatePackage.html',
            controller: 'PackageController'
        })

        .state('Applicator.viewPackages', {
            url: '/viewPackages',
            templateUrl: 'Applicator/html/ViewPackages.html',
            controller: 'ViewPackageController'
        })

        .state('Applicator.tentetiveApplicator', {
            url: '/tentetiveApplicators',
            templateUrl: 'Applicator/html/ViewTentetiveApplicator.html',
            controller: 'ViewTentetiveApplicatorController'
        })
        .state('Applicator.permanentApplicator', {
            url: '/permanentApplicators',
            templateUrl: 'Applicator/html/ViewPermanentApplicator.html',
            controller: 'ViewPermanentApplicatorController'
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

        .state('Expense.createCostCenter', {
            url: '/createCostCenter',
            templateUrl: 'Expense/html/CreateCostCenter.html',
            controller: 'costCenterController'
        })

        .state('Expense.addSegment', {
            url: '/addSegment',
            templateUrl: 'Expense/html/AddBudgetSegment.html',
            controller: 'budgetSegmentController'
        })

        .state('Expense.otherExpense', {
            url: '/otherExpense',
            templateUrl: 'Expense/html/AddOtherExpenses.html',
            controller: 'expenseEntryController'  
        })

        .state('Expense.materialExpense', {
            url: '/materialExpense',
            templateUrl: 'Expense/html/AddMaterialExpense.html',
            controller: 'expenseEntryController'  
        })
        .state('Expense.searchExpense', {
            url: '/searchExpense',
            templateUrl: 'Expense/html/Hi_crete_costCenterSearchNew.html',
            controller: 'costCenterSearchController'  
        })
        .state('Expense.searchSegment', {
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

        .state('Config.search', {
            url: '/search',
            templateUrl: 'Config/html/ConfigSearch.html'
           
        })

        .state('RequestAccess', {
            url: '/requestAccess',
            templateUrl: 'Config/html/RequestTemporaryAccess.html',
           controller: 'requestTempAccessController'

        })

        .state('ChangePassword', {
            url: '/search',
            templateUrl: 'Config/html/ChangePassword.html'

        })

        .state('Process', {
            url: '/Process',
            templateUrl: 'Process/html/processWidgets.html'
        })

        .state('Process.addCustomer', {
            url: '/addCustomer',


        })

        .state('Process.addProject', {
            url: '/addProject',
            templateUrl: 'Process/html/ProjectCreation.html',

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
                console.log($rootScope.accessPermission);
             }else{
                  doShowAlert("Failure",data.message);
             }         
            
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure",data.error);     
           });            
            
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

