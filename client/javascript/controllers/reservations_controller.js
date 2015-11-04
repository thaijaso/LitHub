myApp.controller('ReservationsController', function ($scope, $location, $routeParams, ReservationFactory, UserFactory) {

	UserFactory.returnUser(function(data){
			userID = data;
	});

// Feed - users checking their own reservations
	ReservationFactory.getReservations(userID, function (reservations) {
		console.log(reservations);
			$scope.feed_reservations  = reservations;
	});

	$scope.cancelOrder = function(reservationID) {
		ReservationFactory.cancelOrder(reservationID, function () {
			ReservationFactory.getReservations(userID, function (reservations) {
				$scope.feed_reservations  = reservations;
			});
		});
	}

	$scope.addOrder = function(newOrder, vendorID, strainID) {
		ReservationFactory.addOrder(newOrder, sessionStorage.getItem('sessionID'), vendorID, strainID, function () {
			$location.path('/feed');
		});
	}
	});