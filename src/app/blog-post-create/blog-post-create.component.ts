import { Component, OnInit, AfterViewInit, EventEmitter, OnDestroy, Input,Output, ChangeDetectorRef } from '@angular/core';
// https://go.tinymce.com/blog/angular-2-and-tinymce/
import 'tinymce';
import 'tinymce/themes/modern';

import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/lists';

import { BlogPost } from "../_models/blog-post";
import { UserProfile } from '../_models/user-profile';

import { UserProfileService } from '../_services/user-profile.service';
import { MdSnackBar } from '@angular/material';

import { BlogPostService } from "../_services/blog-post.service";
import { ActivatedRoute, Router } from '@angular/router';

import { UploadFile } from '../_models/upload-file';

import { AuthService } from "../_services/auth.service";

import { Observable } from 'rxjs/Rx';

import * as firebase from "firebase";
declare var tinymce: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-blog-post-create',
  templateUrl: './blog-post-create.component.html',
  styleUrls: ['./blog-post-create.component.scss']
})
export class BlogPostCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  editorId = "post-editor";
  myJson = JSON;
  blogPost:BlogPost;
  userProfile: UserProfile;
  userId: number;
  extraBlogOptions =false;

  pictureFile: UploadFile;
  uploadProgress: number;
  editor: any;
  editMode=false;
  constructor(private ref:ChangeDetectorRef,
    private userProfileService: UserProfileService,
    private blogPostService: BlogPostService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MdSnackBar,
    private route: ActivatedRoute,) { 

      this.userId = parseInt(localStorage.getItem('userId'));
      this.blogPost = new BlogPost(this.userId);
    }

  ngOnInit() {
    var blogId = this.route.snapshot.params['id'];

    console.log("Editor: " + this.editor + "in ngOninit");
    if(blogId){
      this.editMode = true;
      this.blogPostService.getById(blogId).subscribe(
        res => {
          this.blogPost = res;
          if(this.editor){

            console.log("Editor: " + this.editor + "in blogPostService");
            console.log("Editor: " + this.editor + "in blogPostService");
            //this.editor.setContent(this.blogPost.body);
            //$('#'+this.editorId).html(this.blogPost.body);
            tinymce.get(this.editorId).setContent(this.blogPost.body);
          }
        },
        err => this.snackBar.open(err,'',{duration: 3000})
      )
    }

    else{

    this.blogPost.body =`<p>This was potentially my favorite blog post to write.</p> <ol> <li>It was actionable</li> <li>It was on a 
    topic which I really enjoyed.</li> <li>I think I may be right.&nbsp;</li> </ol> <blockquote> <p>"An investment in 
    education pays the best interest."</p> <p>&nbsp; &nbsp; - Benjamin Franklin</p> </blockquote> <p>This is why I
    would prefer going back to my regular writing.</p> <p>&nbsp;</p>`;
    }
    this.userProfileService.getById(this.userId).subscribe(
      res => {
        this.userProfile = res;
        
      },
    )

  }
  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.editorId,
      plugins: ['link', 'table','toc','preview','lists'],
      skin_url: '/assets/skins/lightgray',
      height : "500",
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', (e) => {
          const content = editor.getContent();
          this.onEditorContentChange(e,content, editor);
        });
      },
      init_instance_callback : (editor) => {
        console.log("Editor: " + editor.id + " is now initialized.");
        if(this.blogPost.body){ //body may not be loaded from server yet
          editor.setContent(this.blogPost.body);
        }
        this.editor = editor;
      }
    });


  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.ref.detach();
    tinymce.remove(this.editor);
  }

  onEditorContentChange(event:any, content:any, editor: any){

    if((<KeyboardEvent>event).keyCode == 13) {
      
      console.log('onEditorContentChange: event, content',event, content);
      console.log('onEditorContentChange: editor, ', editor);
      this.blogPost.body = content;
      console.log('onEditorContentChange: this.blogPost, ', this.blogPost);
    }
    this.blogPost.body = content;
    this.ref.detectChanges();
  }

  saveBlog(isPublished:boolean){
    console.log('saveBlog(), isPublished, editor.content, blogPost', isPublished, this.editor.content, this.blogPost);

    //if the blog has already been published, keep the publication status.
    this.blogPost.published = this.blogPost.published? this.blogPost.published: isPublished;

    let postOperation: Observable<any>;
    
    if(this.editMode){

      //change author from dict to ID to match API pattern
      this.blogPost.author = this.blogPost.author.id;
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
              console.log('The snack-bar action was triggered!');
              this.router.navigate(['blog',this.userProfile.username,this.blogPost.slug]);
            },
            err =>  console.log('The snack-bar action was triggered! error', err),
          )
        }

        else {
          this.snackBar.open("Sucessfully Saved Blog", '', {
            duration: 3000
          });
        }
        
        console.log('end of saveBlog() this.blogPost: ',this.blogPost);
      
      }
    )


  }

  titleToSlug(slugInput: HTMLInputElement){
    console.log('titleToSlug, slugInput: ', slugInput);

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
    console.log('uploadPicInput',uploadPicInput);

    var uploadPicFile = uploadPicInput.files[0];

    console.log('uploadPicFile',uploadPicFile);

    
    this.pictureFile = new UploadFile(uploadPicFile);

    // Instructions on how the file should be saved to the database
    this.pictureFile.uploadInstructions = {
      type: 'update_model',
      model: "UserProfile",
      id: this.userProfile.user,
      fieldName: 'profile_pic_url'
    }
    console.log('this.pictureFile',this.pictureFile)

    // the path where the file should be saved on firebase
    this.pictureFile.path = "blogs/" + this.userProfile.user+ "/" + 1 + "/"
    this.pictureFile.path = this.pictureFile.path + this.pictureFile.name
    console.log('this.pictureFile',this.pictureFile);
    
    this.fileUpload(this.pictureFile)
    .subscribe(
      res => console.log('uploadScholarshipAppForm, subscribe() res', res)
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
    
    console.log("uploadFileInternal: res",res,'uploadFile',uploadFile);
    
    let config;
    config = res['api_key'];
    console.log("config",config);
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
      console.log('Upload is ' + progress + '% done');
    },
    (error)=> {
      this.snackBar.open(error.message,'', {
        duration: 5000
      });
    },
    () => {
      console.log('Finished upload: uploadTask.snapshot', uploadTask.snapshot );
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

