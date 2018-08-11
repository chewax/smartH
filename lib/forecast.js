// Cardona -33.837316, -57.417029
(function(){

    const apiKey = '3d6f50f455374ca4354134dde195662a';
    
    //Cardona
    const defaultGeolocation = {
        lat: "-33.837316",
        long: "-57.417029"
    }

    const request = require('request');
    const qs = require('querystring');
    
    const iconMap = {
        "clear-day": `${__dirname}/../public/icons/weather/Sun.svg`,
        "clear-night": `${__dirname}/../public/icons/weather/Moon.svg`,
        "rain": `${__dirname}/../public/icons/weather/Cloud-Rain.svg`,
        "snow": `${__dirname}/../public/icons/weather/Cloud-Snow.svg`,
        "sleet": `${__dirname}/../public/icons/weather/Cloud-Hail-Alt.svg`,
        "wind": `${__dirname}/../public/icons/weather/Wind.svg`,
        "fog": `${__dirname}/../public/icons/weather/Cloud-Fog.svg`,
        "cloudy": `${__dirname}/../public/icons/weather/Cloud.svg`,
        "partly-cloudy-night": `${__dirname}/../public/icons/weather/Cloud-Sun.svg`,
        "partly-cloudy-day": `${__dirname}/../public/icons/weather/Cloud-Moon.svg`,
        "celcius": `${__dirname}/../public/icons/weather/Degrees-Celcius.svg`,
        "fahrenheit": `${__dirname}/../public/icons/weather/Degrees-Fahrenheit.svg`
    }

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
                        data['icons'] = iconMap;
                        resolve(data);
                    }

                    else {
                        reject(err);
                    }
                }
            )
        })
    }

    module.exports.getForecast = getForecast;

}).call(this);
