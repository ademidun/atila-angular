import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
// git add . && git commit -m "fixed bugs in google analytics code" && git push && ng build --prod && firebase deploy

if (environment.production) {
  enableProdMode();
}
import * as firebase from 'firebase';
// if (!environment.production) {
//   enableProdMode();
//   console.log('disabling console.log');
//   window.console.log = function () { };   // disable any console.log debugging statements in production mode
//   console.log('disabled console.log, this should not print');
//   // window.console.error = function () { };
//
// }

// if(process){
//   if (process.env.ENV === 'production') {
//     enableProdMode();
//   }
// }

platformBrowserDynamic().bootstrapModule(AppModule);

// https://github.com/angular/angular-cli/issues/9021
// https://blog.angular-university.io/service-workers/
// https://juristr.com/blog/2018/01/ng-app-runtime-config/

if ('serviceWorker' in navigator && environment.production) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ngsw-worker.js', {
      scope: '/',
    })
      .then(registration => {
      })
      .catch(function (err) {
        console.log({err})
      });

    navigator.serviceWorker.register('/sw-master.js', {
      scope: '/',
    })
      .then(registration => {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {

          for (const registration2 of registrations) {
            // console.log({registration2});
          }

        });

        self.addEventListener('notificationclick', (event) => {
          // event.notification.close();
          // console.log('notification details: ', event.notification);
          console.log('notification event: ', {event});
        });

      })
      .catch(function (err) {
        console.log({err})
      });

  });
}
