import { Injectable }       from '@angular/core';

import { DropdownQuestion } from '../_models/question-dropdown';
import { QuestionBase }     from '../_models/question-base';
import { TextboxQuestion }  from '../_models/question-textbox';
import { DateQuestion }  from '../_models/question-date';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class QuestionService   {

  private grantQuestionsUrl = 'http://127.0.0.1:8000/grant-questions/';
  private saveGrantResponseUrl = 'http://127.0.0.1:8000/application-save-data/';

  
  constructor(private http: Http) { }
  private params = new URLSearchParams();
  private requestOptions = new RequestOptions();
  private observable: Observable<any>;

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

    console.log('in QuestionService, this.params:', this.params)

    return this.observable = this.http.get(this.grantQuestionsUrl, this.requestOptions)
        .map(this.extractData)
        .catch(this.handleError);

  }

    private extractData(res: Response) {
    console.log('in QuestionService, extractData res:', res)
    let body = res.json();
    console.log('in QuestionService, extractData body:', body)
    return body || { };
  }
  saveResponse(appId: number | any, data:any): Observable<any>{
    console.log('data before data["appId"]', data);

    data['appId'] = appId;

    console.log('data AFTER data["appId"]', data);

    return this.http.post(this.saveGrantResponseUrl,data)
    .map(this.extractData)
    .catch(this.handleError);
  }

   private handleError (error: Response | any) {
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