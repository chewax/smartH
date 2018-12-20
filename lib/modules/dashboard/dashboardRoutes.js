(function(){
	'use strict;'

	var dashboardController = require('./dashboardController');
	var Router = require('../core/lib/router');

  class DashboardRouter extends Router {
		appendPublicRoutes (router){
            super.appendPublicRoutes(router);
            router.get('/dashboard', dashboardController.renderDashboard.bind(dashboardController));
			return router;
		}
	}

	module.exports = new DashboardRouter(dashboardController, 'dashboard');

}).call(this);
