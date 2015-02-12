'use strict';

var express = require('express');
var controller = require('./session.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.getSession);
router.get('/user/:id', auth.isAuthenticated(), controller.getUserSessions);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;