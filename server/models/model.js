/*jslint node:true, es5:true, nomen: true, plusplus: true */
/*globals module*/
var mongoose = exports.mongoose = require('mongoose');

var session = new mongoose.Schema({
  userId      : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date        : {type : Date},
  activity    : {type : String, default: ''},
  type        : {type : String, default: ''},
  comments    : {type : String, default: ''},
  completed   : {type : Boolean, default: true},
  exercises   : [exercise]
});

var exercise = new mongoose.Schema({
  name        : {type : String, default: ''},
  setNo       : {type : Number}, 
  sets        : [set],
  completed   : {type : Boolean, default: false}
});

var set = new mongoose.Schema({
  reps        : {type : String, default: ''},
  weight      : {type : Number, default: 0},
  completed   : {type : Boolean, default: false}
});

var user = new mongoose.Schema({
  fname           : {type : String, default: ''},
  lname           : {type : String, default: ''},
  email           : {type : String, default: ''},
  sessionsTotal   : {type : Number},
  isAdmin         : {type : Boolean, default: false},
  password        : {type : String},
  sessions        : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }]
});

exports.Session   = mongoose.model('Session',  session);
exports.Exercise  = mongoose.model('Exercise', exercise);
exports.Set       = mongoose.model('Set',      set);
exports.User      = mongoose.model('User',     user);

exports.Exercise.projection = {
  _id:         '$exercises._id',
  sessionId:   '$_id',
  name:        '$exercises.name',
  completed:   '$exercises.completed',
  sets:        '$exercises.sets',  
};

exports.getId = function (id) {
  "use strict";
  try {
    return mongoose.Types.ObjectId(id);
  } catch (ex) {
    console.log(ex);
    return null;
  }
};