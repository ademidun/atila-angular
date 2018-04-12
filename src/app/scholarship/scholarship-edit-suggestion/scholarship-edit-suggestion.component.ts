import {Component, Input, OnInit} from '@angular/core';
import {Scholarship, ScholarshipEdit} from '../../_models/scholarship';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {UserProfile} from '../../_models/user-profile';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ScholarshipService} from '../../_services/scholarship.service';

@Component({
  selector: 'app-scholarship-edit-suggestion',
  templateUrl: './scholarship-edit-suggestion.component.html',
  styleUrls: ['./scholarship-edit-suggestion.component.scss']
})
export class ScholarshipEditSuggestionComponent implements OnInit {

  @Input() edit: ScholarshipEdit;
  @Input() userProfile: UserProfile;
  @Input() metadata: any={};
  Object = Object;

  constructor(public firebaseService: MyFirebaseService,
              public snackBar: MatSnackBar,
              public router: Router,
              public scholarshipService: ScholarshipService,
              public route: ActivatedRoute,) {
  }
  ngOnInit() {
  }

  saveEdit() {
    this.firebaseService.updateAny_fs(this.edit.firebase_path,this.edit.id,this.edit);
  }

  changeEditStatus(changeKey,newStatus) {

    if (!this.userProfile) {

      let snackBarRef = this.snackBar.open("Please Register to Change Status",'',{duration: 4000});
      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['register']);
        },
      );
      return;
    }
    else if (!this.metadata['isOwner']) {

      let snackBarRef = this.snackBar.open("Must be scholarship creator",'Add Scholarship',{duration: 4000});
      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['/scholarship/add']);
        },
      );
      return;
    }
    else {

      if (newStatus == 'ACCEPTED') {

        let patchData = {
          [changeKey]: this.edit.changes[changeKey].suggested
        };
        this.scholarshipService.patch(this.edit.scholarship,patchData)
          .subscribe(
            res => {
              this.edit.changes[changeKey].status = newStatus;
              console.log('res',res);
              this.saveEdit();
              let snackBarRef = this.snackBar.open("Success! Suggestion Applied",'View Scholarship',{duration: 4000});
              snackBarRef.onAction().subscribe(
                () => {
                  let scholarshipSlug = this.route.snapshot.params['slug'];
                  this.router.navigate(['/scholarship',scholarshipSlug]);
                },
              );
            },
            err => {
              console.log('err',err);
              let snackBarRef = this.snackBar.open("Error: " + JSON.stringify(err.error),'',{duration: 4000});
              snackBarRef.onAction().subscribe(
                () => {
                  let scholarshipSlug = this.route.snapshot.params['slug'];
                  this.router.navigate(['/scholarship',scholarshipSlug]);
                },
              );
            }
          );
      }
      else {
        this.edit.changes[changeKey].status = newStatus;
        this.saveEdit();
      }
    }
  }

  voteForChange(changeKey, voteType) {

    let userId = this.userProfile ? this.userProfile.user : 0;

    if (userId == 0) {
      let snackBarRef = this.snackBar.open("Please Register to Vote",'',{duration: 4000});

      snackBarRef.onAction().subscribe(
        () => {
          this.router.navigate(['register']);
        },
      );
    }
    else if (this.edit.changes[changeKey][voteType].includes(userId)) {
      let index = this.edit.changes[changeKey][voteType].indexOf(this.userProfile.user);
      this.edit.changes[changeKey][voteType].splice(index, 1);
      return;
    }
    else {
      this.edit.changes[changeKey][voteType].push(userId);
      this.saveEdit();
      return;
    }



  }

}
