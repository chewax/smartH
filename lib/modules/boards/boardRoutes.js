(function(){
	'use strict;'

	var boardController = require('./boardController');
	var Router = require('../core/lib/router');

  	class BoardRouter extends Router {
	
	}

	module.exports = new BoardRouter(boardController, 'boards');

}).call(this);
