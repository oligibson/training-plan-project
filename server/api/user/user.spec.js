'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var token,
    user_id;

describe('POST /auth/login', function () {
  it('should create user session for valid user', function (done) {
    request(app)
      .post('/auth/login')
      .set('Accept','application/json')
      .send({"email": "oligibson1@gmail.com", "password": "westholi"})
      .expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        res.body.user.fname.should.equal('Oli');
        res.body.user.lname.should.equal('Gibson');
        res.body.user.email.should.equal('oligibson1@gmail.com');
        should.exist(res.body.token);
        token = res.body.token;
        done();
      });
  });
});

describe('POST /api/users', function() {

  it('should create a new user', function(done) {
    var newprofile = {
      "fname": "Test",
      "lname": "User",
      "email": "test.user@gmail.com",
      "password": "password"
    }
    request(app)
      .post('/api/users')
      .set('Accept','application/json')
      .send(newprofile)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          // this is should.js syntax, very clear
          res.should.have.status(200);
          user_id = res.body.user._id;
          console.log(user_id);
          done();
        });
  });

  it('should return error trying to save duplicate username', function(done) {
    var profile = {
      "fname": "Oli",
      "lname": "Gibson",
      "email": "oligibson1@gmail.com",
      "password": "password"
    }
    request(app)
      .post('/api/users')
      .send(profile)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          // this is should.js syntax, very clear
          res.should.have.status(422);
          done();
        });
  });

  it('should return error trying to save without required parameters', function(done) {
    var profile2 = {
      "email": "oligibson1@gmail.com",
      "password": "password"
    }
    request(app)
      .post('/api/users')
      .send(profile2)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          // this is should.js syntax, very clear
          res.should.have.status(400);
          done();
        });
  });
});

describe('DELETE /api/users/{id}', function() {

  it('should delete the user', function(done) {
    var newprofile = {
      "fname": "Test",
      "lname": "User",
      "email": "test.user@gmail.com",
      "password": "password"
    }
    request(app)
      .delete('/api/users/' + user_id)
      .set('Accept','application/json')
      .set('x-access-token', token)
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          // this is should.js syntax, very clear
          res.should.have.status(204);
          done();
        });
  });
});