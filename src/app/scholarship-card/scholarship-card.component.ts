import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {UserProfile} from '../_models/user-profile';
@Component({
  selector: 'app-scholarship-card',
  templateUrl: './scholarship-card.component.html',
  styleUrls: ['./scholarship-card.component.scss']
})
export class ScholarshipCardComponent implements OnInit {

  //todo change to only handle one scholarship
  @Input() scholarship: any;
  @Input() userProfile: UserProfile;
  constructor(
    public snackBar: MatSnackBar,
    public router: Router) { }

  ngOnInit() {



  }


  shareItem(item) {
    console.log('shareItem(): scholarship, userProfile', item);
    let scholarshipSlug = "https://atila.cascholarship-detail/" + this.scholarship.slug;
    // let toastActionElement = `<a class=" btn btn-flat toast-action" href="${scholarshipSlug}">See Saved</a>`;

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
  }



