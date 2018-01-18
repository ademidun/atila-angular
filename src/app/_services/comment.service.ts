import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Comment } from "../_models/comment";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
@Injectable()
export class CommentService {

  public commentsUrl = environment.apiUrl + 'comments/';

  constructor(public http: HttpClient) { }


  create(comment: Comment): Observable<Comment>{

    var commenturl = this.getUrl(comment);
    return this.http.post(`${commenturl}`, comment)
    .map(res=><any>res)
    .catch(err=> Observable.throw(err));
  }

  update(comment: Comment): Observable<any>{

    var commenturl = this.getUrl(comment);
    return this.http.put(`${commenturl}${comment.id}/`, comment)
    .map(res=><any>res)
    .catch(err=> Observable.throw(err));
  }

  delete(comment: Comment) {
    var commenturl = this.getUrl(comment);
    return this.http.delete(`${commenturl}${comment.id}/`,)
      .map(res=><any>res)
      .catch(err=> Observable.throw(err));
  }

/*
  getComments(modelType:String, modelID: number){

    return this.http.get(`${this.commentsUrl}get-model-comments/?parent-model-type=${modelType}&parent-model-id=${modelID}`)
    .map(res=><any>res)
    .catch(err=> Observable.throw(err));
  }
  */
  getComments(id:number, modelType:string){

    var commenturl = this.parentUrl(modelType);

    return this.http.get(`${commenturl}${id}/comments/`)
    .map(res=><any>res)
    .catch(err=> Observable.throw(err));
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
