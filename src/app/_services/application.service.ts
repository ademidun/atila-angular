import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApplicationService {

  private applicationUrl = 'http://127.0.0.1:8000/application-get-create/';
  private applicationDataUrl = 'http://127.0.0.1:8000/application-data/';

  private applicationsUrl = 'http://127.0.0.1:8000/applications/';
  
  constructor(private http: HttpClient) {
   }

   private params = new URLSearchParams();

  getOrCreateApp(data: any): Observable<any> {
    console.log('in ApplicationService, POST data:', data);
    data.scholarshipId = parseInt(data.scholarshipId);
    console.log('(2)in ApplicationService, POST data:', data);

    return this.http.post(this.applicationUrl, data)
    .map(res=>res)
    .catch(err=>Observable.throw(err));
  }

  getAppData(appId: any): Observable<any>{
    return this.http.get(`${this.applicationsUrl}${appId}/application/`)
    .map(res=>res)
    .catch(err=>Observable.throw(err));
    

  }

}
