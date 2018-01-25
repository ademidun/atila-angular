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
    constructor(public user,) {
        //Do we have to manually do this, is there a python-like equivalent of kwargs
        this.title = '';
    }

}


export function likeContent(content: BlogPost, userProfile?,blogService?: BlogPostService, firebaseService?: MyFirebaseService, snackBar?: MatSnackBar) {
  if (!userProfile) {


    snackBar.open("Please log in to like.", '', {
      duration: 3000
    });

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
