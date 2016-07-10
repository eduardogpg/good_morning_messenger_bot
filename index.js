var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

PAGE_ACCESS_TOKEN = 'EAAMf8hvIsAYBAFRutDrf88S6DlkfMopnH4pc45iZAl5pHvFasxasWn0zHIKFT4IGjTBFPBXZBv2Ro9bMlCl2Dc9s8XXiZCh3qtBmHEsZAlypg3HkVTljcP2fMGmtSFquKk4nznnPvhZCGSzPe2xIZCTEZAyBXui9p5DoN0NaddTNbysqRgJHjYq'
CUSTOME_PORT = 3000

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || CUSTOME_PORT));

app.get('/', function (req, res) {
    res.send('Hola Mundo');
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'test_bot_say_hello') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
  var data = req.body;
 
  if (data.object == 'page') {
    data.entry.forEach(function(pageEntry) {

      pageEntry.messaging.forEach(function(messagingEvent) {
      	
      	if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        }

      });
    });
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var message = event.message;
  var messageText = "I say : " + message.text;
  sendTextMessage(senderID, messageText);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
  	if (error){
  		console.error("Error al enviar el mensaje.");
  	}else{
  		console.log("El mensaje fue enviado correctamente.");
  	}
  });  
}
