var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var app = express();


var Parse = require('parse/node').Parse;

Parse.initialize("RWaJpkpPlTsVYwv6i8f0X0qJIKyEfHw8oGwxEERU", "jVpYXcdktcJ0iw8xVDJGx86BL4sLP5rbtkfvOvto");

//Jason's device token
//517e52af6bb639b207d530c54aa9cc55a9d46ab098ac05f25a55147acbfe098a
var query = new Parse.Query(Parse.Installation);
query.equalTo("deviceToken", "517e52af6bb639b207d530c54aa9cc55a9d46ab098ac05f25a55147acbfe098a");



Parse.Push.send({
    where: query,
    data: {
        alert: "this one is working"
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
		clients[socket.id] = {"loggedIn": false, "userID": null, "vendorID": null, "deviceToken": null};
		
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
                    clients[key].deviceToken = userData.deviceToken;

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
			//console.log('server:: vendor made it available');
			//console.log('userId:', userId);
			for (key in clients) {
                if (clients[key].userID == userId) {
                    //console.log("user found at key, ", key);
                    var socketId = key;
                    io.to(socketId).emit("MadeAvailable");
                    // var query = new Parse.Query(Parse.Installation);
                    // query.equalTo("deviceToken", "517e52af6bb639b207d530c54aa9cc55a9d46ab098ac05f25a55147acbfe098a");

 
                    // console.log("attempting to send push notification");
                    // //send push notification
                    // var deviceToken = clients[key].deviceToken;
                    // console.log("this is the deviceToken: ", deviceToken);
                    
                    // var query = new Parse.Query(Parse.Installation);
                    // query.equalTo("deviceToken", "517e52af6bb639b207d530c54aa9cc55a9d46ab098ac05f25a55147acbfe098a");


                    // Parse.Push.send({
                    //     where: query,
                    //     data: {
                    //         alert: "this one isn't working"
                    //     }
                    // }, {
                    //     success: function() {
                    //         // Push was successful
                    //         console.log("push was succesful");
                    //     },
                    //     error: function(error) {
                    //         console.log(error);
                    //     }
                    // });
                }
            }
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









