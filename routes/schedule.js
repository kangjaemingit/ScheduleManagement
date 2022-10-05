const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const checkAuth = require('../config/auth').checkAuth;

router.post('/newSchedule', checkAuth, scheduleController.newSchedule);

module.exports = router;