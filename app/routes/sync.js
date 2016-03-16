
var express = require('express');
var router = express.Router();

var Configuration = require('../models/config').getInstance();
var passport = Configuration.passport;

var isLoggedIn = function(req, res, next) {
    req.ATLUS = req.ATLUS || {};
    if (req.isAuthenticated()) {
        return next();
    }
    req.ATLUS.err = { message: 'User is not authenticated' };
    return next();
}

var renderSyncPage = function(req, res) {
    var options = {};
    if (req.ATLUS) {
        if (req.ATLUS.err) {
            options.message = req.ATLUS.err.message || 'Something went horribly wrong!';
        } else if (req.ATLUS.repoCount) {
            options.message = req.ATLUS.repoCount + ' repos were synced.';
            options.serverTime = Date.now();
        } else {
            options.message = 'You aren\'t logged in';
        }
    }
    res.render('sync', options);
}

router.get('/', isLoggedIn, function(req, res) {
    if (req.ATLUS) {
        Configuration.sync().then(function(repoCount) {
            req.ATLUS.repoCount = repoCount;
            renderSyncPage(req, res);
        }).catch(function(err) {
            req.ATLUS.err = err;
            renderSyncPage(req, res);
        });
        //renderSyncPage(req, res);
    } else {
        renderSyncPage(req, res);
    }
});

router.post('/',
    passport.authenticate('github', {
        scope: ['user:email'],
        successRedirect: '/',
        failureRedirect: '/'
    })
);

// GET /auth
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
router.get('/auth',
    passport.authenticate('github', { scope: ['user:email'] })
);

// GET /auth/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        Configuration.githubClient = req.user.github;
        res.redirect('/sync');
    }
);

module.exports = router;