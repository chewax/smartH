(function(){
    'use strict';

    let log = require('../core/logger');
    let forecast = require('../forecast/forecastController');
    let dashboard = require('../dashboard/dashboardController');

    class Socket {

        initialize(server){
            log.info("Initializing Socket Events.");

            this.io = require('socket.io')(server);

            this.io.on('connection', (socket) => {
                dashboard.initIO(socket, this.io);
                forecast.initIO(socket, this.io);
            });          
        }

        send(command){

        }

    }

    module.exports = Socket;

}).call(this);
