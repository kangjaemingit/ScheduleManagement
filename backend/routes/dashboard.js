var express = require('express');
var router = express.Router();
const dashboardController = require('../controller/dashboardController')
const checkAuth = require('../config/auth').checkAuth;

/**
 * 담당자 : 강재민
 * 함수 설명 : 대시보드 페이지를 렌더링 하는 라우터 함수입니다.
 * 주요 기능 : - 대시보드 컨트롤러의 index 함수와 주소를 연결해주는 함수입니다.
 * */
router.get('/', checkAuth, dashboardController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 완료와 미완료를 변경해주는 라우터 함수입니다.
 * 주요 기능 : - 대시보드 컨트롤러의 updateScheduleComplete 함수와 주소를 연결해주는 함수입니다.
 * */
router.post('/updateComplete', checkAuth, dashboardController.updateScheduleComplete);

/**
 * 담당자 : 강재민
 * 함수 설명 : 완료율을 불러오기 위해 완료된 일정의 갯수와 미완료된 일정의 갯수를 불러오는 라우터 함수입니다.
 * 주요 기능 : - 대시보드 컨트롤러의 completeRate 함수와 주소를 연결해주는 함수입니다.
 * */
router.get('/completeRate', checkAuth, dashboardController.completeRate);
module.exports = router;
