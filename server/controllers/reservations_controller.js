var mysql = require('mysql');
var pool = mysql.createPool({
  	host : 'us-cdbr-iron-east-03.cleardb.net',
  	user : 'bb08a4822ce4b1',
  	password : '10f0179b',
  	database: 'heroku_59370a6610ff7e4'
});

//connection.connect();

module.exports = (function() {
	return {
		retrieve: function(req, res) {
			console.log("this is req.body.id", req.body.id)
			pool.getConnection(function(err, connection) {
				//connection.query("SELECT * FROM reservations WHERE ")
				connection.query("SELECT users.first_name, users.last_name, vendors.name as vendor, vendors_has_strains.price_gram, vendors_has_strains.price_eigth, vendors_has_strains.price_quarter, vendors_has_strains.price_half, vendors_has_strains.price_oz, reservations.quantity_gram, reservations.quantity_eigth, reservations.quantity_quarter, reservations.quantity_half, reservations.quantity_oz, strains.name, strains.category, reservations.status, reservations.id, reservations.strain_id, reservations.vendor_id, reservations.created_at, reservations.updated_at FROM reservations JOIN users ON users.id = reservations.user_id JOIN vendors ON vendors.id = reservations.vendor_id JOIN vendors_has_strains ON vendors_has_strains.strain_id = reservations.strain_id AND vendors_has_strains.vendor_id = reservations.vendor_id JOIN strains ON strains.id = vendors_has_strains.strain_id WHERE reservations.user_id = " + req.body.id + " AND reservations.status != 3",
				function(error, reservations, fields) {
					if (error) {
						console.log(error);
					} else {
						//console.log(reservations)
						//console.log(reservations);
						res.json(reservations);
					}
				});
				connection.release();
			});
		},

		cancel: function(req, res) {
			pool.getConnection(function(err, connection) {
				connection.query("DELETE FROM reservations WHERE reservations.id = " + "'" + req.body.id + "'",
				function(error, reservations, fields) {
					if (error) {
						console.log(error);
					} else {
						res.json({});
					}
				});
				connection.release();
			});
		},

		add: function(req, res) {
			var post = {user_id: req.body.user_id, vendor_id: req.body.vendor_id, quantity_gram: req.body.quantity_gram, quantity_eigth: req.body.quantity_eigth, quantity_quarter: req.body.quantity_quarter, quantity_half: req.body.quantity_half, quantity_oz: req.body.quantity_oz, status: 0, strain_id: req.body.strain_id};
			pool.getConnection(function(err, connection) {
				connection.query("INSERT INTO reservations SET ?, created_at = NOW(), updated_at = NOW()", post, function(error, reservations, fields) {
					if (error) {
						console.log(error);
					} else {
						connection.query("SELECT LAST_INSERT_ID()", function(error, result) {
							if (error) {
								console.log(error);
							} else {
								res.json(result);
							}
						})
						//Since a new reservation was added, we need to somehow alert the specific vendor

					}
				});
				connection.release();
			});
		},

		getAll: function(req, res) {
			pool.getConnection(function(err, connection) {
				connection.query("SELECT users.first_name, users.last_name, vendors.name as vendor, vendors_has_strains.price_gram, reservations.quantity_gram, reservations.quantity_eigth, reservations.quantity_quarter, reservations.quantity_half, reservations.quantity_oz, strains.name, strains.category, reservations.status, reservations.id, reservations.strain_id FROM reservations JOIN users ON users.id = reservations.user_id JOIN vendors ON vendors.id = reservations.vendor_id JOIN vendors_has_strains ON vendors_has_strains.strain_id = reservations.strain_id JOIN strains ON strains.id = vendors_has_strains.strain_id  GROUP BY reservations.id;", function(error, reservations, fields) {
					if (error) {
						console.log(error);
					} else {
						res.json(reservations);
					}
				});
				connection.release();
			});
		},

		getUserID: function(req, res) {
			console.log("in reserv control, this is resrv id", req.body.reservationId);
			pool.getConnection(function(err, connection) {
				connection.query("SELECT user_id FROM reservations WHERE reservations.id = " + "'" + req.body.reservationId + "'", function(error, userId, fields){
					if (error) {
						console.log(error);
					} else {
						res.json(userId);
					}
				});
				connection.release();
			});
		},

		complete: function(req, res) {
			console.log("in controller, userId: ", req.body.userId);
			pool.getConnection(function(err, connection) {
				connection.query("UPDATE reservations SET status = 3 WHERE reservations.user_id = " + req.body.userId, function(error, reservations, fields) {
					if (error) {
						console.log(error);
					} else {
						res.json({});
					}
				});
			});
		}
	}
})();