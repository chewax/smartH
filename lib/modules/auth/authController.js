(function () {
    'use strict';

    var user = require('../user/userModel');
    var config = require('../../config/config');
    var bcrypt = require('bcryptjs');
    var jwt = require('jsonwebtoken');
    var customErr = require('../core/errors/customErrors');
    var utils = require('../core/utils');
    var errorHandler = require('../core/errors/errorHandler');
    var logger = require('../core/logger');

    module.exports.authenticate = function (req, res) {

        console.log(req.body);

        user.findOne( {'credentials.username': req.body.username })
            .then( function (loggedUser) {
                
                console.log(loggedUser);

                if (!loggedUser) throw new customErr.notAuthorizedError("User not found");
                return utils.bcryptCompareAsync(req.body.password, loggedUser);

            })

            .then( function(loggedUser) {

                var jwtUser = {
                    _id: loggedUser._id,
                    dni: loggedUser.dni,
                    firstName: loggedUser.firstName,
                    lastName: loggedUser.lastName,
                    email: loggedUser.email
                };

                var token = jwt.sign( jwtUser, config.jwt.secret, { expiresIn: config.jwt.expiration } ) ;
                res.status(200).json({ token: token, user: jwtUser });

            })
            .catch(function (err) { errorHandler.handleError(err, req, res) });

    };

    module.exports.renderLogin = function (req, res) {
        res.render('login');
    }

}).call(this);
