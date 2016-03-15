
var Configuration = require('../models/config').getInstance();

module.exports = function(repos) {
    return {
        getAllRepos: function(req, res) {
            if (repos) {
                res.send(repos);
            } else if (Configuration.initialized) {
                Configuration.search(null, function(err, results) {
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
        },
        getRepoByName: function(req, res) {
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
                res.send(results);
            } else if (Configuration.initialized) {
                Configuration.search({ title: title }, function(err, results) {
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
        },
        syncRepos: function(req, res) {
            Configuration.sync(function(err, repoCount) {
                if (err) {
                    res.send({
                        error: true,
                        message: err
                    });
                } else {
                    res.send({
                        message: repoCount + ' repos were synced.',
                        serverTime: Date.now()
                    });
                }
            });
        }
    }
};
