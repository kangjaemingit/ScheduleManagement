const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require('../models/User')

/**
 * 담당자 : 강재민
 * 함수 설명 : 로그인 페이지를 render 하는 함수입니다.
 * 주요 기능 : - 로그인 페이지를 render 합니다.
 * */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

// 네이버 아이디 로그인
/**
 * 담당자 : 강재민
 * 함수 설명 : 네이버 로그인 요청을 하는 함수입니다.
 * 주요 기능 : - passport의 naver로그인 전략을 통해 네이버로 로그인 요청을 합니다.
 * */
router.get('/naver', passport.authenticate('naver'));

/**
 * 담당자 : 강재민
 * 함수 설명 : 네이버 로그인 시도 콜백요청을 처리하는 함수입니다.
 * 주요 기능 : - 로그인 시도 실패 시에는 로그인 페이지로 이동하게 합니다.
 *          - 로그인에 성공하면 메인페이지로 이동합니다.
 * */
router.get('/auth/naver', passport.authenticate('naver', {failureRedirect:'/login'}), function(req, res){
    console.log('callback login from naver');
    res.redirect('/')
});

/**
 * 담당자 : 강재민
 * 함수 설명 : 카카오 로그인 요청을 하는 함수입니다.
 * 주요 기능 : - passport의 kakao로그인 전략을 통해 카카오로 로그인 요청을 합니다.
 * */
router.get('/kakao', passport.authenticate('kakao'));

/**
 * 담당자 : 강재민
 * 함수 설명 : 카카오 로그인 시도 콜백요청을 처리하는 함수입니다.
 * 주요 기능 : - 로그인 시도 실패 시에는 로그인 페이지로 이동하게 합니다.
 *          - 로그인에 성공하면 메인페이지로 이동합니다.
 * */
router.get('/auth/kakao', passport.authenticate('kakao', {failureRedirect: '/login'}) ,function(req, res){
    console.log('callback login from kakao');
    res.redirect('/')
});

/**
 * 담당자 : 강재민
 * 함수 설명 : 로그아웃을 처리하는 기능을 하는 함수입니다.
 * 주요 기능 : - 세션에 있는 로그인 내역을 삭제하고 로그인페이지로 이동하도록 합니다.
 * */
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
})

module.exports = router;