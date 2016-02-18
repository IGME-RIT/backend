//require('./extensions.js');

var express = require('express');
var Configuration = require('./models/config.js').getInstance();

module.exports = function (repos) {

    var app = express();
    app.set('json spaces', 2);

    app.get('/', function (req, res) {
        var payload = {
            message: 'This is Jeff.',
            serverTime: Date.now()
        };
        res.send(payload);
    });

    app.get('/repos', function (req, res) {
        if (repos) {
            res.send(repos);
        } else if (Configuration.initialized) {
            Configuration.search(null, function (err, results) {
                if (err) {
                    res.send({
                        error: true,
                        message: err
                    });
                    console.error(err);
                    return;
                }
                res.send(results);
            });
        } else {
            res.send({
                error: true,
                message: 'Configuration is still warming up!'
            });
        }

    });

    app.get('/repos/:title', function (req, res) {
        var title = req.params.title;
        title = title.replace(/\+|\%20/gi, ' ');
        if (repos) {
            var results = [];
            repos.forEach(function (repo) {
                if (repo && repo.title) {
                    if (repo.title.toLowerCase().indexOf(title) !== -1) {
                        results.push(repo);
                    }
                }
            });
            res.send(results);
        } else if (Configuration.initialized) {
            Configuration.search({ title: title }, function (err, results) {
                if (err) {
                    res.send({
                        error: true,
                        message: err
                    });
                    console.error(err);
                    return;
                }
                res.send(results);
            });
        } else {
            res.send({
                error: true,
                message: 'Configuration is still warming up!'
            });
        }
    });

    return app;
}
