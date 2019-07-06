import {Injectable, OnDestroy} from '@angular/core';

import {HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {User} from '../_models/user';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/of';
import {createTestUserProfile, UserProfile} from '../_models/user-profile';
import {AuthService} from './auth.service';

import {MatDialog, MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import {QuestionBase} from '../_models/question-base';
import {DropdownQuestion} from '../_models/question-dropdown';
import {TextboxQuestion} from '../_models/question-textbox';
import {MyFirebaseService} from './myfirebase.service';
import {AtilaPointsPromptDialogComponent} from '../atila-points-prompt-dialog/atila-points-prompt-dialog.component';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Scholarship} from '../_models/scholarship';
import {ScholarshipService} from './scholarship.service';
import {DynamodbService} from './dynamodb.service';
import {getItemType} from '../_shared/utils';

@Injectable()
export class UserProfileService implements OnDestroy {

  public environment = environment;
  public userEndpoint = environment.apiUrl + 'users/';
  public userProfileEndpoint = environment.apiUrl + 'user-profiles/';
  public viewHistoryChanges: Subscription;

  constructor(public http: HttpClient,
              public authService: AuthService,
              public snackBar: MatSnackBar,
              public firebaseService: MyFirebaseService,
              public dynamodbService: DynamodbService,
              public dialog: MatDialog,) {
  }

  //https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
  // public ngUnsubscribe: Subject<any> = new Subject();

  ngOnDestroy() {
    if (this.viewHistoryChanges) {
      this.viewHistoryChanges.unsubscribe();
    }

  }

  createUser(user: User) {

    return this.http.post(this.userEndpoint, user)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  userProfileRPC(path, data = {}, opts = {}) {
    return this.http.post(`${this.userProfileEndpoint}${path}/`, data)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  createUserAndProfile(data: any) {

    return this.http.post(this.userEndpoint, data)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  getById(id: number): Observable<UserProfile> {
    // add authorization header with jwt token
    if (isNaN(id)) {
      throw  Observable.throw(new HttpErrorResponse({error: 'No Current User', status: 401}))
    }
    return this.http.get(`${this.userProfileEndpoint}${id}/`)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  getDetail(id, detail) {
    return this.http.get(`${this.userProfileEndpoint}${id}/${detail}/`)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  getByUsername(username: string): Observable<UserProfile> {
    // note urls missing the apropriate '/' will be redirected and be blocked by CORS policy.
    return this.http.get(`${this.userProfileEndpoint}user-name/?username=${username}/`)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  getRouteDetail(id, path: string): Observable<any> {
    // note urls missing the apropriate '/' will be redirected and be blocked by CORS policy.
    return this.http.get(`${this.userProfileEndpoint}${id}/${path}/`)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
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
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  patch(id, data: any) {

    return this.http.patch(`${this.userProfileEndpoint}${id}/`, data)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  updateHelper(userProfile: UserProfile) {
    /**
     * Put method, with added feature of automatically extracting the location data to match the API backend format.
     */
    var locationData: any = {}
    if (userProfile.city.length > 0) {
      locationData.city = userProfile.city[0].name;
      locationData.country = userProfile.city[0].country;
      locationData.province = userProfile.city[0].province;
    }

    var sendData = {
      userProfile: userProfile,
      locationData: locationData,
    }
    return this.http.put(`${this.userProfileEndpoint}${userProfile['user']}/`, sendData)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  updateAny(data: any) {
    return this.http.put(`${this.userProfileEndpoint}${data.userProfile['user']}/`, data)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  removeSavedScholarship(userId, scholarshipId) {
    return this.http.get(`${this.userProfileEndpoint}${userId}/remove-saved-scholarship/?scholarship=${scholarshipId}/`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  refreshVerificationToken(username: string): Observable<any> {

    return this.http.get(`${this.userProfileEndpoint}refresh-verification-token/?username=${username}`)
      .map(res => <any>res)
      .catch(err => err);

  }

  verifyToken(username, token) {
    return this.http.get(`${this.userProfileEndpoint}verify-token/?username=${username}&token=${token}`)
      .map(res => <any>res)
      .catch(err => <any>err);
  }

  resetPassword(userNameEmail) {
    return this.http.post(`${this.userProfileEndpoint}reset-password/`, userNameEmail)
      .map(this.extractData)
      .catch(err => Observable.throw(err));
  }

  verifyResetPassword(data) {
    return this.http.post(`${this.userProfileEndpoint}verify-reset-password/`, data)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  addSubscriber(subscriber: any) {
    return this.http.post(`${this.userProfileEndpoint}add-subscriber/`, subscriber)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  //  todo get this object from an external source?
  getDynamicProfileQuestions() {
    // Watch for ExpressionChangedAfterItHasBeenCheckedError if you make a value required and dont provide a default value

    let generalQuestions = [
      {
        key: 'first_name',
        type: '',
        label: '',
        class_data: 'special',
        order: 1,
      },
      {
        key: 'last_name',
        type: '',
        label: '',
        class_data: 'test-dynamic-class',
        order: 2,
      },
      {
        key: 'street_address',
        type: '',
        label: '',
        class_data: '',
        order: 3,
      },
      {
        key: 'postal_code',
        type: '',
        label: '',
        class_data: '',
        order: 4,
      },
      {
        key: 'email',
        type: 'email',
        label: '',
        class_data: '',
        order: 5,
      },
    ];


    let questions: QuestionBase<any>[] = [

      // todo Helper to autofill labels as pretiffied keys
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
      // new TextboxQuestion({
      //   key: 'postal_code',
      //   label: 'Postal Code',
      //   value: 'Postal Code Test',
      //   required: true,
      // }),

      new TextboxQuestion({
        key: 'academic_career_goals',
        label: 'Describe your academic and career Goals',
        value: 'Bombasto',
        required: true,
        type: 'textarea'
      }),

      new TextboxQuestion({
        key: 'secondary_school',
        label: 'Enter your secondary School',
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
        key: 'phone_number',
        label: 'Phone Number',
        type: 'number',
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
        key: 'major',
        label: 'Major',
        required: true,

      }),

      new TextboxQuestion({
        key: 'degree',
        label: 'Degree',
        required: true,

      }),

      new TextboxQuestion({
        key: 'enrollment_proof',
        label: 'Attach Proof of your enrollment in school.',
        type: 'file',
        required: true,

      })
    ];

    generalQuestions.forEach(question => {
      questions.unshift(new TextboxQuestion(question))
    });

    return questions.sort((a, b) => a.order - b.order);
  }

  getLocationQuestions() {
    let questions: QuestionBase<any>[] = [

      new TextboxQuestion({
        key: 'city',
        label: 'City',
        order: 4.1,
      }),
      new TextboxQuestion({
        key: 'province',
        label: 'Province',
        order: 4.2,
      }),
      new TextboxQuestion({
        key: 'country',
        label: 'Country',
        order: 4.3,
      }),
    ];

    return questions;
  }

  public extractData(res: HttpResponse<any>) {
    let body = res.body;

    return res || {};

  }


  getApplications(userId: number) {
    return this.http.get(`${this.userProfileEndpoint}${userId}/applications/`)
      .map(res => res)
      .catch(err => Observable.throw(err))
  }


  transformViewData(userProfile: UserProfile, viewData) {

    let transformedViewData = {
      user_id: userProfile.user,
      item_type: getItemType(viewData),
      item_id: viewData.id,
      item_name: null,
      is_owner: !!(viewData.user && viewData.user.id == userProfile.user)
    };

    switch (transformedViewData.item_type) {

      case 'scholarship':
        transformedViewData.item_name = viewData.name;
        break;
      case 'essay':
          transformedViewData.item_name = viewData.title;
        break;
      case 'blog':
        transformedViewData.item_name = viewData.title;
        break;
      case 'forum':
        transformedViewData.item_name = item.starting_comment ? item.starting_comment.title || item.title : item.title;
        break;
    }

    return transformedViewData;
  }

  checkViewHistory(userProfile: UserProfile, viewData: any) {

    const transformedViewData = this.transformViewData(userProfile, viewData);

    try {
      this.firebaseService.getGeoIp()
        .then(res => {
          transformedViewData['geo_ip'] = res;
          return this.checkViewHistoryHandler(userProfile, transformedViewData)

        })
        .catch((jqXHR, textStatus, errorThrown) => {
          if (this.environment.production || userProfile.is_atila_admin) {
          }
          transformedViewData['error'] = JSON.stringify(errorThrown);
          this.checkViewHistoryHandler(userProfile, transformedViewData)
        })
    }
    catch (e) {
      console.log('checkViewHistory e:',e)
    }

  }

  checkViewHistoryHandler(userProfile, viewData) {
    let path = 'user_profiles/' + userProfile.user + '/view_history';

    this.dynamodbService.savePageViews(viewData)
      .subscribe( res => {
          console.log({ res });
          this.viewHistoryChanges = this.firebaseService.firestoreQuery(path).valueChanges()
            .subscribe(
              viewHistory => {
                // let showPrompt = viewHistory.length % 2 == 0 && this.userProfile.atila_points < 1 ||
                //   viewHistory.length > 10 && viewHistory.length % 10 ==0;
                // let showPrompt = viewHistory.length % 2 == 0 && this.userProfile.atila_points < 1;
                this.showAtilaPointsPromptDialog(userProfile, viewData, viewHistory)
              },
            );
      },
        err => {
          console.log('save Firebase rejection', err);
          this.showAtilaPointsPromptDialog(userProfile, viewData, ['foo', 'bar']);
        });
  }

  showAtilaPointsPromptDialog(userProfile, viewData, viewHistory) {

    if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0) {
      if (this.viewHistoryChanges) {
        this.viewHistoryChanges.unsubscribe();
      }
      return
    }

    if (!viewHistory.length || viewHistory.length == 0) {
      if (this.viewHistoryChanges) {
        this.viewHistoryChanges.unsubscribe();
      }
      return
    }


    let showPrompt = true;
    if (userProfile.atila_points < 1) {
      showPrompt = viewHistory.length % 5 == 0;
    }

    else {
      showPrompt = (userProfile.atila_points / viewHistory.length) <= 10 && viewHistory.length % 5 == 0
    }

    if (showPrompt) {
      let dialogRef = this.dialog.open(AtilaPointsPromptDialogComponent, {
        width: '500px',
        disableClose: true,
        data: {'title': viewData.name, userProfile: userProfile, viewCount: viewHistory.length},
      });


    }

    if (this.viewHistoryChanges) {
      this.viewHistoryChanges.unsubscribe();
    }
  }
}

export let UserProfileServiceStub: Partial<UserProfileService> = {
  userEndpoint: '',
  updateHelper: userProfile => {
    return Observable.of(userProfile);
  },
  getById(id: number) {
    const userProfile = createTestUserProfile();
    return Observable.of(userProfile);
  }

};
