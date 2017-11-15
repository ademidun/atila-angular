import { Injectable } from '@angular/core';
import { extractData,handleError } from '../_services/auth.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class BlogPostService {


  private blogsUrl = 'http://127.0.0.1:8000/blog/blog-posts/';

  private blogUrl = 'http://127.0.0.1:8000/blog/';

  private blogsSlugUrl = 'http://127.0.0.1:8000/blog/blog-slug/';
  constructor(private http: Http) { }

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
