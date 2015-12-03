var mysql = require('mysql');
var pool = mysql.createPool({
  	host : 'us-cdbr-iron-east-03.cleardb.net',
  	user : 'bb08a4822ce4b1',
  	password : '10f0179b',
  	database: 'heroku_59370a6610ff7e4'
});

module.exports = (function() {
	return {
		addEmail: function(req, res) {
			var email = {email: req.body.email};
			pool.getConnection(function(err, connection) {
				connection.query("INSERT INTO emails SET ?, created_at = NOW(), updated_at = NOW()", email, function(error, success, fields) {
					if (error) {
						console.log(error);
					} else {
						console.log("email added successfully");
					}
				});
				connection.release();
			});
		}
	}
})();