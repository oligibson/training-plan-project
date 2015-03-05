'use strict';

var User = require('../../api/user/user.model');
var Session = require('../../api/session/session.model').Session;

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function handleError(res, err) {
  return res.send(500, err);
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

exports.getSessionNumber = getSessionNumber;
exports.getLatestSession = getLatestSession;
exports.getTotalSessionsThisWeek = getTotalSessionsThisWeek;