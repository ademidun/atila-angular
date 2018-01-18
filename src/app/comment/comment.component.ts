import { Component, OnInit , Input} from '@angular/core';
import { Comment, upVoteComment, downVoteComment, countVotes } from "../_models/comment";

import { AuthService } from "../_services/auth.service";
import { CommentService } from '../_services/comment.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() commentType: string;

  userId: number;
  isOwner: boolean;

  constructor(
    public commentService: CommentService,
    public authService: AuthService,
  ) {

    this.userId = parseInt(this.authService.decryptLocalStorage('uid'));



   }

  ngOnInit() {

    this.getCommentMetadata();

    if (!isNaN(this.userId) && this.comment && this.userId == this.comment.user.id){
      this.isOwner = true;
    }

  }

  likeComment() {
    this.comment= upVoteComment(this.userId,this.comment);

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
      .subscribe(res=> console.log('deleteComment res', res),
        err=>console.log('deleteComment res', err))
  }

  getCommentMetadata(){


    if(this.comment.up_votes_id.includes(this.userId)){//if the current user (ID) already liked the video, disable the up_vote_button
      this.comment['alreadyLiked'] = true;
    }


    this.comment = countVotes(this.comment);
  }

}
