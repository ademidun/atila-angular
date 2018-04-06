// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');
// admin.initializeApp();
const nodemailer = require('nodemailer');


// exports.sendContactEmail = functions.database.ref('/contact_form/{pushId}/')
//   .onCreate((snapshot, context) => {
//     const gmailEmail = process.env.gmail.email;
//     const gmailPassword = process.env.gmail.password;
//     const mailTransport = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: gmailEmail,
//         pass: gmailPassword,
//       },
//     });
//
//     const APP_NAME = 'Atila';
//
//     // Grab the current value of what was written to the Realtime Database.
//     const contactData = snapshot.val();
//     console.log('contactData', context.params.pushId, contactData);
//
//     let mailOptions = {
//       from: `${APP_NAME} <tomiademidun@gmail.com>`,
//       to: 'info@atila.ca',
//     };
//
//     mailOptions.subject = `Atila Contact Form to ${APP_NAME}!`;
//     mailOptions.text = `New Contact from Atila. \n
//     Email: ${contactData.email} \n
//     Name: ${contactData.first_name + '' + contactData.last_name} \n
//     Message: ${contactData.message}\n
//     Data:\n`;
//     console.log('mailOptions', mailOptions);
//
//     mailOptions.text += String(contactData);
//     return sendEmail(email, emailText);
//
//   });
//
// function sendEmail(email, mailOptions) {
//   // The user subscribed to the newsletter.
//
//   return mailTransport.sendMail(mailOptions).then(() => {
//     return console.log('Contact email sent to:', email);
//   });
// }

const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const app = express();


// You might instead set these as environment varibles
// I just want to make this example explicitly clear
const appUrl = 'atila.ca';
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
    'W3C_Validator',
    'pocketparser',
    'pocket-parser',
  ];

  const agent = userAgent.toLowerCase();

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('bot detected', bot, agent)
      return true
    }
  }

  console.log('no bots found');
  return false

}


app.get('*', (req, res) => {


  const isBot = detectBot(req.headers['user-agent']);


  if (isBot) {

    const botUrl = generateUrl(req);
    // If Bot, fetch url via rendertron

    fetch(`${renderUrl}/${botUrl}`)
      .then(res => res.text())
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
