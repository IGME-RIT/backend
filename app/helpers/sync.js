var Q = require('q');

var github = require('../services/github').client;
var Repo = require('../models/repo').Repo;

module.exports = function (excluded, completion) {
    var currentPage = 0;
    var perPage = 100;
    var repoCount = 0;

    var promises = [];

    var getRepos = Q.nfbind(github.repos.getFromOrg);

    function next() {
        var len = 0;
        var opts = {
            org: 'igme-rit',
            type: 'public',
            page: currentPage,
            per_page: perPage
        };
        var getRepoPromise = getRepos(opts)
            .then(function (res) {
                len = res.length;
                for (var i = 0; i < len; i++) {
                    var repo_raw = res[i];
                    if (excluded.indexOf(repo_raw.name) !== -1) {
                        continue;
                    }
                    console.log(repo_raw.name);
                    var title = repo_raw.name;
                    var link = repo_raw.html_url;
                    var config = repo_raw.contents_url;
                    var repo = new Repo({
                        title: title,
                        link: link
                    });
                    repoCount += 1;
                    var save = Q.nfbind(repo.save.bind(repo));
                    promises.push(repo.initConfig(config).then(save));
                }
            })
            .then(function () {
                if (len >= perPage) {
                    currentPage += 1;
                    promises.push(next());
                }
            });
        return getRepoPromise;
    }
    promises.push(next());

    Q.all(promises)
        .catch(function (err) {
            console.error(err);
            completion(err, null);
        })
        .done(function () {
            completion(null, repoCount);
        });
}