import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// git add . && git commit -m "switched forum, comment, blog service to httpclient added upload and save in application profile" && git push && ng build --prod && firebase deploy

if (environment.production) {
  enableProdMode();
}
// if(process){
//   if (process.env.ENV === 'production') {
//     enableProdMode();
//   }
// }

platformBrowserDynamic().bootstrapModule(AppModule);
