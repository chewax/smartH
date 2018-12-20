(function () {
    'use strict';

    let model = require('./loggerModel');
    let Controller = require('../core/lib/controller');

    class LoggerController extends Controller {

        find (req, res){

            var query = {};
            if (req.query._id) query["_id"] = req.query._id;
            if (req.query.name) query["name"] = req.query.name;
            if (req.query.sensor) query["sensor"] = req.query.sensor;
            if (req.query.actuator) query["actuator"] = req.query.actuator;
            if (req.query.mac) query["mac"] = req.query.mac;
            if (req.query.ip) query["ip"] = req.query.ip;

            //TODO Add Pagination
            this.model.find(query)
                .then ( (result) => { res.status(200).json(result)} )
                .catch( (err) => {this.errorHandler.handleError(err, req, res) })

        }
    }

    module.exports = new LoggerController(model);

}).call(this);