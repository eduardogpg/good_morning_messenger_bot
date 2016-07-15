var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN = 'EAASoUxc55QUBAJiI4T9vkfw58MmQGpRjCVFQW6HBD6dakk2srvivwTFvcGsKGiw0Kkmgz0HEbpPVZBZAEIydI3bNSbXVramCBa9Ed2rrosaeqRADsennk190yZBPoDfa6SkNHQbun0YhPZCcXGN0pHAPd2IEYoPLCZAVzM8isCepxquyOLt34'

var app = express();
app.use(bodyParser.json());


var server = app.listen(3000, function(){
  console.log("El servidor se encuentra en el puerto 3000");
});

app.get('/', function(req, res){
  res.send('Hola mundo');
});


app.get('/webhook', function(req, res){
  if(req.query['hub.verify_token'] === 'test_token_say_hello' ){
    res.send(req.query['hub.challenge']);
  }else{
    res.send('El token no es valido, lo siento');
  }
});

app.post('/webhook_dos', function(req, res){
  var data = req.body;
  if(data.object == 'page'){
    console.log(data);
    res.sendStatus(200);
  }
});

app.post('/webhook', function(req, res){

  var data = req.body;
  if(data.object == 'page'){
    
    data.entry.forEach(function(pageEntry){
      pageEntry.messaging.forEach(function(messagingEvent){

        if(messagingEvent.message){
          receiveMessage(messagingEvent);
        }

      });
    });

    res.sendStatus(200);
  }
});

function receiveMessage(event){
  var senderID = event.sender.id;
  var messageText = event.message.text;
  
  if (messageText){

    evaluateMessage(senderID, messageText);
  
  }
}

function evaluateMessage(senderID, message){
  var finalMessage = '';

  if(isContains(message, 'taller')){

    finalMessage = 'El taller esta en vivo';

  }else if(isContains(message, 'gato')){

    var url_image = getUrlImageCats();
    sendMessageImage(senderID, url_image);

  }else if(isContains(message, 'perro')){

    var url_image = getUrlImageDogs();
    sendMessageImage(senderID, url_image)
  
  }else if(isContains(message, 'clima')){

    sendMessageWeather(senderID);

  }else if(isContains(message, 'desarrollador')){

    sendMessageHelp(senderID);

  }else{

    finalMessage = message;
  }
  sendMessageText(senderID, finalMessage);
}

function sendMessageText(recipientId,message){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: message
    }
  };
  callSendAPI(messageData);
}

function sendMessageImage(recipientId, image_url){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: image_url, //"http://i.imgur.com/SOFXhd6.jpg" 
        }
      }
    }
  };
  callSendAPI(messageData);
}

function callSendAPI(messageData){
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: APP_TOKEN },
    method: 'POST',
    json: messageData
  }, function (error, response, data) {
    if (error){
      console.error("Error al enviar el mensaje");
    }else{
      console.log("El mensaje fue enviado correctamente");
    }
  });  
}

function sendMessageHelp(recipientId){

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ templateElementHelp() ],
        }
      }
    }
  };
  callSendAPI(messageData);
}

function templateElementHelp(){
  return {
    title: "Eduardo Ismael",
    subtitle: "Desarrollado de Software en Código facilito",
    item_url: "https://www.facebook.com/Eduardo.Ismael.GP",               
    image_url: "http://graph.facebook.com/100000141857371/picture?type=large",
    buttons: [ buttonTwitter(), buttonFacebook() ],
  }
}

function buttonTwitter(){
  return {
    type: "web_url",
    url: "https://twitter.com/eduardo_gpg",
    title: "Twitter"
  }
}
function buttonFacebook(){
  return {
    type: "web_url",
    url: "https://www.facebook.com/Eduardo.Ismael.GP",
    title: "Facebook"
  }
}

function sendMessageWeather(senderID){
  getWeather(function(response){

    message = validateTemperature(response);
    sendMessageText(senderID, message);

  });
}

function getUrlImageDogs(){
  var images = ['http://i.imgur.com/IZCWuqy.jpg', 'http://i.imgur.com/bdh4Qpn.jpg', 'http://i.imgur.com/2cGhWub.jpg', 'http://i.imgur.com/tjvD7lA.jpg', 'http://i.imgur.com/A3DbC8r.jpg', 'http://i.imgur.com/jl4Oje0.jpg', 'http://i.imgur.com/nwClYm0.jpg', 'http://i.imgur.com/93hRNQG.jpg', 'http://i.imgur.com/BdJtY.jpg']
  return getRandomPosition(images);
}

function getUrlImageCats(){
  var images = ['http://i.imgur.com/SOFXhd6.jpg', 'http://i.imgur.com/C2IjdGW.jpg', 'http://i.imgur.com/h5mowK5.jpg', 'http://i.imgur.com/DxhmtB5.jpg', 'http://i.imgur.com/JniS4MF.jpg', 'http://i.imgur.com/9uRmqxv.jpg', 'http://i.imgur.com/nwClYm0.jpg', 'http://i.imgur.com/R63cYVM.jpg', 'http://i.imgur.com/O8XfDsC.jpg']
  return getRandomPosition(images);
}

function getRandomPosition(list){
  var position = Math.floor(Math.random() * list.length );
  return list[position];
}

function validateTemperature(temperature){
  if (temperature > 30)
    return 'El clima es ' + temperature + 'Cº te recomiendo que no salgas hay mucho calor';
  return 'El clima es ' + temperature + 'Cº deberias salir a caminar';
}

function isContains(sentence, word){
  return sentence.indexOf(word) > -1;
}

function getWeather( callback ){
  request('http://api.geonames.org/findNearByWeatherJSON?lat=16.750000&lng=-93.116669&username=eduardo_gpg', 
    function (error, response, data) {
      if(!error){
        response = JSON.parse(data);
        temperature = response.weatherObservation.temperature;
        callback(temperature);
      }
    });
}