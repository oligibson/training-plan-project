'use strict';

var _ = require('lodash');
var Model = require('./session.model');
var Session = Model.Session;
var Exercise = Model.Exercise;
var Set = Model.Set;
var User = require('../user/user.model');
var Statistics = require('../../components/statistics/statistics.service');

// Get list of sessions
exports.index = function(req, res) {
  Session.find(function (err, sessions) {
    if(err) { return handleError(res, err); }
    return res.json(200, sessions);
  });
};

// Get a single session
exports.getSession = function(req, res) {
  Session.findById(req.params.id, function (err, session) {
    if(err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    getTotalSessionsThisWeek('542fee894e51797a026a87ae');
    return res.json(session);
  });
};

// Gets all one users sessions
exports.getUserSessions = function (req, res) {
  Session.find({'userId' : req.params.id}, function (err, sessions){
    if (err) {
      res.json({error: err});
      return;
    }
    var transformedSessions = sessions.map(function(session) {
        return session.toJSON();
    });
    res.send(transformedSessions, 200);
  });
};

// Creates a new session in the DB.
exports.create = function(req, res) {
  if (req.body.id          === undefined ||
      req.body.date        === undefined ||
      req.body.activity    === undefined ||
      req.body.name        === undefined
      ){
    res.status(400).json({
      error: 'Some required parameters were not found. See documentation.'
    });
    return;
  }
  
  User.findById(req.body.id, function (err, user) {
      if (user == null) {
        res.json({ message: 'User not found' });
        return;
      }

      if (err) {
        res.json({error: err});
        return;
      }

      Session.create({
        userId      : req.body.id,
        name        : req.body.name,
        date        : req.body.date,
        activity    : req.body.activity,
        type        : req.body.type,
        completed   : false
      }, function (err, session) {
        if (err) { return handleError(res, err); }

        user.save(function (err, user) {
          if (err) { return handleError(res, err); }
          Statistics.getSessionNumber(session.userId, function(){
            Statistics.getLatestSession(session.userId, function(){
              Statistics.getTotalSessionsThisWeek(session.userId, function(){
                return res.json(200, session);
              });
            });
          });
        });
      });
    });
};

// Updates an existing session in the DB.
exports.update = function(req, res) {
  Session.findById(req.params.id, function (err, session) {
    if (err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    if(req.body.comments != undefined){
      session.comments = req.body.comments;
    }
    if(req.body.completed != undefined){
      session.completed = req.body.completed;
    }
    for(var j = 0; j < req.body.exercises.length; j++){
      var sets = [];
      for (var k = 0; k < req.body.exercises[j].sets.length; k++) {
        sets.push(new Set({
            reps        : req.body.exercises[j].sets[k].reps,
            weight      : req.body.exercises[j].sets[k].weight
        }));
      }
      session.exercises.push(new Exercise(
        {
          name        : req.body.exercises[j].name,
          setNo       : req.body.exercises[j].setNo,
          sets        : sets
        }
      ));
    }
    session.save(function (err) {
      if (err) { return handleError(res, err); }
      res.json(200, { message: 'Session updated!' });
    });
  });
};

// Deletes a session from the DB.
exports.destroy = function(req, res) {
  Session.findById(req.params.id, function (err, session) {
    if(err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    session.remove(function(err) {
      if(err) { return handleError(res, err); }
      Statistics.getSessionNumber(session.userId, function(){
        Statistics.getLatestSession(session.userId, function(){
          Statistics.getTotalSessionsThisWeek(session.userId, function(){
            return res.send(204);
          });
        });
      });
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

// Deletes all sessions associated to a user
exports.removeUserSessions = function (userId, callback) {
  Session.find({'userId' : userId}).remove(function (err, sessions){
    if(err) { return handleError(res, err); }
    callback();
  });
};