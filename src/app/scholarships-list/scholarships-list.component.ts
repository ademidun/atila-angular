import { Component, OnInit } from '@angular/core';
import { ScholarshipService } from "../_services/scholarship.service";
import { UserProfileService } from '../_services/user-profile.service';

import { Scholarship } from '../_models/scholarship';

import { Router } from '@angular/router';

@Component({
  selector: 'app-scholarships-list',
  templateUrl: './scholarships-list.component.html',
  styleUrls: ['./scholarships-list.component.scss']
})
export class ScholarshipsListComponent implements OnInit {

  constructor(
    public scholarshipService: ScholarshipService,
    private userProfileService: UserProfileService,
    private router: Router
  ) { }

  form_data: Object;
  isLoggedIn: boolean;
  userId: string;
  contentFetched: boolean = false;
  sortVal = 1;


  scholarships: Scholarship[]; //TODO: If i use scholarship[] I can't access property members, why?
  scholarship_count: number = 0;
  total_funding: any = 0;
  show_scholarship_funding: boolean = false;

  pageNo: number = 1;
  paginationLen: number = 12
  pageLen: number;



  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    console.log('this.userId', this.userId);
    if (this.userId) {
      this.isLoggedIn = true;
      this.userProfileService.getById(parseInt(this.userId))
      .subscribe(
        data => {
          var tempCity = [];
          tempCity.push(data.city);
          this.form_data = {
            'city': data.city,
            'education_level': data.education_level,
            'education_field': data.education_field
          }

          this.getScholarshipPreview(this.pageNo);
        }
      )} else {
      this.isLoggedIn = false;
      this.scholarshipService.getScholarshipPreviewForm()
      .then(
        res => this.form_data = res,
      )
      .then(
        res => this.getScholarshipPreview(),
      )
    }
  }


  getScholarshipPreview(page: number = 1){
    console.log('inside getScholarshipPreview', this.scholarships);
    console.log('inside getScholarshipPreview page', page);
    if (typeof this.form_data != 'undefined') {
      this.scholarshipService.getPaginatedscholarships(this.form_data, page)
      .subscribe(
        res => {
          this.saveScholarships(res);
          this.contentFetched = true;
        },
        error => {
          console.log('error in getscholarshipPreviewList', error);
          this.contentFetched = false;
        }
      );
    }

    if(!this.scholarships){
      console.log('contentFetched', this.contentFetched);
      this.contentFetched = false;
    }
  }

  saveScholarships(res: any){
    console.log("res", res);
    console.log("res['data']", res['data']);
    this.scholarships = res['data'];
    this.scholarship_count = res['length'];
    this.total_funding = res['funding'];

    if (this.total_funding){
      this.show_scholarship_funding = true;
    }

    this.pageLen = Math.ceil(this.scholarship_count / this.paginationLen);
  }

  nextPage() {
    this.pageNo++;
    this.getScholarshipPreview(this.pageNo);
    window.scrollTo(0, 0);
  }

  previousPage() {
    this.pageNo--;
    this.getScholarshipPreview(this.pageNo);
    window.scrollTo(0, 0);
  }
}
