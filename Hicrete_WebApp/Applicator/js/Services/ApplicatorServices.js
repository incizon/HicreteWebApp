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
						if(data.msg!=""){
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
						}
							//setTimeout(function(){
							//		window.location.reload(true);
							//},2000);
						})
						.error(function (data, status, headers, config){
							$('#loader').css("display","none");
							$scope.errorMessage=data.error;
							$('#error').css("display","block");
                        			console.log(data);

						});			
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
		$scope.loading=true;
		$scope.errorMessage="";
		$scope.warningMessage="";
		$('#loader').css("display","block");
		var config = {
			params: {
				data: applicatorDetails
			}
		};

		$http.post("Applicator/php/Applicator.php", null,config)
				.success(function (data, status, headers, config){

					console.log(data.msg);
					if(data.msg!=""){
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
					}
					console.log(data);
					//setTimeout(function(){
					//	window.location.reload(true);
					//},2000);

				})

				.error(function (data, status, headers){
					console.log(data);
					$('#loader').css("display","none");
					$scope.errorMessage=data.error;
					$('#error').css("display","block");
				});
	}

	this.modifyApplicatorDetails=function($scope,$http,applicatorDetails){


		var config = {
			params: {
				data: applicatorDetails
			}
		};

				$http.post("Applicator/php/Applicator.php", null, config)

				.success(function (data, status, headers, config) {

					console.log(data);

				})
				.error(function (data, status, headers) {
					console.log(data);

				});
	}


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

