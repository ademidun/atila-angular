import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpClient, } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class DynamodbService {

  public environment = environment;
  public pageViewsUrl = `${this.environment.atilaMicroservicesNodeApiUrl}page-views`;
  constructor(public http: HttpClient) { }


  savePageViews(pageViewData): Observable<any>{
    return this.http.post(this.pageViewsUrl,pageViewData)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }
}


export let DynamodbServiceStub: Partial<DynamodbService> = {
  apiKeyUrl: environment.apiUrl + 'api-keys/',
};
