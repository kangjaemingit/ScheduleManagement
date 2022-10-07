var express = require('express');
var router = express.Router();
const checkAuth = require('../config/auth').checkAuth;
/* GET home page. */

router.get('/calender', checkAuth, function(req, res, next) {
  res.render('calender', { title: 'Express' });
});
router.get('/', checkAuth, function(req, res, next) {
  res.render('dashboard', { title: 'Express', user : req.user });
});

router.get('/header', checkAuth, function(req, res, next) {
  res.render('partials/header', { title: 'Express', user : req.user });
});


module.exports = router;
