myApp.factory('VendorFactory', function ($http) {
	var factory = {};
	var vendor_id;
	if (sessionStorage.getItem('sessionVendor_id') != undefined) {
		console.log('Session is carrying a vendor ID: ', sessionStorage.getItem('sessionVendor_id'));
		vendor_id = sessionStorage.getItem('sessionVendor_id');
	} else {

	}

	factory.makeAvailable = function(orderInfo, callback) {
		$http.post('/reservationAvailable', {deviceToken: orderInfo.deviceToken}).success(function () {
			console.log('Successfully told the user their reservation is available');
			callback()
		})
	}

	factory.returnVendor_id = function(callback) {
		callback(vendor_id);
	}

	factory.getMenu = function(vendorID, callback) {
		$http.get('/getMenu/' + vendorID).success(function (menu) {
			callback(menu);
		});
	}
	
	factory.getReservations = function(vendorID, callback) {
		$http.post('/getVendorReservations/' + vendorID).success(function (allReservations) {
			callback(allReservations);
		});
	  }

	factory.unavailable = function(reservationID, callback) {
		$http.post('/unavailable', {id: reservationID}).success(function () {
			callback();
		});
	}

	factory.available = function(reservationID, callback) {

		$http.post('/available', {id: reservationID}).success(function (device_id) {
			callback(device_id);
		});
	}

	factory.getUserIdForReservation = function(reservationId, callback) {
		//console.log(reservationId);
		$http.post('/getUserIdForReservation', {reservationId: reservationId}).success(function (userId) {
			callback(userId);
		});
	}

	factory.pickedUp = function(reservationId, callback) {
		//console.log(reservationId);
		$http.post('/reservationPickedUp', {reservationId: reservationId}).success(function () {
			callback();
		});
	}

	return factory;
});