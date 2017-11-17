import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Comment } from "../_models/comment";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';
@Injectable()
export class CommentService {

  private commentsUrl = 'http://127.0.0.1:8000/comments/';
  
  constructor(private http: Http) { }


  create(comment: Comment): Observable<Comment>{
    console.log('create Comment', comment);
    var commenturl = this.getUrl(comment);
    return this.http.post(`${commenturl}`, comment)
    .map(this.extractData)
    .catch(this.handleError);
  }

  update(comment: Comment): Observable<any>{
    
    var commenturl = this.getUrl(comment);
    return this.http.put(`${commenturl}${comment.id}/`, comment)
    .map(this.extractData)
    .catch(this.handleError);
  }

/*
  getComments(modelType:String, modelID: number){
    console.log('getComments GET: ', `${this.commentsUrl}get-model-comments/?parent-model-type=${modelType}&parent-model-id=${modelID}`);
    return this.http.get(`${this.commentsUrl}get-model-comments/?parent-model-type=${modelType}&parent-model-id=${modelID}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
  */
  getComments(id:number, modelType:string){
  
    var commenturl = this.parentUrl(modelType);

    return this.http.get(`${commenturl}${id}/comments/`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {

    let body = res.json();
    console.log('commentservice res: ', res);
    console.log('commentservice body: ', body);
    return body || { };

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

  private parentUrl(commentType:string){

    switch (commentType) {

      case 'Forum':
        return 'http://127.0.0.1:8000/forum/forums/';

      case 'Scholarship':
        return 'http://127.0.0.1:8000/scholarships/';

      case 'BlogPost':
        return 'http://127.0.0.1:8000/blog/blog-posts/';
  
      default:
        break;
    }

  }

  private getUrl(comment:Comment){

    if ( comment.hasOwnProperty('forum') ) {
      return 'http://127.0.0.1:8000/forum/forum-comments/';
      
    }
    else if( comment.hasOwnProperty('blog_post') ) {
      return 'http://127.0.0.1:8000/blog/blog-comments/';
      
    }
    else if( comment.hasOwnProperty('scholarship') ) {
      return 'http://127.0.0.1:8000/comments/';
      
    }
     return this.commentsUrl;

  }
}