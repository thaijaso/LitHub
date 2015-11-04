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

		getItem: function(req, res) {
			pool.getConnection(function(err, connection) {
				connection.query("SELECT vendors.id as vendor_id, vendors.name as vendor_name, vendors.address, vendors.lat, vendors.lng, vendors.phone, vendors.DateCreated, strains.id as strain_id, vendors_has_strains.price_gram, vendors_has_strains.price_eigth, vendors_has_strains.price_quarter, vendors_has_strains.price_half, vendors_has_strains.price_oz, strains.leafly_id, strains.name as strain_name, strains.slug, strains.category, strains.symbol, strains.description, strains.star_image, strains.thumb_img1, strains.thumb_img2, strains.thumb_img3, strains.thumb_img4, strains.fullsize_img1, strains.fullsize_img2, strains.fullsize_img3, strains.fullsize_img4, strains.test_graph, strains.effects1, strains.effects2, strains.effects3, strains.effects4, strains.effects5, strains.medical1, strains.medical2, strains.medical3, strains.medical4, strains.medical5, strains.negatives1, strains.negatives2, strains.negatives3, strains.negatives4, strains.negatives5, strains.grow_difficulty FROM vendors JOIN vendors_has_strains ON vendors.id = vendors_has_strains.vendor_id JOIN strains ON strains.id = vendors_has_strains.strain_id WHERE vendors.id = " + req.params.vendorID + " AND strains.id = " + req.params.strainID, function (error, item, fields) {
					if (error) {
						console.log(error);
					} else {
						console.log(item);
						res.json(item);
					}
				});
				connection.release();
			});
		}
	}
})();