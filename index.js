let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

require('./lib/socket').initSocketIOEvents(io);

app.use('/static', express.static(__dirname + '/public'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
    
    res.render('dashboard', {
        devices: [
            { class: "macro away lg", name: "Fuera" },
            { class: "macro morning lg", name: "Mañana" },
            { class: "macro night lg", name: "Noche" },
            { class: "switch light", name: "Zaguan" },
            { class: "switch light", name: "Alero Este" },
            { class: "switch light", name: "Alero Sur" },
            { class: "switch light", name: "Dormitorio 1" },
            { class: "switch light", name: "Dormitorio 2" },
            { class: "switch fosset", name: "Jardin Frente" },
            { class: "info energy md", name: "Consumo", data: "0.23" },
            { class: "info entry", name: "Frente" },
            { class: "info entry", name: "Fondo" },
            { class: "info entry", name: "Cocina" },
            { class: "info lock", name: "Frente" },
            { class: "info lock", name: "Fondo" },
            { class: "info lock", name: "Cocina" },
            { class: "info temp", name: "Comedor", data: "18" },
            { class: "info temp", name: "Dormitorio", data: "23" }
        ],
    });

    // res.render('dashboard', {
    //     devices: []
    // });
});

server.listen(5050, function () {
    console.log('Example app listening on port 5050!');
});