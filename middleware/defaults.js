module.exports = function(req, res, next) {
    res.locals.user = req.session.user || null;
    res.locals.style = '';
    res.locals.script = '';
    res.locals.layout = 'layouts/main';
    next();
}; 