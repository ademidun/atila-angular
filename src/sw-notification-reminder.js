// sw-notification-reminder.js – a file containing a event listener
// http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/

(function () {
  'use strict';
  console.log('sw-notification-reminder', self);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {

      for(let registration of registrations) {
        console.log({registration});
      }

    });

    self.addEventListener('notificationClick', (event) => {
      event.notification.close();
      console.log('notification details: ', event.notification);
      console.log('notification event: ', {event});
    });
  }
}());
