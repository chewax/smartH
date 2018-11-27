(function(){
    'use strict';

    let log = require('../core/logger');
    let eh = require('../core/eventHandler');
    let _ = require('lodash');
    let boards = [];
    let consoles = [];
    let _io;

    //Register Board. Checks if already registered and enables otherwise insert new board
    //Joins Board Channel
    function registerBoard ( board, socket ) {
        log.log(`Board registration: ${JSON.stringify(board)}`);
        
        if (!isListed(boards, board.id)) {
            board['socket'] = socket.id;
            board['status'] = 'online';
            add(boards, board, 'board:new');
            socket.to('consoles').emit('console:board:new', board);
        }
        else {
            enable(boards, board.id, socket, 'board:enabled');
            socket.to('consoles').emit('console:board:enable', board.id);
        }

        socket.join('boards');
    }

    function disconnectClient (socket) {
        disable(socket.id);
        log.log(`Socket disconnected: ${socket.id}`);
        eh.emit("client:disconnect", socket);
    }

    function sendBoards (socket) {
        socket.emit("console:boards:get", boards);
    }

    function registerConsole (client, socket) {
        log.log(`Console registration: ${JSON.stringify(client)}`);
            
        if (!isListed(consoles, client.id)) {
            client['socket'] = socket.id;
            client['status'] = 'online';
            add(consoles, client, 'console:new');
            socket.to('consoles').emit('console:new', client.id);
        }
        else {
            enable(consoles, client.id, socket, 'console:enable')
            socket.to('consoles').emit('console:enable', client.id);
        }
        
        socket.join('consoles');
    }

    function actuateBoard (id, socket) {
        if (typeof id == "undefined" || id == null || id == "") return;
        let action = 'set:toggle';

        let index = _.findIndex(boards, (b) => {
            return b.id.toString() == id.toString();
        })

        if (index != -1) {
            _io.to(`${boards[index].socket}`).emit(`board:${action}`);
            log.info(`Emitted: board:${action}`);
        }
    }

    function recieveBoardData (data, socket) {
        var jsonStr = JSON.stringify(data);
        log.debug(jsonStr);
        socket.to('consoles').emit('console:board:temperature', data);
    }

    function initIO (socket, io) {

        _io = io;

        log.info("Initializing Dashboard Socket Events.");

        socket.on("disconnect", () => { disconnectClient (socket) });
        socket.on("board:register", (board) => { registerBoard (board, socket) });
        socket.on("console:boards:get", () => { sendBoards (socket) });
        socket.on("console:register", (client) => { registerConsole (client, socket) });
        socket.on("console:board:actuate", (id) => { actuateBoard (id, socket)});
        socket.on("board:sense", (data) => { recieveBoardData (data, socket)});
    }

    //Checks if an element with id == id is present in elements array
    function isListed (elements, id) {
        //TODO HACK probably _.findindex(elements, {'id': id});
        let index = _.findIndex(elements, (e) => {
            return e.id.toString() == id.toString();
        })
        return index != -1;
    }

    //Adds element e to elements array and emits event.
    function add (elements, e, event) {
        elements.push(e);
        log.info (`"${event}": ${e.name}`);
        eh.emit(event, e);
    }

    //Enables an element.
    //That means setting status to online, reassigning socket id.
    function enable (elements, id, socket, event) {
        //search for socket by boardId, change status, and reassigne socket
        let index = _.findIndex(elements, (e) => {
            return e.id.toString() == id.toString();
        })

        if (index == -1) return;

        elements[index].status = 'online';
        elements[index].socket = socket.id;

        eh.emit(event, elements[index]);
        log.info (`"${event}": ${elements[index].name}`);
    }

    //Tries to disable a board based on given ID, if there is none then tries to disable a console.
    function disable (id) {
        //Lookup for board to disable, if found disable and retunr
        if (boards.length > 0) {
            let index = _.findIndex(boards, (b) => {
                if (typeof b.socket == 'undefined' || b.socket == null) return false;
                return b.socket.toString() == id.toString();
            })

            if (index != -1) {
                _io.to('consoles').emit('console:board:disable', boards[index].id);

                boards[index].status = 'offline';
                boards[index].socket = "";
    
                eh.emit('board:disable', boards[index]);
                log.info (`Board disabled: ${boards[index].name}`);

                return;
            }
        }

        if (consoles.length > 0) {
            //If no board found lookup for consoles to disable
            let index = _.findIndex(consoles, (c) => {
                if (typeof c.socket.id == 'undefined' || c.socket.id == null) return false;
                return c.socket.id.toString() == id.toString();
            })
            
            if (index != -1) {
                socket.to('consoles').emit('console:disable', consoles[index].id);

                consoles[index].status = 'offline';
                consoles[index].socket = "";
    
                eh.emit('console:disable', consoles[index]);
                log.info (`Client disabled: ${consoles[index].name}`);
    
                return;
            }
        }
 
    }

    module.exports.boards = boards;
    module.exports.consoles = consoles;
    module.exports.initIO = initIO;


}).call(this);