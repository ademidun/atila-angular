import { Injectable } from '@angular/core';
import { extractData,handleError } from '../_services/auth.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ForumService {

  private forumsUrl = 'http://127.0.0.1:8000/forum/forums/';

  constructor(private http: Http) { }

  list(): Observable<any>{
    return this.http.get(`${this.forumsUrl}`)
    .map(extractData)
    .catch(handleError);
  }


}
