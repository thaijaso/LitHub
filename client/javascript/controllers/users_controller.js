myApp.controller('UsersController', function ($scope, UserFactory, VendorFactory, $location, Socket) {
	
	UserFactory.checkSession(function (sessionID) {
		$scope.sessionID = sessionStorage.getItem('sessionID');
		$scope.sessionName = sessionStorage.getItem('sessionName')
		$scope.sessionVendor_status = sessionStorage.getItem('sessionVendor_status')
		$scope.sessionVendor_id = sessionStorage.getItem('sessionVendor_id')
	});

	$scope.loginUser = function(user) {
		UserFactory.loginUser(user, function(userFound) {
			$scope.sessionID = userFound[0].id;
			$scope.sessionName = userFound[0].first_name;
			$scope.sessionVendor_status = userFound[0].vendor_status;
			$scope.sessionVendor_id = userFound[0].user_vendor_id;
			//Needs to tell server that the user on this socket connection is now signed in and attach the vendor ID
			//or user id to the socket client as a key value


		});
	}

	$scope.logout = function() {
		UserFactory.logout(function() {
			$scope.sessionID = null;
			Socket.emit('disconnect')
		});
	}

	$scope.addUser = function(newUser) {
		UserFactory.addUser(newUser, function (userInfo) {
			$location.path('/');
		});	
	}
});