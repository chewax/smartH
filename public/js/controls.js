$(document).ready(function(){
  
    var btn = $(".switch");
    var info = $(".info");
    
    var macro = $(".macro");
    
    btn.on('click', function(e){
      e.preventDefault();
      $(this).toggleClass('on');
      macro.removeClass('active');
    })
    
    info.on('click', function(e){
      e.preventDefault();
      $(this).toggleClass('active');
    })
    
    
    macro.on('click', function(e){
      e.preventDefault();
      $(this).toggleClass('active');
    
      if ($(this).hasClass('active')) {
        $(".macro").not(this).removeClass('active');
      }
    })
    
  })