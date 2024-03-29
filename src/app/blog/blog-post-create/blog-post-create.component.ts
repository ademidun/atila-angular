import {Component, OnInit, AfterViewInit, EventEmitter, OnDestroy, Input, Output, ChangeDetectorRef} from '@angular/core';
import {BlogPost} from '../../_models/blog-post';
import {UserProfile} from '../../_models/user-profile';

import {UserProfileService} from '../../_services/user-profile.service';
import {MatSnackBar} from '@angular/material';

import {BlogPostService} from '../../_services/blog-post.service';
import {ActivatedRoute, Router} from '@angular/router';

import {UploadFile} from '../../_models/upload-file';

import {AuthService} from '../../_services/auth.service';

import {Observable} from 'rxjs/Observable';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {Title} from '@angular/platform-browser';

import {environment} from '../../../environments/environment';

import * as firebase from 'firebase';
// https://go.tinymce.com/blog/angular-2-and-tinymce/
import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/code';

declare var tinymce: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-blog-post-create',
  templateUrl: './blog-post-create.component.html',
  styleUrls: ['./blog-post-create.component.scss']
})
export class BlogPostCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  editorId = 'post-editor';
  blogPost: BlogPost;
  userProfile: UserProfile;
  userId: number;
  extraBlogOptions = false;

  pictureFile: UploadFile;
  uploadProgress: number;
  editor: any;
  editMode = false;
  options: Object;
  isLoggedIn: boolean;
  enivronment = environment;

  constructor(public ref:ChangeDetectorRef,
    public userProfileService: UserProfileService,
    public blogPostService: BlogPostService,
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public firebaseService: MyFirebaseService,
    public titleService: Title,) {

      this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    }

  ngOnInit() {

    let blogId = this.route.snapshot.params['id'];

    if (isNaN(this.userId)) {

      setTimeout(() => {
        let snackBarRef = this.snackBar.open('Please Log In', 'Log In', {
          duration: 3000
        });

        snackBarRef.onAction().subscribe(
          () => {

            this.router.navigateByUrl('/login?redirect=' + this.router.url, {
              preserveQueryParams: true,
              preserveFragment: true,
              queryParamsHandling: 'merge'
            });
            this.authService.redirectUrl = this.router.url;

          },
          err => {
          }
        )
      });


      this.blogPost = new BlogPost(0);
    }
    else {
      this.blogPost = new BlogPost(this.userId);
    }
    if (blogId) {
      this.editMode = true;
      this.blogPostService.getById(blogId).subscribe(
        res => {
          this.blogPost = <any>res;
          if (this.userId != this.blogPost.user.id && this.enivronment.adminIds.indexOf(this.userId) < 0) {
            this.router.navigate(['/login']);
          }

          this.titleService.setTitle(`Edit Blog: ${this.blogPost.title} | Atila`);
          if (this.editor) {
            //this.editor.setContent(this.blogPost.body);
            //$('#'+this.editorId).html(this.blogPost.body);
            tinymce.get(this.editorId).setContent(this.blogPost.body);
          }
        },
        err => this.snackBar.open(err, '', {duration: 3000})
      )
    }

    else {

      this.blogPost.body = `Share your thoughts`;
    }
    if (!isNaN(this.userId)) {
      this.userProfileService.getById(this.userId).subscribe(
        res => {
          this.userProfile = res;
          this.isLoggedIn = true;

        },)
    }


  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.editorId,
      plugins: ['link', 'table', 'toc', 'preview', 'lists', 'media', 'autolink', 'code'],
      toolbar: 'undo redo | styleselect | bold italic | link image | fontsizeselect | numlist bullist',
      skin_url: '/assets/skins/light',
      height: '500',
      invalid_elements: 'script',
      default_link_target: '_blank',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', (e) => {
          const content = editor.getContent();
          this.onEditorContentChange(e, content, editor);
        });
      },
      init_instance_callback: (editor) => {

        if (this.blogPost.body) { //body may not be loaded from server yet
          editor.setContent(this.blogPost.body);
        }
        this.editor = editor;
      }
    });

  }

  onEditorContentChange(event: any, content: any, editor: any) {

    if ((<KeyboardEvent>event).keyCode == 13) {


      this.blogPost.body = content;

    }
    this.blogPost.body = content;
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.ref.detach();
    tinymce.remove(this.editor);
  }


  saveBlog(isPublished: boolean) {

    // if the blog has already been published, keep the publication status.
    this.blogPost.published = isPublished;

    let postOperation: Observable<any>;

    if (this.editMode) {

      // change author from dict to ID to match API pattern

      const blogToSave = Object.assign({},this.blogPost);
      blogToSave.user = this.blogPost.user.id;
      postOperation = this.blogPostService.update(blogToSave.id, blogToSave);
    } else {

      postOperation = this.blogPostService.create(this.blogPost);
    }

    postOperation.subscribe(
      res => {
        this.blogPost = res;
        this.titleService.setTitle(`Edit Blog: ${this.blogPost.title} | Atila`);
        this.editMode = true;
      },

      err => {
        this.snackBar.open(err.error ? JSON.stringify(err.error) : JSON.stringify(err), '', {
          duration: 5000
        });
      },
      () => {

        let snackbarMessage = '';
        if (this.blogPost.published) {
          snackbarMessage = 'Sucessfully Published Blog';
        }


        else {
          snackbarMessage = 'Sucessfully Saved Blog';
        }


        let snackBarRef = this.snackBar.open(snackbarMessage, 'View Blog', {
          duration: 3000
        });

        snackBarRef.onAction().subscribe(
          () => {
            if (this.blogPost.slug) {
              this.router.navigate(['blog', this.blogPost.user.username, this.blogPost.slug]);
            }

          },
          err => {
          }
        )


      }
    )


  }

  titleToSlug(slugInput: HTMLInputElement) {


    this.blogPost.slug = this.convertToSlug(this.blogPost.title);
  }

  scrollToElement(elementSelector: string) {
    $('html, body').animate({scrollTop: $(elementSelector).offset().top}, 1000);
  }

  uploadPicture(uploadPicInput: HTMLInputElement) {


    if (!this.blogPost.id) {
      this.snackBar.open('Save Blog Before Uploading Picture', '', {
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
      model: 'BlogPost',
      id: this.blogPost.id,
      fieldName: 'header_image_url'
    };


    // the path where the file should be saved on firebase
    this.pictureFile.path = 'blogs/' + this.blogPost.id + '/' + 1 + '/';
    this.pictureFile.path = `blogs/${this.blogPost.id}/header_image_url/`;
    this.pictureFile.path = this.pictureFile.path + this.pictureFile.name;

    if (!isNaN(this.userId)) {
      this.pictureFile.metadata['owner'] = this.userId;
    }
    this.firebaseService.fileUpload(this.pictureFile)
      .subscribe(
        res => {

          let uploadTask = res;

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: any) => {
              this.uploadProgress = (uploadTask.snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            },
            (error) => {
              this.snackBar.open(error.message, '', {
                duration: 5000
              });
            },
            () => {

              this.blogPost.header_image_url = uploadTask.snapshot.downloadURL;
              this.uploadProgress = null;
              this.saveBlog(false);

            });
        },
        err => {
          this.snackBar.open(err, '', {duration: 3000});
        },
      )


  }


  convertToSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      ;
  }
}

