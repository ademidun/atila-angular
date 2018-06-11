import { Component, OnInit } from '@angular/core';
import {Essay} from '../../_models/essay';
import {Router} from '@angular/router';
import {UserProfile} from '../../_models/user-profile';
import {MatSnackBar} from '@angular/material';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {EssayService} from '../../_services/essay.service';
import {AuthService} from '../../_services/auth.service';
import {UserProfileService} from '../../_services/user-profile.service';
import {SeoService} from '../../_services/seo.service';

@Component({
  selector: 'app-essay-list',
  templateUrl: './essay-list.component.html',
  styleUrls: ['./essay-list.component.scss']
})
export class EssayListComponent implements OnInit {
  essays: Essay[];
  userProfile: UserProfile;
  isLoading: boolean;
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public firebaseService: MyFirebaseService,
    public essayService: EssayService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public seoService: SeoService,
  ) { }

  ngOnInit() {

    this.seoService.generateTags({
      title: "Atila Essays",
      // description: "Read the university application and scholarship essays used by students at Ivey, Waterloo, Harvard etc.",
      description: "Read the university application and scholarship essays used by students that helped them get acceptance to top schools and win scholarships.",
      image: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-logo-right-way.png?alt=media&token=ec084371-320a-447d-8628-b1e9df0af5b9',
      slug: `essay/`
    });
    let userId = parseInt(this.authService.decryptLocalStorage('uid'));
    if (! isNaN(userId)){
      this.userProfileService.getById(userId).subscribe(
        res => {
          this.userProfile = res;

          this.essayService.list().subscribe(
            res => {
              console.log('res',res);
              this.essays = res.results;

              this.essays.forEach(essay => {
                if (essay.up_votes_id && essay.up_votes_id.includes(this.userProfile.user)) {
                  essay['alreadyLiked'] = true;
                }

              });
              this.isLoading = false;
            },

            err =>{
              this.isLoading = false;
            }
          );

        },
        err=> {
        }

      );
    }

    else {
      this.essayService.list().subscribe(
        res => {
          console.log('res',res);
          this.essays = res.results;
          this.isLoading = false;
        },
        err =>{
          this.isLoading = false;
        }
      );
    }
  }

  // todo, uses code from essay-list, refactor common code to a shared function
  likeContent(content: Essay, index?) {

    if (!this.userProfile) {
      let snackBarRef = this.snackBar.open("Please log in to like.", '', {
        duration: 3000
      });

      snackBarRef.onAction().subscribe(
        () => {

          this.router.navigate(['login']);
        },
        err =>  {}
      );

      return;
    }

    if(content.up_votes_id ) {

      if (!content.up_votes_id.includes(this.userProfile.user)) {
        content.up_votes_id.push(this.userProfile.user);
        content.up_votes_count += 1;
        content['alreadyLiked'] = true;

        let sendData = {
          id: content.id,
          up_votes_id: content.up_votes_id,
          up_votes_count: content.up_votes_count,
        };

        let userAgent = {
          'user_id': this.userProfile.user,
          'content_type': 'essay',
          'content_id': content.id,
          'action_type': 'like',
        };

        this.firebaseService.saveUserAnalytics(userAgent, 'content_likes/'+userAgent.content_type);
        this.essayService.partialUpdateComments(sendData)
          .subscribe(res=>{},
            err =>{})
      }

      else  {
        let index = content.up_votes_id.indexOf(this.userProfile.user);
        content.up_votes_id.splice(index, 1);
        content.up_votes_count -= 1;
        content['alreadyLiked'] = false;

        let sendData = {
          id: content.id,
          up_votes_id: content.up_votes_id,
          up_votes_count: content.up_votes_count,
        };

        this.essayService.partialUpdateComments(sendData)
          .subscribe(res=>{},
            err =>{})
      }
    }

  }

}
