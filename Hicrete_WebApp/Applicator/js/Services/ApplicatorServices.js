myApp.service('ApplicatorService',function(){

	this.submitApplicatorDetails=function($scope,$http,$rootScope,applicatorDetails){
		console.log(applicatorDetails);
		 var config = {
						params: {
									data: applicatorDetails
								}
					};


					$http.post("Applicator/php/Applicator.php", null, config)
								
					.success(function (data, status, headers, config){	

						$scope.loading=false;
						$('#loader').css("display","none");
						console.log(data);
						if(data.msg!="") {

							$rootScope.warningMessage = data.msg;
							//console.log($scope.warningMessage);
							$('#warning').css("display", "block");
							setTimeout(function () {
										$('#warning').css("display", "none");
                                        window.location = "dashboard.php#/Applicator";

							}, 1000);
							}
							if (data.error != "") {
								//$rootScope.errorMessage = "Unable to create Applicator...";
								$rootScope.errorMessage = data.error;
								$('#error').css("display", "block");
								setTimeout(function () {
											$('#error').css("display", "none");

								}, 1000);
							}

						})
						.error(function (data, status, headers, config){
							$('#loader').css("display","none");
							$rootScope.errorMessage="Unable to create Applicator...";
							$('#error').css("display","block");
							setTimeout(function() {
									if(data.msg!=""){
										$('#error').css("display","none");
									}
							}, 1000);
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

					$scope.Applicators=data;
					console.log($scope.Applicators);

				})

				.error(function (data, status, headers){
					console.log(data);

				});

	};

	this.savePaymentDetails=function($scope,$rootScope,$http,applicatorDetails){

		applicatorDetails.operation='savePaymentDetails';
		$scope.loading=true;
		//$scope.errorMessage="";
		//$scope.warningMessage="";
		console.log(applicatorDetails);
		$('#loader').css("display","block");
		var config = {
			params: {
				data: applicatorDetails
			}
		};

		$http.post("Applicator/php/Applicator.php", null,config)
				.success(function (data, status, headers, config){
					$('#loader').css("display","none");
					console.log(data);
					console.log(data.msg);
					$scope.loading=false;
					$('#loader').css("display","none");
					if(data.msg!=""){
						$rootScope.warningMessage =data.msg;
						$('#warning').css("display", "block");
						setTimeout(function() {
							$('#warning').css("display", "none");
							window.location = "dashboard.php#/Applicator";
						},1000);
					}

					if(data.error!=""){
						$rootScope.errorMessage=data.error;
						$('#error').css("display","block");

						setTimeout(function() {
							$('#error').css("display","none");
							window.location = "dashboard.php#/Applicator";
						},5000);

					}

				})

				.error(function (data, status, headers){
					console.log(data);
					$('#loader').css("display","none");
					$rootScope.errorMessage="Unable to Add Payment Details..";
					setTimeout(function() {
						$('#error').css("display","block");
					},5000);
				});
	}

    this.deleteApplicator=function($scope,$rootScope,$http,applicator_id){

        var data = {
            operation: "deleteApplicator",
            applicator_id: applicator_id
        };

        var config = {
            params: {
                data:data
            }

        };
        $('#loader').css("display","block");
        $http.post("Applicator/php/Applicator.php", null,config)
            .success(function (data, status, headers, config){
                console.log(data);
                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.msg!=""){
                    $rootScope.warningMessage=data.msg;
                    $('#warning').css("display","block");

                    setTimeout(function(){
                        //window.location = "dashboard.php#/Applicator";
                        //window.location.reload(true);
                    },1000);
                }
                if(data.error!=""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");

                    setTimeout(function(){
                        //window.location = "dashboard.php#/Applicator";
                       // window.location.reload(true);
                    },4000);
                }
            })
            .error(function (data, status, headers, config){
                console.log(data);
                $('#loader').css("display","none");
                $rootScope.errorMessage="Unable to delete Applicator";
                $('#error').css("display","block");
            });
    }

});
myApp.service('PackageService',function(){

		this.createPackage=function($scope,$rootScope,$http,packageDetails){
				packageDetails.operation='createPackage';
				$scope.loading=true;
				//$scope.errorMessage="";
				//$scope.warningMessage="";
				$('#loader').css("display","block");
				var config = {
								params: {
										data: packageDetails
									}
						  	 
								};

			   		$http.post("Applicator/php/Applicator.php",null,config)
                
					.success(function (data, status, headers, config){
						            
                        console.log(data);
						if(data.msg!=""){
							$rootScope.warningMessage=data.msg;
							$('#warning').css("display","block");
                            setTimeout(function() {
                                    $('#loader').css("display", "none");
                                    $('#warning').css("display","none");
                                    window.location = "dashboard.php#/Applicator";

                            },1000);
                        }

                        if (data.error != "") {
                                $('#loader').css("display", "none");
                                $rootScope.errorMessage = data.error;
                                $('#error').css("display", "block");
                        }

					})
					.error(function (data, status, headers, config){
									
						console.log(data);
						$('#loader').css("display","none");
						$rootScope.errorMessage="Unable to create package";
						$('#error').css("display","block");

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

    this.deletePackage=function($scope,$rootScope,$http,packageId){

        var data = {
            operation: "deletePackage",
            package_id: packageId
        };
        var config = {
            params: {
                data: data
            }
        };

        $('#loader').css("display","block");
        $http.post("Applicator/php/Applicator.php",null,config)

            .success(function (data, status, headers, config){
                console.log(data);
                if(data.msg!=""){
                    $rootScope.warningMessage=data.msg;
                    $('#warning').css("display","block");
                    setTimeout(function(){
                        window.location = "dashboard.php#/Applicator";
                    },1000);
                }
                $scope.loading=false;
                $('#loader').css("display","none");
                if(data.error!=""){
                    $rootScope.errorMessage=data.error;
                    $('#error').css("display","block");
                }
            })
            .error(function (data, status, headers, config){
                console.log(data);
                $('#loader').css("display","none");
                $rootScope.errorMessage="Unable to delete Package";
                $('#error').css("display","block");
            });
    };




});

