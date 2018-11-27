$(document).ready(function(){

  var socket = io();
  var serverStatus = "online"

  socket.on('disconnect', function() {
    console.log("server disconnected");
    serverStatus = "offline"
  })

  var client = {
    id: "someuniqueidprobablylogintoken",
    name: "Daniel"
  }

  socket.emit('console:register', client);
  socket.emit('console:boards:get');

  socket.on("console:boards:get", loadModules)
  socket.on("console:board:new", appendBoard);
  socket.on("console:board:disable", disableModule)
  socket.on("console:board:enable", enableModule)
  socket.on("console:board:temperature", updateModuleTemperature)


  function loadModules (boards) {
    boards.forEach( board => { appendBoard(board) });
  }

  function updateModuleTemperature (data) {
    var $data = $(`[id^='${data.id}'] .data`);
    $data.text(data.temperature);
  }

  function enableModule (id) {
    var actuators = $(`[id^='${id}']`);
    actuators.removeClass('disabled');
  }

  function disableModule (id) {
    var actuators = $(`[id^='${id}']`);
    actuators.addClass('disabled');  
  }

  function actuatorClick (e) {
    e.preventDefault();
    
    if ($(this).hasClass('disabled')) return;

    $(this).toggleClass('on');
    $(".macro").removeClass('active');

    socket.emit("console:board:actuate", $(this).attr('id'));
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

    $("<span/>", { 
      "class": "ip",
      "text": `${board.ip}`,
    }).appendTo($module);

    return $module;
    
  }

  function addSensor (board) {
    let $controls = $("#controls");
    let $module = createModule(board);

    $("<span/>", { 
      "class": "data",
      "text": "",
    }).appendTo($module);

    $module.addClass('sensor');
    $module.addClass(board.sensor);

    $module.appendTo($controls);
  }

  function addActuator (board) {

    let $controls = $("#controls");
    let $module = createModule(board);

    $module.addClass('actuator');
    $module.addClass(board.actuator);
    $module.on('click', actuatorClick);

    $module.appendTo($controls);
  }

  function appendBoard (board) {

    if (!isNull(board.sensor)) addSensor(board);
    if (!isNull(board.actuator)) addActuator(board);

  }

})