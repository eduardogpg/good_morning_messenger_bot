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
  var messageText = message.text;
  var messageAttachments = message.attachments;

  console.log("Nuevo mensaje de " + senderID)
  if (messageText) {

    switch (messageText) {
      case 'generic':
      	console.log("Vamos a enviar link");
        sendGenericMessage(senderID);
        break;

      default:
      	console.log("Vamos a enviar texto");
        sendTextMessage(senderID, messageText);
    }
  } 
}

function sendGenericMessage(recipientId) {
  new_elements = []
  new_elements.push( getGenericElementMessage() )
  
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {	
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: new_elements,
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function getGenericElementMessage(){
  return {
    title: "rift",
    subtitle: "Next-generation virtual reality",
    item_url: "https://www.oculus.com/en-us/rift/",               
    image_url: "http://messengerdemo.parseapp.com/img/rift.png",
    buttons: [{
        type: "web_url",
        url: "https://www.oculus.com/en-us/rift/",
        title: "Open Web URL"
      }, {
        type: "postback",
        title: "Call Postback",
        payload: "Payload for first bubble",
      }
    ],
  }
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
  		console.error("Error al enviar el mensaje.\n");
  	}else{
  		console.log("El mensaje fue enviado correctamente.\n");
  	}
  });  
}

console.log("El servidor se encuentra a la escucha en el puerto " + CUSTOME_PORT)
