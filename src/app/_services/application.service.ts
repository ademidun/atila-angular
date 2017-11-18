import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApplicationService {

  public applicationUrl = 'http://127.0.0.1:8000/api/application-get-create/';
  public applicationDataUrl = 'http://127.0.0.1:8000/api/application-data/';

  public applicationsUrl = 'http://127.0.0.1:8000/api/applications/';
  
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
