import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApplicationService {

  public applicationUrl = 'https://1552b637.ngrok.io/api/application-get-create/';
  public applicationDataUrl = 'https://1552b637.ngrok.io/api/application-data/';

  public applicationsUrl = 'https://1552b637.ngrok.io/api/applications/';
  
  constructor(public http: HttpClient) {
   }

   public params = new URLSearchParams();

  getOrCreateApp(data: any): Observable<any> {
    
    data.scholarshipId = parseInt(data.scholarshipId);
    

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
