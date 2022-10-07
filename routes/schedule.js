const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const checkAuth = require('../config/auth').checkAuth;

router.post('/newSchedule', checkAuth, scheduleController.newSchedule);

router.get('/autoComplete/:keyword', checkAuth, scheduleController.autoComplete);
module.exports = router;