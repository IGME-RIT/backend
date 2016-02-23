var mongoose = require('mongoose');

var AuthorSchema = new mongoose.Schema({
    name: { type: String, default: 'Unknown author' },
    email: { type: String, default: 'bad@email.com' },
    github: { type: String, default: 'Unknown GitHub name' }
});

AuthorSchema.pre('save', function (next) {
    var that = this;
    Author.find({ name: that.name }, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('Author exists: ', that.name);
            next(new Error("User exists!"));
        }
    });
});

var Author = mongoose.model('Author', AuthorSchema);

module.exports = {
    Author: Author,
    Schema: AuthorSchema
};