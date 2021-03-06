
var express = require('express');
var router = express.Router();

var middleware = require('../middleware');
var Configuration = require('../models/config').getInstance();
var passport = Configuration.passport;

var isLoggedIn = function(req, res, next) {
    req.ATLAS = req.ATLAS || {}; // If the ATLAS object on the request doesn't already exist, create it
    // There's nearly no documentation anywhere for this method.
    // Just know it's part of passport.js and does what it says on the tin
    if (req.isAuthenticated()) {
        return next();
    }
    req.ATLAS.err = { message: 'User is not authenticated' };
    return next();
}

var renderSyncPage = function(req, res) {
    var options = { csrfToken: req.csrfToken() };
    if (req.ATLAS) {
        if (req.ATLAS.err) {
            options.message = req.ATLAS.err.message || 'Something went horribly wrong!';
        } else if (req.ATLAS.repoCount) {
            options.message = req.ATLAS.repoCount + ' repos were synced.';
            options.serverTime = Date.now();
        } else {
            options.message = 'You aren\'t logged in';
        }
    }
    // Renders a view and sends the rendered HTML string to the client
    res.render('sync', options);
}

// GET /sync
router.get('/',
    middleware.requiresSecure,
    isLoggedIn,
    function(req, res) {
        if (req.ATLAS) {
            if (req.user && req.user.user) {
                if (req.user.user.isOrgAdmin) {
                    Configuration.sync().then(function(repoCount) {
                        req.ATLAS.repoCount = repoCount;
                        renderSyncPage(req, res);
                    }).catch(function(err) {
                        req.ATLAS.err = err;
                        renderSyncPage(req, res);
                    });
                } else {
                    req.ATLAS.err = { message: 'You\'re not an admin of the IGME-RIT organization' };
                    renderSyncPage(req, res);
                }
            } else {
                renderSyncPage(req, res);
            }
        } else {
            renderSyncPage(req, res);
        }
    }
);

router.post('/',
    passport.authenticate('github', {
        scope: ['user:email', 'read:org'],
        successRedirect: '/',
        failureRedirect: '/'
    }),
    middleware.requiresSecure
);

// GET /auth
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
router.get('/auth',
    passport.authenticate('github', { scope: ['user:email', 'read:org'] }),
    middleware.requiresSecure
);

// GET /auth/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    middleware.requiresSecure,
    function(req, res) {
        Configuration.githubClient = req.user.github;
        res.redirect('/sync');
    }
);

module.exports = router;