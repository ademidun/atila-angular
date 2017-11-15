import { Component, OnInit } from '@angular/core';
import { BlogPostService } from "../_services/blog-post.service";

import { BlogPost } from "../_models/blog-post";
import { Comment } from "../_models/comment";

import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';

@Component({
  selector: 'app-blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent implements OnInit {

  private blogs: BlogPost[]
  newBlog: BlogPost;
  blogComment:Comment;
  userProfile: UserProfile;
  constructor(
    private blogService: BlogPostService,
    private userProfileService: UserProfileService,
  ) { }

  ngOnInit() {
    var userId = parseInt(localStorage.getItem('userId'));
    this.blogComment = new Comment(userId,'','');
    this.userProfileService.getById(userId).subscribe(
      res => {
        this.userProfile = res;

      }
    )
    this.blogService.list().subscribe(
      res => {
        this.blogs = res.results;
      }
    );
   
    

  }

}
