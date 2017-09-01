import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthService {

  private loginUrl = 'http://127.0.0.1:8000/login/';
  constructor(private http: Http) { }

  
  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
  }

  login(credentials: any) {
    return this.http.post(this.loginUrl, credentials)
       .map(this.getToken)
       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   private getToken(res: Response) {
    let body = res.json();

    return body || { };
}
}
