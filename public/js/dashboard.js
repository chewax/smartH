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
        clearModules();
        serverStatus = "online"
        socket.emit('console:register', client);
        socket.emit('console:server:getAllBoards');
    })

    socket.on("console:server:getAllBoards", loadModules)
    socket.on("console:board:new", appendBoard);
    socket.on("console:board:disable", disableModule)
    socket.on("console:board:enable", enableModule)
    socket.on("console:board:sense", updateModuleSensor)
    socket.on("console:board:setOn", boardSwitchOn)
    socket.on("console:board:setOff", boardSwitchOff)


    function clearModules () {
        $("#controls").empty();
    }

    function loadModules (boards) {
        console.log(boards);
        boards.forEach(board => { appendBoard(board) });
    }

    function updateModuleSensor (board) {
        var $board = $(`[id^='${board.id}']`);
        var $boardData = $(`[id^='${board.id}'] .data`);
        $boardData.text(board.sensorInfo);
        $board.removeClass('opened');
        $board.removeClass('closed');
        $board.removeClass('unknown');
        $board.addClass(board.state);

        console.log(board);
    }

    function enableModule (board) {
        console.log(board);
        var modules = $(`[id^='${board.id}']`);
        modules.removeClass('disabled');
        updateBoard(board);
    }

    function disableModule (board) {
        var modules = $(`[id^='${board.id}']`);
        modules.addClass('disabled');
        modules.removeClass('on');
    }

    function boardSwitchOn (board) {
        
        if ($(this).hasClass('disabled')) return;

        var modules = $(`[id^='${board.id}']`);
        modules.addClass('on');
        modules.addClass('transition');
    }

    function boardSwitchOff (board) {
        
        if ($(this).hasClass('disabled')) return;

        var modules = $(`[id^='${board.id}']`);
        modules.removeClass('on');
        modules.removeClass('transition');
    }

    function actuatorClick (e) {
        e.preventDefault();

        console.log("click");

        if ($(this).hasClass('disabled')) return;

        // $(this).toggleClass('on');

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

    function createModule (board) {
        let $module = $("<div/>", {
            id: `${board.id}`
        })

        if (board.status == "offline") $module.addClass('disabled');

        $("<span/>", {
            "class": "name",
            "text": `${board.name}`,
        }).appendTo($module);

        $("<span/>", {
            "class": "ip",
            "text": `${board.ip}`,
        }).appendTo($module);

        return $module;

    }

    // function addSensor (board) {
    //     let $controls = $("#controls");
    //     let $module = createModule(board);

    //     $("<span/>", {
    //         "class": "data",
    //         "text": "",
    //     }).appendTo($module);

    //     $module.addClass('sensor');
    //     $module.addClass(board.sensor);

    //     $module.appendTo($controls);
    // }

    // function addActuator (board) {

    //     let $controls = $("#controls");
    //     let $module = createModule(board);

    //     $module.addClass('actuator');
    //     $module.addClass(board.actuator);
    //     $module.on('click', actuatorClick);

    //     $module.appendTo($controls);
    // }

    // function removeSensor (board) {
    //     var $module = $(`[id^='${board.id}'].sensor`);
    //     $module.remove();
    // }

    // function removeActuator (board) {
    //     var $module = $(`[id^='${board.id}'].actuator`);
    //     $module.remove();
    // }

    // function upsertSensor (board) {
    //     var $module = $(`[id^='${board.id}'].sensor`);


    //     if ($module.length == 0) {
    //         $module = $("<div/>", {
    //             id: `${board.id}`
    //         })

    //         if (board.status == "offline") $module.addClass('disabled');
    //     }
    //     else {
    //         $module.empty();
    //         $module.removeClass();
    //     }


    //     $("<span/>", {
    //         "class": "name",
    //         "text": `${board.name}`,
    //     }).appendTo($module);

    //     $("<span/>", {
    //         "class": "ip",
    //         "text": `${board.ip}`,
    //     }).appendTo($module);

    //     $("<span/>", {
    //         "class": "data",
    //         "text": "",
    //     }).appendTo($module);

    //     $module.addClass('sensor');
    //     $module.addClass(board.sensor);

    // }

    function removeBoard (board) {
        var $module = $(`[id^='${board.id}']`);
        $module.remove();
    }

    function upsertBoard (board) {
        var $module = $(`[id^='${board.id}']`);

        if ($module.length == 0) {

            $module = $("<div/>", {
                id: `${board.id}`
            })

            if (board.status == "offline") $module.addClass('disabled');
        }
        else {
            $module.empty();
            $module.removeClass();
        }

        $("<span/>", {
            "class": "name",
            "text": `${board.name}`,
        }).appendTo($module);

        $("<span/>", {
            "class": "ip",
            "text": `${board.ip}`,
        }).appendTo($module);


        $module.addClass('actuator');
        $module.addClass(board.mode);
        $module.addClass(board.relayState);
    }

    function appendBoard (board) {

        // if (!isNull(board.sensor)) addSensor(board);
        // if (!isNull(board.actuator)) addActuator(board);

        let $controls = $("#controls");
        let $module = createModule(board);
        $module.addClass(board.mode);
        console.log(board);

        $module.addClass(board.relayState);

        $module.on('click', actuatorClick);
        $module.appendTo($controls);

    }

    // function updateBoard (board) {
    //     if (!isNull(board.sensor)) upsertSensor(board);
    //     else removeSensor(board);

    //     if (!isNull(board.actuator)) upsertActuator(board);
    //     else removeActuator(board);
    // }

})