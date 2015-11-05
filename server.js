var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

var app = express();

//Hardcorded device token
var token = "d31b8d0c47b9d1964f3903444e6280004de61f8b5abd468220716c22ccf87db0";

var apns = require("apns"), options, connection, notification;
 
options = {
   keyFile : "./config/key.pem",
   certFile : "./config/cert.pem",
   debug : true
};
 
connection = new apns.Connection(options);
 
notification = new apns.Notification();
notification.device = new apns.Device(token);
notification.alert = "Hello World !";
 
connection.sendNotification(notification);

//End notifications

app.use(bodyParser.urlencoded());
app.use(session({secret: '123'}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));
app.set('port', process.env.PORT || 8888);


require('./config/routes.js')(app);

app.listen(app.get('port'), function() {
  	console.log('listening on port: ', app.get('port'));
});
