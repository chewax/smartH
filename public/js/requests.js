let auth_token = localStorage.getItem("smart_token");

function GET (endpoint) {
    $.ajax({
        type: 'POST',
        url: `http://localhost:5000/api/v1/${endpoint}`,

        beforeSend: function (xhr) {b
            xhr.setRequestHeader ("Authorization", `Bearer ${auth_token}`);
        },

        success: function (msg) {

            console.log(msg);

        },
        error: function (request, status, error) {

            console.log(error);
        }
    });
}

function setBearerToken (token) {
    localStorage.setItem("smarth_token", token);
    auth_token = token;
}