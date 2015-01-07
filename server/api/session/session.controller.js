'use strict';

var _ = require('lodash');
var Model = require('./session.model');
var Session = Model.Session;
var Exercise = Model.Exercise;
var Set = Model.Set;
var User = require('../user/user.model');

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getSessionNumber(userId, callback){
  // Count the number of sessions a user has
  Session.find({'userId' : userId}).count(function(err, count){
    if (err) { return handleError(res, err); }
    User.findById(userId, function (err, user) {
      if (err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      user.sessionsTotal = count;
      user.save(function (err) {
        if (err) { return handleError(res, err); }
        callback(user);
      });
    });
  });
}

function getLatestSession(userId, callback){
  Session.find({'userId' : userId}).sort({date: -1}).limit(1).exec(function (err, session){
    if (err) { return handleError(res, err); }
    User.findById(userId, function (err, user) {
      if (err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      user.lastSession = session[0].date;
      user.save(function (err, user) {
        if (err) { return handleError(res, err); }
        callback(user);
      });
    });
  });
};

function getTotalSessionsThisWeek(userId, callback){
  Session.find({'userId' : userId}).where('date').gt(getMonday(new Date())).count(function (err, count){
    if (err) { return handleError(res, err); }
    User.findById(userId, function (err, user) {
      if (err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      user.sessionsThisWeek = count;
      user.save(function (err, user) {
        if (err) { return handleError(res, err); }
        callback(user);
      });
    });
  });
}

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
    if (sessions.length < 1){
      res.send(404);
      return;
    }
    res.json(200, sessions);
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
          getSessionNumber(session.userId, function(){
            getLatestSession(session.userId, function(){
              getTotalSessionsThisWeek(session.userId, function(){
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
      getSessionNumber(session.userId, function(){
        getLatestSession(session.userId, function(){
          getTotalSessionsThisWeek(session.userId, function(){
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