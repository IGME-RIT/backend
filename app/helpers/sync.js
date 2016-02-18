var github = require('../services/github.js').client;
var repo = require('../models/repo.js');
var Repo = repo.Repo;

module.exports = function(excluded, completion) {
    var current = 0;
    var perPage = 100;
    var shouldExecute = true;
    var handler = function(err, res) {
        if (err) {
            shouldExecute = false;
            completion(err, null);
            return;
        }
        var i = 0;
        var len = res.length;
        while (i < len) {
            var repo_raw = res[i];
            if (!shouldExecute) {
                return;
            }
            if (excluded.indexOf(repo_raw.name) === -1) {
                console.log(repo_raw.name);
                var title = repo_raw.name;
                var link = repo_raw.html_url;
                var config = repo_raw.contents_url;
                var repo = new Repo.Repo({
                    title: title,
                    link: link
                });
                repo.initConfig(config);
                repo.save(function (err) {
                    if (err) {
                        completion(err, null);
                        shouldExecute = false;
                        return;
                    }
                });
            }
            i += 1;
        }
        if (res.length < perPage) {
            completion(err);
        } else if (shouldExecute) {
            current++;
            next();
        }
    };
    var next = function() {
        github.repos.getFromOrg({
            org: 'igme-rit',
            type: 'public',
            page: current,
            per_page: perPage
        }, handler);
    };
    next();
};
