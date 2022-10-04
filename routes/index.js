var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/calender', function(req, res, next) {
  res.render('calender', { title: 'Express' });
});
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});
router.get('/CategoryCalendar', function(req, res, next) {
  res.render('CategoryCalender', { title: 'Express' });
});
router.get('/header', function(req, res, next) {
  res.render('partials/header', { title: 'Express' });
});

module.exports = router;
