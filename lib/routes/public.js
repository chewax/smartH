import express from 'express';
import coreRoutes from '../modules/core/coreRoutes.js';
import dahsboardRoutes from '../modules/dashboard/dashboardRoutes.js';
import dataLoggerRoutes from '../modules/dataLogger/dataLoggerRoutes.js';

let router = express.Router();

router = coreRoutes.appendPublicRoutes(router);
router = dahsboardRoutes.appendPublicRoutes(router);
router = dataLoggerRoutes.appendPublicRoutes(router);

export default router;

