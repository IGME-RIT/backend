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
        var deferred = Q.defer();
        var len = res.length;
        var repoPromises = [];
        for (var i = 0; i < len; i++) {
            var repo_raw = res[i];
            if (excluded.indexOf(repo_raw.name) !== -1) {
                continue;
            }
            repoPromises.push(createRepo(repo_raw));
        }
        return Q.all(repoPromises);
    }
    
    function createRepo(raw) {
        var deferred = Q.defer();
        var name = raw.name;
        var link = raw.htmlUrl;
        var repo = new Repo({
            name: name,
            link: link
        });
        var save = Q.nfbind(repo.save.bind(repo));
        repo.initConfig(raw, github)
        .then(save)
        .then(function () {
            repoCount += 1;
            deferred.resolve();
        })
        .catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
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
                });
    }
    
    promises.push(next());

    return Q.all(promises)
        .then(function() {
            return repoCount;
        });
}