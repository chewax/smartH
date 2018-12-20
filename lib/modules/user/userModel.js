(function () {

    'use strict';

    var mongoose = require('../../config/database').Mongoose;
    var utils = require('../core/utils');
    var userCredentials = require('./schemas/userCredentials');

    var userSchema = new mongoose.Schema({

            dni: String,
            firstName: String,
            lastName: String,
            email: String,

            credentials:    userCredentials,

            createdAt: {type: Date, default: Date.now},
            updatedAt: {type: Date, default: Date.now}

        },

        {
            collection: 'Users'
        }
    );

    var User = mongoose.model('User', userSchema);

    module.exports = User;

}).call(this);