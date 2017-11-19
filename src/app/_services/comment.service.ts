import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Comment } from "../_models/comment";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';
@Injectable()
export class CommentService {

  public commentsUrl = 'https://1552b637.ngrok.io/api/comments/';
  
  constructor(public http: Http) { }


  create(comment: Comment): Observable<Comment>{
    
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

  public extractData(res: Response) {

    let body = res.json();
    
    
    return body || { };

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

  public parentUrl(commentType:string){

    switch (commentType) {

      case 'Forum':
        return 'https://1552b637.ngrok.io/api/forum/forums/';

      case 'Scholarship':
        return 'https://1552b637.ngrok.io/api/scholarships/';

      case 'BlogPost':
        return 'https://1552b637.ngrok.io/api/blog/blog-posts/';
  
      default:
        break;
    }

  }

  public getUrl(comment:Comment){

    if ( comment.hasOwnProperty('forum') ) {
      return 'https://1552b637.ngrok.io/api/forum/forum-comments/';
      
    }
    else if( comment.hasOwnProperty('blog_post') ) {
      return 'https://1552b637.ngrok.io/api/blog/blog-comments/';
      
    }
    else if( comment.hasOwnProperty('scholarship') ) {
      return 'https://1552b637.ngrok.io/api/comments/';
      
    }
     return this.commentsUrl;

  }
}
