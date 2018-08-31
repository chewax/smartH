(function () {
    'use strict';

    var user = require('../users/userModel');
    var config = require('../../config/config');
    var bcrypt = require('bcryptjs');
    var jwt = require('jsonwebtoken');
    var logger = require('../log/logger').getLogger();
    var customErr = require('../core/errors/customErrors');
    var utils = require('../core/utils');
    var errorHandler = require('../core/errors/errorHandler');

    module.exports.authenticate = function (req, res) {

        user.findOne( {'credentials.username': req.body.username})
            .then( function (loggedUser) {

                if (!loggedUser) throw new customErr.notAuthorizedError("User not found");
                return utils.bcryptCompareAsync(req.body.password, loggedUser);

            })

            .then( function(loggedUser) {

                var jwtUser = {
                    _id: loggedUser._id,
                    doc: loggedUser.doc,
                    firstName: loggedUser.firstName,
                    lastName: loggedUser.lastName,
                    email: loggedUser.email
                };

                var token = jwt.sign( jwtUser, config.jwt.secret, { expiresIn: config.jwt.expiration } ) ;
                res.status(200).json({ token: token, user: jwtUser });

            })
            .catch(function (err) { errorHandler.handleErrors(err, req, res) });

    };

}).call(this);