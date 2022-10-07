
const authUtil = {
    checkAuth : (req, res, next) => {
        if(!req.session.passport)
            return res.redirect('/login');

        //req.user = req.session.passport.user;
        next();
    }
}
module.exports = authUtil