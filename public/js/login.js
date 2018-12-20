$(document).ready( function() {

    var $username = $("#username");
    var $password = $("#password");
    var $button = $("#submit");

    $button.on('click', doLogin);

    function doLogin () {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5000/api/v1/login',
            data: {username: $username.val(), password: $password.val()},
    
            success: function (msg) {

                setBearerToken(msg.token);
                window.location.replace("/api/v1/dashboard");

            },
            error: function (request, status, error) {
    
                console.log(error);
            }
        });
    }
    
});