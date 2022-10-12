var express = require('express');
const {checkAuth} = require("../config/auth");
const categoryController = require("../controller/categoryController");
var router = express.Router();

router.get('/', checkAuth, function(req, res, next) {
    res.render('calendarPage/calendarPage', { title: 'Express',user : req.user  });
});
router.post('/categoryAdd',categoryController.newCategory);

module.exports = router;