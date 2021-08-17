import log from '../core/logger.js';
import forecast from '../forecast/forecastController.js';
import dashboard from '../dashboard/dashboardController.js';
import core from '../core/coreController.js';
import avwx from '../forecast/avwxController.js';
import socket from 'socket.io';
export default class Socket {

    initialize(server){
        log.info('Initializing Socket Events.');

        this.io = socket(server);
      
        this.io.on('connection', (socket) => {
            core.initIO(socket,this.io);
            dashboard.initIO(socket, this.io);
            forecast.initIO(socket, this.io);
            avwx.initIO(socket, this.io);
        });          
    }
}


