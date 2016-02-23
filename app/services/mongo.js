var mongoose = require("mongoose");

/*
Options: 
{
    open: [Function],
    error: [Function]
}
*/
module.exports = function (opts) {
    var uriStr = process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL;
    if (!uriStr)
        throw new Error('No MongoDB URI could be found. Check your environment variables.');
    var db = mongoose.connection;

    db.on('error', opts.error || console.error.bind(console, 'connection error:'));
    db.once('open', opts.onConnect || console.log.bind(console, 'DB Connected'));

    mongoose.connect(uriStr);

    return db;
};