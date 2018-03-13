import { Component, OnInit } from '@angular/core';
import { BlogPostService } from "../../_services/blog-post.service";

import { BlogPost, likeContent } from "../../_models/blog-post";
import { Comment } from "../../_models/comment";

import { UserProfile } from '../../_models/user-profile';

import { UserProfileService } from '../../_services/user-profile.service';
import { AuthService } from "../../_services/auth.service";
import {MatSnackBar} from '@angular/material';
import { MyFirebaseService} from '../../_services/myfirebase.service';
@Component({
  selector: 'app-blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent implements OnInit {

  public blogs: BlogPost[]
  newBlog: BlogPost;
  blogComment:Comment;
  userProfile: UserProfile;
  isLoading= true;
  constructor(
    public blogService: BlogPostService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public firebaseService: MyFirebaseService,
  ) { }

  ngOnInit() {
    var userId = parseInt(this.authService.decryptLocalStorage('uid'));
    if (! isNaN(userId)){
      this.blogComment = new Comment(userId,'','');
      this.userProfileService.getById(userId).subscribe(
        res => {
          this.userProfile = res;

          this.blogService.list().subscribe(
            res => {
              this.blogs = res.results;

              this.blogs.forEach(blog => {
                if (blog.up_votes_id.includes(this.userProfile.user)) {
                  blog['alreadyLiked'] = true;
                }
              });
              this.isLoading = true;
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
      this.blogService.list().subscribe(
        res => {
          this.blogs = res.results;
          this.isLoading = true;
        },

        err =>{
          this.isLoading = false;
        }
      );
    }




  }



  likeContent(content: BlogPost) {

    return likeContent(content, this.userProfile,this.blogService, this.firebaseService, this.snackBar)

  }

}