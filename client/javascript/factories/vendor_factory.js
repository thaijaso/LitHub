myApp.factory('VendorFactory', function ($http) {
	var factory = {};
	var vendor_id;
	if (sessionStorage.getItem('sessionVendor_id') != undefined) {
		vendor_id = sessionStorage.getItem('sessionVendor_id');
	}

	factory.returnVendor_id = function(callback) {
		console.log(vendor_id);
		callback(vendor_id);
	}

	factory.getMenu = function(vendorID, callback) {
		$http.get('/getMenu/' + vendorID).success(function (menu) {
			callback(menu);
		});
	}
	

	factory.getReservations = function(vendorID, callback) {
		console.log("fred made it to the factory", vendorID);
		$http.post('/getVendorReservations/' + vendorID).success(function (allReservations) {
			console.log('fred made it inside the factory', allReservations);
			callback(allReservations);
		});
	  }

	return factory;
});