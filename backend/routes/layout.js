var express = require('express');
var router = express.Router();
const checkAuth = require('../config/auth').checkAuth;
const layoutController = require('../controller/layoutController')
/**********************************************************************************
 * 담당자 : 김건희
 * 함수 설명 : Navbar의 유저가 선택한 색상을 저장해주는 함수
 * 주요 기능 : - layoutController의 updatePaint 함수와 주소를 연결해주는 역할을 합니다.
 * * ********************************************************************************/
router.post('/paint',checkAuth,layoutController.updatePaint)


module.exports = router;
