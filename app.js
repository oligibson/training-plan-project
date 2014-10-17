/*jslint node:true, es5:true, nomen: true*/
/*global require, process*/

// app.js
// This file contains the server side JavaScript code for your application.

// set up =====================================================================
var port           = process.env.PORT || 8080;                  // Set the port
var express        = require('express');                        // Import express
var mongoose       = require('mongoose');                       // Mongoose for mongodb
var constants      = require('./server/utils/constants');       // Load the database config
var morgan         = require('morgan');                         // Used for logging
var bodyParser     = require('body-parser');                    // 
var app            = express();                                 // Create our app with express

// configuration ==============================================================
mongoose.connect(constants.DBurl);                              // Connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // Set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // Log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));           // Parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // Parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // Parse application/vnd.api+json as json

// authentication =============================================================
/*
var permissions = require('./server/permissions/permissions.js');

permissions(app);
*/
// routes =====================================================================
require('./server/routes.js')(app); /* permissions */
//require('./server/routes.js')(app);
app.use('/', express.static(__dirname + '/public/'));

// listen (start app with node server.js) =====================================
app.listen(port);
console.log("App listening on port " + port);

