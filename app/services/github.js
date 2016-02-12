var GitHub = require('github');
var YAML = require('yamljs');
var GITHUB_DEFAULT = require('../helpers/constants.js').GITHUB_DEFAULT;

var github = new GitHub({
  version: "3.0.0"
});

/*github.authenticate({
  type: "oauth"
});*/


module.exports = {
  client: github,
  getConfig: function(options, cb) {
    if (!options) {
      console.error('Can\'t get a config without a destination.');
      return;
    } else if (!options.user || !options.repo) {
      console.error('Can\'t get a config without a destination.');
      return;
    }
    var that = this;
    github.repos.getContent({
      user: options.user,
      repo: options.repo,
      path: 'igme_config.yml'
    }, function(err, res) {
      if (err || !res) {
        console.error('content fetch failed');
        console.error(err);
        cb(err, null);
        return
      } else if (res && res.content) {
        var encoded = new Buffer(res.content, 'base64');
        var decoded = encoded.toString();
        if (decoded) {
          var config = YAML.parse(decoded);
          if (config) {
            cb(null, config);
          } else {
            cb(new Error('Could not parse decoded content'), null);
            return;
          }
        } else {
          cb(new Error('Could not decode content'), null);
          return;
        }
      }
    });
  }
};
