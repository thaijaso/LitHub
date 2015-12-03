myApp.controller('LandingsController', function ($scope, LandingFactory) {

	$scope.add = function(email) {
		LandingFactory.add(email, function() {

		});
	}
	
});