myApp.service('ApplicatorService',function(){

	this.submitApplicatorDetails=function($scope,$http,applicatorDetails){

		 var config = {
						params: {
									applicatorDetails: applicatorDetails
								}
						  	 
					};

					$http.post("Applicator/php/Applicator.php", null, config)
								
					.success(function (data, status, headers, config){	
							console.log(data);
							doShowAlert("Success",data);

							//window.location="http://localhost/Hicrete_Web1-1-2016/dashboard.html#/Applicator";
							
							setTimeout(function(){
									window.location.reload(true);
							},2000);
							
							// $scope.clearFields(applicatorDetails,'Success');					

						})
						.error(function (data, status, headers, config){
                        		console.log(data);
								doShowAlert("Failure",data);
						});			
	}
	this.viewApplicatorDetails=function($scope,$http,applicatorDetails){

				applicatorDetails.operation='viewApplicator';
				var config = {
								params: {
										applicatorDetails: applicatorDetails
									}
						  	 
								};

				$http.post("Applicator/php/Applicator.php", null,config)
					
					.success(function (data, status, headers, config){
							console.log(data);
							$scope.Applicators=data;
							$scope.totalItems = $scope.Applicators.length;
						})

					.error(function (data, status, headers){
							console.log(data);
          
						});

		};


});
myApp.service('PackageService',function(){

		this.createPackage=function($scope,$http,packageDetails){
				packageDetails.operation='create';
				var config = {
								params: {
										packageDetails: packageDetails
									}
						  	 
								};

			   		$http.post("Applicator/php/Package.php",null,config)
                
					.success(function (data, status, headers, config){
						            
						            console.log(data);
									doShowAlert("Success",data);
									setTimeout(function(){
										window.location.reload(true);
									},2000);
					})
					.error(function (data, status, headers, config){
									
									console.log(data);
									doShowAlert("Failure",data);
                    });
		};


		this.viewPackages=function($scope,$http,packageDetails){

			packageDetails.operation="view";
			var config={

						params:{

							packageDetails:packageDetails
						}
				};		
					$http.post("Applicator/php/Package.php", null,config)
					
					.success(function (data, status, headers, config){

							console.log(data);
							$scope.packages=data;
							
						
						})

					.error(function (data, status, headers){
							
							console.log(data);
          
						});	
			

		};

});

