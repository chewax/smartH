(function () {
    'use strict';

    let model = require('./boardModel');
    let Controller = require('../core/lib/controller');

    class BoardController extends Controller {

    }

    module.exports = new BoardController(model);

}).call(this);