//var Enum = require('../lib/enum.js');
var GitHub = require('github');
var YAML = require('yamljs');
var Author = require('./author.js');
var ImageSet = require('./imageset.js');

const GITHUB_DEFAULT = 'https://github.com/';

var github = new GitHub({
  version: "3.0.0"
});

/*github.authenticate({
  type: "oauth"
});*/

function Repo(title, link, config_url) {
  this.title = title || 'Unknown Repo';
  this.link = link || GITHUB_DEFAULT;
  this.config_url = config_url || GITHUB_DEFAULT;
};
Repo.prototype.initConfig = function() {
  if (this.config_url && this.config_url !== GITHUB_DEFAULT) {
    var comps = this.config_url.split('/', 6);
    for (var i = 0; i < 4; i++) {
      comps.shift();
    }
    if (comps.length == 2) {
      var user = comps[0];
      var repo = comps[1];
      var options = {
        user: user,
        repo: repo,
        path: 'igme_config.yml'
      };
      var that = this;
      github.repos.getContent(options, function(err, res) {
        if (err) {
          console.error('content fetch failed');
          console.error(err);
        }
        if (res && res.content) {
          var encoded = new Buffer(res.content, 'base64');
          var decoded = encoded.toString();
          if (decoded) {
            var config = YAML.parse(decoded);
            if (config) {
              that.title = config.title || that.title;
              that.author = null;
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
            } else {
              console.error('Could not parse YAML for ' + decoded);
            }
          } else {
            console.error('Could not decode ' + encoded);
          }
        }
      });
    }

  }
}
module.exports.Repo = Repo;
module.exports.github = github;
