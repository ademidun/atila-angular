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
      .map(this.extractData)
      .catch(this.handleError);
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
        .map(this.extractData)
        .catch(this.handleError);
    }

    getByUsername(username: string): Observable<UserProfile>{
        // note urls missing the apropriate '/' will be redirected and be blocked by CORS policy.
        return this.http.get(`${this.userProfileEndpoint}user-name/?username=${username}/`)
        .map(this.extractData)
        .catch(this.handleError);
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
          .map(this.extractData)
          .catch(this.handleError);
    }

    updateHelper(userProfile: UserProfile){
        /**
         * Put method, with added feature of automatically extracting the location data to match the API backend format.
         */
        var locationData:any = {}
        if(userProfile.city.length>0){
            locationData.city= userProfile.city[0].name;
            locationData.country=userProfile.city[0].country;
            locationData.province=userProfile.city[0].province;
          }

          var sendData = {
            userProfile: userProfile,
            locationData: locationData,
          }
          return this.http.put(`${this.userProfileEndpoint}${userProfile['user']}/`, sendData, this.jwt())
          .map(this.extractData)
          .catch(this.handleError);
    }

    updateAny(data:any){
        return this.http.put(`${this.userProfileEndpoint}${data.userProfile['user']}/`, data, this.jwt())
        .map(this.extractData)
        .catch(this.handleError);
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
