$(document).ready(function(){
    const socket = io();
    socket.emit('console:forecast:get');

    const iconsMap = {
        
        '200': 'wi-thunderstorm', // thunderstorm with light rain	
        '201': 'wi-thunderstorm', // thunderstorm with rain	
        '202': 'wi-thunderstorm', // thunderstorm with heavy rain	
        '210': 'wi-lightning', // light thunderstorm	
        '211': 'wi-lightning', // thunderstorm
        '212': 'wi-lightning', // heavy thunderstorm	
        '221': 'wi-lightning', // ragged thunderstorm	
        '230': 'wi-thunderstorm', // thunderstorm with light drizzle	
        '231': 'wi-thunderstorm', // thunderstorm with drizzle	
        '232': 'wi-thunderstorm', // thunderstorm with heavy drizzle	

        '300': 'wi-na', //light intensity drizzle	
        '301': 'wi-na', //drizzle
        '302': 'wi-na', //heavy intensity drizzle	
        '310': 'wi-na', //light intensity drizzle rain	
        '311': 'wi-na', //drizzle rain	
        '312': 'wi-na', //heavy intensity drizzle rain	
        '313': 'wi-na', //shower rain and drizzle	
        '314': 'wi-na', //heavy shower rain and drizzle	
        '321': 'wi-na', //shower drizzle	

        '500': 'wi-rain', //light rain
        '501': 'wi-rain', //moderate rain
        '502': 'wi-rain', //heavy intensity rain
        '503': 'wi-rain', //very heavy rain
        '504': 'wi-rain', //extreme rain
        '511': 'wi-rain', //freezing rain
        '520': 'wi-showers', //light intensity shower rain
        '521': 'wi-showers', //shower rain
        '522': 'wi-showers', //heavy intesnity shower rain
        '531': 'wi-rain', //ragged rain

        '600': 'wi-snow', //light snow
        '601': 'wi-snow', //snow
        '602': 'wi-snow', //heavy snow
        '611': 'wi-sleet', //sleet
        '612': 'wi-sleet', //light shower sleet
        '613': 'wi-sleet', //shower sleet
        '615': 'wi-snow', //light rain and snow
        '616': 'wi-snow', //rain and snow
        '620': 'wi-snow', //light shower snow
        '621': 'wi-snow', //shower snow
        '622': 'wi-snow', //heavy shower snow

        '701': 'wi-na', //mist
        '711': 'wi-smoke',
        '721': 'wi-day-haze',
        '731': 'wi-dust',
        '741': 'wi-fog',
        '751': 'wi-sandstorm',
        '761': 'wi-dust',
        '762': 'wi-na', //Volcanic ash
        '771': 'wi-na', //squall
        '781': 'wi-tornado',

        '800': 'wi-day-sunny',
        '801': 'wi-cloudy', //11-25%
        '802': 'wi-cloudy', //25-50%
        '803': 'wi-cloudy', //51-84%
        '804': 'wi-cloudy', //85-100%
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