import dataLoggerController from './dataLoggerController.js';

const appendProtectedRoutes = function(router){ return router; };
const appendPublicRoutes = function(router){
    router.post('/log', dataLoggerController.logData);
    return router;
};

export default {
    appendProtectedRoutes,
    appendPublicRoutes
};