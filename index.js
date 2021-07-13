(function () {

    'use strict';

    const express = require('express');
    const app = express();
    const server = require('http').Server(app);
    const bodyParser = require('body-parser');
    const cors = require('./lib/config/cors');
    const config = require('./lib/config/config');
    const logger = require('./lib/modules/core/logger');

    const publicRoutes = require('./lib/routes/public');
    const protectedRoutes = require('./lib/routes/protected');
    
    // Socket server
    let SocketServer = require('./lib/modules/socket/socket');
    let socket = new SocketServer();

    socket.initialize(server);

    require('./lib/config/database').connect();

    app.set('views', __dirname + '/views')
    app.set('view engine', 'pug')

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use('/static', express.static(__dirname + '/public'));
    app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/dist'));
    app.use(config.api.version, publicRoutes);
    app.use(config.api.version, protectedRoutes);

    server.listen(config.server.port, function () {
        logger.info(`Server UP, listening on port ${config.server.port}`);
    });

}).call(this);


