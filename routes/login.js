const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require('../models/User')


router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

// 네이버 아이디 로그인
router.get('/naver', passport.authenticate('naver'));
// 네이버 아이디 로그인 콜백
router.get('/auth/naver', passport.authenticate('naver', {failureRedirect:'/login'}), function(req, res){
    console.log('callback login from naver');
    console.log(req.session.passport);
    res.redirect('/')
});

// 카카오 아이디 로그임
router.get('/kakao', passport.authenticate('kakao'));
// 카카오 아이디 로그인 콜백
router.get('/auth/kakao', passport.authenticate('kakao', {failureRedirect: '/login'}) ,function(req, res){
    console.log('callback login from kakao', req.user);
    res.redirect('/')
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

module.exports = router;