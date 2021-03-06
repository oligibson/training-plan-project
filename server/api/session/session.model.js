'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
  userId      : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name        : {type : String, default: ''},
  date        : {type : Date},
  activity    : {type : String, default: ''},
  type        : {type : String, default: ''},
  comments    : {type : String, default: ''},
  completed   : {type : Boolean, default: true},
  exercises   : [exercise]
});

var exercise = new Schema({
  name        : {type : String, default: ''},
  setNo       : {type : Number}, 
  sets        : [set]
});

var set = new Schema({
  reps        : {type : Number},
  weight      : {type : Number, default: 0}
});

SessionSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

exports.Session  = mongoose.model('Session', SessionSchema);
exports.Exercise = mongoose.model('Exercise', exercise);
exports.Set      = mongoose.model('Set',      set);