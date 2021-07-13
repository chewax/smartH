(function () {
    
    'use strict';

    let mongoose = require('mongoose');
    let config = require('./config');

    mongoose.Promise = global.Promise;
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindeAndModify', true);

    module.exports.connect = () => {
        return new Promise((resolve, reject) => {
            mongoose.connect(config.mongo_connection.server, {
                useNewUrlParser: true
            }).then(resolve, reject);
        })
    }

    module.exports.mongoose = mongoose;

}).call(this);