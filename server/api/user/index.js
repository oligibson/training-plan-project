'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.getUser);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;