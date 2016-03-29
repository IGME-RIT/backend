/* global process */

var app = require('./app/api')();

var port = process.env.PORT || process.env.NODE_PORT || 5000;

app.listen(port, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('Listening on port ' + port);
});