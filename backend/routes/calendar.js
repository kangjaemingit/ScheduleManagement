var express = require('express');
const {checkAuth} = require("../config/auth");
const categoryController = require("../controller/categoryController");
const calendarController = require("../controller/calendarController");
const scheduleController = require("../controller/scheduleController");
var router = express.Router();

/**
 * 담당자 : 강재민
 * 함수 설명 : 캘린더 페이지를 렌더링 해주는 라우터 함수입니다.
 * 주요 기능 : - 캘린더 컨트롤러의 index함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/', checkAuth, calendarController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 새로운 카테고리를 생성하는 라우터 함수입니다.
 * 주요 기능 : 카테코리 컨트롤러의 newCategory 함수와 주소를 연결해주는 역할을 합니다.
 * */
// create
router.post('/newCategory', checkAuth, categoryController.newCategory);

/**
 * 담당자 : 강재민
 * 함수 설명 : 내가 생성한 카테고리를 불러오는 라우터 함수입니다.
 * 주요 기능 : - 카테고리 컨트롤러의 getMyCategory 홤수와 주소를 연결해주는 역할을 합니다.
 * */
// read
router.get('/getMyCategory', checkAuth, categoryController.getMyCategory);

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리를 수정하는 라우터 함수입니다.
 * 주요 기능 : - 카테고리 컨트롤러의 updateCategory 함수와 주소를 연결해주는 역할을 합니다.
 * */
// update
router.post('/updateCategory', checkAuth, categoryController.updateCategory);

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리를 삭제하는 라우터 함수입니다.
 * 주요 기능 : - 카테고리 컨트롤러의 deleteCategory 함수와 주소를 연결해주는 역할을 합니다.
 * */
// delete
router.delete('/deleteCategory/:id', checkAuth, categoryController.deleteCategory);

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 생성 모달에서 태그를 선택하기 위해 모든 태그를 불러오는 라우터 함수입니다.
 * 주요 기능 : - 카테고리 컨트롤러의 getTagList 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/getTagList', checkAuth, categoryController.getTagList);

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 생성 모달에서 공유자를 선택하기위해 모든 사용자를 불러오는 라우터 함수입니다.
 * 주요 기능 : - 카테고리 컨트롤러의 getUserList 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/getUserList', checkAuth, categoryController.getUserList);

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유함에 내가 공유받은 카테고리 내용을 불러오기 위한 라우터 함수 입니다.
 * 주요 기능 : - 카테고리 컨트롤러의 searchUser 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/searchUser', checkAuth, categoryController.searchUser);

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유받은 일정과 나의 일정 전체를 불러오는 라우터 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 getScheduleByUser 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/getScheduleByUser',checkAuth,scheduleController.getScheduleByUser);

/**
 * 담당자 : 강재민
 * 함수 설명 : 내가 작성한 일정만을 불러오는 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 getMySchedule 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/getMySchedule',checkAuth,scheduleController.getMySchedule);

/**
 * 담당자 : 강재민
 * 함수 설명 : 나의 일정 중 입력받은 태그가 포함된 일정을 검색하는 라우터 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 getMyScheduleByTag 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/getMyScheduleByTag', checkAuth, scheduleController.getMyScheduleByTag);

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유함에 내가 공유받은 카테고리 내용을 불러오기 위한 라우터 함수 입니다.
 * 주요 기능 : - 카테고리 컨트롤러의 sharedCategory 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/sharedCategory', checkAuth, categoryController.sharedCategory);

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리의 태그를 입력받아 관련 일정을 찾아내는 함수입니다.
 * 주요 기능 : - 스케줄 컨트롤러의 getScheduleByCategory 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/getScheduleByCategory', checkAuth, scheduleController.getScheduleByCategory);


module.exports = router;