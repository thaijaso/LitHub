myApp.factory('LandingFactory', function ($http) {
	
	var factory = {};

	factory.add = function(email, callback) {
		$http.post('/addEmail', {email: email}).success(function(){

		});
	}

	return factory;
	
});