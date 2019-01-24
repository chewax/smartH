(function(){
    'use strict';


    let log = require('../core/logger');
    let _ = require('lodash');
    let BoardManager = require('../core/classes/boardManager');

    // let boards = [];

    let boards = new BoardManager();

    let consoles = [];
    let _io;
    let Logger = require('../logger/loggerModel');
    let config = require('../../config/config');

    // //Register Board. Checks if already registered and enables otherwise insert new board
    // //Joins Board Channel
    // function registerBoard ( board, socket ) {
    //     if (_.isEmpty(board)) return;

    //     log.debug(`Board registration: ${JSON.stringify(board)}`);

    //     if (!isListed(boards, board.id)) {
    //         log.debug("Board is not listed, adding new...");

    //         board['socket'] = socket.id;
    //         board['status'] = 'online';

    //         appendBoard(board);
    //         _io.to('consoles').emit('console:board:new', board);
    //     }
    //     else {
    //         log.debug("Board is already listed...updating information");

    //         enableBoard(board, socket);
    //         _io.to('consoles').emit('console:board:enable', board);
    //     }

    //     socket.join('boards');
    // }

    // function appendBoard (board) {
    //     board.idx = boards.length;
    //     boards.push(board);
    // }

    function disconnectClient (socket) {
        // disableBoard(socket.id); 
        boards.disableBoardBySocketId(socket.id);
    }

    function sendBoards (socket) {
        //HACK: Send socket error.
        if (!consoleIsAuthorized(socket)) return;
        socket.emit("console:server:getAllBoards", boards.boards.map(b => {return b.strip()}) );
    }

    function registerConsole (client, socket) {
        if (authorizeConsole(client, socket))
            socket.join('consoles');
    }

    // function actuateBoard (id, socket) {
    //     //HACK: Send socket error.
    //     if (!consoleIsAuthorized(socket)) return;

    //     if (typeof id == "undefined" || id == null || id == "") return;
    //     let action = 'toggle';

    //     let index = _.findIndex(boards, (b) => {
    //         return b.id.toString() == id.toString();
    //     })

    //     if (index != -1) {
    //         _io.to(`${boards[index].socket}`).emit(`board:${action}`);
    //         log.info(`Emitted: board:${action}`);
    //     }

    //     let data = {};
    //     data['id'] = id;
    //     data['action'] = "board:toggle";

    //     persistBoardLog(data);
    // }

    // function recieveBoardData (data, socket) {
    //     socket.to('consoles').emit('console:board:temperature', data);
    //     data['action'] = "board:sense";
    //     persistBoardLog(data);
    // }

    function persistBoardLog (data) {
        
        if (!config.persist_logs) return;

        let boardIdx = _.findIndex(boards, (b) => { return b.id.toString() == data.id.toString() });
        
        if (boardIdx == -1) return Promise.reject("Reporting board is not registered");
        
        let newLog = JSON.parse( JSON.stringify ( boards[boardIdx] ) ); //a hack to clone an object
        newLog['mac'] = data.id;
        newLog['action'] = data.action;
        newLog['data'] = [];

        
        
        //map readings.
        for (var key in data) {
            if (key == 'id' || key == 'action') continue;

            if(data.hasOwnProperty(key)) {
                newLog.data.push({
                    name: key,
                    value: data[key]
                })    
            }
        }
        
        let reading = new Logger(newLog);
        return reading.save();
    }

    function initIO (socket, io) {

        _io = io;
        
        boards.io = io;

        socket.on("disconnect", () => { disconnectClient (socket) });
        socket.on("board:register", (board) => { boards.register (board, socket) });
        socket.on("console:server:getAllBoards", () => { sendBoards (socket) });
        socket.on("console:register", (client) => { registerConsole (client, socket) });

        
        socket.on("console:board:default", (id) => { boards.processConsoleRequest(id, "default") });
        socket.on("console:board:setOn", (id) => { boards.processConsoleRequest(id, "setOn") });
        socket.on("console:board:setOff", (id) => { boards.processConsoleRequest(id, "setOff") });
        socket.on("console:board:sense", (id) => { boards.processConsoleRequest(id, "sense") });
        
        // socket.on("board:sensorReadings", (data) => { recieveBoardData (data, socket) });

        socket.on("board:sense", (data) => { boards.processBoardRequest(socket.id, "sense", data) });
        socket.on("board:setOff", () => { boards.processBoardRequest(socket.id, "setOff", {}) });
        socket.on("board:setOn", () => { boards.processBoardRequest(socket.id, "setOn", {}) });
        
    }

    // //Checks if an element with id == id is present in elements array
    // function isListed (elements, id) {
    //     //TODO HACK probably _.findindex(elements, {'id': id});
    //     let index = _.findIndex(elements, (e) => {
    //         return e.id.toString() == id.toString();
    //     })
    //     return index != -1;
    // }

    // //Enables an element.
    // //That means setting status to online, reassigning socket id.
    // function enableBoard (board, socket) {
    //     //search for socket by boardId, change status, and reassigne socket
    //     let index = _.findIndex(boards, (b) => {
    //         return board.id.toString() == b.id.toString();
    //     })

    //     if (index == -1) return;

    //     board.status = 'online';
    //     board.socket = socket.id;

    //     boards[index] = board;
    // }

    // //Tries to disable a board based on given ID, if there is none then tries to disable a console.
    // function disableBoard (socketId) {
    //     //Lookup for board to disable, if found disable and retunr
    //     if (boards.length > 0) {
    //         let index = _.findIndex(boards, (b) => {
    //             if (typeof b.socket == 'undefined' || b.socket == null) return false;
    //             return b.socket.toString() == socketId.toString();
    //         })

    //         if (index != -1) {
    //             _io.to('consoles').emit('console:board:disable', boards[index].id);

    //             boards[index].status = 'offline';
    //             boards[index].socket = "";

    //             log.info (`Board disabled: ${boards[index].name}`);

    //             return;
    //         }
    //     }
    // }

    function consoleIsAuthorized (socket) {
        //TODO
        return true;
    }

    function authorizeConsole (client, socket) {
        //TODO
        client.socket = socket.id;
        client.staus = 'authorized';
        consoles.push(client);
        return true;
    }

    
    function renderDashboard (req, res) {

        res.render('dashboard', {
            devices: boards.boards.map( b => { 
                return b.strip();
            })
        });
    }

    module.exports.initIO = initIO;
    module.exports.renderDashboard = renderDashboard;

}).call(this);