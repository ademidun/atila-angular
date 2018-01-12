import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from '../_services/search.service';
import {AuthService} from '../_services/auth.service';


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
  ) { }

  ngOnInit() {

    this.query = this.route.snapshot.queryParams['q'];

    if (this.query) {
      this.search(this.query)
    }
  }

  search(query) {

    this.isSearching = true;

    let queryMetaData = {
      query: this.route.snapshot.queryParams,
      user_id: null,
    };

    this.userId = parseInt(this.authService.decryptLocalStorage('uid'));

    if (!isNaN(this.userId)) {
      this.isRegistered = true;
      queryMetaData.user_id = this.userId
    }

    let queryString= `?q=${query}`;

    this.searchService.search(queryString, queryMetaData)
      .subscribe(
        res => {
          this.searchResults = res;
          console.log(res)
          this.isSearching = false;
        } ,

        err=>{
          this.isSearching = false;
        },
      )
  }

}
