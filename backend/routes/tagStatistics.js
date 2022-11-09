const express = require('express');
const router = express.Router();
const tagStatisticsController = require('../controller/tagStatisticsController');
const { checkAuth } = require('../config/auth');

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 통계 페이지를 렌더링 해주는 라우터 함수 입니다.
 * 주요 기능 : - 태그통계컨트롤러의 index 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/', checkAuth, tagStatisticsController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그통계 기본값을 불러오는 라우터 함수입니다.
 * 주요 기능 : - 태그통계 컨트롤러의 tagStatisticsData 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/data', checkAuth, tagStatisticsController.tagStatisticsData);

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그이름을 통해서 태그 정보와 일정리스트를 받아오는 라우터 함수입니다.
 * 주요 기능 : - 태그통계 컨트롤러의 findMyTagByTagName 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.get('/findMyTagByTagName/:tagName', checkAuth, tagStatisticsController.findMyTagByTagName);

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 통계페이지에서 왼쪽 원형차트 범례의 '기타' 항목에 해당하는 일정을 불러오기 위한 라우터 함수입니다.
 * 주요 기능 : - 태그통계 컨트롤러의 findMyTagByNotTagName 함수와 주소를 연결해주는 역할을 합니다.
 * */
router.post('/findMyTagByNotTagName/', checkAuth, tagStatisticsController.findMyTagByNotTagName);

module.exports = router;