// If you're looking for where igme_config.yml actually gets read, it's here.

var Q = require('q');

// OctoKat is a GitHub client for NodeJS
// It provides a minimal higher-level wrapper around GitHub's API
var Octokat = require('octokat');
var YAML = require('yamljs');

var octo = new Octokat({
});

module.exports = {
    client: octo,
    authorize: function(token) {
        this.client = new Octokat({
            token: token
        });
    },
    config: function(options) {
        if (!options) {
            console.error('Can\'t get a config without a destination.');
            return;
        } else if (!options.user || !options.repo) {
            console.error('Can\'t get a config without a destination.');
            return;
        }
        return this.client.repos(options.user, options.repo)
            .contents('igme_config.yml')
            .read()
            .then((contents) => {
                var config = YAML.parse(contents);
                return config;
            })
            .catch((err) => {
                console.error(err);
            });
    }
};
