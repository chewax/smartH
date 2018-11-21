$(document).ready(function(){

  var socket = io();

  var client = {
    id: "someuniqueidprobablylogintoken",
    name: "username"
  }

  socket.emit('client:register', client);
  socket.emit('client:boards:get');
  socket.emit('client:forecast:get');

  socket.on("client:boards:all", (boards) => {
    boards.forEach( board => { appendBoard(board) });
  })
  
  socket.on("client:board:new", (board) => { 
    appendBoard(board);
  })

  socket.on("client:board:disable", (id) => {
    var actuators = $(`[id^='${id}']`);
    actuators.addClass('disabled');  
  })

  socket.on("client:board:enable", (id) => {
    var actuators = $(`[id^='${id}']`);
    actuators.removeClass('disabled');
  })

  socket.on("client:forecast:all", (data) => {
    let $today = $(".forecast .today");
    $today.addClass(data.daily.data[0].icon);
    $(`<span>${Math.round(data.daily.data[0].temperatureMax)}℃ / ${Math.round(data.daily.data[0].temperatureMin)}℃</span>`)
        .addClass("temp")
        .appendTo($today);


    let $tomorrow = $(".forecast .tomorrow");
    $tomorrow.addClass(data.daily.data[1].icon);
    $(`<span>${Math.round(data.daily.data[1].temperatureMax)}℃ / ${Math.round(data.daily.data[1].temperatureMin)}℃</span>`)
      .addClass("temp")
      .appendTo($tomorrow);

    $(`<span>${Math.round(data.daily.data[1].precipProbability)}%</span>`)
      .addClass("rain")
      .appendTo($tomorrow);
  })
  
  $(".switch").on('click', switchClick);
  $(".info").on('click', infoClick);
  $(".macro").on('click', macroClick);

  function switchClick (e) {
    e.preventDefault();
    
    if ($(this).hasClass('disabled')) return;

    $(this).toggleClass('on');
    $(".macro").removeClass('active');

    socket.emit("client:switch:actuate", $(this).attr('id'));
  } 

  function macroClick (e) {
    e.preventDefault();
    
    if ($(this).hasClass('disabled')) return;

    $(this).toggleClass('active');
  
    if ($(this).hasClass('active')) {
      $(".macro").not(this).removeClass('active');
    }
  }

  function infoClick (e) {
    e.preventDefault();

    if ($(this).hasClass('disabled')) return;
    
    $(this).toggleClass('active');
  }

  function appendBoard (board) {
    let $controls = $("#controls");

    let $module = $( "<div/>", {
        id: `${board.id}`, 
        "class": `${board.type} ${board.actuator}`
      })
      .on('click', switchClick)
      .appendTo($controls);

    if (board.status == "offline") $module.addClass('disabled');
    
    $("<span/>", { 
      "class": "name",
      "text": `${board.name}`,
    }).appendTo($module);

    $("<span/>", { 
      "class": "ip",
      "text": `${board.ip}`,
    }).appendTo($module);
  }

})