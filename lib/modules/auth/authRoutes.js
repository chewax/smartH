(function(){

    'use strict';

    var authController = require('./authController');

    module.exports.appendProtectedRoutes = function(router){

        return router;
    }

    module.exports.appendPublicRoutes = function(router){

        router.get('/login', authController.renderLogin);
        router.get('/', authController.renderLogin);
        router.post('/login', authController.authenticate);

        return router;
    }

}).call(this)
