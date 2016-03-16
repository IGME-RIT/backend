
var express = require('express');
var uuid = require('node-uuid');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Configuration = require('./models/config').getInstance();
var passport = Configuration.passport;

module.exports = function(repos) {
    var repo_routes = require('./routes/repos')(repos);
    var sync_routes = require('./routes/sync');

    var app = express();
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.set('json spaces', 2);
    app.use(logger('dev'));
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(session({
        genid: function (req) {
            return uuid.v1();
        },
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(__dirname + '/public', { redirect : false }));

    app.get('/', function(req, res) {
        var payload = {
            message: 'Atlas backend - 2016.',
            serverTime: Date.now()
        };
        res.send(payload);
    });

    app.use('/repos', repo_routes);
    app.use('/sync', sync_routes);

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

    return app;
}
