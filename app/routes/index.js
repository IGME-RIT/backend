
// middleware for dynamically or statically enabling CORS in express/connect applications
// cors: Cross-origin resource sharing
// It allows a resource to request resources from different domains than the one which the first resource itself serves.
var cors = require('cors');

var middleware = require('../middleware');
var syncRoutes = require('./sync');

module.exports = function(repos) {
    var router = function(app) {
        var repoRoutes = require('./repos')(repos);
        // If the request is for the /repos endpoint, use ./repos
        app.use('/repos', repoRoutes);
        // If the request is for the /sync endpoint, use ./sync
        app.use('/sync', syncRoutes);
        
        // options is not an express specific method, but rather an http method
        // so if you're looking through the express documentation and can't find it,
        // look for app.METHOD instead
        app.options('/', cors());
        
        // GET /
        // This is the default page
        app.get('/',
            cors(),
            middleware.requiresSecure, // Requires secure is either requiresSecure or bypassSecure (in a dev env)
            // req: request
            // res: response
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
