import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// git add . && git commit -m "removed userId = NaN bug, improved, scholarship and userprofile ux" && git push && ng build --prod && firebase deploy

if (environment.production) {
  enableProdMode();
}
// if(process){
//   if (process.env.ENV === 'production') {
//     enableProdMode();
//   }
// }

platformBrowserDynamic().bootstrapModule(AppModule);
