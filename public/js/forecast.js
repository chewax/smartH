$(document).ready(function(){
    let socket = io();
    socket.emit('console:forecast:get');


    let iconsMap = {
        "clear-day": "wi-day-sunny"
    };

    socket.on("console:forecast:get", (data) => {
        // <i class="wi wi-night-sleet"></i>
        
        console.log(data.daily.data[0].icon);

        let $forecast = $(".forecast");

         $(`<i class="wi ${iconsMap[data.daily.data[0].icon]}"></i>`)
            .appendTo($forecast);

        // $today.addClass( iconsMap[data.daily.data[0].icon] );
        $(`<span>${Math.round(data.daily.data[0].temperatureMax)}°/${Math.round(data.daily.data[0].temperatureMin)}°</span>`)
            .addClass("temp")
            .appendTo($forecast);
    })

    let forecast = $("#forecast")


    
})