'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  fname           	: {type : String, default: ''},
  lname           	: {type : String, default: ''},
  email           	: {type : String, default: ''},
  city				: {type : String},
  country			: {type : String},
  gender			: {type : String},
  dob			    : {type : Date},
  weight			: {type : Number},
  weightUnit		: {type : String},
  sessionsTotal   	: {type : Number},
  lastSession     	: {type : Date},
  sessionsThisWeek	: {type : Number},
  isAdmin         	: {type : Boolean, default: false},
  profileImageId	: {type : String},
  profileImage    	: {type : String},
  mobileProfileImage: {type : String}
});

module.exports = mongoose.model('User', UserSchema);