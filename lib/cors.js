(function () {
    'use strict';

    module.exports = () => {
        return function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, appKey");

            // intercept OPTIONS method
            if ('OPTIONS' == req.method) {
                res.status(200).send("Not allowed option method");
            }
            else {
                next();
            }
        };
    }

}).call(this);
