/* eslint-disable no-undef */
$(document).ready(function(){
    
    const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    let $clock = $('.clock');
    let divider = ' ';
    updateClock();
    
    
    setInterval(updateClock, 1000);

    function updateClock()
    {
        let date = new Date;
        // date.setTime(result_from_Date_getTime);

        // let seconds = date.getSeconds();
        let minutes = date.getMinutes();
        let hour = date.getHours();

        // let year = date.getFullYear();
        let month = date.getMonth(); // beware: January = 0; February = 1, etc.
        let day = date.getDate();
        let dOW = date.getDay(); // Sunday = 0, Monday = 1, etc.
        // let milliSeconds = date.getMilliseconds();
        
        divider = divider === ':' ? ' ' : ':';
        $clock.find('.time').text(`${hour}${divider}${('0'+minutes).slice(-2)}`);
        $clock.find('.date').text(`${DAYS[dOW]}, ${day} ${MONTHS[month]}`);
        // $clock.find('.tz').text(Intl.DateTimeFormat().resolvedOptions().timeZone);
        
    }
});