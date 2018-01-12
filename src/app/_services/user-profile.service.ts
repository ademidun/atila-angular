import { Injectable } from '@angular/core';

import {HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { User } from '../_models/user';

import { Observable } from 'rxjs/Observable';

import { UserProfile } from '../_models/user-profile';
import { AuthService } from "./auth.service";

import { MatSnackBar } from '@angular/material';
import {environment} from '../../environments/environment';
import {QuestionBase} from '../_models/question-base';
import {DropdownQuestion} from '../_models/question-dropdown';
import {TextboxQuestion} from '../_models/question-textbox';
@Injectable()
export class UserProfileService {

  constructor(public http: HttpClient,
                public authService: AuthService,
                public snackBar: MatSnackBar,) { }
  public userEndpoint = environment.apiUrl + 'users/';

  public userProfileEndpoint = environment.apiUrl + 'user-profiles/';



  createUser(user: User) {

    return this.http.post(this.userEndpoint, user)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createUserAndProfile(data: any) {

    return this.http.post(this.userEndpoint, data)
      .map(this.extractData)
      .catch(err=>Observable.throw(err));
  }

    getById(id: number): Observable<UserProfile> {
        // add authorization header with jwt token
      if (isNaN(id)){
        throw  Observable.throw(new HttpErrorResponse({error: 'No Current User', status: 401}))
      }
        return this.http.get(`${this.userProfileEndpoint}${id}/`)
        .map(this.extractData)
        .catch(err=>Observable.throw(err));
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
          .catch(err => err);
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

    refreshVerificationToken(username: string): Observable<any>{

    return this.http.get(`${this.userProfileEndpoint}refresh-verification-token/?username=${username}`)
      .map(res=><any>res)
      .catch(err=>err);

    }

    verifyToken(username, token) {
      return this.http.get(`${this.userProfileEndpoint}verify-token/?username=${username}&token=${token}`)
        .map(res=><any>res)
        .catch(err=><any>err);
    }


    addSubscriber(subscriber: any) {
      return this.http.post(`${this.userProfileEndpoint}add-subscriber/`, subscriber)
        .map(res=>res)
        .catch(err=>Observable.throw(err));
    }

  //  todo get this object from an external source?
  getDynamicProfileQuestions () {
      let questions: QuestionBase<any>[] = [

        // new DropdownQuestion({
        //   key: 'brave',
        //   label: 'Bravery Rating',
        //   options: [
        //     {key: 'solid',  value: 'Solid'},
        //     {key: 'great',  value: 'Great'},
        //     {key: 'good',   value: 'Good'},
        //     {key: 'unproven', value: 'Unproven'}
        //   ],
        //   order: 3
        // }),

        new TextboxQuestion({
          key: 'extracurricular_description',
          label: 'Describe your extracurricular activities',
          value: 'Bombasto',
          required: true,
          type: 'textarea'
        }),

        new TextboxQuestion({
          key: 'academic_career_goals',
          label: 'Describe your academic and career Goals',
          value: 'Bombasto',
          required: true,
          type: 'textarea'
        }),

        new TextboxQuestion({
          key: 'academic_career_goals',
          label: 'Enter your secondary School',
          value: 'Bombasto',
          required: true,
        }),

        new TextboxQuestion({
          key: 'academic_career_goals',
          label: 'Enter your post secondary school',
          value: 'Bombasto',
          required: true,
        }),

        new TextboxQuestion({
          key: 'birth_date',
          label: 'Date',
          type: 'date',
          value: 'Bombasto',
          required: true,
        }),

        new TextboxQuestion({
          key: 'academic_average',
          label: 'Academic Average',
          type: 'number',
          required: true,

        }),

        new TextboxQuestion({
          key: 'enrollment_proof',
          label: 'Attach Proof of your enrollment in school.',
          type: 'file',
          required: true,

        })
      ];

      return questions.sort((a, b) => a.order - b.order);
    }


    public extractData(res: HttpResponse<any>) {
        let body = res.body;

        return res || { };

    }

    public handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        let err: any;

        return error;

    }

}
