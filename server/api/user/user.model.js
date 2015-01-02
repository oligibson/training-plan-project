'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  fname           : {type : String, default: ''},
  lname           : {type : String, default: ''},
  email           : {type : String, default: ''},
  sessionsTotal   : {type : Number},
  lastSession     : {type : Date},
  isAdmin         : {type : Boolean, default: false}
});

module.exports = mongoose.model('User', UserSchema);