/* eslint-disable no-unused-vars */

import log from './logger.js';
let _io;


function timeCheck(socket){
    let date = new Date;

    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hour = date.getHours();

    let rtc = {
        h:hour,
        m:minutes,
        s:seconds
    };

    socket.emit('time:check', rtc);
}

const initIO = function (socket, io) {
    _io = io;
    socket.on('time:check', () => { timeCheck (socket); });
};

export default {
    initIO
};
