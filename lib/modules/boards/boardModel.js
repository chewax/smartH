(function () {

    'use strict';

    var mongoose = require('../../config/database').Mongoose;


    var boardSchema = new mongoose.Schema({

            boardName: {type: String},
            boardId: {type: String, unique: true},
            boardMAC: {type: String, unique: true},
            boardType: {type: String, enum: ["Sensor", "Actuator"]},

            createdAt: {type: Date, default: Date.now},
            updatedAt: {type: Date, default: Date.now}
        },

        {
            collection: 'Boards'
        }
    );

    var Board = mongoose.model('Board', boardSchema);

    module.exports = Board;

}).call(this);