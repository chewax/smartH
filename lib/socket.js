(function(){
    'use strict';

    let log = require('./logger');
    let boards = [];
    let clients = [];
    let _ = require('lodash');
    let eh = require('./eventHandler');
    let _io;

    function toggleRelay (socket, interval) {
        setInterval(function(){
            log.info("toggling module_0");
            socket.emit('module_0:set:turbo');
        }, interval);
    }

    function isListed (elements, id) {
        let index = _.findIndex(elements, (e) => {
            return e.id.toString() == id.toString();
        })
        return index != -1;
    }

    function add (elements, e, event) {
        elements.push(e);
        log.info (`"${event}": ${e.name}`);
        eh.emit(event, e);
    }

    function enable (elements, id, socket, event) {
        //search for socket by boardId, change status, and reassigne socket
        let index = _.findIndex(elements, (e) => {
            return e.id.toString() == id.toString();
        })

        if (index == -1) return;

        elements[index].status = 'online';
        elements[index].socket = socket;

        eh.emit(event, elements[index]);
        log.info (`"${event}": ${elements[index].name}`);
    }

    function disable (id) {
        //Lookup for board to disable, if found disable and retunr

        if (boards.length > 0) {
            let index = _.findIndex(boards, (b) => {
                if (typeof b.socket.id == 'undefined' || b.socket.id == null) return false;
                return b.socket.id.toString() == id.toString();
            })
            
            if (index != -1) {
                _io.emit('client:board:disable', boards[index].id);

                boards[index].status = 'offline';
                boards[index].socket = "";
    
                eh.emit('board:disabled', boards[index]);
                
                log.info (`Board disabled: ${boards[index].name}`);
    
                return;
            }
        }

        if (clients.length > 0) {
            //If no board found lookup for clients to disable
            let index = _.findIndex(clients, (c) => {
                if (typeof c.socket.id == 'undefined' || c.socket.id == null) return false;
                return c.socket.id.toString() == id.toString();
            })
            
            if (index != -1) {
                clients[index].status = 'offline';
                clients[index].socket = "";
    
                eh.emit('board:disabled', clients[index]);
                log.info (`Client disabled: ${clients[index].name}`);
    
                return;
            }
        }
 
    }

    function toggleBoard (boardId, moduleId) {
        let index = _.findIndex(boards, (b) => {
            return b.id.toString() == boardId.toString();
        })

        if (index != -1) {
            _io.to(`${boards[index].socket}`).emit(`${moduleId}:set:toggle`);
        }
    }


    module.exports.initSocketIOEvents = (io) => {

        _io = io;

        log.info("Initializing Socket.io");

        io.on('connection', function (socket) {

            socket.on("disconnect", function(){
                disable(socket.id);
            })

            socket.on("board:register", function(board){
                
                if (!isListed(boards, board.id)) {
            
                    socket.broadcast.emit('client:board:new', board);
                    board['socket'] = socket.id;
                    board['status'] = 'online';
                    add(boards, board, 'board:new');
                }
                else {
                    enable(boards, board.id, socket, 'board:enabled');
                    socket.broadcast.emit('client:board:enable', board.id);
                }
            })
            
            socket.on("client:boards:get", function(){
                socket.emit("client:boards:all", boards);
            })

            socket.on("client:register", function(client){

                client['socket'] = socket.id;
                client['status'] = 'online';

                if (!isListed(clients, client.id)) add(clients, client, 'client:new');
                else enable(clients, client.id, socket, 'client:enabled');
            })

            socket.on("client:switch:actuate", function(id){
                var cmd = id.split('_');
                var boardId = cmd[0];
                var moduleId = `${cmd[1]}_${cmd[2]}`;
                toggleBoard(boardId, moduleId);
            })

            socket.on("messageType", function(data){
                log.debug(data);
            })

            socket.on("temperature:read", function (data) {
                var jsonStr = JSON.stringify(data);
                var parsed = JSON.parse(jsonStr);
                log.debug(parsed);
            });

            socket.on("module:state", function (data) {
                var jsonStr = JSON.stringify(data);
                var parsed = JSON.parse(jsonStr);
                log.debug(parsed);
            });

        });

    }

}).call(this);