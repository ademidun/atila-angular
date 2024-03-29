import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {environment} from '../../environments/environment';
import {MyFirebaseService} from './myfirebase.service';
import {mockSearchResponseIveyBusinessSchool} from '../_models/_tests/mock-search-response-ivey-business-school';


@Injectable()
export class SearchService {

  public searchUrl = environment.apiUrl + 'search/';
  constructor(
    public http: HttpClient,
    public firebaseService: MyFirebaseService,
  ) { }


  search(queryString, metaData?) {
    this.firebaseService.saveSearchAnalytics(metaData);

    return this.http.get(this.searchUrl+queryString)
      .map(res=>res)
      .catch(err=>Observable.throw(err))
  }

  relatedItems(queryString, metaData?) {
    return this.http.get(this.searchUrl + 'related-items/'+queryString)
      .map(res=>res)
      .catch(err=>Observable.throw(err))
  }


}

export let SearchServiceStub: Partial<SearchService> = {


  search(queryString, metaData?) {
    /*
    if (queryString === 'ivey business school') {
      data = require('../../assets/_tests/mock-search-response-ivey-business-school.json');
    }
    console.log({ data });
    */
    return Observable.of(mockSearchResponseIveyBusinessSchool);
  }
};
