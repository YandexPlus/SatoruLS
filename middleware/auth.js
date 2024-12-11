<<<<<<< HEAD
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

=======
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

>>>>>>> cb358ef (Initial commit)
module.exports = { requireAuth, redirectIfAuth }; 