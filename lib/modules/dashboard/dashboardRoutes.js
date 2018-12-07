(function(){

    'use strict';

    var dashboardController = require('./dashboardController');

    module.exports.appendProtectedRoutes = function(router){
        // router.get('/dashboard', dashboardController.renderDashboard);
        return router;
    }

    module.exports.appendPublicRoutes = function(router){
        router.get('/dashboard', dashboardController.renderDashboard);
        return router;
    }

}).call(this)