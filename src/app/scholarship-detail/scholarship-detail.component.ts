import { Component, OnInit } from '@angular/core';

import { Scholarship } from '../_models/scholarship';
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipService } from '../_services/scholarship.service';
import { ApplicationService } from '../_services/application.service';
import { Observable } from 'rxjs/Rx';
import { NgZone } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { UserProfileService } from '../_services/user-profile.service';

@Component({
  selector: 'app-scholarship-detail',
  templateUrl: './scholarship-detail.component.html',
  styleUrls: ['./scholarship-detail.component.scss']
})
export class ScholarshipDetailComponent implements OnInit {

  scholarship: Scholarship;
  scholarshipSlug: string;
  userId: number;
  appId: number;

  private reviews: any[];
  private reviewsLoaded: boolean = false;
  private scholarshipOwner;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private scholarshipService: ScholarshipService,
    private applicationService: ApplicationService,
    private _ngZone: NgZone,
    public dialog: MdDialog,
    private snackBar: MdSnackBar,
    private userProfileService: UserProfileService
  ) {
    // Get the id that was passed in the route
    this.scholarshipSlug = route.snapshot.params['slug'];
    this.userId = parseInt(localStorage.getItem('userId')); // Current user
  }

  ngOnInit() {
    // Load scholarship from the id
    this.scholarshipService.getBySlug(this.scholarshipSlug)
      .subscribe(
        scholarship => {
          this.scholarship = scholarship;
          // Get the user profile of the scholarship owner
          if (this.scholarship.owner){
            this.userProfileService.getById(scholarship.owner)
            .subscribe(
              user => {
                this.scholarshipOwner = user;
              },
              err => {
                console.log(err);
              }
            )
          }
        },
        err => {
          console.log(err);
        }
      );

    // Load reviews
  }

}
