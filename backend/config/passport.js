const passport = require('passport');
const {User} = require("../models/User");
const NaverStrategy = require('passport-naver').Strategy
const KakaoStrategy = require('passport-kakao').Strategy

/**
 * 담당자 : 강재민
 * 함수 설명 : 소셜 서비스를 통한 로그인을 구현하기 위한 함수입니다.
 * 주요 기능 : - passport를 사용하여 네이버와 카카오에 로그인 요청을 하고, 콜백을 받아 세션에 담아주는 역할을 합니다.
 *          - API요청 혹은 페이지 이동시마다 세션을 갱신해줌
 *
 * */
module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    // Serialize
    passport.serializeUser((user, done) => {
        done(null, user);
    })

    // DeSerialize
    passport.deserializeUser((user, done) => {
        User.findOne({userId : user.userId})
            .then((user => done(null, user)))
            .catch(err => done(err));
    })

    /* Naver Strategy */
    passport.use(
        new NaverStrategy(
            {
                clientID : process.env['NAVER_CLIENT_ID'],
                clientSecret : process.env['NAVER_CLIENT_SECRET'],
                callbackURL : process.env['NAVER_CALLBACK'],
            },
            async function (accessToken, refreshToken, profile, cb) {

                try{
                    const userExists = await User.exists({userId : profile.id}).exec();

                    if(userExists){
                        const existsUser = await User.findOneAndUpdate({userId : profile.id},
                            {$set : {
                                    name : profile._json.nickname,
                                    nickName : profile._json.nickname,
                                    email : profile._json.email,
                                    profilePhoto : profile._json.profilePhoto }});

                        cb(null, existsUser);
                    }
                    else{
                        const newUser = await User.create({
                            name : profile._json.nickname,
                            userId : profile.id,
                            nickName : profile._json.nickname,
                            email : profile._json.email,
                            profilePhoto : profile._json.profile_image,
                            provider : profile.provider
                        });
                        cb(null, newUser);
                    }
                } catch (e){
                    console.log(e);
                    cb(e);
                }
            }
        )
    );

    /* Kakao Strategy */
    passport.use(
        new KakaoStrategy(
            {
                clientID : process.env['KAKAO_CLIENT_ID'],
                clientSecret : process.env['KAKAO_CLIENT_SECRET'],
                callbackURL : process.env['KAKAO_CALLBACK'],
            },
            async function (accessToken, refreshToken, profile, cb) {
                try{
                    const userExists = await User.exists({userId : profile.id}).exec();

                    if(userExists){
                        const existsUser = await User.findOneAndUpdate({userId : profile.id},
                            {$set : {
                                    name : profile.username,
                                    nickName : profile.displayName,
                                    email : profile._json.kakao_account.email,
                                    profilePhoto : profile._json.properties.profile_image,
                                    }});

                        cb(null, existsUser);
                    }
                    else{
                        const newUser = await User.create({
                            name : profile.username,
                            userId : profile.id,
                            nickName : profile.displayName,
                            email : profile._json.kakao_account.email,
                            profilePhoto : profile._json.properties.profile_image,
                            provider : profile.provider
                        });
                        cb(null, newUser);
                    }
                } catch (e){
                    console.log(e);
                    cb(e);
                }

            }
        )
    );

}