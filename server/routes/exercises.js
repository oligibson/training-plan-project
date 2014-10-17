(function () {
  "use strict";

  var
    model    = require('../models/model');

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
  
  exports.createExercise = function (req, res) {
    
    if (req.body.userId      === undefined ||
        req.body.sessionId   === undefined ||
        req.body.name        === undefined ||
        req.body.setNo       === undefined
        ){
      res.status(400).json({
        error: 'Some required parameters were not found. See documentation.'
      });
      return;
    }
    
    model.User.findById(req.body.userId, function (err, user) {

        if (user === null) {
          res.json({ message: 'User not found' });
          return;
        }
  
        if (err) {
          res.json({error: err});
          return;
        }

        var sets = [];

        if(req.body.reps != undefined){

          for (var i = 0; i < req.body.setNo; ++i) {
            sets.push(new model.Set({
                reps        : req.body.reps
            }));
          }
        }

        var session = user.sessions.id(req.body.sessionId);
        
        session.exercises.push(new model.Exercise(
            {
              name        : req.body.name,
              setNo       : req.body.setNo,
              sets        : sets
            }
          ));

        user.save(function (err) {
          if (err) {
            res.json({error: err});
          }

          res.json({ message: 'Exercise created!' });
        });
    });
  }
  
  exports.deleteExercise = function (req, res) {
    model.Session.find({activity : 'gym'}, function (err, users) {
      console.log(users);
      /*
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
*/
    });
  };

}());