var middleware = require('../middleware');
var syncRoutes = require('./sync');
var router = function (app) {
    var repoRoutes = require('./repos')(app);
    
    app.use('/repos', repoRoutes);
    app.use('/sync', syncRoutes);
    app.get('/',
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

module.exports = router;
