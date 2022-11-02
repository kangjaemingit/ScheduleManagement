const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const checkAuth = require('../config/auth').checkAuth;

router.post('/newSchedule', checkAuth, scheduleController.newSchedule);

router.post('/updateSchedule', checkAuth, scheduleController.updateSchedule);

router.post('/deleteSchedule', checkAuth, scheduleController.deleteSchedule);

router.post('/autoComplete', checkAuth, scheduleController.autoComplete);

router.get('/getScheduleById/:id', checkAuth, scheduleController.getScheduleById);

router.post('/getMyScheduleByKeyword', checkAuth, scheduleController.getMyScheduleByKeyword);


module.exports = router;