import { Component, OnInit , Input} from '@angular/core';
import { Comment, upVoteComment, downVoteComment, countVotes } from "../_models/comment";


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

  constructor(
    private commentService: CommentService
  ) { 

    this.userId = parseInt(localStorage.getItem('userId'));
    console.log('CONSTRUCTOR comment.ts, comment Type', this.commentType, this.comment);
   }

  ngOnInit() {
    console.log('ngOnInit comment.ts, comment Type', this.commentType, this.comment);
    this.getCommentMetadata();
  }

  commentVote(voteType: string){
    
          console.log('voteType', voteType);
          console.log('this.comment',this.comment);
          
          if(voteType=='upVote'){
            this.comment= upVoteComment(this.userId,this.comment);
          }
          else{
            this.comment= downVoteComment(this.userId,this.comment);
          }
          
          //convert the owner attribute to only keep the id, as per the API format.
          var sendData = this.comment;
          sendData.user = sendData.user.id;
      
          //update the database with the new upvote score and update the UI based on the database response
          //why is commentType sometimes defined and sometimes undefined?
          console.log('comment.ts, comment Type', this.commentType);
          let postOperation = this.commentService.update(sendData);
          postOperation.subscribe(
            res => {
              console.log('updating comment res:', res);
              //this.comment = res; TODO: Do we need the updated result from the database?
            }
          )
      
  }

  getCommentMetadata(){
    

    if(this.comment.up_votes_id.includes(this.userId)){//if the current user (ID) already liked the video, disable the up_vote_button
      this.comment['user_already_upvoted'] = true;
    }else{
      this.comment['user_already_upvoted'] = false;
    }

    if(this.comment.down_votes_id.includes(this.userId)){
       this.comment['user_already_downvoted'] = true;
    }else{
      this.comment['user_already_downvoted'] = false;
    }


    this.comment = countVotes(this.comment);
  }

}