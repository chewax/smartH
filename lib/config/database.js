(function () {
    
    'use strict';

    let Mongoose = require('mongoose');
    Mongoose.Promise = require('bluebird'); //Use bluebird...mongoose does not accept .catch
    let config = require('./config');
    let _ = require('lodash');
    let logger = require('../modules/core/logger');
    
    var lastModPlugin = require('../modules/core/plugins/lastModifiedPlugin');
    var findOneOrCreatePlugin = require('../modules/core/plugins/findOneOrCreatePlugin');
    
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
            useMongoweb: true,
            auth: {
                authdb: 'admin'
            }
        };

        var url = 'mongodb://'+config.mongo_connection.url+':'+config.mongo_connection.port+'/'+config.mongo_connection.database;

        Mongoose.connect(url, options);
    }

    var db = Mongoose.connection;

    logger.trace("Connecting to database...");

    db.on('error', () => {
        logger.error("Database connection Error"); 
    });
    db.once('open', () => { 
        logger.success("Database connection success!!!"); 
    });

    //Add Global Plugins before returning...
    Mongoose.plugin(lastModPlugin);
    Mongoose.plugin(findOneOrCreatePlugin);

    exports.Mongoose = Mongoose;
    exports.db = db;

}).call(this);