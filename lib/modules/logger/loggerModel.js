(function () {

    'use strict';

    var mongoose = require('../../config/database').Mongoose;

    var loggerSchema = new mongoose.Schema({

            name: {type: String},
            mac: {type: String},
            ip: {type: String},
            action: {type: String},
            sensor: {type: String},
            actuator: {type: String},
            
            data: [{
                name: {type: String},
                value: {type: Number}
            }]

        },

        {
            collection: 'Logs'
        }
    );

    var Logger = mongoose.model('Logger', loggerSchema);

    module.exports = Logger;

}).call(this);