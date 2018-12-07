// Cardona -33.837316, -57.417029
(function(){
    let log = require('../core/logger');
    let _io;
    const apiKey = '3d6f50f455374ca4354134dde195662a';
    
    //Cardona
    const defaultGeolocation = {
        lat: "-33.837316",
        long: "-57.417029"
    }

    const request = require('request');
    const qs = require('querystring');


    function getForecast(geolocation) {
        return new Promise (function (resolve, reject) {
            if (typeof geolocation == "undefined" || geolocation == null) geolocation = defaultGeolocation;
            

            let params = {
                exclude: ['minutely', 'hourly', 'flags'],
                lang: ['es'],
                units: ['uk2']
            }

            let uri = `https://api.darksky.net/forecast/${apiKey}/${geolocation.lat},${geolocation.long}`;
            uri = `${uri}/?${qs.stringify(params)}`;

            request.get(uri, {},
                function (err, res, data){
                    if (!err) {
                        data = JSON.parse(data);
                        resolve(data);
                    }

                    else {
                        console.log(err);
                        reject(err);
                    }
                }
            )
        })
    }

    function sendForecast (socket) {
        getForecast()
            .then( data => {
                socket.emit("console:forecast:get", data);
            });
    }


    function initIO (socket, io) {
        _io = io;
        socket.on("console:forecast:get", () => { sendForecast (socket) });
    }

    module.exports.initIO = initIO;


}).call(this);


