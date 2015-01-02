'use strict';

var express = require('express');
var controller = require('./session.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.getSession);
router.get('/user/:id', controller.getUserSessions);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;