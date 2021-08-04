import dotenv from 'dotenv';
dotenv.config();

export default {

    openWeatherKey: process.env.OPEN_WEATHER_API_KEY,

    api: { 
        version: process.env.API_VERSION
    },

    server : {
        port: process.env.SERVER_PORT || 3000
    },

};
