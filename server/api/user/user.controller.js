'use strict';

// Your accountSid and authToken from twilio.com/user/account
var accountSid = 'AC679c38dc16d782faa231afb369f39a15';
var authToken = '3b0a89bb84341e73f64798d11a900abb';
var twilio = require('twilio')(accountSid, authToken);
var _ = require('lodash');
var User = require('./user.model');
var Session = require('../session/session.controller');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var email = require('../../components/emails/email.service');
var Statistics = require('../../components/statistics/statistics.service');

var validationError = function(res, err) {
  return res.json(422, err);
};

function sendText(user){
  twilio.messages.create({
      body: "We have a new user! Welcome " + user.fname + " " + user.lname + " - " + user.email,
      to: "+447922045992",
      from: "+441728752055"
  }, function(err, message) {
      if(err){console.log(err);}
  });
};

// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

exports.create = function (req, res, next) {
  if (req.body.email       === undefined ||
      req.body.password    === undefined ||
      req.body.fname       === undefined ||
      req.body.lname       === undefined
      ){
    res.status(400).json({
      error: 'Some required parameters were not found. See documentation.'
    });
    return;
  }
  var newUser = new User(req.body);
  newUser.role = 'user';
  newUser.sessionsThisWeek = 0;
  newUser.sessionsTotal = 0;
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*24*7 });
    user.salt = undefined;
    user.hashedPassword = undefined;
    res.json({ token: token, user: user });
    email.sendEmail('notification', 'Welcome to Training App', user, null);
    sendText(user);
  });
};

// Refreshes User Auth Token
exports.refresh = function(req, res, next) {
  var userId = req.user._id;
  var token = jwt.sign({_id: userId }, config.secrets.session, { expiresInMinutes: 60*24*7 });
  res.json({ token: token });
};

// Get a single user
exports.getUser = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    Statistics.getTotalSessionsThisWeek(user._id, function(newUser){
      newUser.salt = undefined;
      newUser.hashedPassword = undefined;
      return res.json(newUser);
    });
  });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }

    var
      fields = [
        'fname',
        'lname',
        'email',
        'city',
        'gender',
        'dob',
        'weight',
        'weightUnit',
        'role'
      ],
      i;
    
    for (i = 0; i < fields.length; ++i) {
      if (req.body[fields[i]] !== undefined) {
        user[fields[i]] = req.body[fields[i]];
      }
    }
    
    user.save(function (err) {
      if (err) { return handleError(res, err); }
      user.salt = undefined;
      user.hashedPassword = undefined;
      return res.json(200, user);
    });
  });
};

// Change a users password
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

// Deletes a user from the DB.
exports.destroy = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    user.remove(function(err) {
      if(err) { return handleError(res, err); }
      Session.removeUserSessions(req.params.id, function(){
        return res.send(204);
      });
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}