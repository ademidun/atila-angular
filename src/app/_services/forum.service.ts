import { Injectable } from '@angular/core';
import { extractData,handleError } from '../_services/auth.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class ForumService {

  public forumsUrl = environment.apiUrl + 'forum/forums/';
  public forumComments = environment.apiUrl + 'forum/forum-comments/';

  public forumsSlugUrl = environment.apiUrl + 'forum/forum-slug/';

  constructor(public http: Http) { }

  list(): Observable<any>{
    return this.http.get(`${this.forumsUrl}`)
    .map(extractData)
    .catch(handleError);
  }

  getBySlug(slug: string) {
    return this.http.get(`${this.forumsSlugUrl}?slug=${slug}/`)
      .map(extractData)
      .catch(handleError);
  }

  getComments(id:number){
    return this.http.get(`${this.forumsUrl}${id}/comments/`)
    .map(extractData)
    .catch(handleError);
  }

  create(data): Observable<any>{
    return this.http.post(`${this.forumsUrl}`,data)
    .map(extractData)
    .catch(handleError);
  }



}
