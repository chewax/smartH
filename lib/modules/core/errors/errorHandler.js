'use strict';

import logger from '../logger.js';

class ErrorHandler {

    constructor () {
        this.logger = logger;
    }

    handleError (err, req, res) {
        if (res) {
            var result = {
                errors: {internal: err.message}
            };
            this.logger.error(err);

            res.status(200).json(result);
        }
    }


    handleUncaughtErrors (err, req, res, next) {
        var requestInfo = {
            ip: req.connection.remoteAddress
        };

        if (err.name === 'UnauthorizedError') {
            this.logger.warn('Access attempt with invalid token: ' + JSON.stringify(requestInfo) );
            res.status(401).send(err.message);
            return;
        }

        if (err.name === 'SyntaxError') {
            this.logger.info('Bad request, syntax error: ' + JSON.stringify(requestInfo) );
            res.status(401).send(err.message);
            return;
        }

        //OTHERWISE
        // console.log(">>>>> " + this);
        if(this){
            this.logger.error('Unhandled Error: ', err);
            res.status(500).send('Error');
        }else{
            // why there is no this?
            res.status(500).send();
        }

        next();
    }
}

export default new ErrorHandler();
