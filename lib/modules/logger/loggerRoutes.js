(function(){
	'use strict;'

	var loggerController = require('./loggerController');
	var Router = require('../core/lib/router');

  	class LoggerRouter extends Router {
	
	}

	module.exports = new LoggerRouter(loggerController, 'logs');

}).call(this);
