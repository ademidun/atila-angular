import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../_services/search.service';
import {AuthService} from '../_services/auth.service';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {UserProfileService} from '../_services/user-profile.service';
import {MatSnackBar} from '@angular/material';
import {UserProfile, addToMyScholarshipHelper} from '../_models/user-profile';
import {genericItemTransform} from '../_shared/utils';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query: any;
  userId: any;
  isLoggedIn = false;
  isSearching: boolean;
  essays = [];
  searchResults: any = {};
  userProfile: UserProfile;


  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public searchService: SearchService,
    public snackBar: MatSnackBar,
    public authService: AuthService,
    public firebaseService: MyFirebaseService,
    public userProfileService: UserProfileService,
  ) { }

  ngOnInit() {

    this.query = this.route.snapshot.queryParams['q'];


    this.userId = parseInt(this.authService.decryptLocalStorage('uid'), 10);

    if (!isNaN(this.userId)) {
      this.isLoggedIn = true;
    }
    const queryOptions = this.route.snapshot.queryParams;

    if (this.query) {
      this.search(this.query, queryOptions)
    }


  }

  search(query, queryOptions?) {

    this.isSearching = true;


    const queryMetaData = {
      query: queryOptions,
      user_id: null,
    };


    if (!isNaN(this.userId)) {
      this.isLoggedIn = true;
      queryMetaData.user_id = this.userId
    }

    const queryString= `?q=${query}`;

    this.searchService.search(queryString, queryMetaData)
      .subscribe(
        res => {
          this.searchResults = res;
          this.isSearching = false;


          // Call customizeResults() twice, since search results and user data may return at different times.

          this.essays = this.searchResults.essays.map(item => {
            return genericItemTransform(item);
          });

          if (!this.userProfile && !isNaN(this.userId)) {
            this.userProfileService.getById(this.userId)
              .subscribe(
                res2 => {
                  this.userProfile = res2;
                  this.customizeResults();
                },
              );
          }
          if(this.userProfile) {
            this.customizeResults();
          }
        } ,

        err => {
          this.isSearching = false;
        },
      )
  }

  customizeResults() {


    if(this.userProfile.saved_scholarships) {


      this.searchResults.scholarships =  this.searchResults.scholarships.map(
        scholarship => {
          if (this.userProfile.saved_scholarships.includes(scholarship.id) ) {
            scholarship.alreadySaved = true;
          }

          return scholarship;
        }
      );

    }



  }
  saveQueryClick(clickObject,objectType) {
    const clickData:any = {
      title: clickObject.title || clickObject.name,
      object_id: clickObject.id,
      object_type: objectType,
      query: this.query,
      user_id: this.userId,
    };


    this.firebaseService.saveAny('search_analytics/clicks', clickData);

  }

  addToMyScholarships(scholarship) {

    const userAnalytics:any = {};

    userAnalytics.share_type = 'save_scholarship';
    userAnalytics.share_source = 'search';
    userAnalytics.query = this.query;
    userAnalytics.schoarship_id = scholarship.id;


    this.firebaseService.saveUserAnalytics(userAnalytics,'scholarship_sharing');
    if(this.userProfile) {
      userAnalytics.user_id = this.userProfile.user;
    }

    if (!this.userProfile) {
      const snackBarRef = this.snackBar.open('Register to Save', 'Register', {
        duration: 5000
      });

      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['register']);
        },
      );

      return;
    }

    const saveResult = addToMyScholarshipHelper(this.userProfile,scholarship);

    if(!saveResult[1]) {
      this.snackBar.open('Already Saved', '', {
        duration: 5000
      });
      return;
    }
    else {
      this.userProfile = saveResult[0];

      this.userProfileService.updateHelper(this.userProfile)
        .subscribe(
          res => {
            const snackBarRef = this.snackBar.open('Saved to My Scholarships', 'My Scholarships', {
              duration: 5000
            });

            snackBarRef.onAction().subscribe(
              () => {
                this.router.navigate(['profile',this.userProfile.username,'my-atila']);
              },
            )},
          err=> {},
        )

    }

  }
}
