// This file mostly lays the groundwork of node packages used to make the app work and able to handle requests.

// Express is a common web application framework.
// The app is an express instance.
var express = require('express');

// Used only to create a RFC4122 v1 UUID
var uuid = require('node-uuid');

// Only used method is path.join([..paths])
// ..paths: [String]
// The path.join() method joins all given path segments together using the
// platform specific separator as a delimiter, then normalizes the resulting path.
var path = require('path');

// HTTP request logger middleware for node.js
var logger = require('morgan');

// Parse cookie headers and populate req.cookies
var cookieParser = require('cookie-parser');

// Parse incoming request bodies in a middleware before your handlers, availabe under the req.body property
var bodyParser = require('body-parser');

// Simple session middleware for Express
var session = require('express-session');

// Node.js Cross-site request forgery (csrf) protection middleware
var csrf = require('csurf');

var Configuration = require('./models/config').getInstance();
var passport = Configuration.passport;

module.exports = function(repos) {
    // require('./routes')(repos) returns a function that takes an app and adds other app-specific files to it before returning the app again.
    var router = require('./routes')(repos);
    
    var app = express();

    // __dirname is a node-defined `global' (it's actually local to each module)
    // that is the name of the directory that the currently executing script resides in.
    // express.static(root, [options])
    //  - root: [String]
    // The root argument refers to the root directory from which the static assets are to be served.
    // The file to serve will be determined by combining req.url with the provided root directory.
    // When a file is not found, instead of sending a 404 response,
    //  this module will instead call next() to move on to the next middleware, allowing for stacking and fall-backs.
    app.use(express.static(path.join(__dirname, 'public')));
    
    // app.set('views', [String] or [Array])
    // A directory or an array of directories for the application's views.
    // If an array, the views are looked up in the order they occur in the array.
    app.set('views', path.join(__dirname, 'views'));
    // The default engine extension to use when omitted
    app.set('view engine', 'jade');
    // The 'space' argument used by `JSON.stringify`. This is typically set to the number of spaces to use to indent prettified JSON.
    app.set('json spaces', 2);

    // Concise output colored by response status for development use.
    // The :status token will be colored red for server error codes, yellow for client error codes,
    //   cyan for redirection codes, and uncolored for all other codes.
    // :method :url :status :response-time ms - :res[content-length]
    app.use(logger('dev'));

    // read cookies (needed for auth)
    app.use(cookieParser());

    // app.use([path,] callback [, callback...])
    // Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.
    // path defaults to '/', so in this case the following is run on every request to the app.
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
    
    // Returns middleware that only parses json
    app.use(bodyParser.json());
    // Returns middleware that only parses urlencoded bodies
    app.use(bodyParser.urlencoded({ extended: false }));

    // Sets the Boolean setting name to false, in this case the "X-Powered-By: Express" HTTP header
    app.disable('x-powered-by');

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    // Create a middleware for CSRF token creation and validation.
    // This middleware adds a req.csrfToken() function to make a token which should
    //   be added to requests which mutate state, within a hidden form field, query-string etc.
    // This token is validated against the visitor's session or csrf cookie.
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
