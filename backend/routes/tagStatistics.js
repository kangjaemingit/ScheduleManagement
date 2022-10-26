const express = require('express');
const router = express.Router();
const tagStatisticsController = require('../controller/tagStatisticsController');
const { checkAuth } = require('../config/auth');

router.get('/', checkAuth, tagStatisticsController.index);

router.get('/data', checkAuth, tagStatisticsController.tagStatisticsData);

module.exports = router;