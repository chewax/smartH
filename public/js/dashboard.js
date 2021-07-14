$(document).ready(function(){

  let sensors = [];
  let actuators = [];

  let socket = io();
  let serverStatus = ""
  let client = {
    id: "someuniqueidprobablylogintoken",
    name: "Daniel"
  }

  socket.on('disconnect', function() {
    serverStatus = "offline"
  })

  socket.on('connect', function() {
    clearModules();
    serverStatus = "online"
    socket.emit('console:register', client);
    socket.emit('console:boards:get');
  })

  socket.on("console:boards:get", loadModules)
  socket.on("console:board:new", appendBoard);
  socket.on("console:board:disable", disableModule)
  socket.on("console:board:enable", enableModule)
  socket.on("console:board:data", updateData)

  
  function clearModules () {
    $("#controls").empty();
  }

  function loadModules (boards) {
    boards.forEach( board => { appendBoard(board) });
  }

  function updateData(data) {

    console.log(data);

    switch (data.type) {
      case "dht": 
        updateModuleTemperature(data); 
        break;

      case "switch": 
        updateModuleState(data);
        break;

      case "caudal": 
        updateModuleCaudal(data);
        break;
    }

  } 

  function updateModuleCaudal (data) {
    let $data = $(`[id^='${data.id}'] .data`);
    let sensor = getSensor(data.id);

    if (sensor.alt) {
      let idx = data.vol.indexOf(".");
      $data.text(data.vol.substr(0,idx+2));
    }
    else {
      let idx = data.lph.indexOf(".");
      $data.text(data.lph.substr(0,idx));
    }
    
  }

  function updateModuleTemperature (data) {
    let $data = $(`[id^='${data.id}'] .data`);
    $data.text(data.temperature.substr(0,4));
  }

  function updateModuleState (data) {
    let $data = $(`[id^='${data.id}']`);
    $data.toggleClass('on', data.state === 'on');
  }

  function enableModule (board) {
    let modules = $(`[id^='${board.id}']`);
    modules.removeClass('disabled');
    updateBoard (board);
  }

  function disableModule (id) {
    let modules = $(`[id^='${id}']`);
    modules.addClass('disabled');  
  }

  function actuatorClick (e) {
    e.preventDefault();
    
    if ($(this).hasClass('disabled')) return;

    let action = $(this).hasClass('on') ? 'off' : 'on';
    $(this).toggleClass('on');

    $(".macro").removeClass('active');

    socket.emit(`console:board:actuate`, { id: $(this).attr('id'), action });
  } 

  function sensorClick (e) {
    e.preventDefault();
    
    if ($(this).hasClass('disabled')) return;

    let id = $(this).attr('id');
    let idx =  sensors.findIndex( a => a.id === id);
    if (idx !== -1) {
      sensors[idx].alt = !sensors[idx].alt; 
      $(this).toggleClass('alt');
    }
  } 

  function createModule (board) {
    let $module = $( "<div/>", {
        id: `${board.id}`
      })

    if (board.status == "offline") $module.addClass('disabled');
    
    $("<span/>", { 
      "class": "name",
      "text": `${board.name}`,
    }).appendTo($module);

    // $("<span/>", { 
    //   "class": "ip",
    //   "text": `${board.ip}`,
    // }).appendTo($module); 

    return $module;
    
  }

  function getSensor(id){
    let idx =  sensors.findIndex( a => a.id === id);
    if (idx !== -1) return sensors[idx];
  }

  function addSensor (board) {
    board["alt"] = false;
    sensors.push(board);

    let $controls = $("#controls");
    let $module = createModule(board);

    $("<span/>", { 
      "class": "data",
      "text": "",
    }).appendTo($module);

    $module.addClass('sensor');
    $module.addClass(board.actuator);
    $module.on('click', sensorClick);
    $module.appendTo($controls);
  }


  function addActuator (board) {
    actuators.push(board);

    let $controls = $("#controls");
    let $module = createModule(board);

    $module.addClass('actuator');
    $module.addClass(board.actuator);
    $module.on('click', actuatorClick);

    $module.appendTo($controls);
  }

  function removeSensor (board) {
    let idx =  sensors.findIndex( a => a.id === board.id);
    if (idx !== -1) sensors.splice(idx,1);
    let $module = $(`[id^='${board.id}'].sensor`);
    $module.remove();
  }

  function removeActuator (board) {
    let idx =  actuators.findIndex( a => a.id === board.id);
    if (idx !== -1) actuators.splice(idx,1);
    let $module = $(`[id^='${board.id}'].actuator`);
    $module.remove();
  }

  function upsertSensor (board) {
    let $module = $(`[id^='${board.id}'].sensor`);
    
    
    if ($module.length == 0) {
      $module = $( "<div/>", {
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

    $("<span/>", { 
      "class": "data",
      "text": "",
    }).appendTo($module);

    $module.addClass('sensor');
    $module.addClass(board.sensor);

  }

  function upsertActuator (board) {
    let $module = $(`[id^='${board.id}'].actuator`);

    if ($module.length == 0) {
      
      $module = $( "<div/>", {
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
    $module.addClass(board.actuator);
  }

  function appendBoard (board) {
    if (board.actuator == 'dht') addSensor(board);
    if (board.actuator == 'caudal') addSensor(board);
    if (board.actuator == 'filler') addSensor(board);
    else addActuator(board);
  }

  function updateBoard (board) {
    if (!isNull(board.sensor)) upsertSensor (board);
    else removeSensor (board);

    if (!isNull(board.actuator)) upsertActuator (board);
    else removeActuator (board);
  }

})