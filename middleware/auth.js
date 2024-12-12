function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
}

function redirectIfAuth(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}

module.exports = { requireAuth, redirectIfAuth }; 