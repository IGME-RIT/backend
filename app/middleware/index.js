// Force a non-https request to be https
var requiresSecure = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.hostname + req.url);
    }
    next();
};

// Make the app not care if incoming connections are https or not
var bypassSecure = function (req, res, next) {
    next();
};

// When working in a development environment, security is less of an issue.
if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}