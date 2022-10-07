var express = require('express');
var router = express.Router();
const checkAuth = require('../config/auth').checkAuth;

/* GET home page. */
router.get('/', checkAuth, function(req, res, next) {
  res.render('dashboard', { title: 'Express', user : req.user });
});



module.exports = router;
