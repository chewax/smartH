(function(){
	'use strict;'

	var userController = require('./userController');
	var Router = require('../core/lib/router');

  class UserRouter extends Router {
		appendPublicRoutes (router){
			super.appendPublicRoutes(router);
			router.post('/signup', userController.create.bind(userController));
			return router;
		}
	}

	module.exports = new UserRouter(userController, 'users');

}).call(this);
