import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Comment } from "../_models/comment";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
@Injectable()
export class CommentService {

  public commentsUrl = environment.apiUrl + 'comments/';

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

    return Observable.throw(error);
  }

  public parentUrl(commentType:string){

    switch (commentType) {

      case 'Forum':
        return environment.apiUrl + 'forum/forums/';

      case 'Scholarship':
        return environment.apiUrl + 'scholarships/';

      case 'BlogPost':
        return environment.apiUrl + 'blog/blog-posts/';

      default:
        break;
    }

  }

  public getUrl(comment:Comment){

    if ( comment.hasOwnProperty('forum') ) {
      return environment.apiUrl + 'forum/forum-comments/';

    }
    else if( comment.hasOwnProperty('blog_post') ) {
      return environment.apiUrl + 'blog/blog-comments/';

    }
    else if( comment.hasOwnProperty('scholarship') ) {
      return environment.apiUrl + 'comments/';

    }
     return this.commentsUrl;

  }
}
