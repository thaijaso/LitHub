var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

var app = express();

// //Hardcorded device token
// var token = "d31b8d0c47b9d1964f3903444e6280004de61f8b5abd468220716c22ccf87db0";

// var apns = require("apns"), options, connection, notification;
 
// options = {
//    keyFile : "./config/key.pem",
//    certFile : "./config/cert.pem",
//    debug : true
// };
 
// connection = new apns.Connection(options);
 
// notification = new apns.Notification();
// notification.device = new apns.Device(token);
// notification.alert = "Hello World !";
 
// connection.sendNotification(notification);

//End notifications

//global
app.use(bodyParser.urlencoded());
app.use(session({secret: '123'}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));
app.set('port', process.env.PORT || 8888);


require('./config/routes.js')(app);

var server = app.listen(app.get('port'), function() {
		console.log('listening on port: ', app.get('port'));
});

var io = require('socket.io').listen(server);
var clients = {};


io.sockets.on('connection', function (socket) {
	//console.log('SERVER::WE ARE USING SOCKETS!');
		console.log("socketId:", socket.id);
		clients[socket.id] = {"loggedIn": false, "userID": null, "vendorID": null};
		
        socket.on('UserLoggedIn', function (userData) {
            console.log(userData);
            //console.log(socket.id);
            //this might take a while if hella niggas are on
            for (key in clients) {
                if (key == socket.id) {
                    console.log("socket found at key: ", key)
                    clients[key].loggedIn = true;
                    clients[key].userID = userData.userID;
                    clients[key].vendorID = userData.vendorID;

                }
            }
            console.log(clients);
        });
	
	
		socket.on('PlaceResvButtonPressed', function (vendorID) {
			console.log("server:: ios button pressed");
            console.log("this is the vendorID ", vendorID);
			// this emits to all connected vendors, should only emit to one vendor
			// Create key value pair
			// append to clients array
            var socketid;
            for (key in clients) {
                if (clients[key].vendorID == vendorID) {
                    //console.log("vendor found at key", key)
                    socketid = key;
                    io.to(socketid).emit("UpdateReservations");
                } 
            }
            
			//io.sockets.connected[socketid].emit('UpdateReservations');
		});

		socket.on('MakeAvailable', function (userId) {
			console.log('server:: vendor made it available');
			console.log('userId:', userId);
			for (key in clients) {
                if (clients[key].userID == userId) {
                    console.log("user found at key, ", key);
                    var socketId = key;
                    io.to(socketId).emit("MadeAvailable");
                }
            }

            //io.to(socketid).emit('message', 'for your eyes only');
		});

        socket.on('PickedUp', function (userId) {
            console.log('server: user picked up from vendor');
            console.log('userId: ', userId);
            for (key in clients) {
                if (clients[key].userID == userId) {
                    console.log("user found at key, ", key);
                    var socketId = key;
                    io.to(socketId).emit("PickedUp");
                }
            }
        });

        socket.on('OrderCompleted', function (vendorId) {
            console.log('server: user completed order');
            for (key in clients) {
                if (clients[key].vendorID == vendorId) {
                    console.log("vendor found at key, ", key);
                    var socketId = key;
                    io.to(socketId).emit("UpdateReservations");
                }
            }
        });

        socket.on('disconnect', function() {
            console.log("socket id disconnecting: ", socket.id);
            delete clients[socket.id];
            console.log(clients);

        });
});









