myApp.controller('StrainDetailsController', function ($scope, $location, $routeParams, StrainsDetailFactory) {
	
	// when user clicks to get additional detail about a certain strain, call this function automatically

	StrainsDetailFactory.getItem($routeParams.vendor_id, $routeParams.strain_id, function (item){
		console.log(item);
		$scope.name = item[0].vendor_name;
		$scope.vendorID = item[0].vendor_id;
		$scope.strainName = item[0].strain_name;
		$scope.imgSRC = item[0].fullsize_img1;
		$scope.desc = item[0].description;
		$scope.price_gram = item[0].price_gram;
		$scope.category = item[0].category;
		$scope.strainID = item[0].strain_id;
	});
});