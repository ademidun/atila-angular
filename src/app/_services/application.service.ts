import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class ApplicationService {

  public applicationDataUrl = environment.apiUrl + 'application-data/';

  public applicationsUrl = environment.apiUrl + 'applications/';

  constructor(public http: HttpClient) {
   }

   public params = new URLSearchParams();

  getOrCreateApp(data: any): Observable<any> {

    data.scholarshipId = parseInt(data.scholarshipId);


    return this.http.post(environment.apiUrl+'application-get-create/', data)
    .map(res=><any>res)
    .catch(err=>Observable.throw(err));
  }

  getAppData(appId: any): Observable<any>{
    return this.http.get(`${this.applicationsUrl}${appId}/application/`)
    .map(res=><any>res)
    .catch(err=>Observable.throw(err));


  }

}
