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
  public timeoutLength: number = 45000; //set timeOut for form Autoamtion at 45 seconds
  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
  getQuestions() {

    let questions: QuestionBase<any>[] = [

      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        key: 'project_description',
        controlType : 'textboxlong',
        label: 'Project Description',
        value: 'As an agriproducer or agriprocessor, you could get a financial contribution to help you bring new products to domestic and international markets. The financing can cover up to 50% of your eligible expenses up to a maximum $100,000.',
        order: 4
      }),
      new DateQuestion({
        key: 'date',
        label: 'Date',
        type: 'date',
        value: '2017-07-13',
        order: 2
      })
    ];

    return questions.sort((a, b) => a.order - b.order);
  }

  getQuestions2(appId: number | any): Observable<any>{

    return this.observable = this.http.get(`${this.scholarshipQuestionsUrl}?app-id=${appId}`)
        .map(res=><any>res)
        .catch(err=>err);

  }

  automateResponse(appId: number | any, data:any): Observable<any>{


    data['appId'] = appId;



    return this.http.post(this.automateScholarshipResponseUrl,data)
    .map(res=><any>res)
    .catch(err=>err)
    .timeout(this.timeoutLength)
    // TODO: Change the timeout based on what type of form is being automated
  }

  saveResponse(appId: number | any, data:any): Observable<any>{


    data['appId'] = appId;



    return this.http.post(this.saveScholarshipResponseUrl,data)
    .map(res=><any>res)
    .catch(err=>err)
    .timeout(this.timeoutLength)
  }



}
