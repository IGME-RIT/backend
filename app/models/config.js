// The top level file for the config "half"
// Configuration is a singleton object that manages MongoDB

// fs is the Node filesystem. Not currently in use
// TODO test to see if it can be removed safely?
var fs = require('fs');

// For loading excluded_repos.yml
var YAML = require('yamljs');

// A promise library
// The only method used in this file is Q.nfbind
var Q = require('q');

var Repo = require('./repo').Repo;
var sync = require('../helpers/sync');
var auth = require('../services/auth');
var db = require('../services/mongo')({
    onConnect: onConnect,
    error: null
});

// A helper to load json or yml files
function loadFile(path, file, ext) {
    if (ext == 'json')
        return require(path + file + '.' + ext);
    else if (ext == 'yml')
        return YAML.load(path + file + '.' + ext);
    else
        return {};
}

function onConnect() {
    Configuration.getInstance().initialized = true;
}

function open() {
    var config = Configuration.getInstance();
    var excluded = config.excluded;
    var client = config.githubClient;
    return sync(excluded, client);
}

// Configuration follows the singleton pattern
var Configuration = (function () {
    function ConfigurationPrivate() {
        this.excluded = loadFile('config/', 'excluded_repos', 'yml');
        this.passport = auth.passport;
        this.githubClient = auth.github;
        this.initialized = false;
    }

    ConfigurationPrivate.prototype.search = function (opts, cb) {
        Repo.find(opts || {}, cb);
    };

    ConfigurationPrivate.prototype.sync = function () {
        this.initialized = false;
        var that = this;
        // Creates a promise-returning function from a Node.js-style function
        var removePromise = Q.nfbind(Repo.remove.bind(Repo));
        return removePromise({}).then(open).then(function (repoCount) {
            that.initialized = true;
            return repoCount;
        });
    }

    // This is where the singleton is stored
    var instance;

    function initInstance() {
        var inst = new ConfigurationPrivate();
        return inst;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = initInstance();
            }
            return instance;
        }
    };
})();

module.exports = Configuration;
