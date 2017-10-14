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
  private userNameEndpoint = 'http://127.0.0.1:8000/user-profile-user-name/';
  


  createUser(user: User) {
    let headers = new Headers({ 'Content-Type': 'application/json', });
    // headers.append("Authorization","JWT YW5ndWxhci13YXJlaG91c2Utc2VydmljZXM6MTIzNDU2");
    let options = new RequestOptions({ headers: headers, });
    
    return this.http.post(this.userEndpoint, user, options)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createUserAndProfile(data: any) {
    let headers = new Headers({ 'Content-Type': 'application/json', });
    // headers.append("Authorization","JWT YW5ndWxhci13YXJlaG91c2Utc2VydmljZXM6MTIzNDU2");
    let options = new RequestOptions({ headers: headers, });
    
    return this.http.post(this.userEndpoint, data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

    getById(id: number): Observable<UserProfile> {
        return this.http.get(`${this.userProfileEndpoint}${id}/`)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getByUsername(username: string): Observable<UserProfile>{
        return this.http.get(`${this.userNameEndpoint}?user-name=${username}/`)
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

    updateAny(data:any){
        return this.http.put(`${this.userProfileEndpoint}${data.userProfile['user']}/`, data, this.jwt())
        .map(this.extractData)
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

    private extractData(res: Response) {
        let body = res.json();
        console.log('user-profile.service res: ', res);
        console.log('user-profile.service res: ', res.status);
        console.log('user-profile.service res: ', res);
        console.log('user-profile.service body: ', body);
        return body || { };
    
    }

    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        let err: any;
        if (error instanceof Response) {
          const body = error.json() || '';
          err = body.error || JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
          const body = error.json() || '';
          err = body.error || JSON.stringify(body);
        }
        console.log('user-profile.service error.json(): ', error.json());
        console.log('user-profile.service error: ', error);
        console.error(errMsg);
        return Observable.throw(err);
    }

}
