var mongoose = require('mongoose');
var Q = require('q');
var github = require('../services/github');
var GITHUB_DEFAULT = require('../helpers/constants').GITHUB_DEFAULT;
var Author = require('./author');
var ImageSet = require('./imageset');

var parseUrl = function (url) {
    var comps = url.split('/', 6);
    for (var i = 0; i < 4; i++) {
        comps.shift();
    }
    if (comps.length === 2)
        return comps;
    else
        return [comps[0], comps[1]];
}

var RepoSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Unknown Repo'
    },
    link: {
        type: String,
        default: GITHUB_DEFAULT
    },
    author: Author.Schema,
    description: String,
    language: String,
    image: ImageSet.Schema,
    tags: [String],
    extra_resources: [String]
});

RepoSchema.methods.initConfig = function (config_url) {
    if (!config_url) {
        throw new Error("no url supplied");
    }
    var parsed = parseUrl(config_url);
    var user = parsed[0];
    var repo = parsed[1];
    var that = this;
    var deferred = Q.defer();
    var configPromise = Q.nfbind(github.getConfig);
    configPromise({
        user: user,
        repo: repo
    })
    .then(function (config) {
        that.title = config.title || that.title;
        that.author = config.author ?
            new Author.Author({
                name: config.author.name,
                email: config.author.email,
                github: config.author.github
            }) :
            new Author.Author({});
        that.description = config.description || 'No description found';
        that.language = config.language || 'None';
        that.image = config.image ?
            new ImageSet.ImageSet({
                icon: config.image.icon,
                banner: config.image.banner
            }) :
            new ImageSet.ImageSet({});
        that.tags = config.tags || [];
        that.extra_resources = config.extra_resources || [];
        console.log('Parsed the project config for ' + that.title);
        deferred.resolve();
    })
    .catch(function (err) {
        console.error(err);
    });
    return deferred.promise;
};

var Repo = mongoose.model('Repo', RepoSchema);

RepoSchema.pre('save', function (next) {
    var that = this;
    Repo.find({ title: that.title, link: that.link }, function (err, docs) {
        if (!docs.length) {
            next();
        }
    });
});

module.exports = {
    Repo: Repo,
    Schema: RepoSchema
};
