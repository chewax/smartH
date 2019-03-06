
(function () {
    'use strict';

    let log = require('../logger');
    let Board = require('../boardClass/board');
    let _ = require('lodash');

    class BoardManager {

        constructor () {
            this.boards = [];
            this.io = {};
        }

        register (board, socket) {

            log.debug(`Board registration: ${JSON.stringify(board)}`);
            let idx = this.indexOf(board.id);

            if (idx == -1) {
                log.debug("Board is not listed, adding new...");
                board['socket'] = socket.id;

                //Overrite with Board instance.
                board = new Board(board);

                //AppendBoard.
                this.appendBoard(board);

                //Notify the consoles of new addition
                this.io.to('consoles').emit('console:board:new', board.strip());
                
            }
            else {

                log.debug("Board is already listed...updating information");
                board['socket'] = socket.id;
                this.boards[idx].enable(this.io, board);
            }

            socket.join('boards');
        }

        appendBoard (board) {
            board.idx = this.boards.length;
            this.boards.push(board);
            
        }

        // //Checks if an element with id == id is present in elements array
        indexOf (id) {

            let idx = _.findIndex(this.boards, (b) => {
                return b.id.toString() == id.toString();
            })

            return idx;
        }

        processConsoleRequest (id, action) {
            let idx = _.findIndex(this.boards, { 'id': id });

            if (action == "setOn") this.boards[idx].setOn(this.io);
            if (action == "setOff") this.boards[idx].setOff(this.io);
            if (action == "sense") this.boards[idx].sense(this.io, data);
        }   


        processBoardRequest (socketId, action, data) {

            let b = this.getBoardBySocketId(socketId);

            if (_.isEmpty(b)) return;

            if (action == "setOn") b.setOn(this.io);
            if (action == "setOff") b.setOff(this.io);
            if (action == "sense") b.sense(this.io, data);

            // data['action'] = "board:sense";
            // persistBoardLog(data);
        }

        enableBoard (id, socket) {
            let idx = this.indexOf(id);
            if (idx != -1) this.boards[idx].enable(socket);
            return idx != 1;
        } 
        
        disableBoard (id) {
            let idx = this.indexOf(id);
            if (idx != -1) this.boards[idx].disable();
            return idx != 1;
        }

        getBoardBySocketId (socketId) {
            
            let idx = _.findIndex(this.boards, (b) => {

                return b.socket.toString() == socketId.toString();
            })

            if (idx != -1) return this.boards[idx];
            else return {}
        }

        disableBoardBySocketId (socketId) {
            let board = this.getBoardBySocketId(socketId)
            
            if (!_.isEmpty(board)) {
                log.debug(`Disabling ${board.name}`);
                this.io.to('consoles').emit('console:board:disable', board.strip());
            }
            
        }
        
    }

    module.exports = BoardManager;

}).call(this);
