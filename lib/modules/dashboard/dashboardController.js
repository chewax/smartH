(function(){
    'use strict';

    let log = require('../core/logger');
    let _ = require('lodash');
    let boards = [];
    let consoles = [];
    let _io;


    //Register Board. Checks if already registered and enables otherwise insert new board
    //Joins Board Channel
    function registerBoard ( board, socket ) {
    
        if (_.isEmpty(board)) return;

        log.debug(`Board registration: ${JSON.stringify(board)}`);

        if (!isListed(boards, board.id)) {
            log.debug("Board is not listed, adding new...");

            board['socket'] = socket.id;
            board['status'] = 'online';
            board['state'] = {};

            appendBoard(board);
            _io.to('consoles').emit('console:boards:new', board);
        }
        else {
            log.debug("Board is already listed...updating information");

            enableBoard(board, socket);
            _io.to('consoles').emit('console:boards:enable', board);
        }

        socket.join('boards');
    }

    function appendBoard (board) {
        board.idx = boards.length;
        boards.push(board);
    }

    function disconnectClient (socket) {
        disableBoard(socket.id); 
    }

    function sendBoards (socket) {
        //HACK: Send socket error.
        if (!consoleIsAuthorized(socket)) return;
        socket.emit("console:boards:list", boards);
    }

    function registerConsole (client, socket) {
        if (authoriseConsole(client, socket))
            socket.join('consoles');
    }

    function actuateBoard ({id, action}, socket) {
        //HACK: Send socket error.
        if (!consoleIsAuthorized(socket)) return;

        if (typeof id == "undefined" || id == null || id == "") return;

        let index = _.findIndex(boards, (b) => {
            return b.id.toString() == id.toString();
        })

        if (index != -1) {
            _io.to(`${boards[index].socket}`).emit(`board:${action}`);
            log.info(`Emitted: board:${action}`);
        }
    }

    function recieveBoardData (payload, socket) {

        let idx = boards.findIndex( b => b.id === payload.id);
        if (idx !== -1) { 
            boards[idx].state = payload;
            socket.to('consoles').emit('console:boards:data', payload);
        }
    }

    function initIO (socket, io) {

        _io = io;

        socket.on("disconnect", () => { disconnectClient (socket) });
        socket.on("board:register", (board) => { registerBoard (board, socket) });
        socket.on("console:boards:get", () => { sendBoards (socket) });
        socket.on("console:register", (client) => { registerConsole (client, socket) });
        socket.on("console:boards:actuate", (payload) => { actuateBoard (payload, socket) });
        socket.on("board:data", (payload) => { recieveBoardData (payload, socket) });
    }

    //Checks if an element with id == id is present in elements array
    function isListed (elements, id) {
        //TODO HACK probably _.findindex(elements, {'id': id});
        let index = _.findIndex(elements, (e) => {
            return e.id.toString() == id.toString();
        })
        return index != -1;
    }

    //Enables an element.
    //That means setting status to online, reassigning socket id.
    function enableBoard (board, socket) {
        //search for socket by boardId, change status, and reassigne socket
        let index = _.findIndex(boards, (b) => {
            return board.id.toString() == b.id.toString();
        })

        if (index == -1) return;

        board.status = 'online';
        board.socket = socket.id;

        boards[index] = board;
    }

    //Tries to disable a board based on given ID, if there is none then tries to disable a console.
    function disableBoard (socketId) {
        //Lookup for board to disable, if found disable and retunr
        if (boards.length > 0) {
            let index = _.findIndex(boards, (b) => {
                if (typeof b.socket == 'undefined' || b.socket == null) return false;
                return b.socket.toString() == socketId.toString();
            })

            if (index != -1) {
                _io.to('consoles').emit('console:boards:disable', boards[index].id);

                boards[index].status = 'offline';
                boards[index].socket = "";

                log.info (`Board disabled: ${boards[index].name}`);

                return;
            }
        }
    }

    function consoleIsAuthorized (socket) {
        //TODO
        return true;
    }

    function authoriseConsole (client, socket) {
        //TODO
        client.socket = socket.id;
        client.staus = 'authorized';
        consoles.push(client);
        return true;
    }

    function renderDashboard (req, res) {
        res.render('dashboard', {
            devices: boards
        });
    }

    module.exports.initIO = initIO;
    module.exports.renderDashboard = renderDashboard;

}).call(this);