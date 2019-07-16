import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpClient, } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
import {IPDATA_KEY} from '../_shared/utils';

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
  getPageViews(userId): Observable<any>{
    return this.http.get(`${this.pageViewsUrl}?user=${userId}`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }


  getGeoIp(opts = {}) {
    return $.getJSON(`https://api.ipdata.co?api-key=${IPDATA_KEY}`)
  }
}


export let DynamodbServiceStub: Partial<DynamodbService> = {
  environment: environment,
  pageViewsUrl: `${environment.atilaMicroservicesNodeApiUrl}page-views`,
};
