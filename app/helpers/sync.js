var Q = require('q');
var Repo = require('../models/repo').Repo;

module.exports = function(excluded, github) {
    var client = github.client;

    var currentPage = 0;
    var perPage = 100;
    var repoCount = 0;
    var len = 0;

    var promises = [];
    
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
            repo.save((err) => {
                if (err) {
                    deferred.reject();
                }
                repoCount += 1;
                deferred.resolve();
            });
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
                        promises.push(next());
                    }
                })
                .catch(function (err) {
                    console.err(err);
                });
    }
    
    promises.push(next());

    return Promise.all(promises)
        .then(function() {
            return repoCount;
        });
}