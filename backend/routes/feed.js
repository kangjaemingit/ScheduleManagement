var express = require('express');
var router = express.Router();
const feedController = require('../controller/feedController')
const checkAuth = require('../config/auth').checkAuth;

router.get('/', checkAuth, feedController.index);

router.post('/createFeed', checkAuth, feedController.createFeed);

router.post('/updateFeed', checkAuth, feedController.updateFeed);

router.post('/deleteFeed', checkAuth, feedController.deleteFeed);

router.post('/commentCreate', checkAuth, feedController.createFeedComment);

module.exports = router;
