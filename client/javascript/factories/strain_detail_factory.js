myApp.factory('StrainsDetailFactory', function($http) {
	var factory = {};
	var factoryItem;
	
	factory.getItem = function(vendorID, strainID, callback) {
		$http.get('/getItem/' + vendorID + "/" + strainID).success(function (item) {
			factoryItem = item;
			callback(factoryItem);
		});
	}
	return factory;
});