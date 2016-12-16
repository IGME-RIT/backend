
var express = require('express');
var cors = require('cors');

// A router object is an isolated instance of middleware and routes.
var router = express.Router();

var middleware = require('../middleware');
var Configuration = require('../models/config').getInstance();

module.exports = function(repos) {
    // req is an object representing the http request
    // res is an object representing the http response express sends back when it receives a request
    var getAllRepos = function(req, res) {
        if (repos) {
            res.json(repos);
        } else if (Configuration.initialized) {
            Configuration.search(null, function(err, results) {
                if (err) {
                    res.json({
                        error: true,
                        message: err
                    });
                    console.error(err);
                    return;
                }
                res.json(results);
            });
        } else {
            res.render('error', {
                message: 'Configuration is still warming up!',
                error: {}
            });
        }
    };

    // If a set of repos is passed when this file is require()d, search that list
    // Otherwise look through the database
    var getRepoByName = function(req, res) {
        var title = req.params.title;
        title = title.replace(/\+|\%20/gi, ' ');
        if (repos) {
            var results = [];
            repos.forEach(function(repo) {
                if (repo && repo.title) {
                    if (repo.title.toLowerCase().indexOf(title) !== -1) {
                        results.push(repo);
                    }
                }
            });
            res.json(results);
        } else if (Configuration.initialized) {
            Configuration.search({ title: title }, function(err, results) {
                if (err) {
                    res.json({
                        error: true,
                        message: err
                    });
                    console.error(err);
                    return;
                }
                res.json(results);
            });
        } else {
            res.render('error', {
                message: 'Configuration is still warming up!',
                error: {}
            });
        }
    };
    
    // GET /repos
    // When just hitting the /repos endpoint, serve up a json array of every repo in the database
    router.options('/', cors());
    router.get('/', 
            cors(),
            middleware.requiresSecure, 
            getAllRepos);
    
    // GET /repos/:title
    // When the /repos/:title endpoint is hit, look for the repo in question and serve that
    router.options('/:title', cors());
    router.get('/:title', 
            cors(),
            middleware.requiresSecure, 
            getRepoByName);

    return router;
};
