var express = require('express');
var router = express.Router();
const dashboardController = require('../controller/dashboardController')
const checkAuth = require('../config/auth').checkAuth;

/* GET home page. */
router.get('/', checkAuth, dashboardController.index);



module.exports = router;
