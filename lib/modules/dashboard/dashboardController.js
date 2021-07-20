import log from '../core/logger.js';
import _ from 'lodash';
let boards = [];
let consoles = [];
let _io;


//Register Board. Checks if already registered and enables otherwise insert new board
//Joins Board Channel
function registerBoard ( board, socket ) {
    
    if (_.isEmpty(board)) return;

    log.debug(`Board registration: ${JSON.stringify(board)}`);

    if (!isListed(boards, board.id)) {
        log.debug('Board is not listed, adding new...');

        board['socket'] = socket.id;
        board['status'] = 'online';
        board['state'] = {};

        appendBoard(board, socket);

        console.log(board);

        _io.to('consoles').emit('console:boards:new', board);
    }
    else {
        log.debug('Board is already listed...updating information');

        enableBoard(board, socket);
        _io.to('consoles').emit('console:boards:enable', board);
    }

    socket.join('boards');
}

function appendBoard (board, socket) {
    board.idx = boards.length;
    boards.push(board);
    socket.join('boards');
}

function disconnectClient (socket) {
    disableBoard(socket.id); 
}

function sendBoards (socket) {
    //HACK: Send socket error.
    if (!consoleIsAuthorized(socket)) return;
    socket.emit('console:boards:list', boards);
}

function registerConsole (client, socket) {
    if (authoriseConsole(client, socket))
        socket.join('consoles');
}

function isBoardEnabled(id) {
    let b = boards.filter( b => b.id === id);
    return b.length && b[0].status === 'online';
}

function actuateBoard ({id, action}, socket) {

    //HACK: Send socket error.
    if (!consoleIsAuthorized(socket)) return;
    if (!isBoardEnabled(id)) return;

    if (typeof id == 'undefined' || id == null || id == '') return;

    let idx = boards.findIndex(b => b.id === id);

    if (idx != -1) {
        _io.to(`${boards[idx].socket}`).emit(`board:${action}`);
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


//Checks if an element with id == id is present in elements array
function isListed (elements, id) {
    //TODO HACK probably _.findindex(elements, {'id': id});
    let index = elements.findIndex(e => e.id === id );
    return index != -1;
}

//Enables an element.
//That means setting status to online, reassigning socket id.
function enableBoard (board, socket) {

    let target = boards.filter( b => b.id === board.id );
    target.forEach( t => {
        _io.to('consoles').emit('console:boards:enable', t.id);
        t.status = 'online';
        t.socket = socket.id; //socket may change id when reconnected;
        log.info (`Board enabled: ${t.name}`);
    });

    socket.join('boards');
}

//Tries to disable a board based on given ID, if there is none then tries to disable a console.
function disableBoard (socketId) {
    let target = boards.filter( b => b.socket.toString() === socketId.toString() );
    target.forEach( t => {
        t.status = 'offline';
        t.socket = '';
        _io.to('consoles').emit('console:boards:disable', t.id);
        log.info (`Board disabled: ${t.name}`);
    });
}

function consoleIsAuthorized (socket) {
    //TODO
    console.log(`Authorizing ${socket.id}`);
    return true;
}

function authoriseConsole (client, socket) {
    //TODO
    client.socket = socket.id;
    client.staus = 'authorized';
    consoles.push(client);
    return true;
}


function boardBroadcast (payload, socket) {
    socket.to('boards').emit('console:boards:data', payload.message);
}


const renderDashboard = function (req, res) {
    res.render('dashboard', {
        devices: boards
    });
};

const initIO = function (socket, io) {

    _io = io;

    socket.on('disconnect', () => { disconnectClient (socket); });
    socket.on('board:register', (board) => { registerBoard (board, socket); });
    socket.on('console:boards:get', () => { sendBoards (socket); });
    socket.on('console:register', (client) => { registerConsole (client, socket); });
    socket.on('console:boards:actuate', (payload) => { actuateBoard (payload, socket); });
    socket.on('board:data', (payload) => { recieveBoardData (payload, socket); });
    socket.on('board:broadcast', payload => boardBroadcast(payload, socket));
};

export default {
    initIO,
    renderDashboard
};
