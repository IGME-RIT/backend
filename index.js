/* global process */
var fs = require('fs');
var https = require('https');

const HTTPS_OPTIONS = {
    key: fs.readFileSync('./config/atlas-key.key'),
    cert:  fs.readFileSync('./config/atlas-cert.crt')
};

var app = require('./app/api')();

var PORT = process.env.PORT || 5000;
/* HACK: FIX LATER */
var HOST = 'localhost';

var server = https.createServer(HTTPS_OPTIONS, app).listen(PORT, HOST);

console.log('Started Atlas server listening on %s:%s', HOST, PORT);