var fs = require('fs');
var YAML = require('yamljs');
var Repo = require('./repo.js').Repo;
var sync = require('../helpers/sync.js');
var db = require('../services/mongo.js')({
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

function onConnect () {
    Configuration.getInstance().initialized = true;
}

function open(cb) {
    var excluded = Configuration.getInstance().excluded;
    sync(excluded, cb);
}

var Configuration = (function () {
    function ConfigurationPrivate() {
        this.excluded = loadFile('config/', 'excluded_repos', 'yml');
        this.initialized = false;
    }

    ConfigurationPrivate.prototype.search = function (opts, cb) {
        Repo.find(opts || {}, cb);
    };

    ConfigurationPrivate.prototype.sync = function (cb) {
        this.initialized = false;
        open(function (err, repoCount) {
            if (err) {
                console.error(err);
                cb(err, null);
            } else {
                Configuration.getInstance().initialized = true;
                cb(null, repoCount);
            }
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
