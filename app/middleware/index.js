var requiresSecure = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.hostname + req.url);
    }
    next();
};

var bypassSecure = function (req, res, next) {
    next();
};

if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}