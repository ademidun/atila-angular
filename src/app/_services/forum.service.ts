import {Injectable} from '@angular/core';
import {HttpClient,} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class ForumService {

  public forumsUrl = environment.apiUrl + 'forum/forums/';
  public forumComments = environment.apiUrl + 'forum/forum-comments/';

  public forumsSlugUrl = environment.apiUrl + 'forum/forum-slug/';

  constructor(public http: HttpClient) {
  }

  list(): Observable<any> {
    return this.http.get(`${this.forumsUrl}`)
      .map(res=><any>res)
      .catch(err=>err);
  }

  getBySlug(slug: string) {
    return this.http.get(`${this.forumsSlugUrl}?slug=${slug}/`)
      .map(res=><any>res)
      .catch(err=>err);
  }

  getComments(id: number) {
    return this.http.get(`${this.forumsUrl}${id}/comments/`)
      .map(res=><any>res)
      .catch(err=>err);
  }

  partialUpdateComments(data): Observable<any> {
    return this.http.patch(`${this.forumComments}${data.id}/`, data)
      .map(res=><any>res)
      .catch(err=>Observable.throw(err));
  }


  create(data): Observable<any> {
    return this.http.post(`${this.forumsUrl}`, data)
      .map(res=><any>res)
      .catch(err=>err);
  }


}
