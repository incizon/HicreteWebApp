myApp.service('inventoryService', function(){


  /***************************************************************************
    Get Product Details  
  ****************************************************************************/
  this.getProducts=function($scope,$http){

    $http.post("Inventory/php/ProductSearch.php", null)
    .success(function (data)
    {
     console.log("Items Present in database");
     console.log(data);
      $scope.productsToModify=data;
     $scope.products=data;   
    })
    .error(function (data, status, headers)
    {
      console.log(data);
          // $scope.messages.push(data.error);
    });
  };
  /***************************************************************************
    Get Product Details  
  ****************************************************************************/

  /***************************************************************************
    Get Material Types 
   ****************************************************************************/
  this.getMaterialTypes=function($scope,$http){
   $http.get("Inventory/php/Material.php")
   .success(function(data) {

     console.log("IN MATERIAL");
     $scope.materialNames = data;
     console.log(data);
     console.log($scope.materialNames);
   });
 }
});
/***************************************************************************
    Get Material Types  
****************************************************************************/
/***************************************************************************
* Start of Supplier Service
****************************************************************************/
myApp.service('addSupplierService', function() {

  this.addSupplier= function($scope,$http,supplier){

    var config = {
      params: {
        supplier: supplier
      }
    };

    $http.post("Inventory/php/supplierSubmit.php", null, config)
    .success(function (data)
    {
     console.log(data);

         //$scope.messages.push(data.msg);
         $scope.clearData(supplier,'submit'); 
         if(data.msg!="")
          doShowAlert("Success",data.msg);
        else if (data.error!="")
          doShowAlertFailure("Failure",data.error); 
         //doShowAlert("success",data.msg);
       })
    .error(function (data, status, headers, config)
    {
      console.log(data.error);
    });
  };

});

/***************************************************************************
 * End of Supplier Service
 ****************************************************************************/

/***************************************************************************
 * Start of Material Type Service
 ****************************************************************************/
  myApp.service('addMaterialTypeService', function() {

    this.addMaterialtype= function($scope,$http,materialType){

    //console.log("inside controller check"+materialType);
    $http.post("Inventory/php/inventory_Add_MaterialType.php",materialType)
    .success(function (data)
    {

     console.log(data);
     $scope.clear();
     if(data.msg!="")
      doShowAlert("Success",data.msg);
    else if (data.error!="")
      doShowAlertFailure("Failure",data.error);   

         //$scope.messages.push(data.msg);
         // $scope.clearData(supplier,'submit'); 
       })
    .error(function (data, status, headers, config)
    {
      console.log("Error calling php");
          //$scope.messages=data.error;
          //$scope.messages.push(data.error);
    });
  };

});

/*****************************************************************************
 * END of Material Type Service
 ****************************************************************************/

/*****************************************************************************
 * START OF INWARD  Service
 ****************************************************************************/
  myApp.service('inwardService', function(){

   this.inwardEntry=function($scope,$http,inwardData){
    console.log("IN SERVICE OF INWARD=");

    var data={
      inwardData:inwardData,
      module:'inward',
      operation:'insert'
    }
    var config={
      params:{
        data:data
      }
    };
    $http.post("Inventory/php/InventoryIndex.php", null,config)
    .success(function (data)
    {
       console.log("IN SERVICE OF INWARD=");
       console.log(data);
       console.log(inwardData);
       $scope.inwardData=data;
       if(data.msg!=""){
         doShowAlert("Success",data.msg);
        $scope.clearFields(inwardData);
      }else if (data.error!="")
      doShowAlert("Failure",data.error);   
    })
    .error(function (data, status, headers)
    {
      console.log(data);

    });
  };

});
/************************************************************************
 * End Of Inward Service
 *************************************************************************/

/*****************************************************************************
 * START OF OUTWARD  Service
 ****************************************************************************/
  myApp.service('outwardService', function(){

  this.outwardEntry=function($scope,$http,outwardData){
    var data={
      outwardData:outwardData,
      module:'outward',
      operation:'insert'
    }
    var config={
      params:{
        data:data
      }
    };
    $http.post("Inventory/php/InventoryIndex.php", null,config)
    .success(function (data)
    {
     console.log("IN SERVICE OF INWARD=");
     console.log(data);
     console.log(outwardData);
     $scope.outwardData=data;
     if(data.msg!=""){
       doShowAlert("Success",data.msg);
       $scope.clearFields(outwardData);
     }else if (data.error!="")
     doShowAlert("Failure",data.error);   
   })
    .error(function (data, status, headers)
    {
      console.log(data);

    });
  };

  this.getMaterialTypes=function($scope,$http){
   $http.get("Inventory/php/Material.php")
   .success(function(data) {
    console.log("IN MATERIAL");
    $scope.materialNames = data;
    $scope.material=data;
    console.log($scope.materialNames);
    for(var i=0;i<$scope.materialNames.length;i++){
      $scope.availableMaterials.push($scope.materialNames[i].materialtype);
    }
  });
 }

 this.getSupplierList=function($scope,$http){
   $http.get("Inventory/php/Material.php")
   .success(function(data) {
    console.log("IN MATERIAL");
    $scope.materialNames = data;
    $scope.material=data;
    console.log($scope.materialNames);
    for(var i=0;i<$scope.materialNames.length;i++){
      $scope.availableMaterials.push($scope.materialNames[i].materialtype);
    }

  });
 }
});
/************************************************************************
 * End Of OUTWARD Service
 *************************************************************************/
 /************************************************************************
 * Start Of PRODUCTION SERVICE Service
 *************************************************************************/

myApp.service('ProductionBatchService', function() {

  this.addProdBatchInfo= function($scope,$http,prodBatchInfo){

    //console.log(prodBatchInfo.prodcdMaterial);
    //console.log("inside controller check"+materialType);
    console.log(prodBatchInfo);
    var config = {
        params: {
              prodBatchInfo: prodBatchInfo
            }
      };


    $http.post("Inventory/php/Inventory_Production_Batch.php", null, config)
        .success(function (data)
        {

         console.log(data);

         if(prodBatchInfo.option=='Inquiry' || prodBatchInfo.option=='InquiryAll')
         {
          $scope.prodInq=data;
         }
         //$scope.clear();
         if(data.msg!="" && prodBatchInfo.option!='Inquiry' && prodBatchInfo.option!='InquiryAll')
          doShowAlert("Success",data.msg);
         else if (data.error!="" && prodBatchInfo.option!='Inquiry' && prodBatchInfo.option!='InquiryAll')
          doShowAlertFailure("Failure",data.error);  
         

         $scope.step=1;
         $scope.clear('All');


         //$scope.messages.push(data.msg);
         // $scope.clearData(supplier,'submit'); 
        })
        .error(function (data, status, headers, config)
        {
          console.log("Error calling php");
          //$scope.messages=data.error;
          //$scope.messages.push(data.error);
        });
  };

});




 /************************************************************************
 * End Of PRODUCTION Service
 *************************************************************************/