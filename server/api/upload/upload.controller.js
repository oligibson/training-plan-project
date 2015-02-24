'use strict';

var _ = require('lodash');
var cloudinary = require('cloudinary');
var User = require('../user/user.model');
var email = require('../../components/emails/email.service');

cloudinary.config({ 
  cloud_name: 'trainingplan', 
  api_key: '226843548145894', 
  api_secret: 'HGPtI3Rms6RqQfTCSLpr872amVE' 
});

// Creates a new upload in the DB.
exports.profileUpload = function(req, res) {
  if(!req.files) { return res.send(404); }
  User.findById(req.params.userId, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    cloudinary.uploader.upload(req.files.photo.path, function(result) {
        if(user.profileImageId){
          cloudinary.uploader.destroy(user.profileImageId);
        }
        user.profileImage = result.url;
        user.mobileProfileImage = result.eager[0].url;
        user.profileImageId = result.public_id;
        user.save(function (err, user) {
          if (err) { return handleError(res, err); }
          return res.json(200, user);
        });
      }, {
      format: "jpg",
      width: 1000, 
      height: 1000,
      crop: "limit",
      tags: [ 'profile', user._id ],
      eager: {
        width: 140, 
        height: 140, 
        crop: "fill", 
        gravity: "face"
      }
    });
  });
};

exports.email = function(req, res) {
  email.sendEmail();
};

function handleError(res, err) {
  return res.send(500, err);
}