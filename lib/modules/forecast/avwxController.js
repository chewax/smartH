import axios from 'axios';
import qs from 'querystring';

const apiKey = process.env.AVWX_API_KEY;


const defaultStations = ['SUMU','SAEZ', 'SUDU'];

async function getReport(type, stations) {

    stations = stations || defaultStations;
    type = type || 'metar'
            
    let params = {
        token:apiKey,
    };

    let reports = {};

    try {

        let baseUri = `https://avwx.rest/api/${type}`;
        
        for (let sta of stations) {
          let uri = `${baseUri}/${sta}?${qs.stringify(params)}`;
          let response = await axios.get(uri);
          reports[sta] = response.data.raw;
        }

        return reports;
    }
    catch (err) {
        console.log(err);
        return {};
    }
        
}


async function sendAVWX (socket) {
    let data = {}
    data["metar"] = await getReport('metar');
    // data["taf"] = await getReport('taf');
    console.log(data);
    socket.emit('console:avwx:get', data);
}


const initIO = function (socket) {
    socket.on('console:avwx:get', sendAVWX.bind(this, socket));
};


export default {
    initIO
};


