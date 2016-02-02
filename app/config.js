var fs = require('fs');
var YAML = require('yamljs');
var sync = require('./sync.js');

var loadFile = function (path, file, ext) {
  if (ext == 'json')
    return require(path+file+'.'+ext);
  else if (ext == 'yml')
    return YAML.load(path+file+'.'+ext);
  else
    return {};
};

var Configuration = {
    excluded: loadFile('config/','excluded_repos','yml')
};

require('./sync.js')(Configuration.excluded, function (err, repos) {
  Configuration.repos = repos;
});

module.exports = Configuration;