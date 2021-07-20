import dashboardController from './dashboardController.js';

const appendProtectedRoutes = function(router){ return router; };
const appendPublicRoutes = function(router){
    router.get('/dashboard', dashboardController.renderDashboard);
    return router;
};

export default {
    appendProtectedRoutes,
    appendPublicRoutes
};