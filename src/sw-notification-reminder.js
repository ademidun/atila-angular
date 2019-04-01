// sw-notification-reminder.js – a file containing a event listener
// http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/

(function () {
  'use strict';
  console.log('sw-notification-reminder', self);

  self.addEventListener('notificationclick', (event) => {
    // event.notification.close();
    console.log('notification event: ', {event});
    console.log('notification details: ', event.notification);
  });
}());
