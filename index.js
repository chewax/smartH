(function () {

    'use strict';

    let express = require('express');
    let app = express();
    let server = require('http').Server(app);
    let io = require('socket.io')(server);
    let bodyParser = require('body-parser');
    let cors = require('./lib/modules/core/cors');
    let config = require('./lib/modules/core/config');
    let logger = require('./lib/modules/core/logger');
    let publicRoutes = require('./lib/routes/public');
    let protectedRoutes = require('./lib/routes/protected');

    require('./lib/modules/core/socket').initSocketIOEvents(io);
    require('./lib/modules/core/database');

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


