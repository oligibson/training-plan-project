'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.getUser);
router.get('/:id/refresh', auth.isAuthenticated(), controller.refresh);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/', controller.create);

module.exports = router;