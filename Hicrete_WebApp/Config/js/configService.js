myApp.service('configService', function(){

	var self=this;
  self.marshalledAccessList=function(returnVal,accessList){

   angular.forEach(returnVal, function(accessEntry) {
                      var entryNotFound=true;
                      angular.forEach(accessList, function(accessListEntry) {
                          if(accessListEntry.moduleName===accessEntry.ModuleName){
                            entryNotFound=false;   
                            if(accessEntry.accessType==="Read"){
                              accessListEntry.read.accessId=accessEntry.accessId;
                              accessListEntry.read.ispresent=true;                        
                            }  
                            else{
                              accessListEntry.write.accessId=accessEntry.accessId;
                              accessListEntry.write.ispresent=true;
                            }  
                          }
                      });  
                      if(entryNotFound){
                        if(accessEntry.accessType==="Read")
                          accessList.push({moduleName:accessEntry.ModuleName,read:{val:false,accessId:accessEntry.accessId,ispresent:true},write:{val:false,accessId:"",ispresent:false}});                        
                        else
                          accessList.push({moduleName:accessEntry.ModuleName,read:{val:false,ispresent:false,accessId:""},write:{val:false,accessId:accessEntry.accessId,ispresent:true}});
                      }
               });
   return accessList;

};



  // Write a get function for material type
	self.getAllAccessPermission=function($http,$scope){
		
    if($scope.accessList==undefined){
      $scope.accessList=[];
      console.log("fetching accessPermission");
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
                  doShowAlert("Failure",data.message);
                }else{
                  self.marshalledAccessList(data.message,$scope.accessList);

                }
                $scope.loaded=true;

           })
           .error(function(data, status, headers, config)
           {
             doShowAlert("Failure","Error Occured");
             $scope.loaded=true;
           });
    }
    

};


self.getRoleList=function($http,$scope){
                  //Get all permissions
          if($scope.roleList==undefined){
             $scope.roleList=[];
              var data={
                      operation :"getRoles"    
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
                          $scope.roleList=data.message;                
                       }

                     })
                     .error(function (data, status, headers, config)
                     {
                       doShowAlert("Failure","Error Occured");
                       
                     });
        }      
  };


});