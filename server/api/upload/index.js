'use strict';

var express = require('express');
var controller = require('./upload.controller');

var router = express.Router();

router.post('/profile/:userId', controller.profileUpload);
router.get('/email', controller.email);

module.exports = router;