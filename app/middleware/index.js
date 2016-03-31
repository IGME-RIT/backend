var requiresSecure = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.hostname + req.url);
    }
    next();
};

var bypassSecure = function (req, res, next) {
    next();
};

var enableCors = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
  next();
};

module.exports.enableCors = enableCors;
if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}