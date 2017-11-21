import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { User } from '../_models/user';

import { Observable } from 'rxjs/Observable';

import { UserProfile } from '../_models/user-profile';
import { AuthService } from "./auth.service";

import { MatSnackBar } from '@angular/material';
@Injectable()
export class UserProfileService {

  constructor(public http: HttpClient,
                public authService: AuthService,
                public snackBar: MatSnackBar,) { }
  public userEndpoint = 'http://127.0.0.1:8000/api/users/';
  
  public userProfileEndpoint = 'http://127.0.0.1:8000/api/user-profiles/';
  


  createUser(user: User) {
    
    return this.http.post(this.userEndpoint, user)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createUserAndProfile(data: any) {
    
    return this.http.post(this.userEndpoint, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

    getById(id: number): Observable<UserProfile> {
        // add authorization header with jwt token
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
  
        return this.http.put(`${this.userProfileEndpoint}${profile['user']}/`, profile)
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
          return this.http.put(`${this.userProfileEndpoint}${userProfile['user']}/`, sendData)
          .map(this.extractData)
          .catch(this.handleError);
    }

    updateAny(data:any){
        return this.http.put(`${this.userProfileEndpoint}${data.userProfile['user']}/`, data)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public extractData(res: HttpResponse<any>) {
        let body = res.body;
        
        return res || { };
    
    }

    public handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        let err: any;
        
        return Observable.throw(error);
        
    }

}
