(function () {
  "use strict";

  var
    model    = require('../models/model'),
    exerciseProjection = model.Exercise.projection;

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

  function findExercises(match, project, errorCallback, doneCallback) {
    var aggregation = [
      { $unwind: '$sessions' },
      { $unwind: '$sessions.exercises' },
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

  exports.getExercisesAll = function (req, res) {
    findExercises({}, exerciseProjection, sendErrorFn(res), sendResultFn(res));
  };

  exports.getExercise = function (req, res) {
    findExercises({
      'sessions.exercises._id' : model.getId(req.params.id)
    }, exerciseProjection, sendErrorFn(res), sendResultFn(res));
  };
  
  //Rewrite this function to be more efficient! use model.update
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
    
    model.User.findById(req.params.userId, function (err, user) {

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
    model.User.update({
      'sessions.exercises._id': model.getId(req.params.id)
    },
    {$pull: {'sessions.$.exercises': {_id: model.getId(req.params.id)}}
    }, function(err, result){
      if (err) {
          res.json({error: err});
        }

      res.json({ message: 'Exercise deleted!' });
    });
  }

}());