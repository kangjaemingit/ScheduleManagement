
const authUtil = {
    checkAuth : (req, res, next) => {
        if(!req.session.passport)
            return res.redirect('/login');
        next();
    }
}
module.exports = authUtil