/*jslint node:true, es5:true, nomen: true, plusplus: true */
/*globals module*/
var
  authenticate = require('authenticate'),
  model = require('../models/model');

module.exports = function (app) {
  "use strict";

  app.use(authenticate.middleware({
    encrypt_key:  'aW{4rUdzZM0C8@m39jR8ZMqP9f*Mb3', // Add any key for encrypting data
    validate_key: '21sMEsriS<0iL(411n}#%?~F%gg54^'  // Add any key for signing data
  }));
  
};

module.exports.hasToken = function (req, res, next) {
  "use strict";
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication token required for this resource. Please set the x-access-token header in your request.',
      userMessage: 'Sorry, you must be logged in to access this page'
    });
    return;
  }
  
  /* Check date. Expire after 12hrs */
  var
    date = new Date(req.user.date),
    now  = new Date(),
    differenceMs = now.getTime() - date.getTime(),
    differenceHours = differenceMs / (1000 * 60 * 60);
  
  if (differenceHours > 12) {
    res.status(401).json({
      error: 'Token expired',
      userMessage: 'Sorry, you need to log in again to access this page.'
    });
    return;
  }
  
  return next();
};

module.exports.admin = function (req, res, next) {
  "use strict";
  module.exports.hasToken(req, res, function () {
    model.User.findById(req.user.user_id, function (err, user) {
      if (user.isAdmin) {
        return next();
      } else {
        res.status(403).json({error: 'You are not authorized to access this resource'});
      }
    });
    
  });
};

/* Allows the current user to view their own document, or admins to view any document */
module.exports.user = function (req, res, next) {
  "use strict";
  module.exports.hasToken(req, res, function () {
    if (req.user.user_id === req.params.id) {
      return next();
    } else {
      module.exports.admin(req, res, next);
    }
  });
};

module.exports.booking = function (req, res, next) {
  "use strict";
  module.exports.hasToken(req, res, function () {
    var
      userId    = model.getId(req.user.user_id),
      bookingId = model.getId(req.params.id);
    
    model.User.find({_id: userId, $or: [{isAdmin: true}, {bookings: {$elemMatch: { _id: bookingId }}}]}, function (err, users) {
      if (err) {
        res.status(500).json({error: err});
      }
      if (users.length > 0) {
        return next();
      } else {
        res.status(403).json({error: 'Access denied. You do not own this booking'});
      }
    });
  });
};

module.exports.request = function (req, res, next) {
  "use strict";
  module.exports.hasToken(req, res, function () {
    //if (req.user.extra_data.isAdmin) { return next(); }
    
    var
      userId    = model.getId(req.user.user_id),
      requestId = model.getId(req.params.id);
    
    model.User.find({_id: userId, $or: [{isAdmin: true}, {requests: {$elemMatch: { _id: requestId }}}]}, function (err, users) {
      if (err) {
        res.status(500).json({error: err});
      }
      if (users.length > 0) {
        return next();
      } else {
        res.status(403).json({error: 'Access denied. You do not own this request'});
      }
    });
  });
};
