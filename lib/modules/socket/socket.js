import log from '../core/logger.js';
import forecast from '../forecast/forecastController.js';
import dashboard from '../dashboard/dashboardController.js';
import socket from 'socket.io';
export default class Socket {

    initialize(server){
        log.info('Initializing Socket Events.');

        this.io = socket(server);

        this.io.on('connection', (socket) => {
            dashboard.initIO(socket, this.io);
            forecast.initIO(socket, this.io);
        });          
    }
}


