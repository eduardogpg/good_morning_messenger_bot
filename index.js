var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var http = require('http');

var app = express();

https://github.com/request/request

PAGE_ACCESS_TOKEN = 'EAAOQRGtWnHQBAHu3BGf7KDwnJdjcOkm8L0ja7RsnQ9JUoetdKzBZCT8L4c5fOt0j8DAcnceslQE7j3VzNoO9Rxn7N6Mpbv9fp04tgH4Paf8Q16No1bz8V3Q6Q1qQX67grZCmGdT4MSVAZBvEHOG9ohOgHIWmatUKLMFD2cN9YiMpCpZBPQdf'
CUSTOME_PORT = 3000
REPEAT_WORLD = "repite "
WEATHER = "clima"
TEMPERATURE = "temperatura"
WORKSHOP = "taller"
CAT = "perro"
HELP = "ayuda"

MESSAGE_HELP = "Promocional para el taller del días viernes, crea un bot con facebook Messenger\nTrabajaremos con webhooks, con ngrok\nManejo de evento de Facebook"

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var server = app.listen( CUSTOME_PORT, function(){
  var port = server.address().port
  console.log("El servidor se encuentra a la escucha en el puerto " + port)
});

app.get('/', function (req, res) {
  res.send('Hola Mundo');
});


app.get('/clima', function (req, res) {
  GetWeather( function(message){
    res.send(message);
  });  
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

/*
app.post('/webhook_dos', function (req, res) {
  var data = req.body;
  console.log("nuevo mensaje");
  //console.log(data.entry);
  console.log(data.entry[0].messaging);
  res.sendStatus(200);
});
*/

function receivedMessage(event) {
  var senderID = event.sender.id;
  var message = event.message;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  //console.log("Nuevo mensaje de " + senderID)
  //console.log(messageText);

  if (messageText) {
    if (isContainsWorld(messageText, REPEAT_WORLD)){
      
      message = repeatWorld(messageText);
      sendTextMessage(senderID, message);

    }else if (isContainsWorld(messageText, WEATHER) || isContainsWorld(messageText, TEMPERATURE) ){
      
      GetWeather( function(message){
         sendTextMessage(senderID, message);
      });
      
    }else if (isContainsWorld(messageText, CAT)  ){
  
      sendImageMessage(senderID);

    }else if (isContainsWorld(messageText, HELP)  ){
  
      sendTextMessage(senderID, MESSAGE_HELP);

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

function sendImageMessage(recipientId) {
  //https://s3.amazonaws.com/StartupStockPhotos/20140808_StartupStockPhotos/85.jpg
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "http://i.imgur.com/IZCWuqy.jpg"
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


function foo(address, fn){
  geocoder.geocode( { 'address': address}, function(results, status) {
     fn(results[0].geometry.location); 
  });
}

function GetWeather( callback ){
   temperature = request('http://api.geonames.org/findNearByWeatherJSON?lat=16.750000&lng=-93.116669&username=eduardo_gpg', function (error, response, data) {
     response = JSON.parse(data);
     temperature = response.weatherObservation.temperature;

     final_message = "Ahora nos encontramos a "+ temperature + "ºC"
     if (temperature > 30) {
        final_message+=  ",Te recomiento que no salgas."
    }else{
        final_message+=  ",Un bonito día para disfrutar."
    }
     callback(final_message);
  });

}



