
var express = require('express');
var uuid = require('node-uuid');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var csrf = require('csurf');

var Configuration = require('./models/config').getInstance();
var passport = Configuration.passport;

module.exports = function(repos) {
    var router = require('./routes')(repos);
    
    var app = express();

    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.set('json spaces', 2);
    app.use(logger('dev'));
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(session({
        key: 'sessionid',
        genid: function(req) {
            return uuid.v1();
        },
        secret: 'Gaia and Uranus',
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: true
        }
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.disable('x-powered-by');
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());


    app.use(csrf());
    app.use(function(err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN')
            return next(err);
        return;
    });
    
    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    
    app = router(app);

    return app;
}
