
var Configuration = require('./app/config.js');

var api = require('./app/api.js')(Configuration.repos);
api.listen(process.env.PORT || 5000);
