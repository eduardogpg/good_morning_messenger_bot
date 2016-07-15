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

If you want seen the official example

```js
$ npm install messenger-bot
```

For the webhook that facebook expects you need use ngrok, download [here][ngrok] and run the next line


```js
$ ./ngrok http 3000
```

when you create your webhook put test_token_say_hello in the facebook form, section token.


Once run the command is necesary put the URL in the field URL webhook facebook, Important not stop the execution this program, because is necesary restart the app (meaning create new app).

replace the token (line 5) with the token of your application.


Deploy whit Heroku


```js
$ npm init
$ heroku login
$ heroku create
$ git push heroku master
```

Update Heroku

```js
$ git add .
$ git commit -m 'Your change'
$ git push heroku master
```

Some links

* [Facebook Documentation][facebook]
* [ngrol][ngrok]
* [express][express]
* [release your app ][release]
* [API weather ][weather]
* [Emojies][Emojie]

:innocent:
:cat:
:cow:

[facebook]: <https://developers.facebook.com/docs/messenger-platform/quickstart>
[ngrok]: <https://ngrok.com/>
[express]: <http://expressjs.com/es/>
[release]: <https://developers.facebook.com/docs/messenger-platform/app-review/>
[weather]: <http://www.geonames.org/enablefreewebservice/>
[Emojie]: <http://emojipedia.org/>

