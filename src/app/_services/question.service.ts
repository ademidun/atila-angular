import { Injectable }       from '@angular/core';

import { DropdownQuestion } from '../_models/question-dropdown';
import { QuestionBase }     from '../_models/question-base';
import { TextboxQuestion }  from '../_models/question-textbox';
import { DateQuestion }  from '../_models/question-date';

import { HttpClient, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import { map, filter, catchError, timeout } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';


@Injectable()
export class QuestionService   {

  public scholarshipQuestionsUrl = environment.apiUrl + 'scholarship-questions/';
  public saveScholarshipResponseUrl = environment.apiUrl + 'application-save-response/';
  public automateScholarshipResponseUrl = environment.apiUrl + 'application-automate-response/';


  constructor(public http: HttpClient) { }
  public observable: Observable<any>;
  public timeoutLength: number = 90000; //set timeOut for form Automation at 75 seconds

  getQuestions2(appId: number | any): Observable<any>{

    return this.observable = this.http.get(`${this.scholarshipQuestionsUrl}?app-id=${appId}`)
        .map(res=><any>res)
        .catch(err=>Observable.throw(err));

  }

  automateResponse(appId: number | any, data:any): Observable<any>{


    data['appId'] = appId;



    return this.http.post(this.automateScholarshipResponseUrl,data)
    .map(res=><any>res)
    .catch(err=>Observable.throw(err))
    .timeout(this.timeoutLength)
    // TODO: Change the timeout based on what type of form is being automated
  }

  saveResponse(appId: number | any, data:any): Observable<any>{

    data['appId'] = appId;

    return this.http.post(this.saveScholarshipResponseUrl,data)
    .map(res=><any>res)
    .catch(err=>Observable.throw(err))
    .timeout(this.timeoutLength)
  }



}
