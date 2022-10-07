var express = require('express');
const {checkAuth} = require("../config/auth");
const categoryController = require("../controller/categoryController");
var router = express.Router();

router.post('/categoryAdd',categoryController.newCategory);

router.get('/', checkAuth, function(req, res, next) {
    res.render('calendarPage', { title: 'Express',user : req.user  });
});
module.exports = router;