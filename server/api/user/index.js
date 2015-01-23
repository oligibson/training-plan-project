'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.getUser);
router.put('/:id', controller.update);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.delete('/:id', controller.destroy);
router.post('/', controller.create);

module.exports = router;