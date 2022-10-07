var express = require('express');
var router = express.Router();
const checkAuth = require('../config/auth').checkAuth;
const layoutController = require('../controller/layoutController')

router.post('/paint',checkAuth,layoutController.updatePaint)


module.exports = router;
