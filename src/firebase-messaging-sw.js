importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


firebase.initializeApp({
  'messagingSenderId': '148649271725'
});

const messaging = firebase.messaging();
console.log('firebase-messaging-sw.js');
// messaging.usePublicVapidKey("BAjiETJuDgtXH6aRXgeCZgK8vurMT7AbFmPPhz1ybyfcDmfGFFydSXkYDC359HIXUmWw8w79-miI6NtmbfodiVI");
console.log({messaging});
