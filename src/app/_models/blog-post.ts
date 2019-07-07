import {MyFirebaseService} from '../_services/myfirebase.service';
import {BlogPostService} from '../_services/blog-post.service';
import {MatSnackBar} from '@angular/material';

export class BlogPost {

    id?: number;
    title?:any;
    slug?: any;
    date_created?: any;
    header_image_url?: any;
    body?: any;
    description?:any;
    contributors: any[];
    published?: boolean;
    up_votes_count?: any;
    down_votes_count?: any;
    metadata?: any;
    up_votes_id?: any[];
    down_votes_id?: any[];
    user:any;
    constructor(user=-1) {
        //Do we have to manually do this, is there a python-like equivalent of kwargs
        this.title = '';
    }

}


// todo move this to the blog.service
export function likeContent(content: BlogPost, userProfile?,blogService?: BlogPostService, firebaseService?: MyFirebaseService, snackBar?: MatSnackBar) {
  if (!userProfile) {


    let snackBarRef = snackBar.open("Please log in to like.", 'Log In', {
      duration: 3000
    });

    snackBarRef.onAction().subscribe(
      () => {

        this.router.navigateByUrl('/login?redirect='+this.router.url, {      preserveQueryParams: true, preserveFragment: true, queryParamsHandling: 'merge'});
        this.authService.redirectUrl = this.router.url;
      },
      err =>  {}
    )

    return content;
  }

  if(content.up_votes_id ) {

    if (!content.up_votes_id.includes(userProfile.user)) {
      content.up_votes_id.push(userProfile.user);
      content.up_votes_count += 1;
      content['alreadyLiked'] = true;


      if(firebaseService){
        let userAgent = {
          'user_id': userProfile.user,
          'content_type': 'blog',
          'content_id': content.id,
          'action_type': 'like',
        };
        firebaseService.saveUserAnalytics(userAgent, 'content_likes/'+userAgent.content_type);
      }


      let sendData = {
        id: content.id,
        up_votes_id: content.up_votes_id,
        up_votes_count: content.up_votes_count,
      };
      blogService.patch(sendData)
        .subscribe(res=>res)
    }

    else  {
      let index = content.up_votes_id.indexOf(userProfile.user);
      content.up_votes_id.splice(index, 1);
      content.up_votes_count -= 1;
      content['alreadyLiked'] = false;

      let sendData = {
        id: content.id,
        up_votes_id: content.up_votes_id,
        up_votes_count: content.up_votes_count,
      };

      blogService.patch(sendData)
        .subscribe(res=>res)
    }
  }

  return content;
}


export function createTestBlogPost() {
  const blog = new BlogPost();
  blog.title = 'The Nature and Necessity of a Paper-Currency';

  blog.header_image_url = 'https://benfranklin.org';
  blog.user = {
    id: 1706,
    first_name: 'Benjamin',
    last_name: 'Franklin',
  };

  return blog
}
