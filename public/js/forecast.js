$(document).ready(function(){
    let socket = io();
    socket.emit('console:forecast:get');

    let iconsMap = {
        '800': 'wi-day-sunny'
    };

    socket.on('console:forecast:get', (data) => {    
        
        console.log(data);
        let $forecast = $('.forecast');

        // $(this).attr('data-before','anything');

        $(`<i class="wi ${iconsMap[data.current.weather[0].id]}"></i>`)
            .appendTo($forecast);

        $(`<span>${Math.round(data.current.temp)}°</span>`)
            .addClass('temp')
            .appendTo($forecast);
    });
    
});