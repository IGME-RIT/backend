//require('./extensions.js');

var Configuration = require('./models/config.js');

module.exports = function(repos) {
  if (!repos) {
    var config = Configuration.getInstance().getRepos(function (err, repo_arr) {
      if (err) {
        console.error('Repos could not be loaded');
      } else {
        repos = repo_arr;
      }
    })
  }

  var express = require('express');

  var app = express();

  app.set('json spaces', 2);

  app.get('/', function(req, res) {
    res.send('Root currently serves no function');
  });

  app.get('/repos', function(req, res) {
    res.send(repos);
  });

  app.get('/repos/:title', function(req, res) {
    var title = req.params.title;
    title = title.replace(/\+|\%20/gi, ' ');
    var results = [];
    repos.forEach(function(repo) {
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
