
var express = require('express');
var router = express.Router();

var middleware = require('../middleware');
var Configuration = require('../models/config').getInstance();

module.exports = function(repos) {
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

    router.get('/', 
            middleware.requiresSecure, 
            middleware.enableCors,
            getAllRepos);
    router.get('/:title', 
            middleware.requiresSecure, 
            middleware.enableCors,
            getRepoByName);

    return router;
};
