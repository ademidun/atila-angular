// sw-notification-reminder.js – a file containing a event listener
// http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/

(function () {
  'use strict';
  console.log('sw-notification-reminder', self);

  self.addEventListener('notificationclick', (event) => {
    // event.notification.close();
    console.log('notification event: ', {event});
    console.log('notification details: ', event.notification);

    // This looks to see if the current is already open and
    // focuses if it is

    // https://stackoverflow.com/questions/30302636/clients-openwindow-not-allowed-to-open-a-window-on-a-serviceworker-google-c

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowClient
    console.log({clients});
    event.waitUntil(clients.matchAll({
      type: "window"
    })
      .then(function(clientList) {
      console.log({clientList});
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes('https://atia.ca') && 'focus' in client) {
          client.focus();
          break;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(`https://atila.ca/${event.notification.actions[0].action}`);
      }

    })
      .catch(err=> {console.log({err})}));
  });
}());
