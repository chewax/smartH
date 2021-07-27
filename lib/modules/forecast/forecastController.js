
import axios from 'axios';
import qs from 'querystring';

const apiKey = '6f62ef339c7471bcb601a9da35291090';

// Cardona -33.837316, -57.417029
const defaultGeolocation = {
    lat: '-33.837316',
    long: '-57.417029'
};


async function getForecast(geolocation) {

    geolocation = geolocation || defaultGeolocation;
            
    let params = {
        lat: geolocation.lat,
        lon: geolocation.long,
        appid: apiKey,
        units:'metric',
        lang: 'es',
        exclude: 'minutely,hourly'
    };


    let uri = 'https://api.openweathermap.org/data/2.5/onecall';
    uri = `${uri}?${qs.stringify(params)}`;


    try {
        let response = await axios.get(uri);
        console.log(response);

        return response.data;
    }
    catch (err) {
        console.log(err);
        return {};
    }
    
    
        
}

async function sendForecast (socket) {
    let data = await getForecast();
    socket.emit('console:forecast:get', data);
}


const initIO = function (socket) {
    socket.on('console:forecast:get', sendForecast.bind(this, socket));
};


export default {
    initIO
};


