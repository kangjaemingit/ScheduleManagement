const session = require('express-session');

/**
 * 담당자 : 강재민
 * 함수 설명 : 로그인 세션을 유지시켜주는 역할을 합니다.
 * 주요 기능 : - 세션정보를 갱신하고, 지정된 시간동안 로그인을 유지할 수 있도록 합니다.
 * */
module.exports = (app) => {
    app.use(
        session({
            secret : process.env['SESSION_SECRET'],
            resave : true,
            saveUninitialized : true,
        })
    )
}