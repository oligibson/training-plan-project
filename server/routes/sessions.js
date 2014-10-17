/*jslint node:true, es5:true, nomen: true, plusplus: true */
/*globals module*/

(function () {
  "use strict";

  var
    model    = require('../models/model'),
    sessionProjection = model.Session.projection,
    crypto   = require('crypto'),
    sendmail = require('sendmail')({logger: {
      debug: function () {},
      info: function () {},
      warn: console.warn,
      error: console.error
    }});

  function sendErrorFn(res) {
    return function (err) {
      res.json({error: err});
    };
  }
  function sendResultFn(res) {
    return function (result) {
      res.json(result);
    };
  }

  function findSessions(match, project, errorCallback, doneCallback) {
    var aggregation = [
      { $unwind: '$sessions' },
      { $match: match }
    ];
    
    if (project !== null) {
      aggregation.push({ $project: project });
    }
    
    model.User.aggregate(aggregation, function (err, result) {
      if (err) {
        errorCallback(err);
        return;
      }
      doneCallback(result);
    });
  }
  
  exports.createSession = function (req, res) {
    
    if (req.body.id          === undefined ||
        req.body.date        === undefined ||
        req.body.activity    === undefined
        ){
      res.status(400).json({
        error: 'Some required parameters were not found. See documentation.'
      });
      return;
    }
    
    model.User.findById(req.body.id, function (err, user) {
        if (user === null) {
          res.json({ message: 'User not found' });
          return;
        }
  
        if (err) {
          res.json({error: err});
          return;
        }

        user.sessions.push(new model.Session(
          {
            date        : req.body.date,
            activity    : req.body.activity,
            type        : req.body.type,
            completed   : false
          }
        ));

        user.sessionsTotal += 1;

        user.save(function (err) {
          if (err) {
            res.json({error: err});
          }
  
          res.json({ message: 'Session created!' });
        });
      });
  };

  exports.getSession = function (req, res) {
    findSessions({
      'sessions._id' : model.getId(req.params.id)
    }, sessionProjection, sendErrorFn(res), sendResultFn(res));
  };

  exports.modifySession = function (req, res) {

    model.User.findOne({'sessions._id' : model.getId(req.params.id)}, function (err, user) {
      var
        fields = [
          'comments',
          'completed'
        ],
        i, session;
      
      if (err) {
        res.json({error: err});
        return;
      }
      
      if (user === undefined) {
        res.json({ message: 'Session not found' });
        return;
      }

      session = user.sessions.id(req.params.id);
      
      for (i = 0; i < fields.length; ++i) {
        if (req.body[fields[i]] !== undefined) {
          session[fields[i]] = req.body[fields[i]];
        }
      }
      user.save(function (err) {
        if (err) {
          res.json({error: err});
          return;
        }

        res.json({ message: 'Session updated!' });
      });
    });
  };


  exports.deleteSession = function (req, res) {
    model.User.find({'sessions._id' : model.getId(req.params.id)}, function (err, users) {
      var
        user = users[0];
      if (user === undefined) {
        res.json({ message: 'Session not found' });
        return;
      }
      
      if (err) {
        res.json({error: err});
        return;
      }
      
      user.sessions.pull({'_id': model.getId(req.params.id)});

      user.sessionsTotal -= 1;
      
      user.save(function (err) {
        if (err) {
          res.json({error: err});
        }

        res.json({ message: 'Session deleted!' });
      });
    });
  };

}());