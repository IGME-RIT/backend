var fs = require('fs');
var YAML = require('yamljs');
var sync = require('./sync.js');

var loadFile = function(path, file, ext) {
  if (ext == 'json')
    return require(path + file + '.' + ext);
  else if (ext == 'yml')
    return YAML.load(path + file + '.' + ext);
  else
    return {};
};

var Configuration = (function() {
  var ConfigurationPrivate = function() {
    this.excluded = loadFile('config/', 'excluded_repos', 'yml');
  };
  ConfigurationPrivate.prototype.getRepos = function(cb) {
    if (this.repos) {
      cb(null, this.repos);
    } else {
      sync(this.excluded, function(err, repos) {
        if (err) {
          cb(err, null);
        } else {
          this.repos = repos;
          cb(null, this.repos);
        }
      });
    }
  };

  var instance;

  function initInstance() {
    var inst = new ConfigurationPrivate();
    return inst;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = initInstance();
      }
      return instance;
    }
  };
})();

module.exports = Configuration;
