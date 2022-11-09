const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const checkAuth = require('../config/auth').checkAuth;

/**
 * 담당자 : 강재민
 * 함수 설명 : 새로운 일정을 생성해주는 라우터 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 newSchedule 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/newSchedule', checkAuth, scheduleController.newSchedule);

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정을 수정하는 라우터 함수 입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 updateSchedule 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/updateSchedule', checkAuth, scheduleController.updateSchedule);

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정을 삭제하는 라우터 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 deleteSchedule 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/deleteSchedule', checkAuth, scheduleController.deleteSchedule);

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 생성 시 태그 입력 자동완성 기능을 위해 태그를 검색하는 라우터 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 autoComplete 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/autoComplete', checkAuth, scheduleController.autoComplete);

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 id를 통해 일정을 검색하는 라우터 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 getScheduleById 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/getScheduleById/:id', checkAuth, scheduleController.getScheduleById);

/**
 * 담당자 : 강재민
 * 함수 설명 : 나의 일정 중 검색 키워드가 포함된 일정을 검색하는 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 getMyScheduleByKeyword 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/getMyScheduleByKeyword', checkAuth, scheduleController.getMyScheduleByKeyword);


module.exports = router;