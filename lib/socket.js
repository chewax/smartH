(function(){
    'use strict';

    let log = require('./logger');
    let boards = [];
    let clients = [];
    let _ = require('lodash');
    let eh = require('./eventHandler');
    let _io;
    let forecast = require('./forecast');

    function toggleRelay (socket, interval) {
        setInterval(function(){
            log.info("toggling module_0");
            socket.emit('module_0:set:turbo');
        }, interval);
    }

    /**
     * Checks if an element with id == id is present in elements array
     * @param {*} elements 
     * @param {*} id 
     */
    function isListed (elements, id) {
        //TODO HACK probably _.findindex(elements, {'id': id});
        let index = _.findIndex(elements, (e) => {
            return e.id.toString() == id.toString();
        })
        return index != -1;
    }

    /**
     * Adds element e to elements array and emits event.
     * @param {[]} elements 
     * @param {*} e 
     * @param {String} event 
     */
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
        elements[index].socket = socket.id;

        eh.emit(event, elements[index]);
        log.info (`"${event}": ${elements[index].name}`);
    }

    function disable (id) {
        //Lookup for board to disable, if found disable and retunr

        if (boards.length > 0) {
            let index = _.findIndex(boards, (b) => {
                if (typeof b.socket == 'undefined' || b.socket == null) return false;
                return b.socket.toString() == id.toString();
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

    function actuateBoard (boardId, action) {
        let index = _.findIndex(boards, (b) => {
            return b.id.toString() == boardId.toString();
        })

        if (index != -1) {
            _io.to(`${boards[index].socket}`).emit(`board:${action}`);
            log.info(`Emitted: board:${action}`);
        }
    }

    module.exports.initSocketIOEvents = (io) => {

        _io = io;

        log.info("Initializing Socket.io");

        io.on('connection', function (socket) {

            socket.on("disconnect", function(){
                disable(socket.id);
                console.log("disconnected: " + socket.id);
            })

            socket.on("board:register", function(board){

                log.log(JSON.stringify(board));
                log.log("connected: " + socket.id);
                
                if (!isListed(boards, board.id)) {
                    board['socket'] = socket.id;
                    board['status'] = 'online';
                    add(boards, board, 'board:new');
                    socket.broadcast.emit('client:board:new', board);
                }
                else {
                    enable(boards, board.id, socket, 'board:enabled');
                    socket.broadcast.emit('client:board:enable', board.id);
                }

                //Get initial state
                socket.emit("module:get:state");

            })
            
            socket.on("client:boards:get", function(){
                socket.emit("client:boards:all", boards);
            })

            socket.on("client:forecast:get", function(){
                forecast.getForecast()
                .then( data => {
                    socket.emit("client:forecast:all", data);
                });
            })

            socket.on("client:register", function(client){

                client['socket'] = socket.id;
                client['status'] = 'online';

                if (!isListed(clients, client.id)) add(clients, client, 'client:new');
                else enable(clients, client.id, socket, 'client:enabled');
            })

            socket.on("client:switch:actuate", function(id){
                if (typeof id == "undefined" || id == null || id == "") return;
                actuateBoard(id, 'set:toggle');
            })

            socket.on("client:switch:on", function(id){
                if (typeof id == "undefined" || id == null || id == "") return;
                actuateBoard(id, 'set:on');
            })

            socket.on("client:switch:off", function(id){
                if (typeof id == "undefined" || id == null || id == "") return;
                actuateBoard(id, 'set:off');
            })

            socket.on("temperature:read", function (data) {
                var jsonStr = JSON.stringify(data);
                var parsed = JSON.parse(jsonStr);
                log.debug(parsed);
            });

            socket.on("module:state", function (data) {
                var jsonStr = JSON.stringify(data);
                var parsed = JSON.parse(jsonStr);
                log.debug(jsonStr);
            });

        });

    }


    module.exports.boards = boards;

}).call(this);