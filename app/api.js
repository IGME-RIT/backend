
var express = require('express');
var passport = require('./services/auth');

module.exports = function(repos) {
    var repo_routes = require('./routes/repos')(repos);

    var app = express();
    app.set('json spaces', 2);
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    /**
     * root
     */

    // GET /auth/github
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in GitHub authentication will involve redirecting
    //   the user to github.com.  After authorization, GitHub will redirect the user
    //   back to this application at /auth/github/callback
    app.get('/auth',
        passport.authenticate('github', { scope: ['user:email'] }),
        function(req, res) {
            // The request will be redirected to GitHub for authentication, so this
            // function will not be called.
        }
    );

    // GET /auth/github/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/sync');
        }
    );

    app.get('/', function(req, res) {
        var payload = {
            message: 'This is Jeff.',
            serverTime: Date.now()
        };
        res.send(payload);
    });

    app.get('/repos', repo_routes.getAllRepos);
    app.get('/repos/:title', repo_routes.getRepoByName);
    app.get('/sync',
        passport.authenticate('github', { scope: ['user:email'] }),
        repo_routes.syncRepos
    );

    return app;
}
