'use strict'

var logger =  require("../logger");
var messages = require("./systemMessages");

class ErrorHandler {

    constructor () {
        this.logger = logger;
        this.messages = messages;
    }

    handleError (err, req, res) {
        if (res) {
            var result = {
                errors: {internal: err.message}
            }
            this.logger.error(err);

            res.status(200).json(result);
        }
    }


    handleUncaughtErrors (err, req, res, next) {

        console.log(err);

        var requestInfo = {
            ip: req.connection.remoteAddress
        }

        if (err.name === 'UnauthorizedError') {
            this.logger.warn('Access attempt with invalid token: ' + JSON.stringify(requestInfo) );
            res.status(401).send(this.messages.data.missingOrIncomplete("Token"));
            return;
        }

        if (err.name === 'SyntaxError') {
            this.logger.info('Bad request, syntax error: ' + JSON.stringify(requestInfo) );
            res.status(401).send(this.messages.request.badRequest(err.message));
            return;
        }

        //OTHERWISE
        // console.log(">>>>> " + this);
        if(this){
          this.logger.error('Unhandled Error: ', err);
          res.status(500).send(this.messages.generic());
        }else{
          // why there is no this?
          res.status(500).send();
        }


    };
}

var errorHandler = new ErrorHandler();

module.exports = errorHandler;
