var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var app = express();


var Parse = require('parse/node');

Parse.initialize("RWaJpkpPlTsVYwv6i8f0X0qJIKyEfHw8oGwxEERU", "jVpYXcdktcJ0iw8xVDJGx86BL4sLP5rbtkfvOvto");

//Jason's device token
//517e52af6bb639b207d530c54aa9cc55a9d46ab098ac05f25a55147acbfe098a
// var query = new Parse.Query(Parse.Installation);
// query.equalTo("deviceToken", "517e52af6bb639b207d530c54aa9cc55a9d46ab098ac05f25a55147acbfe098a");



// Parse.Push.send({
//     where: query,
//     data: {
//         alert: "this one is working"
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
var devices = [];


io.sockets.on('connection', function (socket) {
	//console.log('SERVER::WE ARE USING SOCKETS!');
		console.log("socketId:", socket.id);
		clients[socket.id] = {"loggedIn": false, "userID": null, "vendorID": null, "device_id": null};
		
        // socket.on('UserLoggedIn', function (userData) {
        //     console.log(userData);
        //     //console.log(socket.id);
        //     //this might take a while if hella niggas are on
        //     for (key in clients) {
        //         if (key == socket.id) {
        //             console.log("socket found at key: ", key)
        //             clients[key].loggedIn = true;
        //             clients[key].userID = userData.userID;
        //             clients[key].vendorID = userData.vendorID;
        //             clients[key].deviceToken = userData.deviceToken;

        //         }
        //     }
        //     console.log(clients);
        // });

        socket.on('VendorLoggedIn', function (vendorID) {
            //Looking through all the connected clients
            for (vendorSocketID in clients) {
                //If the socket id from which this was sent matches a socket id in the connected clients
                //add the the vendor id to it
                if (vendorSocketID == socket.id) {
                    clients[vendorSocketID].loggedIn = true;
                    clients[vendorSocketID].vendorID = vendorID;
                    console.log('Found a socket that matches the vendor: ', clients[vendorSocketID])
                }
            }
        });

        socket.on('UserLoggedIn', function (userInfo) {
            //Makes sure that the devicetoken isnt empty or push notifs wont work
            if (userInfo["device_id"] != undefined) {
                console.log('There is a new user on the app: ', userInfo["device_id"]);
                console.log(userInfo);

                for (UserSocketID in clients) {
                    if (UserSocketID == socket.id) {
                        clients[UserSocketID].loggedIn = true;
                        clients[UserSocketID].userID = userInfo["userID"];
                        clients[UserSocketID].device_id = userInfo["device_id"];
                        devices.push(clients[UserSocketID]);
                        console.log('These are the current connected devices: ', devices);
                    }
                }
                // devices[socket.id].loggedIn = true;
                // devices[socket.id].userID = userInfo["userID"];
                // devices[socket.id].device_id = userInfo["device_id"];
            }
        });
	
	
		socket.on('PlaceResvButtonPressed', function (orderInfo) {
			console.log("server:: ios button pressed");
            console.log("this is the vendorID ", orderInfo["vendor_id"]);
			// this emits to all connected vendors, should only emit to one vendor
			// Create key value pair
			// append to clients array
            var socketid;
            for (key in clients) {
                if (clients[key].vendorID == orderInfo["vendor_id"]) {
                    //console.log("vendor found at key", key)
                    socketid = key;
                    io.to(socketid).emit("UpdateReservations");
                } 
            }
            
			//io.sockets.connected[socketid].emit('UpdateReservations');
		});

        //New reservation submitted from iOS
        socket.on('NewReservation', function (orderData) {
            //Order data send should contain the device id and vendor ID
            console.log('iOS has submitted a new order: ', orderData);
            if (orderData["vendor_id"] != "nil" && orderData["device_id"] != "nil") {
                //This forloop is to find the vendor the order belongs to an emit to them
                for (vendorSocketID in clients) {
                    if (clients[vendorSocketID].vendorID == orderData["vendor_id"]) {
                        // var deviceToken = orderData["device_token"];
                        io.to(vendorSocketID).emit("UpdateReservations");
                    }
                }
            }
        });

        //Vendor made the order available for pickup
		socket.on('MakeAvailable', function (userInfo) {
			console.log('server:: vendor made it available');
			console.log("this is userInfo, ", userInfo);
            
            var userId = userInfo.userId
            var deviceId = userInfo.deviceId;
            
            //send push notification
            Parse.Push.send({
                channels: [deviceId],
                data: {
                    alert: "Your order is available for pick-up!"
                }
            }, {
                success: function() {
                // Push was successful
                    console.log('Successfully told iOS device that order is ready');
                },
                error: function(error) {
                // Handle error
                    console.log('We received an error: ', error);
                }
            });

            //send made available event to ios
            for (key in clients) {
                if (clients[key].userID == userId) {
                    console.log("user found at key, ", key);
                    var socketId = key;
                    io.to(socketId).emit("MadeAvailable");
                } else {
                    console.log("device not connected");
                }
            }
		});

        socket.on('PickedUp', function (userId) {
            console.log('server: user picked up from vendor');
            console.log('userId: ', userId);

            //send socket event to ios
            for (key in clients) {
                if (clients[key].userID == userId) {
                    console.log("user found at key, ", key);
                    var socketId = key;
                    io.to(socketId).emit("PickedUp");
                }
            }

            //send push notification
            // var deviceToPush = clients[key].deviceToken;
            // var query = new Parse.Query(Parse.Installation);
            // query.equalTo("deviceToken", deviceToPush);
            // Parse.Push.send({
            //     where: query,
            //     data: {
            //         alert: "You picked up your order! Please rate your experience."
            //     }
            // }, {
            //     success: function() {
            //         // Push was successful
            //         console.log("push was succesful to token: ", deviceToPush);
            //     },
            //     error: function(error) {
            //         console.log(error);
            //     }
            // }); 
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









