import { Component, OnInit, AfterViewInit, EventEmitter, OnDestroy, Input,Output, ChangeDetectorRef } from '@angular/core';
import { BlogPost } from "../_models/blog-post";
import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';
import { MatSnackBar } from '@angular/material';

import { BlogPostService } from "../_services/blog-post.service";
import { ActivatedRoute, Router } from '@angular/router';

import { UploadFile } from '../_models/upload-file';

import { AuthService } from "../_services/auth.service";

import { Observable } from 'rxjs/Observable';

import * as firebase from "firebase";

declare var tinymce: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-blog-post-create',
  templateUrl: './blog-post-create.component.html',
  styleUrls: ['./blog-post-create.component.scss']
})
export class BlogPostCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  blogPost:BlogPost;
  userProfile: UserProfile;
  userId: number;
  extraBlogOptions =false;

  pictureFile: UploadFile;
  uploadProgress: number;
  editor: any;
  editMode=false;
  options: Object;

  constructor(public ref:ChangeDetectorRef,
    public userProfileService: UserProfileService,
    public blogPostService: BlogPostService,
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar,
    public route: ActivatedRoute,) {

      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
      this.options = {
          placeholder: "Share your thoughts",
          events : {
            'froalaEditor.focus' : function(e, editor) {
            }
          },
        heightMin: 200,
        }
    }

  ngOnInit() {

    let blogId = this.route.snapshot.params['id'];

    if(isNaN(this.userId)){

      setTimeout( () => {
        this.snackBar.open('Please Log In','',{duration: 3000});
      });


      this.blogPost = new BlogPost(0);
    }
    else{

      this.blogPost = new BlogPost(this.userId);
    }
    if(blogId){
      this.editMode = true;
      this.blogPostService.getById(blogId).subscribe(
        res => {
          this.blogPost = <any>res;
          if (this.userId!=this.blogPost.user.id) {
            this.router.navigate(['/login']);
          }
        },
        err => this.snackBar.open(err,'',{duration: 3000})
      )
    }

    else{
    /*
    this.blogPost.body =`<p>This was potentially my favorite blog post to write.</p> <ol> <li>It was actionable</li> <li>It was on a
    topic which I really enjoyed.</li> <li>I think I may be right.&nbsp;</li> </ol> <blockquote> <p>"An investment in
    education pays the best interest."</p> <p>&nbsp; &nbsp; - Benjamin Franklin</p> </blockquote> <p>This is why I
    would prefer going back to my regular writing.</p> <p>&nbsp;</p>`;
    */
    this.blogPost.body = `Share your thoughts`;
    }
    if (!isNaN(this.userId)){
      this.userProfileService.getById(this.userId).subscribe(
        res => {
          this.userProfile = res;

        },)
    }



  }
  ngAfterViewInit() {


  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.ref.detach();
  }


  saveBlog(isPublished:boolean){


    //if the blog has already been published, keep the publication status.
    this.blogPost.published = this.blogPost.published? this.blogPost.published: isPublished;

    let postOperation: Observable<any>;

    if(this.editMode){

      //change author from dict to ID to match API pattern
      this.blogPost.user = this.blogPost.user.id;
      postOperation = this.blogPostService.update(this.blogPost.id,this.blogPost);
    }
    else{
      postOperation = this.blogPostService.create(this.blogPost);
    }

    postOperation.subscribe(
      res => {
        this.blogPost = res
      },

      err => {
        this.snackBar.open(err,'', {
          duration: 5000
        });
      },
      () => {
        if (this.blogPost.published){
          let snackBarRef = this.snackBar.open("Sucessfully Published Blog", 'View Blog', {
            duration: 3000
          });

          snackBarRef.onAction().subscribe(
            () => {

              this.router.navigate(['blog',this.userProfile.username,this.blogPost.slug]);
            },
            err =>  {}
          )
        }

        else {
          this.snackBar.open("Sucessfully Saved Blog", '', {
            duration: 3000
          });
        }



      }
    )


  }

  titleToSlug(slugInput: HTMLInputElement){


      this.blogPost.slug = this.convertToSlug(this.blogPost.title);
  }

  uploadPicture(uploadPicInput:HTMLInputElement){


    if(!this.blogPost.id){
      this.snackBar.open("Save Blog Before Uploading Picture", '', {
        duration: 3000
      });
      return;
    }

    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.


    var uploadPicFile = uploadPicInput.files[0];




    this.pictureFile = new UploadFile(uploadPicFile);

    // Instructions on how the file should be saved to the database
    this.pictureFile.uploadInstructions = {
      type: 'update_model',
      model: "UserProfile",
      id: this.userProfile.user,
      fieldName: 'profile_pic_url'
    }


    // the path where the file should be saved on firebase
    this.pictureFile.path = "blogs/" + this.userProfile.user+ "/" + 1 + "/"
    this.pictureFile.path = this.pictureFile.path + this.pictureFile.name


    this.fileUpload(this.pictureFile)
    .subscribe(
      res => {}
    )



  }

  //TODO: Refactor this code into the firebase service
  //TODO:
  fileUpload(uploadFile: UploadFile){
    /**
     * Upload handler which gets the Firebase API keys before we upload the file.
     */
    return this.authService.getAPIKey("FIREBASE_CONFIG_KEYS")
    .map(res => this.uploadFileFirebase(res, uploadFile))
    .catch(err=>Observable.throw(err))
  }

  //TODO: Refactor this code into the firebase service
  //TODO: How can we get uploadFileFirebase to return an observable with the URL of the uploaded file
  uploadFileFirebase(res: Response, uploadFile: UploadFile){



    let config;
    config = res['api_key'];

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    //Initiliazing the firebase client
    //https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
    //

    uploadFile.name = config.toString();
    var storage = firebase.storage();
    let storageRef = storage.ref();
    let uploadRef = storageRef.child(uploadFile.path);
    var metadata = {
      contentType: uploadFile.file.type,
      size: uploadFile.file.size,
      name: uploadFile.file.name,
    };

    var uploadTask = uploadRef.put(uploadFile.file, metadata);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot:any) => {
      var progress = (uploadTask.snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.uploadProgress = progress;

    },
    (error)=> {
      this.snackBar.open(error.message,'', {
        duration: 5000
      });
    },
    () => {

      this.blogPost.header_image_url = uploadTask.snapshot.downloadURL;
      this.uploadProgress = null;
      this.saveBlog(false);

    });


  }

  convertToSlug(text){
      return text
          .toLowerCase()
          .replace(/[^\w ]+/g,'')
          .replace(/ +/g,'-')
          ;
  }
}

