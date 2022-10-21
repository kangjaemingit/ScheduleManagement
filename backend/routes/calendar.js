var express = require('express');
const {checkAuth} = require("../config/auth");
const categoryController = require("../controller/categoryController");
const calendarController = require("../controller/calendarController");
const scheduleController = require("../controller/scheduleController");
var router = express.Router();

router.get('/', checkAuth, calendarController.index);

// create
router.post('/newCategory',categoryController.newCategory);

// read
router.get('/getMyCategory', categoryController.getMyCategory);

// update
router.post('/updateCategory', categoryController.updateCategory);

// delete
router.delete('/deleteCategory/:id', categoryController.deleteCategory);

router.get('/getTagList', checkAuth, categoryController.getTagList);

router.get('/getUserList', checkAuth, categoryController.getUserList);

router.post('/searchUser', checkAuth, categoryController.searchUser);

router.get('/getScheduleByUser',checkAuth,scheduleController.getScheduleByUser);

router.get('/getMySchedule',checkAuth,scheduleController.getMySchedule);

router.get('/sharedCategory', checkAuth, categoryController.sharedCategory);

router.post('/getScheduleByCategory', checkAuth, scheduleController.getScheduleByCategory);


module.exports = router;