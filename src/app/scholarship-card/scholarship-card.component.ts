import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {UserProfile} from '../_models/user-profile';
import {MyFirebaseService} from '../_services/myfirebase.service';
@Component({
  selector: 'app-scholarship-card',
  templateUrl: './scholarship-card.component.html',
  styleUrls: ['./scholarship-card.component.scss']
})
export class ScholarshipCardComponent implements OnInit {

  //todo change to only handle one scholarship
  @Input() scholarship: any;
  @Input() userProfile: UserProfile;
  userAnalytics: any = {};
  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public firebaseSerce: MyFirebaseService) { }

  ngOnInit() {



  }


  addToMyScholarship(item) {
    console.log('shareItem(): scholarship, userProfile', this.scholarship, this.userProfile);

    this.logShareType('save_my_scholarships');
    if (this.userProfile) {
      let snackBarRef = this.snackBar.open("Saved to My Scholarships", 'My Scholarships', {
        duration: 5000
      });

      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['my-scholarships']);
        },
      )
    }

    else {
      let snackBarRef = this.snackBar.open("Register to Save", 'Register', {
        duration: 5000
      });


      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['register']);
        },
      )
    }


    }

  logShareType(sharingType) {
    console.log('logShareType',sharingType);
    this.userAnalytics.share_type = sharingType;
    this.userAnalytics.schoarship_id = this.scholarship.id;


    if(this.userProfile) {
      this.userAnalytics.user_id = this.userProfile.user;

    }
    this.firebaseSerce.saveUserAnalytics(this.userAnalytics,'scholarship_sharing');
  }

  }



