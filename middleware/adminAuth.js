<<<<<<< HEAD
function requireAdmin(req, res, next) {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/');
    }
    next();
}

=======
function requireAdmin(req, res, next) {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/');
    }
    next();
}

>>>>>>> cb358ef (Initial commit)
module.exports = { requireAdmin }; 