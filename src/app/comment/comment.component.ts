import { Component, OnInit , Input} from '@angular/core';
import { Comment, upVoteComment, getCommentType, countVotes } from "../_models/comment";

import { AuthService } from "../_services/auth.service";
import { CommentService } from '../_services/comment.service';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() commentType: string;
  @Input() metaData: any = {};

  userId: number;
  isOwner: boolean;
  trimText: boolean;


  constructor(
    public commentService: CommentService,
    public authService: AuthService,
    public firebaseService: MyFirebaseService,
    public router: Router,
    public snackBar: MatSnackBar,
  ) {

    this.userId = parseInt(this.authService.decryptLocalStorage('uid'));



   }

  ngOnInit() {

    this.getCommentMetadata();


  }

  likeComment() {

    if (!this.userId || isNaN(this.userId)) {
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

    this.comment= upVoteComment(this.userId,this.comment);


    let userAgent = {
      'user_id': this.comment.user.id,
      'content_type': getCommentType(this.comment),
      'content_id': this.comment.id,
      'action_type': 'like',
      'is_comment': true,
    };

    this.firebaseService.saveUserAnalytics(userAgent, 'content_likes/'+userAgent.content_type);

    //convert the owner attribute to only keep the id, as per the API format.
    var sendData = Object.assign({}, this.comment);
    sendData.user = sendData.user.id;

    //update the database with the new upvote score and update the UI based on the database response
    //why is commentType sometimes defined and sometimes undefined?

    let postOperation = this.commentService.update(sendData);
    postOperation.subscribe(
      res => {

        //this.comment = res; TODO: Do we need the updated result from the database?
      }
    )
  }

  deleteComment() {
    this.comment['isDeleted'] = true;

    this.commentService.delete(this.comment)
      .subscribe(res=> {},
        err=>{})
  }

  logSeeMoreClick(){

    let userAgent = {
      'content_type': getCommentType(this.comment),
      'content_id': this.comment.id,
      'action_type': 'see_more_click',
      'is_comment': true,
    };


    this.firebaseService.saveUserAnalytics(userAgent,'see_more_click/');


  }


  getCommentMetadata(){

    if (!isNaN(this.userId) && this.comment && this.userId == this.comment.user.id || environment.adminIds.indexOf(this.userId) > -1){
      this.isOwner = true;
    }

    // A/B Test to see effect of trimming the text on engagement.
    this.trimText = !this.metaData['titleComment'] && this.comment.text.length > 500;

    if(this.comment.up_votes_id.includes(this.userId)){//if the current user (ID) already liked the video, disable the up_vote_button
      this.comment['alreadyLiked'] = true;

    }


    this.comment = countVotes(this.comment);
  }

  saveComment() {
    let sendData = Object.assign({}, this.comment);
    sendData.user = this.comment.user.id;
    this.commentService.patch(sendData)
      .subscribe(res=> {
        this.comment['editMode'] = false;
        },
        err=>{
        })
  }



}
