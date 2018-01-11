import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {MyFirebaseService} from './myfirebase.service';
@Injectable()
export class SearchService {

  public searchUrl = environment.apiUrl + 'search/';
  constructor(
    public http: HttpClient,
    public firebaseService: MyFirebaseService,
  ) { }


  search(queryString, metaData?) {

    console.log('query url:',this.searchUrl+queryString);

    this.firebaseService.saveSearchAnalytics(metaData);

    return this.http.get(this.searchUrl+queryString)
      .map(res=>res)
      .catch(err=>Observable.throw(err))
  }


}
