
var Configuration = require('./config.js');

var api = require('./app/api.js')(Configuration.repos);
api.listen(3000);
