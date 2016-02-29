myApp.service('ApplicatorService',function(){

	this.submitApplicatorDetails=function($scope,$http,applicatorDetails){
		applicatorDetails.operation='createApplicator';
		 var config = {
						params: {
									data: applicatorDetails
								}
						  	 
					};

					$http.post("Applicator/php/Applicator.php", null, config)
								
					.success(function (data, status, headers, config){	
							console.log(data);

							setTimeout(function(){
									window.location.reload(true);
							},2000);



						})
						.error(function (data, status, headers, config){

                        			console.log(data);

						});			
	};

	this.getApplicatorDetails=function($scope,$http,applicatorDetails){



		};

	this.getApplicatorPaymentDetails=function($scope,$http,applicatorDetails){

		applicatorDetails.operation='getPaymentDetails';
		var config = {
					 params: {
								data: applicatorDetails
							}
					};

		        $http.post("Applicator/php/Applicator.php", null,config)

				.success(function (data, status, headers, config){
					console.log(data);
					$scope.Applicators=data;

				})

				.error(function (data, status, headers){
					console.log(data);

				});

	};

	this.savePaymentDetails=function($scope,$http,applicatorDetails){

		applicatorDetails.operation='savePaymentDetails';
		var config = {
			params: {
				data: applicatorDetails
			}
		};

		$http.post("Applicator/php/Applicator.php", null,config)

				.success(function (data, status, headers, config){
					console.log(data);
					setTimeout(function(){
						window.location.reload(true);
					},2000);

				})

				.error(function (data, status, headers){
					console.log(data);

				});
	};


});
myApp.service('PackageService',function(){

		this.createPackage=function($scope,$http,packageDetails){
				packageDetails.operation='createPackage';
				var config = {
								params: {
										data: packageDetails
									}
						  	 
								};

			   		$http.post("Applicator/php/Applicator.php",null,config)
                
					.success(function (data, status, headers, config){
						            
						            console.log(data);

									setTimeout(function(){
										window.location.reload(true);
									},2000);
					})
					.error(function (data, status, headers, config){
									
									console.log(data);

                    });
		};


		this.viewPackages=function($scope,$http,packageDetails){

			packageDetails.operation="viewPackages";
			var config={

						params:{

							data:packageDetails
						}
				};		
					$http.post("Applicator/php/Applicator.php", null,config)
					
					.success(function (data, status, headers, config){

							console.log(data);
							$scope.packages=data;
							$scope.totalPackages = $scope.packages.length;
						
						})

					.error(function (data, status, headers){
							
							console.log(data);
          
						});	
			

		};

});

