import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { User } from '../_models/user';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserProfileService {

  constructor(private http: Http) { }
  private userEndpoint = 'http://127.0.0.1:8000/users/';


  createUser(user: User) {
    let headers = new Headers({ 'Content-Type': 'application/json', });
    // headers.append("Authorization","JWT YW5ndWxhci13YXJlaG91c2Utc2VydmljZXM6MTIzNDU2");
    let options = new RequestOptions({ headers: headers, });
    
    return this.http.post(this.userEndpoint, user, options)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

   isLoggedIn(): boolean {
    // Determines if user is logged in from the token
    var token = localStorage.getItem('token');
    if (token) {
        return true;
    } 
    return false;
}
}
