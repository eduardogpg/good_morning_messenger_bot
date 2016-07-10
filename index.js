var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));


app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'test_bot_say_hello') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});


console.log("El servidor se encuentra en el puerto 3000")