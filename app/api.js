//require('./extensions.js');
var express = require('express');
var Configuration = require('./config.js');

var app = express();

app.set('json spaces', 2);

app.get('/', function(req, res) {
  res.send('Root currently serves no function');
});

app.get('/repos', function(req, res) {
  res.send(Configuration.repos);
});

app.get('/repos/:title', function(req, res) {
  var title = req.params.title;
  title = title.replace(/\+|\%20/gi, ' ');
  var results = [];
  Configuration.repos.forEach(function(repo, index, repos) {
    if (repo && repo.title) {
      if (repo.title.toLowerCase().indexOf(title) !== -1) {
        results.push(repo);
      }
    }
  });
  res.send(results);
});

module.exports = app;
