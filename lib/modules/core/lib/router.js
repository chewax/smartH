import errorHandler from '../errors/errorHandler.js';

export default class Router {

    constructor (controller, baseRoute) {
        this.controller = controller;
        this.baseRoute = baseRoute;
        this.errorHandler = errorHandler;
    }

    appendProtectedRoutes (router){
        router.get('/'+this.baseRoute, this.controller.find.bind(this.controller));
        router.get('/'+this.baseRoute + '/find', this.controller.find.bind(this.controller));
        router.get('/'+this.baseRoute + '/:_id', this.controller.retrieve.bind(this.controller));
        router.post('/'+this.baseRoute, this.controller.create.bind(this.controller));
        router.put('/'+this.baseRoute + '/:_id', this.controller.update.bind(this.controller));
        router.delete('/'+this.baseRoute + '/:_id', this.controller.delete.bind(this.controller));

        return router;
    }

    appendPublicRoutes (router){
        return router;
    }

    appendAll (router) {
        router = this.appendPublicRoutes(router);
        router = this.appendProtectedRoutes(router);
        return router;
    }

}
