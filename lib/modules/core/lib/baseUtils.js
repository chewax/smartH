'use strict'

var errorHandler = require ('../errors/errorHandler');
var bcrypt = require('bcryptjs');
var config = require('../../../config/config');
var customErr = require('../errors/customErrors');
var _ = require('lodash');

module.exports = class Utils {
    
    constructor () {
        this.errorHandler = errorHandler;
        this.config = config;
        this.bcrypt = bcrypt;
        this.customErr = customErr;
        this._ = _;
    }

    /**
     * Generates salt and hash async.
     * @param pass String
     * @returns {Promise}
     */
    hashPasswordAsync (pass) {

        return new Promise (function (resolve, reject) {

            bcrypt.genSalt( config.salt_work_factor, function(err, salt) {

                if(err) {
                    // Error Generating Salt
                    var e = new customErr.severeError("Error generating salt when creating user.");
                    reject(e);
                }


                // HASH
                bcrypt.hash(pass, salt, function(err, hash) {

                    if(err) {
                        // Error Hashing
                        var e = new customErr.severeError("Error hashing salted password.");
                        reject(e);
                    }

                    resolve(hash);

                });

            });
        });

    };

    /**
     * Generates salt and hash sync.
     * @param pass String
     * @returns hash String
     */
    hashPasswordSync (pass) {

        var salt = bcrypt.genSaltSync(config.salt_work_factor);
        var hash = bcrypt.hashSync(pass, salt);
        return hash;

    };

    bcryptCompareAsync (sentPassword, loggedUser){

        return new Promise( function (resolve, reject) {

            // Compare retrieved password with sent password using salt.
            bcrypt.compare(sentPassword, loggedUser.credentials.password, function (err, isMatch) {

                if (err) {
                    var e = new customErr.severeError("Internal error comparing hashes.");
                    reject(e);
                }

                if (isMatch) {
                    resolve(loggedUser);
                }

                else {
                    var e = new customErr.notAuthorizedError("Wrong username or password.");
                    reject(e);
                }

            });
        });
    }
    
}