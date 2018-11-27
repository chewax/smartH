(function () {
    'use strict';

    var express = require('express');
    var router = express.Router();
    var {boards} = require('../modules/dashboard/dashboardController');

    router.get('/', function (req, res) {
                
        res.render('dashboard', {
            devices: boards
        });

    });
    
    module.exports = router;

}).call(this);
