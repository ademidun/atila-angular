import { Injectable }       from '@angular/core';

import { DropdownQuestion } from '../_models/question-dropdown';
import { QuestionBase }     from '../_models/question-base';
import { TextboxQuestion }  from '../_models/question-textbox';
import { DateQuestion }  from '../_models/question-date';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
//import { map, filter, catchError, timeout } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class QuestionService   {

  public scholarshipQuestionsUrl = 'https://1552b637.ngrok.io/api/scholarship-questions/';
  public saveScholarshipResponseUrl = 'https://1552b637.ngrok.io/api/application-save-response/';
  public automateScholarshipResponseUrl = 'https://1552b637.ngrok.io/api/application-automate-response/';
  
  
  constructor(public http: Http) { }
  public params = new URLSearchParams();
  public requestOptions = new RequestOptions();
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
    let questions: QuestionBase<any>[];

    this.params.set('app-id', appId);
    this.requestOptions.params = this.params;

    

    return this.observable = this.http.get(this.scholarshipQuestionsUrl, this.requestOptions)
        .map(this.extractData)
        .catch(this.handleError);

  }

    public extractData(res: Response) {
    
    let body = res.json();
    
    return body || { };
  }
  automateResponse(appId: number | any, data:any): Observable<any>{
    

    data['appId'] = appId;

    

    return this.http.post(this.automateScholarshipResponseUrl,data)
    .map(this.extractData)
    .catch(this.handleError)
    .timeout(this.timeoutLength)
    // TODO: Change the timeout based on what type of form is being automated
  }

  saveResponse(appId: number | any, data:any): Observable<any>{
    

    data['appId'] = appId;

    

    return this.http.post(this.saveScholarshipResponseUrl,data)
    .map(this.extractData)
    .catch(this.handleError)
    .timeout(this.timeoutLength)
  }

   public handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}