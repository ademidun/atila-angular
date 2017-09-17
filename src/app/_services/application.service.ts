import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApplicationService {

  private applicationUrl = 'http://127.0.0.1:8000/application-get-create/';
  private applicationDataUrl = 'http://127.0.0.1:8000/application-data/';
  
  constructor(private http: Http) {
   }

   private params = new URLSearchParams();
   private requestOptions = new RequestOptions();

  getOrCreateApp(data: any): Observable<any> {
    console.log('in ApplicationService, POST data:', data);
    data.scholarshipId = parseInt(data.scholarshipId);
    console.log('(2)in ApplicationService, POST data:', data);

    return this.http.post(this.applicationUrl, data)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAppData(appId: any): Observable<any>{
    this.params.set('app-id', appId);
    this.requestOptions.params = this.params;

    console.log('in ApplicationService, this.params:', this.params)

    return this.http.get(this.applicationDataUrl, this.requestOptions)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    

  }

}
