var Q = require('q');
var Repo = require('../models/repo').Repo;

module.exports = function(excluded, github) {
    var client = github.client;
    return client.orgs('igme-rit').repos.fetch().then(function(res) {
        var len = res.length;
        for (var i = 0; i < len; i++) {
            var repo_raw = res[i];
            if (excluded.indexOf(repo_raw.name) !== -1) {
                continue;
            }
            console.log(repo_raw.name);
            var title = repo_raw.name;
            var link = repo_raw.htmlUrl;
            var repo = new Repo({
                title: title,
                link: link
            });
            var save = Q.nfbind(repo.save.bind(repo));
            repo.initConfig(repo_raw, github).then(save);
        }
        return len;
    });
}