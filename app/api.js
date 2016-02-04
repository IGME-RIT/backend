//require('./extensions.js');
var express = require('express');
var Configuration = require('./config.js');

var app = express();

app.set('json spaces', 2);

app.get('/', function(req, res) {
  res.send('Root currently serves no function');
});

app.get('/users/:id', function(req, res) {
  var id = req.params.id;
  console.log('Requested user ' + id);
  var i, len;
  for (i = 0, len = db_fake.length; i < len; i++) {
    var record = db_fake[i];
    console.log(record);
    if (record.id == id) {
      console.log('match found');
      res.send(record.name + ' : ' + record.email);
      return;
    }
  }
  console.log('not found');
  res.send('Not found');
});

app.get('/repos', function(req, res) {
  res.send(Configuration.repos);
});

app.get('/repos/:title', function(req, res) {
  var title = req.params.title;
  title = title.replace(/\+|\%20/g,' ');
  var results = [];
  for (var repo in Configuration.repos) {
    if (repo.title == title) {
      results.push(repo);
    }
  }
  res.send(results);
});

module.exports = app;