var express = require('express');
var router = express.Router();
const feedController = require('../controller/feedController')
const checkAuth = require('../config/auth').checkAuth;

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 페이지를 렌더링 해주는 라우터 함수입니다.
 * 주요 기능 : - 피드 컨드롤러의 index 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/', checkAuth, feedController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드를 생성해주는 라우터 함수입니다.
 * 주요 기능 : - 피드 컨트롤러의 createFeed 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/createFeed', checkAuth, feedController.createFeed);

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드를 수정하는 라우터 함수입니다.
 * 주요 기능 : - 피드 컨트롤러의 updateFeed 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/updateFeed', checkAuth, feedController.updateFeed);

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드를 삭제하는 함수입니다.
 * 주요 기능 : - 피드 컨트롤러의 deleteFeed 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/deleteFeed', checkAuth, feedController.deleteFeed);

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 댓글을 생성해주는 함수입니다.
 * 주요 기능 : - 피드 컨트롤러의 createFeedComment 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/commentCreate', checkAuth, feedController.createFeedComment);

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 댓글을 삭제하는 함수입니다.
 * 주요 기능 : - 피드 컨트롤러의 deleteFeedComment 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/commentDelete', checkAuth, feedController.deleteFeedComment);
module.exports = router;
