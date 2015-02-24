'use strict';

var express = require('express');
var controller = require('./upload.controller');

var router = express.Router();

router.post('/profile/:userId', controller.profileUpload);

module.exports = router;