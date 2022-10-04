var express = require('express');
var router = express.Router();
const checkAuth = require('../config/auth').checkAuth;
/* GET home page. */


router.get('/calender', function(req, res, next) {
  res.render('calender', { title: 'Express' });
});
router.get('/', checkAuth, function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

module.exports = router;
