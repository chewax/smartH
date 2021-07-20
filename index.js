import express from 'express';
import config from './lib/config/config.js';
import cors from './lib/config/cors.js';
import logger from './lib/modules/core/logger.js';
import http from 'http';    
import publicRoutes from './lib/routes/public.js';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const app = express();
const server = http.Server(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Socket server
import SocketServer from './lib/modules/socket/socket.js';
let socket = new SocketServer();

socket.initialize(server);

import db from './lib/config/database.js';
db.connect();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(cors);
app.use('/static', express.static(__dirname + '/public'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use(config.api.version, publicRoutes);

server.listen(config.server.port, function () {
    logger.info(`Server UP, listening on port ${config.server.port}`);
});

