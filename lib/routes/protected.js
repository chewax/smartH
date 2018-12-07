
(function () {
    'use strict';


    var coreRoutes = require('../modules/core/coreRoutes');
    var userRoutes = require('../modules/user/userRoutes');

    var express = require('express');
    var expressJwt = require('express-jwt');
    var config = require('../config/config');
    var router = express.Router();

    router.use(expressJwt({secret: config.jwt.secret}));

    router = userRoutes.appendProtectedRoutes(router);
    router = coreRoutes.appendProtectedRoutes(router);

    module.exports = router;

}).call(this);
