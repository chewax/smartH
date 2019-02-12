$(document).ready(function () {

    var socket = io();
    var serverStatus = ""
    var client = {
        id: "someuniqueidprobablylogintoken",
        name: "Daniel"
    }

    socket.on('disconnect', function () {
        serverStatus = "offline"
    })

    socket.on('connect', function () {
        clearBoards();
        serverStatus = "online"
        socket.emit('console:register', client);
        socket.emit('console:server:getAllBoards');
    })

    socket.on("console:server:getAllBoards", loadBoards)
    socket.on("console:board:new", appendBoard);
    socket.on("console:board:disable", disableBoard)
    socket.on("console:board:enable", enableBoard)
    socket.on("console:board:sense", updateBoardSensor)
    socket.on("console:board:setOn", boardSwitchOn)
    socket.on("console:board:setOff", boardSwitchOff)


    function clearBoards () {
        $("#controls").empty();
    }

    function loadBoards (boards) {
        boards.forEach(board => { appendBoard(board) });
    }

    function updateBoardSensor (data) {
        
        var $board = $(`[id^='${data.id}']`);
        
        //TODO update with other data that might come from sensors.
        // var $boardData = $(`[id^='${data.id}'] .data`);
        // $boardData.text(data.sensorInfo);
        
        //Remove all sensor related clasess
        $board.removeClass('opened');
        $board.removeClass('closed');
        $board.removeClass('unknown');

        //Add the ones that come in state
        $board.addClass(data.state);
    }

    function enableBoard (board) {
        var $board = $(`[id^='${board.id}']`);
        $board.removeClass('disabled');
    }

    function disableBoard (board) {
        console.log(board);
        console.log("disabling board");
        var $board = $(`[id^='${board.id}']`);
        $board.addClass('disabled');
        console.log($board);
    }

    function boardSwitchOn (board) {
        
        if ($(this).hasClass('disabled')) return;

        var $board = $(`[id^='${board.id}']`);
        $board.addClass('on');
    }

    function boardSwitchOff (board) {
        
        if ($(this).hasClass('disabled')) return;

        var $board = $(`[id^='${board.id}']`);
        $board.removeClass('on');
    }

    function actuatorClick (e) {
        e.preventDefault();

        console.log("click");

        if ($(this).hasClass('disabled')) return;

        if ($(this).hasClass('on')) { 
            $(this).removeClass('on');
            socket.emit("console:board:setOff", $(this).attr('id'));
        }
        else {
            $(this).addClass('on');
            socket.emit("console:board:setOn", $(this).attr('id'));
        }

        $(".macro").removeClass('active');
    }

    function createBoard (board) {
        let $board = $("<div/>", {
            id: `${board.id}`
        })

        if (board.status == "offline") $board.addClass('disabled');

        $("<span/>", {
            "class": "name",
            "text": `${board.name}`,
        }).appendTo($board);

        $("<span/>", {
            "class": "ip",
            "text": `${board.ip}`,
        }).appendTo($board);

        return $board;

    }

    // function removeBoard (board) {
    //     var $board = $(`[id^='${board.id}']`);
    //     $board.remove();
    // }

    function upsertBoard (board) {
        var $board = $(`[id^='${board.id}']`);

        if ($board.length == 0) {

            $board = $("<div/>", {
                id: `${board.id}`
            })

            if (board.status == "offline") $board.addClass('disabled');
        }
        else {
            $board.empty();
            $board.removeClass();
        }

        $("<span/>", {
            "class": "name",
            "text": `${board.name}`,
        }).appendTo($board);

        $("<span/>", {
            "class": "ip",
            "text": `${board.ip}`,
        }).appendTo($board);


        $board.addClass('actuator');
        $board.addClass(board.mode);
        $board.addClass(board.relayState);
    }

    function appendBoard (board) {

        let $controls = $("#controls");
        let $board = createBoard(board);
        $board.addClass(board.mode);
        
        console.log(board);

        $board.addClass(board.relayState);

        $board.on('click', actuatorClick);
        $board.appendTo($controls);

    }

})