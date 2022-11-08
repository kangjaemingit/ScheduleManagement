/**
* 담당자 : 강재민
* 함수 설명 : 로그인 여부를 검증하는 미들웨어입니다.
* 주요 기능 : 세션에 로그인 정보가 있는지 확인하고 없다면 로그인 페이지로 이동시킵니다.
 * */

const authUtil = {
    checkAuth : (req, res, next) => {
        if(!req.session.passport){
            // return res.redirect('/login');
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>location.replace('/login')</script>")
        }
        //req.user = req.session.passport.user;
        next();
    }
}
module.exports = authUtil