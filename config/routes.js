var strains = require('./../server/controllers/strains_controller');
var straindetails = require('./../server/controllers/strain_details_controller');
var users = require('./../server/controllers/users_controller');
var reservations = require('./../server/controllers/reservations_controller');
var vendors = require('./../server/controllers/vendors_controller');
var dispensaries = require('./../server/controllers/dispensaries_controller');
var landings = require('./../server/controllers/landings_controller');
var parse = require('./../server/controllers/parse_controller');

//var session = require('express-session');

module.exports = function(app) {
	
	app.get('/', function(req, res) {
		res.render('index');
	});

	app.get('/getStrains', function(req, res) {
		strains.show(req, res);
	});

	app.post('/loginUser', function(req, res) {
		console.log(req.session);
		users.find(req, res);
	});

	// This is a logout function for iOS users who must use express session
	app.post('/logoutUser', function(req, res){
		req.session.destroy()
	});

	// This is a function to check which user is logged in. For now this is only used for iOS.
	app.get('/currentUser', function(req, res) {
		var jsonObject = {
			email: req.session.email,
			id: req.session.user_id
		}
		console.log('routes session var: ', req.session);
		res.json(jsonObject)
	});
	
	app.post('/addUser', function(req, res) {
		console.log(req.body, "adding user")
		users.add(req, res)
	});

	// This is for the 'ajax-like' email is unique validation in iOS
	app.post('/findUser', function(req, res) {
		users.findOne(req,res)
	});

	app.post('/getReservations', function(req, res) {
		reservations.retrieve(req, res);
	});

	app.post('/getVendorReservations/:id', function(req, res) {
		vendors.getReservations(req, res);
	});

	app.get('/getMenu/:id', function(req, res) {
		vendors.getMenu(req, res);
	});

	app.get('/dispensaries', function(req, res) {
		dispensaries.get(req, res);
	});

	app.get('/strains/next', function(req, res) {
		strains.getPage(req, res);
	});

	app.post('/cancelOrder', function(req, res) {
		reservations.cancel(req, res);
	});

	app.post('/addOrder', function(req, res) {
		console.log(req.body)
		reservations.add(req, res);
	});

	app.post('/orderComplete', function(req, res) {
		console.log("request to complete order")
		reservations.complete(req, res);
	});

	app.get('/getItem/:vendorID/:strainID', function(req, res) {
		straindetails.getItem(req, res);
	});

	app.post('/available', function(req, res) {
		vendors.available(req, res);
	});

	app.post('/unavailable', function(req, res) {
		vendors.unavailable(req, res);
	});

	app.post('/getUserIdForReservation', function(req, res) {
		reservations.getUserID(req, res);
	});

	app.post('/reservationPickedUp', function(req, res) {
		vendors.pickedUp(req, res);
	});

	app.post('/addEmail', function(req, res) {
		console.log("at routes");
		landings.addEmail(req, res);
	});

	app.post('/reservationAvailable', function(req, res) {
		console.log("Reservation is available")
		parse.reservationAvailable(req, res);
	});

}









