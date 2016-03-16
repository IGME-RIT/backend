var fs = require('fs');
var YAML = require('yamljs');
var Q = require('q');

var Repo = require('./repo').Repo;
var sync = require('../helpers/sync');
var auth = require('../services/auth');
var db = require('../services/mongo')({
    onConnect: onConnect,
    error: null
});

var lastSyncTime = process.env.LAST_SYNC || 0;

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
        var removePromise = Q.nfbind(Repo.remove.bind(Repo));
        return removePromise({}).then(open).then(function (repoCount) {
            that.initialized = true;
        });
    }

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
