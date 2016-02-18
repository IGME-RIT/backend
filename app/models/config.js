var fs = require('fs');
var YAML = require('yamljs');
var sync = require('../helpers/sync.js');
var db = require('../services/mongo.js')({
    open: open,
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

function open() {
    var excluded = Configuration.getInstance().excluded;
    sync(excluded, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        Configuration.getInstance().initialized = true;
    });
}

var Configuration = (function () {
    var ConfigurationPrivate = function () {
        this.excluded = loadFile('config/', 'excluded_repos', 'yml');
        this.initialized = false;
    };

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
