$(document).ready(function(){
    const socket = io();
    socket.emit('console:avwx:get');


    socket.on('console:avwx:get', (data) => {    
        
        console.log(data);
        let $ticker = $('.ticker');

        for (let sta in data.metar) {
          $(`<div class="ticker__item">${data.metar[sta]}</div>`)
            .appendTo($ticker);
        }

        // $(this).attr('data-before','anything');

        
        // $(`<i class="wi ${iconsMap[data.current.weather[0].id]}"></i>`)
        //     .appendTo($forecast);

        // $(`<span>${Math.round(data.current.temp)}°</span>`)
        //     .addClass('temp')
        //     .appendTo($forecast);
    });
    
});