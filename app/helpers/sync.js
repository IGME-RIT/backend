var Q = require('q');
var Repo = require('../models/repo').Repo;

module.exports = function(excluded, github) {
    var client = github.client;

    var currentPage = 1; // Github's API has a 1-indexed paging system
    var perPage = 100;
    var repoCount = 0;
    var len = 0;
    
    function getRepoPage(res) {
        len = res.length;
        var repoPromises = [];
        for (var i = 0; i < len; i++) {
            var raw = res[i];
            if (excluded.indexOf(raw.name) !== -1) {
                continue;
            }
            repoPromises.push(createRepo(raw));
        }
        return Promise.all(repoPromises);
    }
    
    function createRepo(raw) {
        var name = raw.name;
        var link = raw.htmlUrl;
        var repo = new Repo({
            name: name,
            link: link
        });
        return repo.initConfig(raw, github)
        .then(() => {
            var deferred = Q.defer();
            repo.save(() => {
                deferred.resolve();
                repoCount += 1;
            })
            return deferred.promise;
        });
    }
    
    function next() {
        var opts = {
            page: currentPage,
            per_page: perPage
        };
        return client
                .orgs('igme-rit')
                .repos
                .fetch(opts)
                .then(getRepoPage)
                .then(function() {
                    if (len >= perPage) {
                        currentPage += 1;
                        return next();
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });
    }
    
    return next()
        .then(function() {
            return repoCount;
        });
}
