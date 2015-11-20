myApp.controller('VendorsController', function ($scope, $location, $routeParams, VendorFactory, UserFactory, Socket) {

	Socket.on('UpdateReservations', function() {
		console.log('sockets are success!');
		VendorFactory.getReservations(vendor_id, function (allReservations){
			$scope.allreservations  = allReservations;
		});
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
		vendor_id = data;
	});

	// Vendor Dashboard - vendors checking their orders
	VendorFactory.getReservations(vendor_id, function (allReservations){
		$scope.allreservations  = allReservations;

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

	$scope.available = function(reservationID) {
		console.log(reservationID);
		VendorFactory.available(reservationID, function () {
			VendorFactory.getReservations(vendor_id, function (allReservations){
				$scope.allreservations  = allReservations;
				VendorFactory.getUserIdForReservation(reservationID, function (userId) {
					console.log("this is the userID", userId[0].user_id);
					Socket.emit("MakeAvailable", userId[0].user_id);
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