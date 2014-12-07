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
        if (user == null) {
          res.json({ message: 'User not found' });
          return;
        }
  
        if (err) {
          res.json({error: err});
          return;
        }

        model.Session.create({
          userId      : model.getId(req.body.id),
          date        : req.body.date,
          activity    : req.body.activity,
          type        : req.body.type,
          completed   : false
        }, function (err, session) {
          if (err) {
            res.json({error: err});
          }

          user.sessionsTotal += 1;

          user.save(function (err) {
            if (err) {
              res.json({error: err});
            }
          });

          res.json(session);
        });
      });
  };

  exports.getSession = function (req, res) {
    model.Session.findById(req.params.id, function (err, session){
      if(err){
        res.json({error: err});
        return;
      }
      res.json(session);
    });
  };

  exports.getUserSessions = function (req, res) {
    model.Session.find({'userId' : model.getId(req.params.id)}, function (err, sessions){
      if (err) {
        res.json({error: err});
        return;
      }
      if (sessions.length < 1){
        res.json({ message: 'No Sessions Found'});
        return;
      }
      res.json(sessions);
    });
  };

  exports.modifySession = function (req, res) {

    model.Session.findById(model.getId(req.params.id), function (err, session) {

      if (err) {
        res.json({error: err});
        return;
      }
      
      if (session == undefined) {
        res.json({ message: 'Session not found' });
        return;
      }

      if(req.body.comments != undefined){
        session.comments = req.body.comments;
      }

      if(req.body.completed != undefined){
        session.completed = req.body.completed;
      }

      for(var j = 0; j < req.body.exercises.length; j++){

        var sets = [];

        for (var k = 0; k < req.body.exercises[j].sets.length; k++) {
          sets.push(new model.Set({
              reps        : req.body.exercises[j].sets[k].reps,
              weight      : req.body.exercises[j].sets[k].weight
          }));
        }

        session.exercises.push(new model.Exercise(
          {
            name        : req.body.exercises[j].name,
            setNo       : req.body.exercises[j].setNo,
            sets        : sets
          }
        ));
      }

      session.save(function (err) {
        if (err) {
          res.json({error: err});
          return;
        }

        res.json({ message: 'Session updated!' });
      });
    });
  };


  exports.deleteSession = function (req, res) {
    model.Session.findById(model.getId(req.params.id), function (err, session){
      if(session == undefined){
        res.json({ message: 'Session not found' });
        return;
      }

      if (err) {
        res.json({error: err});
        return;
      }

      session.remove(function (err, result) {
        if (err) {
          res.json({error: err});
          return;
        }
        res.json({ message: 'Session deleted!' });
      });

    });
  };

}());