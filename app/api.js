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
        res.send(repos);
    });

    app.get('/repos/:title', function (req, res) {

        var title = req.params.title;
        title = title.replace(/\+|\%20/gi, ' ');
        var results = [];
        repos.forEach(function (repo) {
            if (repo && repo.title) {
                if (repo.title.toLowerCase().indexOf(title) !== -1) {
                    results.push(repo);
                }
            }
        });
        res.send(results);
    });

    return app;
}
