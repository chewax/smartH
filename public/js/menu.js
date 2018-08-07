$(document).ready(function(){
  
    var btn = $(".menu .button");
    var controls = $(".controls");
    var dashboard = $(".dashboard");
 
    btn.on('click', function(e){
      e.preventDefault();
      $(this).toggleClass('active');
      
      if ($(this).hasClass('active')) {
        $(".menu .button").not(this).removeClass('active');
      }
    })
    
    $(".menu .button.home").on('click', function(e){
        e.preventDefault();
        controls.removeClass('active');
        dashboard.addClass('active');
    })

    $(".menu .button.domo").on('click', function(e){
        e.preventDefault();
        controls.addClass('active');
        dashboard.removeClass('active');
    })

})