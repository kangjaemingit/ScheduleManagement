
const authUtil = {
    checkAuth : (req, res, next) => {
        if(!req.session.passport){
            // return res.redirect('/login');
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('로그인 세션이 만료되었습니다.')</script>"
                    + "<script>location.replace('/login')</script>")
        }
        //req.user = req.session.passport.user;
        next();
    }
}
module.exports = authUtil