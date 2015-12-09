var Parse = require('parse/node').Parse;

Parse.initialize("RWaJpkpPlTsVYwv6i8f0X0qJIKyEfHw8oGwxEERU", "jVpYXcdktcJ0iw8xVDJGx86BL4sLP5rbtkfvOvto");

module.exports = (function() {
	return {
		reservationAvailable: function(req, res) {
			//Get the device token
			var deviceToken = req.body.deviceToken;

			var query = new Parse.Query(Parse.Installation);
			query.equalTo("deviceToken", deviceToken);
			//Send the push
			Parse.Push.send({
    			where: query,
    			data: {
        			alert: "Your order is ready for pick-up!"
    			}
			}, {
    			success: function() {
        			// Push was successful
        			console.log("push was succesful");
    			},
    			error: function(error) {
        			console.log(error);
    			}
			});
		},
		orderCompleted: function(req, res) {
			
		}	
	}
})();