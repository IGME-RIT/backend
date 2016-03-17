var Q = require('q');
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
