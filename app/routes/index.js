var cors = require('cors');

var middleware = require('../middleware');
var syncRoutes = require('./sync');

module.exports = function(repos) {
    var router = function(app) {
        var repoRoutes = require('./repos')(repos);
        app.use('/repos', repoRoutes);
        app.use('/sync', syncRoutes);
        app.options('/', cors());
        app.get('/',
            cors(),
            middleware.requiresSecure,
            function(req, res) {
                res.json({
                    message: 'Atlas backend - 2016',
                    serverTime: Date.now()
                });
            }
        );

        return app;
    };
    return router;
}
