'use strict';

var _ = require('lodash');
var User = require('./user.model');
var Session = require('../session/session.controller');

// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
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
        'isAdmin'
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