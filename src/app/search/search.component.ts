import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from '../_services/search.service';
import {AuthService} from '../_services/auth.service';
import {MyFirebaseService} from '../_services/myfirebase.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query: any;
  userId: any;
  isRegistered: boolean = false;
  isSearching: boolean;

  searchResults: any = {};


  constructor(
    public route: ActivatedRoute,
    public searchService: SearchService,
    public authService: AuthService,
    public firebaseService: MyFirebaseService,
  ) { }

  ngOnInit() {

    this.query = this.route.snapshot.queryParams['q'];


    this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    let queryOptions = this.route.snapshot.queryParams;

    if (this.query) {
      this.search(this.query, queryOptions)
    }

  }

  search(query, queryOptions?) {

    this.isSearching = true;


    let queryMetaData = {
      query: queryOptions,
      user_id: null,
    };


    if (!isNaN(this.userId)) {
      this.isRegistered = true;
      queryMetaData.user_id = this.userId
    }

    let queryString= `?q=${query}`;

    this.searchService.search(queryString, queryMetaData)
      .subscribe(
        res => {
          this.searchResults = res;
          this.isSearching = false;
        } ,

        err=>{
          this.isSearching = false;
        },
      )
  }

  saveQueryClick(clickObject,objectType) {
    console.log('saveQueryClick: ',clickObject,objectType);
    let clickData:any = {
      title: clickObject.title || clickObject.name,
      object_id: clickObject.id,
      object_type: objectType,
      query: this.query,
      user_id: this.userId,
    };


    this.firebaseService.saveAny('search_analytics/clicks', clickData);

  }

}
