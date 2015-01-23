'use strict';

var _ = require('lodash');
var User = require('./user.model');
var Session = require('../session/session.controller');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  console.log(newUser);
  newUser.role = 'user';
  newUser.sessionsThisWeek = 0;
  newUser.sessionsTotal = 0;
  console.log(newUser);
  newUser.save(function(err, user) {
    console.log(err);
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

// Get a single user
exports.getUser = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
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