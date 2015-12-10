myApp.controller('VendorsController', function ($scope, $location, $routeParams, VendorFactory, UserFactory, Socket) {

	Socket.on('UpdateReservations', function(orderInfo) {
		//Grabs new reservations
		console.log('The vendor received this: ', orderInfo);
		var orderInfo = orderInfo;
		// VendorFactory.makeAvailable(function(orderInfo) {
		// 	console.log('The reservation has been made available for the customer');
		// });

		VendorFactory.getReservations(vendor_id, function (allReservations){
			$scope.allreservations  = allReservations;
		});
	});



	Socket.on('NewOrderSubmitted', function(orderInfo) {
		var userId = orderInfo.user_id;
		var vendorId = orderInfo.vendor_id;

	});



    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  	$scope.series = ['Series A', 'Series B'];
  	$scope.data = [
    	[65, 59, 80, 81, 56, 55, 40],
    	[28, 48, 40, 19, 86, 27, 90]
  	];
  	$scope.onClick = function (points, evt) {
    	//console.log(points, evt);
  	};


	VendorFactory.returnVendor_id(function(data){
		if (data != undefined) {
			console.log('This is the data from the returnVendor_id function in the vendors controller: ', data);
			vendor_id = data;
			Socket.emit('VendorLoggedIn', vendor_id);
		} else if (sessionStorage.getItem('sessionVendor_id') != undefined) {
			console.log('This is the data from the returnVendor_id function in the vendors controller: ', data);
			vendor_id = sessionStorage.getItem('sessionVendor_id');
			Socket.emit('VendorLoggedIn', vendor_id);
		}
		
		console.log('VendorLoggedIn socket sent with vendor id: ', vendor_id);
	});

	// Vendor Dashboard - vendors checking their orders
	VendorFactory.getReservations(vendor_id, function (allReservations){
		$scope.allreservations  = allReservations;
		console.log($scope.allreservations);
	});

	VendorFactory.getMenu($routeParams.id, function (menu) {
		$scope.indicas = [];
		$scope.sativas = [];
		$scope.hybrids = [];
		$scope.name = menu[0].name;
		for (var i = 0; i < menu.length; i++) {
			if (menu[i].category == "Indica") {
				$scope.indicas.push(menu[i]);
				//console.log('pushed indica')
			}
			if (menu[i].category == "Sativa") {
				$scope.sativas.push(menu[i]);
				//console.log('pushed sativas')
			}
			if (menu[i].category == "Hybrid") {
				$scope.hybrids.push(menu[i]);
				//console.log('pushed hybrid')
			}
		}
		//console.log('Here is the count of the sativas: ', $scope.sativas.count)
		//console.log('Here is the count of the indicas: ', $scope.indicas.count)
		//console.log('Here is the count of the hybrids: ', $scope.hybrids.count)
	});

	//User submits order (socket with userId sent) --> Vendor receives the user id and order --> Vendor sends a socket back to update the users page -->
	//User should then receive a push notification

	$scope.available = function(reservationID) {
		console.log(reservationID);
		VendorFactory.available(reservationID, function (device_id) {
			// Socket.emit('MakeAvailable', )
			VendorFactory.getReservations(vendor_id, function (allReservations){
				$scope.allreservations  = allReservations;
				//Socket to send to the server for push notification
				VendorFactory.getUserIdForReservation(reservationID, function (userId) {
					var userId = userId[0].user_id;
					var deviceId = device_id[0].device_id;
					var userInfo = {userId: userId, deviceId: deviceId};
					console.log("this is userInfo: ", userInfo);
					Socket.emit("MakeAvailable", userInfo);
					
				});	
			});
		});
	}

	$scope.unavailable = function(reservationID) {
		VendorFactory.unavailable(reservationID, function () {
			VendorFactory.getReservations(vendor_id, function (allReservations){
				$scope.allreservations  = allReservations;
			});
		});
	}

	$scope.pickedUp = function(reservationId) {
		//console.log(reservationId);
		VendorFactory.pickedUp(reservationId, function () {
			//do something to picked up reservation on front end...
			VendorFactory.getReservations(vendor_id, function (allReservations) {
				console.log(allReservations);
				$scope.allreservations = allReservations;
				VendorFactory.getUserIdForReservation(reservationId, function (userId) {
					console.log("this is the userId: ", userId);
					Socket.emit("PickedUp", userId[0].user_id);
				});

			});
			//$scope.allreservations = allReservations;
		});
	}















});