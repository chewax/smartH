(function () {
    'use strict';

    let log = require('../logger');

    class Board {

        constructor (data) {
            console.log(data);
            
            this.id = data.id;
            this.name = data.name;
            this.mode = data.mode;
            this.ip = data.ip;
            this.socket = data.socket;
            this.status = 'online';
            this.idx = -1;
            this.relayState = '';
            this.sensorState = {};
        }

        defaultAction (_io) {
            this.doAction(_io, 'defaultAction');
        }

        setOn (_io) {
            this.relayState = 'on';
            this.doAction(_io, 'setOn');
            console.log(this.strip())
        }

        setOff (_io) {
            this.relayState = 'off';
            this.doAction(_io, 'setOff');
            console.log(this.strip())
        }

        sense (_io, data) {
            this.doAction(_io, "sense", data);
            this.sensorState = data;
        }

        doAction (_io, action, data) {
            if (typeof data == "undefined" || data == null) data = {};

            data["id"] = this.id;

            _io.to('consoles').emit(`console:board:${action}`, data);

            //Sense is autobroadcasted by the device so, the console should never ask board to autosense
            if (action != 'sense') _io.to(this.socket).emit(`board:${action}`);
            
            log.info(`Emitted: board:${action}`);
        }
        
        //Enables a board.
        //That means setting status to online, reassigning socket id.
        enable(socket) {
            this.status = 'online';
            this.socket = socket.id;
        }

        //Disables a board.
        //That means setting status to offline, deleting de socket id
        disable() {
            status = 'offline';
            socket = '';
        }

        strip () {
            return {
                id: this.id,
                name: this.name,
                mode: this.mode,
                ip: this.ip,
                socket: this.socket,
                idx: this.idx,
                status: this.status,
                relayState: this.relayState
            }
        }

    }

    module.exports = Board;

}).call(this);
