//require('../javascript/angular-socket-io-master/socket.js');


myApp.factory('UserFactory', function ($http) {
	var factory = {};
	var userID;
	
	if (sessionStorage.getItem('sessionID') != undefined) {
		userID = sessionStorage.getItem('sessionID');
	}
	
	factory.checkSession = function(callback) {
		factory.sessionID = sessionStorage.getItem('sessionID');
		// console.log(factory.sessionID);
		callback(factory.sessionID);
	}

	factory.loginUser = function(user, callback) {
		// console.log('at factory, user: ', user);
		$http.post('/loginUser', user).success(function(userFound) {
			userID = userFound[0].id;
			console.log(userFound[0]);

	     	var vendorID;
	     	//Check if the vendor status bool is true
	     	if (userFound[0].vendor_status) {
	     		console.log(userFound[0].user_vendor_id);
	     		vendorID = userFound[0].user_vendor_id;
	     		socket.emit("VendorLoggedIn", vendorID);
	     	}
            //console.log(socket);
            var userData = {"userID": userID, "vendorID": vendorID};
            // socket.emit("UserLoggedIn", userData);
            
            
	        console.log('here');
	        //$http.post('/userAuth', {userid: })
			// console.log(userFound[0].id);
			// console.log('made it back from database, userid: ', userFound[0].id);
			sessionStorage.setItem('sessionID', userFound[0].id);
			sessionStorage.setItem('sessionName', userFound[0].first_name);
			sessionStorage.setItem('sessionVendor_status', userFound[0].vendor_status);
			sessionStorage.setItem('sessionVendor_id', userFound[0].user_vendor_id);



			//$http.post('/userAuth', )

			callback(userFound);
		});
	}
	
	factory.logout = function(callback) {
		sessionStorage.clear();
		callback();
	}

	factory.returnUser = function(callback) {
		callback(userID);
	}

	factory.addUser = function(newUser, callback) {
		$http.post('/addUser', {first_name: newUser.first_name, last_name: newUser.last_name, email: newUser.email, password: newUser.password, phone: newUser.phone})
		.success(function (userInfo) {
			// console.log(userInfo);
			callback(userInfo);
		});
	}
	
	return factory;
});