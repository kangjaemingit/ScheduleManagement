var express = require('express');
const {checkAuth} = require("../config/auth");
const layoutController = require("../controller/layoutController");
var router = express.Router();

router.post('/category',checkAuth,)

module.exports = router;