(function () {
    'use strict';

    var express = require('express');
    var router = express.Router();
    var {boards} = require('../socket');

    router.get('/', function (req, res) {
        
        // res.render('dashboard', {
        //     devices: [
        //         { class: "macro away lg", name: "Fuera" },
        //         { class: "macro morning lg", name: "Mañana" },
        //         { class: "macro night lg", name: "Noche" },
        //         { class: "switch light", name: "Zaguan" },
        //         { class: "switch light", name: "Alero Este" },
        //         { class: "switch light", name: "Alero Sur" },
        //         { class: "switch light", name: "Dormitorio 1" },
        //         { class: "switch light", name: "Dormitorio 2" },
        //         { class: "switch fosset", name: "Jardin Frente" },
        //         { class: "info energy md", name: "Consumo", data: "0.23" },
        //         { class: "info entry", name: "Frente" },
        //         { class: "info entry", name: "Fondo" },
        //         { class: "info entry", name: "Cocina" },
        //         { class: "info lock", name: "Frente" },
        //         { class: "info lock", name: "Fondo" },
        //         { class: "info lock", name: "Cocina" },
        //         { class: "info temp", name: "Comedor", data: "18" },
        //         { class: "info temp", name: "Dormitorio", data: "23" }
        //     ],
        // });


        console.log(boards);
        
        res.render('dashboard', {
            devices: boards
        });

    });
    
    module.exports = router;

}).call(this);
