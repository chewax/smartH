$(document).ready(function(){
    var socket = io();
    socket.emit('console:forecast:get');


    socket.on("console:forecast:get", (data) => {

        let $today = $(".forecast .today");
        $today.addClass(data.daily.data[0].icon);
        $(`<span>${Math.round(data.daily.data[0].temperatureMax)}°/${Math.round(data.daily.data[0].temperatureMin)}°</span>`)
            .addClass("temp")
            .appendTo($today);
    })

    let forecast = $("#forecast")

    
})