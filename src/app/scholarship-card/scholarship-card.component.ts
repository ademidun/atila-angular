import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {UserProfile} from '../_models/user-profile';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {UserProfileService} from '../_services/user-profile.service';
@Component({
  selector: 'app-scholarship-card',
  templateUrl: './scholarship-card.component.html',
  styleUrls: ['./scholarship-card.component.scss']
})
export class ScholarshipCardComponent implements OnInit {

  //todo change to only handle one scholarship
  @Input() scholarship: any;
  @Input() userProfile: UserProfile;
  alreadySaved: boolean;
  userAnalytics: any = {};
  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public firebaseService: MyFirebaseService,
    public userProfileService: UserProfileService) { }

  ngOnInit() {
    if(this.userProfile && this.userProfile.metadata.saved_scholarships) {

      for (let i =0; i<this.userProfile.metadata.saved_scholarships.length; i++) {
        if (this.userProfile.metadata.saved_scholarships[i].id == this.scholarship.id) {
          this.alreadySaved = true;
          break;
        }
      }
    }

    if ('2019-01-01T00:00:00Z' == this.scholarship.deadline) {
      this.scholarship['metadata']['deadline_tbd'] = 'TBD';
    }
  }



  addToMyScholarship(item) {

    if (this.alreadySaved) {
      this.snackBar.open("Already Saved", '', {
        duration: 5000
      });
      return;
    }
    this.logShareType('save_my_scholarships');
    if (this.userProfile) {

      if(!this.userProfile.metadata.saved_scholarships) {
        this.userProfile.metadata.saved_scholarships = [];
      }
      let savedScholarship = {
        id: this.scholarship.id,
        name: this.scholarship.name,
        slug: this.scholarship.slug,
        description: this.scholarship.description,
        img_url: this.scholarship.img_url,
        deadline: this.scholarship.deadline,
      };
      this.userProfile.metadata.saved_scholarships.push(savedScholarship);
      this.alreadySaved = true;


      this.userProfileService.updateHelper(this.userProfile)
        .subscribe(
          res => {},
          err=> {},
        )
      let snackBarRef = this.snackBar.open("Saved to My Scholarships", 'My Scholarships', {
        duration: 5000
      });

      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['profile',this.userProfile.username,'my-atila']);
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
    this.userAnalytics.share_type = sharingType;
    this.userAnalytics.schoarship_id = this.scholarship.id;


    if(this.userProfile) {
      this.userAnalytics.user_id = this.userProfile.user;

    }
    this.firebaseService.saveUserAnalytics(this.userAnalytics,'scholarship_sharing');
  }

  webShare() {
    // if(this.userProfile && (this.userProfile.user == 4 || this.userProfile.user == 1)) {
    if(this.userProfile) {

      if ((<any>navigator).share) {
        (<any>navigator).share({
          title: 'Scholarship From Atila - '+ this.scholarship.name,
          text: 'Have you seen this scholarship from Atila: https://atila.ca/scholarship-detail/'+this.scholarship.slug,
          url: 'https://atila.ca/scholarship-detail/'+this.scholarship.slug,
        })
          .then(() => {})
          .catch((error) => {});
      }
    }

  }

  }



