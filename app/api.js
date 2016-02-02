var express = require('express');
var Configuration = require('./config.js');

var app = express();

app.get('/', function(req, res) {
  res.send('Hello '.concat(req.method));
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

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

module.exports = app;