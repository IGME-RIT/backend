var repo = require('./repo.js');
var Repo = repo.Repo;
var github = repo.github;

module.exports = function(excluded, completion) {
  var current = 0;
  var perPage = 100;
  var shouldExecute = true;
  var repos = [];
  var handler = function(err, res) {
    if (err) {
      shouldExecute = false;
      completion(err, null);
      return;
    }
    for (var repo_raw of res) {
      if (!shouldExecute) {
        return;
      }
      if (excluded.indexOf(repo_raw.name) === -1) {
        console.log(repo_raw.name);
        var title = repo_raw.name;
        var link = repo_raw.html_url;
        var config = repo_raw.contents_url;
        var repo = new Repo(title, link, config);
        repo.initConfig();
        repos.push(repo);
      }
    }
    if (res.length < perPage) {
      completion(err, repos);
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
