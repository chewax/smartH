(function () {
    
    'use strict';

    let Mongoose = require('mongoose');
    Mongoose.Promise = require('bluebird'); //Use bluebird...mongoose does not accept .catch
    let config = require('./config');
    let _ = require('lodash');
    let logger = require('./logger');

    //load database
    if (_.isEmpty(config.mongo_connection.username) || _.isNil(config.mongo_connection.username)){
        Mongoose.connect('mongodb://' + config.mongo_connection.url + '/' + config.mongo_connection.database, { useNewUrlParser: true });
    }
    else {

        var options = {
            db: { native_parser: true },
            server: { poolSize: 10 },
            user: config.mongo_connection.username,
            pass: config.mongo_connection.password,
            useMongoClient: true,
            auth: {
                authdb: 'admin'
            }
        };

        var url = 'mongodb://'+config.mongo_connection.url+':'+config.mongo_connection.port+'/'+config.mongo_connection.database;

        Mongoose.connect(url, options);
    }

    var db = Mongoose.connection;

    logger.info("Connecting to Database...");

    db.on('error', () => {
        logger.error("Connection Error"); 
    });
    db.once('open', () => { 
        logger.info("Connection success!!!"); 
    });

    exports.Mongoose = Mongoose;
    exports.db = db;

}).call(this);