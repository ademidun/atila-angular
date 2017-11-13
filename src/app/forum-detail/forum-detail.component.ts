import { Component, OnInit } from '@angular/core';
import { ForumService } from "../_services/forum.service";

import { Forum } from "../_models/forum";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';

import { CommentService } from '../_services/comment.service';

import { ActivatedRoute, Router } from '@angular/router';

import { NgZone } from '@angular/core';
import { Title }     from '@angular/platform-browser';

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.scss']
})
export class ForumDetailComponent implements OnInit {

  comments: Comment[];
  forum: Forum;
  parentComment:Comment;
  userProfile: UserProfile;

  constructor(    
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private userProfileService: UserProfileService,
    private titleService: Title,
    private commentService: CommentService,
    private forumService: ForumService,) { }

  ngOnInit() {

    this.forumService.getBySlug(this.route.snapshot.params['slug']).subscribe(
      forum => {
        this.forum = forum;

        this.titleService.setTitle('Atila Forum - ' + this.forum.title);
        this.forumService.getComments(this.forum.id).subscribe(
          comments => {
            console.log('forumService.getComments',comments)
            this.comments = comments;
          }
        )
      }
    )
  }

}
