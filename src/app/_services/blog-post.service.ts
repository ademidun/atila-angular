import { Injectable } from '@angular/core';
import { extractData,handleError } from '../_services/auth.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
@Injectable()
export class BlogPostService {


  public blogsUrl = environment.apiUrl + 'blog/blog-posts/';

  public blogUrl = environment.apiUrl + 'blog/';

  public blogsSlugUrl = environment.apiUrl + 'blog/blog-slug/';
  constructor(public http: Http) { }

  list(): Observable<any>{
    return this.http.get(`${this.blogsUrl}`)
    .map(extractData)
    .catch(handleError);
  }

  getBySlug(username:string, slug: string) {
    return this.http.get(`${this.blogUrl}blog/${username}/${slug}/`)
      .map(extractData)
      .catch(handleError);
  }

  getById(id:number){
    return this.http.get(`${this.blogsUrl}${id}/`)
    .map(extractData)
    .catch(handleError);
  }

  getComments(id:number){
    return this.http.get(`${this.blogsUrl}${id}/comments/`)
    .map(extractData)
    .catch(handleError);
  }

  create(data): Observable<any>{
    return this.http.post(`${this.blogsUrl}`,data)
    .map(extractData)
    .catch(handleError);
  }

  update(id:number, data): Observable<any>{
    return this.http.put(`${this.blogsUrl}${id}/`,data)
    .map(extractData)
    .catch(handleError);
  }
}
