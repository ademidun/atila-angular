import { Component, OnInit } from '@angular/core';
import { BlogPostService } from "../../_services/blog-post.service";

import { BlogPost, likeContent } from "../../_models/blog-post";
import { Comment } from "../../_models/comment";

import { UserProfile } from '../../_models/user-profile';

import { UserProfileService } from '../../_services/user-profile.service';
import { AuthService } from "../../_services/auth.service";
import {MatSnackBar} from '@angular/material';
import { MyFirebaseService} from '../../_services/myfirebase.service';
import {SeoService} from '../../_services/seo.service';
@Component({
  selector: 'app-blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent implements OnInit {

  public blogs: BlogPost[] = [];
  newBlog: BlogPost;
  blogComment:Comment;
  userProfile: UserProfile;
  isLoading= true;
  titleMaxLength = 75;
  totalItemCount: number;
  pageNumber=1;
  constructor(
    public blogService: BlogPostService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    public firebaseService: MyFirebaseService,
    public seoService: SeoService,
  ) { }

  ngOnInit() {
    this.seoService.generateTags({
      title: "Atila Blogs",
      description: "Stories by students on school, career, and life in general.",
      image: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-blog-logo.png?alt=media&token=84980f33-d850-4e94-905e-04ac5195b414',
      slug: `blog/`
    });

    var userId = parseInt(this.authService.decryptLocalStorage('uid'));
    if (! isNaN(userId)){
      this.blogComment = new Comment(userId,'','');
      this.userProfileService.getById(userId).subscribe(
        res => {
          this.userProfile = res;

          this.loadMoreItems();
        },
        err=> {
        }

      );
    }

    else {
      this.loadMoreItems();
    }

  }

  likeContent(content: BlogPost) {

    return likeContent(content, this.userProfile,this.blogService, this.firebaseService, this.snackBar)

  }

  loadMoreItems(pageNo = 1) {
    this.isLoading = true;
    this.blogService.list(pageNo).subscribe(
      res => {
        this.blogs.push(...res.results);
        this.totalItemCount = res.count;

        if (this.userProfile) {
          this.blogs.forEach(blog => {
            if (blog.up_votes_id.includes(this.userProfile.user)) {
              blog['alreadyLiked'] = true;
            }
          });
        }
        this.isLoading = false;
      },
      err =>{
        this.isLoading = false;
        console.log({ err });
      }
    );
  }

}
