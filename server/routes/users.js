/*jslint node:true, es5:true, nomen: true, plusplus: true */
/*globals module*/

(function () {
  "use strict";
  var
    model    = require('../models/model'),
    crypto   = require('crypto'),
    sendmail = require('sendmail')({logger: {
      debug: function () {},
      info: function () {},
      warn: console.warn,
      error: console.error
    }});

  exports.getUsers = function (req, res) {
    model.User.find(function (err, users) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(users);
    });
  };
  
  exports.getUser = function (req, res) {
    model.User.findById(model.getId(req.params.id), function (err, user) {
      if (user === null) {
        res.json({ message: 'User not found' });
        return;
      }
      
      if (err) {
        res.json({error: err});
        return;
      }

      res.json(user);
    });
  };
  
  exports.getUserSessions = function (req, res) {
    model.User.aggregate([
      { $match: {'_id' : model.getId(req.params.id)}},
      { $unwind: '$sessions' },
      {
        $project: model.Session.projection
      }
    ], function (err, sessions) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(sessions);
    });
  };
  
  function sendPassword(email, password, message) {
    if (message === undefined) {
      message = 'Desk Booking Access Code';
    }
    
    sendmail({
      from: 'ilabs@uk.ibm.com',
      to: email,
      subject: message,
      content: 'Your access code for the desk booking system is :  ' + password + '  . Please keep this somewhere safe!'
    }, function (err, reply) { console.log('Sent password email'); });
  }

  exports.createUser = function (req, res) {
    /* User is assigned a password and they should NOT be able to change it -
       This prevents people using their intranet password which would then be
       stored in our system.
       
       Since access control is not a major issue and the passwords are random, 
       we will not hash the passwords */
    if (req.body.email === undefined) {
      res.json({error: 'No email provided - cannot create user'});
      return;
    }
    
    /* Check email isn't already registered */
    model.User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
      if (err) {
        res.status(500).json({error: err});
        return;
      }
      
      if (user === null) {
        /* Generates password */
        crypto.randomBytes(4, function (ex, buf) {
          var password = buf.toString('hex');
  
          /* Creates user */
          model.User.create({
            fname           : req.body.fname,
            lname           : req.body.lname,
            email           : req.body.email.toLowerCase(),
            sessionsTotal   : 0,
            isAdmin         : 0,
            sessions        : [],
            password        : password
          }, function (err, user) {
            if (err) {
              res.json({error: err});
            }
            
            /* Emails password through */
  
            sendPassword(req.body.email, password);
  
            res.json(user);
          });
        });
      } else {
        res.status(409).json({
          error: 'User already exists!',
          message: 'Sorry, this email is already registered.',
          userId: user._id
        });
      }
    });
  };
  /*
  exports.newPassword = function (req, res) {
    crypto.randomBytes(4, function (ex, buf) {
      var password = buf.toString('hex');
      
      model.User.findOne({'email': req.body.email}, function (err, user) {
        if (user === null) {
          res.json({ error: 'User not found' });
          return;
        }
        
        if (err) {
          res.json({error: err});
          return;
        }
        
        user.password = password;
        
        user.save(function (err) {
          if (err) {
            res.json({error: err});
            return;
          }
          
          sendPassword(req.body.email, password, "Desk booking - password reset");
          res.json({result: 'success'});
        });
      });
    });
  };
  */
  exports.modifyUser = function (req, res) {
    model.User.findById(model.getId(req.params.id), function (err, user) {
      if (user === null) {
        res.json({ error: 'User not found' });
        return;
      }
      
      if (err) {
        res.json({error: err});
        return;
      }

      var
        fields = [
          'fname',
          'lname',
          'email',
          'isAdmin'
        ],
        i;
      
      for (i = 0; i < fields.length; ++i) {
        if (req.body[fields[i]] !== undefined) {
          user[fields[i]] = req.body[fields[i]];
        }
      }
      
      user.save(function (err) {
        if (err) {
          res.json({error: err});
        }

        res.json({ message: 'User updated!' });
      });
    });
  };

  exports.deleteUser = function (req, res) {
    model.User.remove({
      _id: model.getId(req.params.id)
    }, function (err, user) {
      if (err) {
        res.json({error: err});
        return;
      }

      res.json({ message: 'Successfully deleted' });
    });
  };
}());