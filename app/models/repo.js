// mongoose, in addition to setting up the connection to mongodb, is also used to define the kinds of objects
// that we store there.
// These definitions are called Schemas.
var mongoose = require('mongoose');
var Q = require('q');
var GITHUB_DEFAULT = require('../helpers/constants').GITHUB_DEFAULT;
var Author = require('./author');

// OBSOLETE
// TESTING REQUIRED BEFORE REMOVAL
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
    series: String,
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
    tags: [String],
    extra_resources: [{title: String, link: String}],
    connections: [{series: String, title: String}]
});

RepoSchema.methods.initConfig = function (raw, github) {
    var that = this;
    return github.config({
        user: raw.owner.login,
        repo: raw.name
    })
    .then((config) => {
        if (typeof config !== 'undefined') {
            that.series = config.series || that.name;
            that.title = config.title || that.name;
            that.author = config.author ?
                new Author.Author({
                    name: config.author.name,
                    email: config.author.email,
                    github: config.author.github
                }) :
                new Author.Author({});
            that.description = config.description || 'No description found';
            that.language = config.language || null;
            // For the following 3 properties, yes it should be != and not !==.
            // To see why open up a javascript console and see what the difference is between
            //   > [][0] != null
            // and
            //   > [][0] !== null
            // (hint: one returns true, the other returns false)
            // In general, these follow the following logic:
            //   Does the thing even exist?
            //   Is it an array?
            //   Is it a non-empty array?
            //   Does the first element have the correct format (if so, we'll assume they all do)?
            //   If so, return the raw response.
            //   Otherwise .map it to be correct
            that.tags = (config.tags && (config.tags.constructor === Array) && (config.tags[0] != null)) ? config.tags : [];
            that.extra_resources = (config.extra_resources && (config.extra_resources.constructor === Array) && (config.extra_resources[0] != null)) ?
                                    ((config.extra_resources[0].title && config.extra_resources[0].link) ? config.extra_resources
                                     : config.extra_resources.map(link => { return {title: link, link: link}}))
                                    : [];
            that.connections = (config.connections && (config.connections.constructor === Array) && (config.connections[0] != null)) ?
                                    ((config.connections[0].series && config.connections[0].title) ? config.connections
                                     : config.connections.map(title => { return {series: title, title: title}}))
                                    : [];
            console.log('Parsed the project config for ' + that.title);
        } else {
            that.title = that.name;
            that.series = that.name;
            that.author = new Author.Author({});
            that.description = 'No description found';
            that.language = null;
            that.tags = [];
            that.extra_resources = [];
            that.connections = [];
            console.log('No igme_config.yml for ' + that.name);
        }
    })
    .catch((err) => {
        console.error(err);
    });
};

var Repo = mongoose.model('Repo', RepoSchema);

// Before saving a repo, check to see if it already exists.
// If it does, don't save it again.
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
