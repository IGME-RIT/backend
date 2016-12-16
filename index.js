/* global process */

// require('./app/api') returns a function that returns the app
var app = require('./app/api')();

var port = process.env.PORT || process.env.NODE_PORT || 5000;

// app.listen starts a Unix socket server listening for connections on the given path.
// Once it begins listening, the callback is called.
app.listen(port, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('Listening on port ' + port);
});