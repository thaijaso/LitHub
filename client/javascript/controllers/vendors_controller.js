myApp.controller('VendorsController', function ($scope, $location, $routeParams, VendorFactory, UserFactory) {

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
			}
			if (menu[i].category == "Sativa") {
				$scope.sativas.push(menu[i]);
			}
			if (menu[i].category == "Hybrid") {
				$scope.hybrids.push(menu[i]);
			}
		}
	});

	$scope.available = function(reservationID) {
		VendorFactory.available(reservationID, function () {
			VendorFactory.getReservations(vendor_id, function (allReservations){
				$scope.allreservations  = allReservations;
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

});