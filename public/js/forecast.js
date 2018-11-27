$(document).ready(function(){
    var socket = io();
    socket.emit('console:forecast:get');


    socket.on("console:forecast:get", (data) => {
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

    let forecast = $("#forecast")

    
})