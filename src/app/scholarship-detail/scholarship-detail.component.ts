import { Component, OnInit } from '@angular/core';

import { Scholarship } from '../_models/scholarship';
import { Comment } from "../_models/comment";
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipService } from '../_services/scholarship.service';
import { ApplicationService } from '../_services/application.service';
import { Observable } from 'rxjs/Rx';
import { NgZone } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { UserProfileService } from '../_services/user-profile.service';

import { CommentService } from '../_services/comment.service';

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

  private reviews: any[];
  private reviewsLoaded: boolean = false;
  private scholarshipOwner;
  public keyGetter = Object.keys;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private scholarshipService: ScholarshipService,
    private applicationService: ApplicationService,
    private _ngZone: NgZone,
    public dialog: MdDialog,
    private snackBar: MdSnackBar,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private commentService: CommentService,
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
          this.titleService.setTitle('Atila - ' + this.scholarship.name);
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

        console.log('this.keyGetter',this.keyGetter(this.scholarship.city));
        },
        err => {
          console.log(err);
        },

        () => {
          this.getScholarshipComments(); 
        }
      );

    // Load reviews
  }

  getScholarshipComments(){
    //create an empty UserComment object
    this.userComment = new Comment(this.userId, 'Scholarship',this.scholarship.id);

    console.log('getScholarshipComments() this.userComment: ', this.userComment);
    //this.scholarshipComments = new Array<Comment>();

    let postOperation = this.commentService.getComments('Scholarship',this.scholarship.id);

    postOperation.subscribe(
      res => {
        console.log('get Comment response; ', res);
        this.scholarshipComments = res.results;
      }
    )
    
  }

  postComment(){
    
    //prevent ScholarshipComments from tracking the changes to UserComment;
    var commentTemp:Comment = new Comment(this.userId, 'Scholarship',this.scholarship.id);
    commentTemp.text = this.userComment.text;
    commentTemp.title = this.userComment.title;
    console.log('about to save the comment commentTemp; ', commentTemp);
    let postOperation = this.commentService.saveComment(commentTemp);

    postOperation.subscribe(
      res => {
        console.log('postComment response; ', res);
        this.scholarshipComments.unshift(res);
      },

      err =>{
        console.log('postComment err: ', err);
      }
      
    )
    
    this.userComment.text = "";
    this.userComment.title = "";
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
          console.log('application', application)
          console.log('application.id', application.id);
        },
        error => {
          console.log('scholarship-detail component error!:', error)
        },
        () => {
  
          console.log('()', this.appId);
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
          console.log('The snack-bar action was triggered!');
          this.router.navigate(['login']);
        },
        err =>  console.log('The snack-bar action was triggered! error', err),
      )
    }
   }

}
