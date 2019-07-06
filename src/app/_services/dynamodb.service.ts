import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class DynamodbService {

  public environment = environment;
  constructor(public http: HttpClient) { }

  savePageViews(pageViewData): Observable<any>{
    return this.http.post(`${this.environment.atilaMicroservicesApiUrl}page-views`,pageViewData)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }
}
