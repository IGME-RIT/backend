var Q = require('q');
var Repo = require('../models/repo').Repo;

module.exports = function(excluded, github) {
    var client = github.client;

    var currentPage = 0;
    var perPage = 100;
    var repoCount = 0;
    var len = 0;

    var promises = [];
    
    function incrementRepoCount() {
        repoCount += 1;
    }
    
    function createRepo(res) {
        var deferred = Q.defer();
        var len = res.length;
        for (var i = 0; i < len; i++) {
            var repo_raw = res[i];
            if (excluded.indexOf(repo_raw.name) !== -1) {
                continue;
            }
            console.log(repo_raw.name);
            var name = repo_raw.name;
            var link = repo_raw.htmlUrl;
            var repo = new Repo({
                name: name,
                link: link
            });
            var config = repo.initConfig(repo_raw, github);
            var save = Q.nfbind(repo.save.bind(repo));
            var promise = config.then(save).then(incrementRepoCount);
            promises.push(promise);
            deferred.resolve();
        }
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
                .then(createRepo)
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