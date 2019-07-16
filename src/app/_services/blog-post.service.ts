import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
@Injectable()
export class BlogPostService {


  public blogsUrl = environment.apiUrl + 'blog/blog-posts/';

  public blogUrl = environment.apiUrl + 'blog/';

  constructor(public http: HttpClient) { }

  list(pageNo=1): Observable<any>{
    return this.http.get(`${this.blogsUrl}?page=${pageNo}`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  getBySlug(username: string, slug: string) {
    // return this.http.get(`https://api.myjson.com/bins/1f93talug/`) // uncomment this line to use a mocked API call
    return this.http.get(`${this.blogUrl}blog/${username}/${slug}/`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  getById(id:number){
    return this.http.get(`${this.blogsUrl}${id}/`)
    .map(res => res)
    .catch(err => Observable.throw(err));
  }

  getComments(id:number){
    return this.http.get(`${this.blogsUrl}${id}/comments/`)
    .map(res => res)
    .catch(err => Observable.throw(err));
  }

  create(data): Observable<any>{
    return this.http.post(`${this.blogsUrl}`,data)
    .map(res => res)
    .catch(err => Observable.throw(err));
  }

  update(id:number, data): Observable<any>{
    return this.http.put(`${this.blogsUrl}${id}/`,data)
    .map(res => res)
    .catch(err => Observable.throw(err));
  }

  patch(data) {
    return this.http.patch(`${this.blogsUrl}${data.id}/`,data)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }
}
