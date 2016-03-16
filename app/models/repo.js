var mongoose = require('mongoose');
var Q = require('q');
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
    title: String,
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: GITHUB_DEFAULT,
        required: true
    },
    author: Author.Schema,
    description: String,
    language: String,
    image: ImageSet.Schema,
    tags: [String],
    extra_resources: [String],
    connections: [String]
});

RepoSchema.methods.initConfig = function (raw, github) {
    var that = this;
    return github.config({
        user: raw.owner.login,
        repo: raw.name
    })
    .then(function (config) {
        that.title = config.title || that.name;
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
        that.connections = config.connections || [];
        console.log('Parsed the project config for ' + that.title);
    })
    .catch(function (err) {
        console.error(err);
    });
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
