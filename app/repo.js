//var Enum = require('../lib/enum.js');
var GitHub = require('github');
var YAML = require('yamljs');
var Author = require('./author.js');

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
      github.repos.getContent(options, function(err, res) {
        if (err) {
          console.log('content fetch failed');
          console.log(err);
        }
        if (res && res.content) {
          var config = YAML.parse(atob(res.content));
          if (config) {
            this.title = config.title || this.title;
            this.author = null;
            if (config.author) {
              this.author = new Author(config.author.name,
                                       config.author.email,
                                       config.author.github);
            }
            this.description = config.description || 'No description found';
            this.language = config.language || 'None';
            this.banner = config.banner || '#';
            this.tags = config.tags || [];
            this.extra_resources = config.extra_resources || [];
          }
        }
      });
    }

  }
}
module.exports.Repo = Repo;
module.exports.github = github;
