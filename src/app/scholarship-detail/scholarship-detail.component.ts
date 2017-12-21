import { Component, OnInit } from '@angular/core';

import { Scholarship } from '../_models/scholarship';
import { Comment, upVoteComment, downVoteComment } from "../_models/comment";
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipService } from '../_services/scholarship.service';
import { ApplicationService } from '../_services/application.service';
import { Observable } from 'rxjs/Observable';
import { NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { UserProfileService } from '../_services/user-profile.service';

import { CommentService } from '../_services/comment.service';
import { AuthService } from "../_services/auth.service";
import { Title }     from '@angular/platform-browser';


@Component({
  selector: 'app-scholarship-detail',
  templateUrl: './scholarship-detail.component.html',
  styleUrls: ['./scholarship-detail.component.scss']
})
export class ScholarshipDetailComponent implements OnInit {

  scholarship: Scholarship;
  scholarshipComments: Comment[];
  userComment: Comment;
  scholarshipSlug: string;
  userId: number;
  appId: number;
  json = JSON;

  public reviews: any[];
  public reviewsLoaded: boolean = false;
  public scholarshipOwner;
  public keyGetter = Object.keys;

  constructor(
    route: ActivatedRoute,
    public router: Router,
    public scholarshipService: ScholarshipService,
    public applicationService: ApplicationService,
    public _ngZone: NgZone,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public commentService: CommentService,
    public authService: AuthService,
  ) {
    // Get the id that was passed in the route
    this.scholarshipSlug = route.snapshot.params['slug'];
    this.userId = parseInt(this.authService.decryptLocalStorage('uid')); // Current user, TODO: Should we use the request user ID?


  }

  ngOnInit() {
    // Load scholarship from the id
    this.scholarshipService.getBySlug(this.scholarshipSlug)
      .subscribe(
        scholarship => {
          this.scholarship = scholarship;
          this.titleService.setTitle('Atila - ' + this.scholarship.name);
          // Get the user profile of the scholarship owner
          if (this.scholarship.owner){
            this.userProfileService.getById(scholarship.owner)
            .subscribe(
              user => {
                this.scholarshipOwner = user;
              },
              err => {

              }
            )
          }


        },
        err => {

        },

        () => {
          this.getScholarshipComments();
        }
      );

    // Load reviews
  }

  getScholarshipComments(){
    //create an empty UserComment object
    this.userComment = new Comment(this.userId);


    //this.scholarshipComments = new Array<Comment>();

    let postOperation = this.commentService.getComments(this.scholarship.id,'Scholarship');

    postOperation.subscribe(
      res => {

        this.scholarshipComments = res.comments;
      }
    )

  }

  postComment(){

    //prevent ScholarshipComments from tracking the changes to UserComment;
    // TODO: Consider using deepcopy of comment
    var commentTemp:Comment = new Comment(this.userId);
    commentTemp['scholarship'] = this.scholarship.id;
    commentTemp.text = this.userComment.text;
    commentTemp.title = this.userComment.title;

    let postOperation = this.commentService.create(commentTemp);

    postOperation.subscribe(
      res => {

        this.scholarshipComments.unshift(res);
      },

      err =>{

      }

    )

    this.userComment.text = "";
    this.userComment.title = "";
  }


  trackByFn(index: any, item: any) {
    return index;

  }

  getOrCreateApp() {
    if(this.userId){
      var data = {
        scholarshipId: this.scholarship.id,
        userId: this.userId
      }
      let postOperation: Observable<any>;
      postOperation = this.applicationService.getOrCreateApp(data);

      postOperation
        .subscribe(
        application => {
          this.appId = application.id;


        },
        error => {

        },
        () => {


          this.router.navigate(['applications', this.appId])
        }
        )


    }
    else{
      let snackBarRef = this.snackBar.open("Account Required to Apply", 'Create Account', {
        duration: 3000
      });

      snackBarRef.onAction().subscribe(
        () => {

          this.router.navigate(['login']);
        },
        err =>  {}
      )
    }
   }

   //Make this an exported member function of comment
   upVoteComment(userId: number, comment: Comment): Comment{



    if(comment.up_votes_id.includes(userId)){


        return comment;
    }
    else{
        this['user_already_upvoted'] = true;
        comment.up_votes_count = comment.up_votes_id.push(userId);

        return comment.up_votes_count;
    }
  }

}
