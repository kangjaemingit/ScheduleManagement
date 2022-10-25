const express = require('express');
const router = express.Router();
const tagStatisticsController = require('../controller/tagStatisticsController');
const { checkAuth } = require('../config/auth');

router.get('/', checkAuth, tagStatisticsController.index);

module.exports = router;