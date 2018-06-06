import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class EssayService {


  public essaysUrl = environment.apiUrl + 'essay/essays/';

  public essayUrl = environment.apiUrl + 'essay/';
  public essayComments = environment.apiUrl + 'essay/essay-comments/';

  constructor(public http: HttpClient) { }

  list(): Observable<any>{
    return this.http.get(`${this.essaysUrl}`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  getBySlug(username:string, slug: string) {
    return this.http.get(`${this.essayUrl}essay/${username}/${slug}/`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  getById(id:number){
    return this.http.get(`${this.essaysUrl}${id}/`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  getComments(id:number){
    return this.http.get(`${this.essaysUrl}${id}/comments/`)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  create(data): Observable<any>{
    return this.http.post(`${this.essaysUrl}`,data)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  update(id:number, data): Observable<any>{
    return this.http.put(`${this.essaysUrl}${id}/`,data)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  patch(data) {
    return this.http.patch(`${this.essaysUrl}${data.id}/`,data)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  partialUpdateComments(data): Observable<any> {
    return this.http.patch(`${this.essayComments}${data.id}/`, data)
      .map(res=><any>res)
      .catch(err=>Observable.throw(err));
  }
}
