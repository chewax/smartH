(function(){
    'use strict';

    let log = require('./logger');
    let forecast = require('../forecast/forecastController');
    let dashboard = require('../dashboard/dashboardController');


    module.exports.initSocketIOEvents = (io) => {

        log.info("Initializing Socket Events.");

        io.on('connection', function (socket) {
            dashboard.initIO(socket, io);
            forecast.initIO(socket, io);
        });
    }

}).call(this);