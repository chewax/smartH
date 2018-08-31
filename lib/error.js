(function () {
    'use strict';

    var logger =  require("./logger");

    class ErrorHandler {
        
        constructor () {
            this.logger = logger;
        }

        handleError (err, req, res) {
            if (res) {
                
                var result = { 
                    status: "Internal Error",
                    error: err 
                };

                this.logger.error(err);                
                res.status(200).json(result);
            }
        
        }

        
        handleUncaughtErrors (err, req, res, next) {

            var requestInfo = { ip: req.connection.remoteAddress };

            var result = { 
                status: "Internal Error",
                error: err 
            };

            if (err.name === 'UnauthorizedError') {
                result.status = "Unauthorized";
                this.logger.warn('Access attempt with invalid token: ' + JSON.stringify(requestInfo) );
                res.status(401).json(result);
                return;
            }

            if (err.name === 'SyntaxError') {
                this.logger.info('Bad request, syntax error: ' + JSON.stringify(requestInfo));
                result.status = "Bad request";
                res.status(401).json(result);
                return;
            }

            //OTHERWISE
            this.logger.error('Unhandled Error: ' + err.message );
            result.status = "Internal Server Error";
            res.status(500).json(result);

        };

    }

    module.exports.handler = new ErrorHandler();

}).call(this);