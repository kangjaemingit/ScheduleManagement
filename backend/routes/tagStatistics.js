const express = require('express');
const router = express.Router();
const tagStatisticsController = require('../controller/tagStatisticsController');
const { checkAuth } = require('../config/auth');

router.get('/', checkAuth, tagStatisticsController.index);

router.get('/data', checkAuth, tagStatisticsController.tagStatisticsData);

router.get('/findMyTagByTagName/:tagName', checkAuth, tagStatisticsController.findMyTagByTagName);

router.post('/findMyTagByNotTagName/', checkAuth, tagStatisticsController.findMyTagByNotTagName);

module.exports = router;