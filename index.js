var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

PAGE_ACCESS_TOKEN = 'EAAEGnfkOXJABAFmpaZAyc3s1ghK7kBKAaPWJIUbQH4SSg3uY9L0c2GHMie99kWdGuAeNWkkcEEANNEgt8b8wHq3MZAWCQUAZC7rNtXmIHCApIWLectSBonJe3n0gfK3UmRRpJn0Sxy07KMHfXG6ukpLixRPBlKELtUJBkeXZCXNFrM1tzyZCA'
CUSTOME_PORT = 3000
REPEAT_WORLD = "repite "
WEATHER = "clima"
TEMPERATURE = "temperatura"
WORKSHOP = "taller"

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.listen((process.env.PORT || CUSTOME_PORT));

var server = app.listen( CUSTOME_PORT, function(){
  var port = server.address().port
  console.log("El servidor se encuentra a la escucha en el puerto " + port)
});


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
  console.log(messageText);

  if (messageText) {
    if (isContainsWorld(messageText, REPEAT_WORLD)){
      
      message = repeatWorld(messageText);
      sendTextMessage(senderID, message);

    }else if (isContainsWorld(messageText, WEATHER) || isContainsWorld(messageText, TEMPERATURE) ){
      
      message = GetWeather();
      sendTextMessage(senderID, message);

    }else if (isContainsWorld(messageText, WORKSHOP) ){

      var message = "El día viernes a las 5 de la tarde horario de México.";
      sendTextMessage(senderID, message);

    }else{
      
      switch (messageText) {
      case 'generic':
        console.log("Vamos a enviar link");
        sendGenericMessage(senderID);
        break;
      default:
        console.log("Vamos a enviar texto");
        sendTextMessage(senderID, messageText);
        //sendGifMessage(senderID);
      }  
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
  new_buttons = []
  new_buttons.push( getButtonMessage() )
  return {
    title: "Hello world",
    subtitle: "Next-generation virtual reality",
    item_url: "https://www.oculus.com/en-us/rift/",               
    image_url: "http://messengerdemo.parseapp.com/img/rift.png",
    buttons: new_buttons,
  }
}

function getButtonMessage(){
  return {
    type: "web_url",
    url: "https://www.oculus.com/en-us/rift/",
    title: "Open Web URL"
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

function sendGifMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "http://messengerdemo.parseapp.com/img/instagram_logo.gif"
        }
      }
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

function isContainsWorld(messageText, sentence){
  return messageText.indexOf(sentence) > -1
}

function repeatWorld(messageText){
  return messageText.replace(REPEAT_WORLD, "");
}

function GetWeather(){
  var temperatura = 38;
  final_message = "Ahora nos encontramos a "+ temperatura + "ºC"
  if (temperatura > 30) {
    final_message+=  ", Recomiento que no salgas"
  }
  return final_message;
}

