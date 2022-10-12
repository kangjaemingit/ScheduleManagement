var express = require('express');
const {checkAuth} = require("../config/auth");
const categoryController = require("../controller/categoryController");
const calendarController = require("../controller/calendarController");
var router = express.Router();

router.get('/', checkAuth, calendarController.index);

router.post('/newCategory',categoryController.newCategory);

router.get('/getMyCategory', categoryController.getMyCategory);

router.get('/deleteCategory/:id', categoryController.deleteCategory);

router.get('/getTagList', checkAuth, categoryController.getTagList);

router.get('/getUserList', checkAuth, categoryController.getUserList);

router.post('/searchUser', checkAuth, categoryController.searchUser);

module.exports = router;