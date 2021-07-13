(function () {
    'use strict';

    require('dotenv').config();

    module.exports = {

        mongo_connection: {
            server: process.env.DB_SERVER,
            database: process.env.DB_COLL
        },

        api: {
            version: '/api/v1'
        },

        server : {
            port: (process.env.PORT || 5000)
        },

        jwt: {
            secret:process.env.JWT_SECRET,
            expiration: 5*60*60*24 // 5 days in seconds
        },

        salt_work_factor: 10
    }

}).call(this);
