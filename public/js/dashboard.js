$(document).ready(function(){

  var socket = io();

  var client = {
    id: "someuniqueidprobablylogintoken",
    name: "username"
  }

  socket.emit('client:register', client);

  socket.emit('client:boards:get');

  socket.on("client:boards:all", (boards) => {
    boards.forEach(board => {appendBoard(board)});
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
    let controls = $("#controls");

    if (board.module_0_type != "empty") {
      var $module_0 = $("<div>", {id: `${board.id}_module_0`, "class": `${board.module_0_type}`});

      if (board.status == "offline") $module_0.addClass('disabled');
      
      $(`<span>${board.module_0_name}</span>`)
        .addClass("name")
        .appendTo($module_0);

      $module_0.on('click', switchClick);
      controls.append($module_0);
    }

    if (board.module_1_type != "empty") {
      var $module_1 = $("<div>", {id: `${board.id}_module_1`, "class": `${board.module_1_type}`});
      
      if (board.status == "offline") $module_1.addClass('disabled');

      $(`<span>${board.module_1_name}</span>`)
        .addClass("name")
        .appendTo($module_1);

      $module_1.on('click', switchClick);
      controls.append($module_1);
    }

    if (board.module_2_type != "empty") {
      var $module_2 = $("<div>", {id: `${board.id}_module_2`, "class": `${board.module_2_type}`});

      if (board.status == "offline") $module_2.addClass('disabled');

      $(`<span>${board.module_2_name}</span>`)
        .addClass("name")
        .appendTo($module_2);

      $module_2.on('click', switchClick);
      controls.append($module_2);
    }

    if (board.module_3_type != "empty") {
      var $module_3 = $("<div>", {id: `${board.id}_module_3`, "class": `${board.module_3_type}`});
      
      if (board.status == "offline") $module_3.addClass('disabled');

      $(`<span>${board.module_3_name}</span>`)
        .addClass("name")
        .appendTo($module_3);

      $module_3.on('click', switchClick);
      controls.append($module_3);
    }
  }

})