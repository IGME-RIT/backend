var GitHub = require('github');
var express = require('express');

var github = new GitHub({
  version: "3.0.0"
});
/*github.authenticate({
  type: "oauth"
});*/

var excluded = ['documentation', 'igme-rit.github.io', 'backend', 'contribute'];
var db_fake = [{
  "id": 1,
  "name": "Aaron",
  "email": "yes@me.com"
}, {
  "id": 2,
  "name": "Ryan",
  "email": "no@me.com"
}, {
  "id": 3,
  "name": "Dave",
  "email": "maybe@me.com"
}, {
  "id": 4,
  "name": "Dominate",
  "email": "perfect@me.com"
}, {
  "id": 5,
  "name": "Hominate",
  "email": "failure@me.com"
}, {
  "id": 6,
  "name": "Wolf",
  "email": "absolutism@me.com"
}];


var syncProjectsWithDatabase = function() {
  var current = 0;
  var perPage = 100;
  var shouldExecute = true;
  var repos = [];
  var handler = function(err, res) {
    if (err) {
      shouldExecute = false;
      completion();
    }
    for (var repo in res) {
      if (excluded.indexOf(repo.name) === -1) {
        repos.push(repo);
      }
    }
    if (res.length < per_page) {
      completion();
    }
    if (shouldExecute) {
      current++;
      next();
    }
  };
  var next = function() {
    github.repos.getFromOrgs({
      org: 'igme-rit',
      type: 'public',
      page: current,
      per_page: perPage
    }, handler);
  };
  var completion = function() {
    //completion handle
  };
  next();
};

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

app.get('/butts', function(req, res) {
  res.send('You\'re a big butt');
});

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});


//get projects
//sync projects
//get user
//post new user

app.listen(3000);
