myApp.controller('budgetSegmentController',function($scope,$http){

		$scope.segments=[];
		$scope.materialSegment;
    $scope.addClicked=false;
    $scope.submitClicked=false;
    $scope.showDialog=false;
    $scope.showModal=false;
      $scope.add = function () {
            
          for (var i = 0; i < $scope.noOfElement; i++) {
            $scope.addField();
          };
          
          $scope.noOfElement=""; 
          $scope.addClicked=false;
      };

      
      $scope.clear =function() {
          $scope.segments.splice(0,$scope.segments.length);
      };

      $scope.remove= function(index) {
         
          $scope.segments.splice(index,1);
          
          if($scope.segments.length==0)
            $scope.isSegmentAdded=true;  
      };

      $scope.addField= function(){

            $scope.segments.push({name:""});
      };

        
     $scope.initializeMaterialSegment  =function(){
          $scope.submitClicked=false;
          $scope.materialSegment=$scope.segments[0].name;
          $scope.showModal=true;
          console.log(showModal);
      };
        
      
      $scope.addSegment=function(){
          $scope.showModal=false;
          var data={
            operation :"addSegment",
            segments :$scope.segments,
            materialSegment: $scope.materialSegment
          };        

          
          var config = {
                 params: {
                       data: data
                     }
               };

          $http.post("Expense/php/expenseFacade.php",null, config)
           .success(function (data)
           {
            console.log("Dataa");
            console.log(data);
            if(data=="0")
               doShowAlert("Success","Added Successfully");
             window.location="http://localhost/Hicrete_webapp/dashboard.php#/Expense";
        
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             
           });
        } ; 


        $scope.clearSegmentFields=function(){
           console.log("remove"); 
            angular.forEach($scope.segments, function(segment) {
               console.log(segment.name);
               segment.name="";
            });

        };



});  



myApp.controller('costCenterController',function($scope,$http){
      $scope.createCostCenterClicked=false;

      $scope.projectList=[];
      $scope.projectList.push({name:"Project1",id:"1"});
      $scope.projectList.push({name:"Project2",id:"2"});

      
      $scope.segmentList=[];
      
      $scope.costCenterDetails={
        projectId:"",
        costCenterName:"",
        segments:null
      }


      var data={
            operation :"getSegments",
      };        

      var config = {
                 params: {
                       data: data
                     }
      };

      $http.post("Expense/php/expenseUtils.php",null, config)
           .success(function (data)
           {
            console.log(data);
             if(data=="1"){

             }else{
                 $scope.segmentList=data;
             }
        
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             
           });
     

      $scope.createCostCenter=function(){
            $scope.createCostCenterClicked=false;

            // $scope.costCenterDetails=$scope.segmentList;  

           // angular.extend($scope.costCenterDetails, $scope.segmentList);
           console.log($scope.segmentList);
            var data={
              operation :"createCostCenter",
              costCenterData: $scope.costCenterDetails,
              segments:$scope.segmentList

            };        
            console.log(data);
            var config = {
                params: {
                       data: data
                     }
            };
            console.log(config);
            $http.post("Expense/php/expenseFacade.php",null, config)
           .success(function (data)
           {
            console.log(data);
             if(data=="0"){
                doShowAlert("Success","Costcenter created Successfully");
                window.location="http://localhost/Hicrete_webapp/dashboard.php#/Expense";
             }else{
                doShowAlert("Failure","Cannot connect to database");  
             }
        
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             
           });  

      }
  
});      


myApp.controller('expenseEntryController',function($scope,$http){
      
      $scope.otherExpenseClicked=false;
      $scope.materialExpenseClicked=false;
      $scope.expenseDetails={costCenter:"",
        segmentName:"",
        amount:"",
        desc:"",
        isBillApplicable:false
      };

      $scope.billDetails={
        billNo:"",
        firmName:"",
        dateOfBill:""
      };
      
      // $scope.costCenterList=[];
      // $scope.costCenterList.push({name:"CostCenter1",id:"1"});
      // $scope.costCenterList.push({name:"CostCenter2",id:"2"});

      // $scope.segmentList=[];  
      // $scope.segmentList.push({name:"Transport",id:"1"});
      // $scope.segmentList.push({name:"Other",id:"2"});

/*
    START of getting segment list
*/
      var data={
            operation :"getSegments",
      };        

      var config = {
                 params: {
                       data: data
                     }
      };

      $http.post("Expense/php/expenseUtils.php",null, config)
           .success(function (data)
           {
            console.log(data);
             if(data=="1"){

             }else{
                 $scope.segmentList=data;
             }
        
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             
           });
/*
    End of getting segment list
*/
      var data={
            operation :"getCostCenters",
      };        

      var config = {
                 params: {
                       data: data
                     }
      };

      $http.post("Expense/php/expenseUtils.php",null, config)
           .success(function (data)
           {
            console.log(data);
             if(data=="1"){

             }else{
                 $scope.costCenterList=data;
             }
        
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             
           });
      $scope.addOtherExpense=function(){
        $scope.otherExpenseClicked=false;
            var data={
              operation :"addOtherExpense",
              otherExpenseData: $scope.expenseDetails,
              billDetails:$scope.billDetails

            };        

            var config = {
                params: {
                       data: data
                     }
            };
            console.log("config");
            console.log(config);
            console.log($scope.billDetails);
            $http.post("Expense/php/expenseFacade.php",null, config)
           .success(function (data)
           {
            console.log(data);
                window.location="http://localhost/Hicrete_webapp/dashboard.php#/Expense";
             if(data=="0"){
                doShowAlert("Success","Other Expense Details Added successfully");
             }else{
                doShowAlert("Failure","Cannot connect to database");  
             }
        
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             
           });  
        alert($scope.expenseDetails.costCenter);
      }
      
      $scope.addMaterialExpense=function(){
        $scope.materialExpenseClicked=false;
                    var data={
              operation :"addMaterialExpense",
              materialExpenseData: $scope.expenseDetails,
              billDetails:$scope.billDetails
            };        

            var config = {
                params: {
                       data: data
                     }
            };
            console.log("config");
            console.log(config);
            console.log($scope.billDetails);
            $http.post("Expense/php/expenseFacade.php",null, config)
           .success(function (data)
           {
            console.log(data);
             if(data=="0"){
                doShowAlert("Success","Material Expense Details Added successfully");
             }else{
                doShowAlert("Failure","Cannot connect to database");  
             }
        
           })
           .error(function (data, status, headers, config)
           {
             doShowAlert("Failure","Error Occurred");
             
           });  
        alert($scope.expenseDetails.costCenter);
      }

     
});



myApp.controller('costCenterSearchController',function($scope,$http){


});