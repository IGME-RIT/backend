
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var github = require('../services/github');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.

var options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://" + process.env.FQDN + "/sync/auth/callback"
};

var verify = function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(() => {

        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        github.authorize(accessToken);
        github.client.orgs('igme-rit').members.fetch({role:'admin'})
        .then((res) => {
            for (var i = 0; i < res.length; i++) {
                var user = res[i];
                if (user.login === profile.username) {
                    profile.isOrgAdmin = true;
                    break;
                }
            }
            return done(null, {user: profile, github: github});
        });            
    });
};

passport.use(new GitHubStrategy(options, verify));

module.exports = {
    passport: passport,
    github: github
};
