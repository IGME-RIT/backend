var mongoose = require('mongoose');

var github = require('../services/github.js');
var GITHUB_DEFAULT = require('../helpers/constants.js').GITHUB_DEFAULT;
var Author = require('./author.js');
var ImageSet = require('./imageset.js');

var parseUrl = function(url) {
  var comps = url.split('/', 6);
  for (var i = 0; i < 4; i++) {
    comps.shift();
  }
  if (comps.length === 2)
    return comps;
  else
    return [comps[0], comps[1]];
}

function Repo(title, link, config_url) {
  this.title = title || 'Unknown Repo';
  this.link = link || GITHUB_DEFAULT;
  if (config_url) {
    var parsed = parseUrl(config_url);
    this.initConfig(parsed[0], parsed[1]);
  }
}
Repo.schema = function () {
  return new mongoose.Schema({
    title: String,
    link: String,
    author: Author.schema(),
    description: String,
    language: String,
    image: ImageSet.schema(),
    tags: [String],
    extra_resources: [String]
  });
};
Repo.prototype.initConfig = function(user, repo) {
  var that = this;
  github.getConfig({
    user: user,
    repo: repo
  }, function(err, config) {
    if (err) {
      console.error(err);
      return;
    }
    that.title = config.title || that.title;
    that.author = config.author ?
      new Author(config.author.name,
        config.author.email,
        config.author.github) :
      new Author();
    that.description = config.description || 'No description found';
    that.language = config.language || 'None';
    that.image = config.image ?
      new ImageSet(config.image.icon,
        config.image.banner) :
      new ImageSet();
    that.tags = config.tags || [];
    that.extra_resources = config.extra_resources || [];
    console.log('Parsed the project config for ' + that.title);
  });
};

module.exports.Repo = Repo;
