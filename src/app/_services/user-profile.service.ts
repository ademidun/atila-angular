import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { User } from '../_models/user';

import { Observable } from 'rxjs/Rx';

import { UserProfile } from '../_models/user-profile';
@Injectable()
export class UserProfileService {

  constructor(private http: Http) { }
  private userEndpoint = 'http://127.0.0.1:8000/users/';
  
  private userProfileEndpoint = 'http://127.0.0.1:8000/user-profiles/';


  createUser(user: User) {
    let headers = new Headers({ 'Content-Type': 'application/json', });
    // headers.append("Authorization","JWT YW5ndWxhci13YXJlaG91c2Utc2VydmljZXM6MTIzNDU2");
    let options = new RequestOptions({ headers: headers, });
    
    return this.http.post(this.userEndpoint, user, options)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getById(id: number): Observable<UserProfile> {
    return this.http.get(`${this.userProfileEndpoint}${id}/`)
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

    update(profile: UserProfile) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers});
  
        return this.http.put(`${this.userProfileEndpoint}${profile['user']}/`, profile, this.jwt())
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

}
