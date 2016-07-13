var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

PAGE_ACCESS_TOKEN = 'EAAENT4pPJkkBAEWi0nBn7uZBYdGFcKDt3g9HUwufWxBjp8Nw2mX7T4j5CBxz8sR4JAYxs1bYqLO6rZC8GY0Mw73jW0STtanXe9DfjmeF9OuE3mBflJ2ugH9Cb575xDHB4m49OmNGVgsaQtViEEXe3rZCJc6bVLClJ0yMNY8f33KaNBc5jeE'
CUSTOME_PORT = 3000
REPEAT_WORLD = "repite "
WEATHER = "clima"
TEMPERATURE = "temperatura"
WORKSHOP = "taller"

CAT = "gato"
DOG = "perro"
HELP = "ayuda"

MESSAGE_HELP = "Puede pedir : el clima, imagenes de gatos de perro e información del taller"
IMAGE_DOGS = ['IZCWuqy.jpg', 'bdh4Qpn.jpg', '2cGhWub', 'tjvD7lA', 'A3DbC8r', 'jl4Oje0', 'nwClYm0', '93hRNQG', 'BdJtY']
IMAGE_CATS = ['SOFXhd6.jpg', 'C2IjdGW.jpg', 'h5mowK5.jpg' , '9uRmqxv.jpg', 'R63cYVM.jpg', 'EuQ4fPQ.jpg' , 'JniS4MF', 'DxhmtB5']
URL_IMAGE = 'http://i.imgur.com/'


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

  if (messageText) {
    if (isContainsWorld(messageText, REPEAT_WORLD)){
      
      message = repeatWorld(messageText);
      sendTextMessage(senderID, message);

    }else if (isContainsWorld(messageText, WEATHER) || isContainsWorld(messageText, TEMPERATURE) ){
      
      GetWeather( function(message){
         sendTextMessage(senderID, message);
      });

    }else if (isContainsWorld(messageText, CAT)  ){

      sendImageCat(senderID);

    }else if (isContainsWorld(messageText, DOG)  ){

      sendImageDog(senderID);

    }else if (isContainsWorld(messageText, HELP)  ){
  
      sendTextMessage(senderID, MESSAGE_HELP);

    }else if (isContainsWorld(messageText, WORKSHOP) ){

      var message = "El taller será el día viernes a las 5 de la tarde horario de México.";
      sendTextMessage(senderID, message);

    }else{
      
      switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;
      default:
        messageText = "Solo se repetir las cosas, escribe ayuda para más info.  " +messageText;
        sendTextMessage(senderID, messageText);
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


function sendImageDog(recipientId){
 pos_image = Math.floor(Math.random() * IMAGE_DOGS.length );
 image = IMAGE_DOGS[pos_image]
 url_image = URL_IMAGE + image
 sendImageMessage(recipientId, url_image + ".jpg")
}

function sendImageCat(recipientId){
  pos_image = Math.floor(Math.random() * IMAGE_CATS.length );
  image = IMAGE_CATS[pos_image]
  url_image = URL_IMAGE + image
  console.log( url_image )
  sendImageMessage(recipientId, url_image + ".jpg")
}

function sendImageMessage(recipientId, url_image) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: url_image
        }
      }
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

function GetWeather( callback ){
    //http://www.geonames.org/enablefreewebservice
   temperature = request('http://api.geonames.org/findNearByWeatherJSON?lat=16.750000&lng=-93.116669&username=eduardo_gpg', function (error, response, data) {
     response = JSON.parse(data);
     temperature = response.weatherObservation.temperature;

     final_message = "Me dicen que tenemos una temperatura de "+ temperature + " ºC"
     if (temperature > 30) {
        final_message+=  ", te recomiento que no salgas."
    }else{
        final_message+=  ", un bonito día para disfrutar."
    }
     callback(final_message);
  });

}