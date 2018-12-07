(function () {
    'use strict';

    var express = require('express');
    var authRoutes = require('../modules/auth/authRoutes');
    var coreRoutes = require('../modules/core/coreRoutes');
    var dahsboardRoutes = require('../modules/dashboard/dashboardRoutes');

    var router = express.Router();

    router = authRoutes.appendPublicRoutes(router);
    router = coreRoutes.appendPublicRoutes(router);
    router = dahsboardRoutes.appendPublicRoutes(router);

    module.exports = router;

}).call(this);

