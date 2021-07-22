
$(document).ready(function(){
    let $nav = $('.nav');
    let $els = $nav.find('li');

    $('.nav li').each(function(){
        $(this).click( function() {
            $(this).toggleClass('selected');
        });
    });
    
    
    
});