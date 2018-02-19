// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const request = require('request');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

let VERIFY_TOKEN = "xkcd";
const PAGE_ACCESS_TOKEN = "EAAFs0hONVTQBAI6xNWvDU4mWYwZCTi3nB8UxZBmi0UFnt" +
  "niQaQSgaU2TiZBviUS8lTrsoJvZA0HMEdNlFsEqzqZCLo8hbizFG34XiArbbYTTyky" +
  "N0ZCRWPLSJFe9ewmUd5k7ERvreIXhD37oczR2P65M9XyKucdOfE5xf4QCIlMQZDZD";

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});



// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.facebookChatPost = functions.https.onRequest((req, res) => {

  let body = req.body;

console.log('body', body);
console.log('body.object', body.object);
// Checks this is an event from a page subscription
if (body.object === 'page') {

  // Iterates over each entry - there may be multiple if batched
  body.entry.forEach(function(entry) {

    // Gets the message. entry.messaging is an array, but
    // will only ever contain one message, so we get index 0
    let webhook_event = entry.messaging[0];
    console.log('webhook_event', webhook_event);
  });

  // Returns a '200 OK' response to all requests
  res.status(200).send('EVENT_RECEIVED');
} else {
  // Returns a '404 Not Found' if event is not from a page subscription
  res.sendStatus(404);
}

});


exports.facebookChatGet = functions.https.onRequest((req, res) => {

  // Your verify token. Should be a random string.

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  console.log('facebookChatGet() req.body',req.body);
  console.log('facebookChatGet() req.query',req.query);
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      // if (webhook_event.message) {
      //   handleMessage(sender_psid, webhook_event.message);
      // }

      if (webhook_event.message || webhook_event.postback || webhook_event.referral) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

  /*
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

  // Checks the mode and token sent is correct
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {

    // Responds with the challenge token from the request
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);

  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
    }
  }*/
});
// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  request({
    "uri": `https://graph.facebook.com/v2.6/${sender_psid}
?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
    "method": "GET"
  }, (err, res, body) => {
    if (!err) {
      console.log('handlePostback res', res);
      console.log('handlePostback body', body);

      let message = `Hey ${res.first_name}, if you have any questions let me know.`;
      callSendAPI(sender_psid,message);
    } else {
      console.error("Unable to send message:" + err);
    }
  })
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  };

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
// Push the new message into the Realtime Database using the Firebase Admin SDK.
admin.database().ref('/messages').push({original: original}).then(snapshot => {
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref);
});
});

const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const app = express();


// You might instead set these as environment varibles
// I just want to make this example explicitly clear
const appUrl = 'atila-7.firebaseapp.com';
// const renderUrl = 'https://render-tron.appspot.com/render';
const renderUrl = 'https://atila-7.appspot.com/render';


// Generates the URL
function generateUrl(request) {
  return url.format({
    protocol: request.protocol,
    host: appUrl,
    pathname: request.originalUrl
  });
}

function detectBot(userAgent) {
  // List of bots to target, add more if you'd like

  const bots = [
    // crawler bots
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    // link bots
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkShare',
    'facebot',
    'outbrain',
    'W3C_Validator'
  ]

  const agent = userAgent.toLowerCase()

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('bot detected', bot, agent)
      return true
    }
  }

  console.log('no bots found')
  return false

}


app.get('*', (req, res) => {


  const isBot = detectBot(req.headers['user-agent']);


  if (isBot) {

    const botUrl = generateUrl(req);
    // If Bot, fetch url via rendertron

    fetch(`${renderUrl}/${botUrl}`)
      .then(res => res.text() )
      .then(body => {

        // Set the Vary header to cache the user agent, based on code from:
        // https://github.com/justinribeiro/pwa-firebase-functions-botrender
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.set('Vary', 'User-Agent');

        res.send(body.toString())

      });

  } else {


    // Not a bot, fetch the regular Angular app
    // Possibly faster to serve directly from from the functions directory?
    fetch(`https://${appUrl}`)
      .then(res => res.text())
      .then(body => {
        res.send(body.toString());
      })
  }

});

exports.rendertron = functions.https.onRequest(app);
