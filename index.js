/*===== Imports ===== */
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

/*===== Const ===== */
const PAGE_ACCESS_TOKEN = 'EAAQMMevRNgQBAIS3Y7RavTequW75QyBRm8ELXLxEcNQl39UPOh2fBhO7c25oeTIrYIHsRbvZCKB6MMlzf76WdNmYra7dGridz3l2Py0zXErPHvCBon1F0eHtoFZCOWOq0sbaoZCUigNq2KGlTDMWJut7cpRBDuO2hcuXZAYge6G0jiAm2DBZB'
const IMAGE_DOGS = ['IZCWuqy', 'bdh4Qpn', '2cGhWub', 'tjvD7lA', 'A3DbC8r', 'jl4Oje0', 'nwClYm0', '93hRNQG', 'BdJtY']
const IMAGE_CATS = ['SOFXhd6', 'C2IjdGW', 'h5mowK5' , '9uRmqxv', 'R63cYVM', 'EuQ4fPQ' , 'JniS4MF', 'DxhmtB5']

/*===== Instances ===== */
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var server = app.listen( 3000, function(){
  console.log("El servidor se encuentra a la escucha en el puerto 3000" )
});

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

/*======= Facebook Function =======*/
function receivedMessage(event) {
  var senderID = event.sender.id;
  var message = event.message;
  var messageText = message.text;

  if (messageText) {
    if (isContainsWorld(messageText, 'repite') || isContainsWorld(messageText, 'di') ){
      
      message = repeatWorld(messageText);
      sendTextMessage(senderID, message);

    }else if (isContainsWorld(messageText, 'clima') || isContainsWorld(messageText, 'temperatura') ){
      
      GetWeather( function(message){
         sendTextMessage(senderID, message);
      });

    }else if (isContainsWorld(messageText, 'gato')  ){

      url_image = getUrlImage(IMAGE_CATS);
      sendImageMessage(senderID, url_image);

    }else if (isContainsWorld(messageText, 'perro')  ){

      url_image = getUrlImage(IMAGE_DOGS)
      sendImageMessage(senderID, url_image);

    }else if (isContainsWorld(messageText, 'ayuda')  ){
      
      sendMessageHelp(senderID);

    }else if (isContainsWorld(messageText, 'taller') ){

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

function sendMessageHelp(recipientId){
  var message = "Puede pedir : el clima, imagenes de gatos o de perros e información del taller";
  sendTextMessage(recipientId, message);
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
      console.error("Error al enviar el mensaje");
    }else{
      console.log("El mensaje fue enviado correctamente");
    }
  });  
}

/*======= Custome Function =======*/
function getUrlImage( image_list ){
  position = Math.floor(Math.random() * image_list.length );
  return  'http://i.imgur.com/' + image_list[position] + ".jpg"
}

function isContainsWorld(messageText, sentence){
  return messageText.indexOf(sentence) > -1
}

function repeatWorld(messageText){
  return messageText.replace(REPEAT_WORLD, "");
}

function GetWeather( callback ){
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

