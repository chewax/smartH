(function () {
    'use strict';

    require('dotenv').config();

    module.exports = {

        mongo_connection: {
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            url: process.env.DB_HOST,
            port: process.env.DB_PORT,
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
            expiration: 5*60*60 // 5 hours in seconds
        },

        salt_work_factor: 10
    }

}).call(this);
