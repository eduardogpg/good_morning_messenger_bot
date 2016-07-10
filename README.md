# Say Good Morning

This is a simple messenger bot, with the goal is say Good morning every day with a especial message around 7:30 am.

You can modify this project easily.

Technologies :
    
  - Java Script
  - NodeJS
  - Express Framework
  
You can also see the official documentation:

link [Facebook Documentation][facebook]

### Run local

Install NodeJS

```Js
$ Node
```

Install expresss

```Js
$ npm install express body-parser request --save
```

If you want the official example
```js
$ npm install messenger-bot
```
For the webhook that facebook expects you need use ngrok, download [here][ngrok]

```js
$ ./ngrok http 3000
```

Once run the command is necesary put the URL in the field URL webhook facebook, Important not stop the execution this program, because is necesary restart the app (meaning create new app).

[facebook]: <https://developers.facebook.com/docs/messenger-platform/quickstart>
[ngrok]: <https://ngrok.com/>