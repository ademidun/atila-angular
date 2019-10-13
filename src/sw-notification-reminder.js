// sw-notification-reminder.js – a file containing a event listener
// http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/

(function () {
  'use strict';
  // You can 'unregister' the service worker using javascript. Here is an example:

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      //returns installed service workers
      if (registrations.length) {
        for(let registration of registrations) {
          console.log({registration});
          registration.unregister();
        }
      }
    });
  }
}());
