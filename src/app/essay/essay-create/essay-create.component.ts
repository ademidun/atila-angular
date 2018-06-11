import { Component, OnInit, AfterViewInit, EventEmitter, OnDestroy, Input,Output, ChangeDetectorRef } from '@angular/core';
import { UserProfile } from '../../_models/user-profile';

import { UserProfileService } from '../../_services/user-profile.service';
import { MatSnackBar } from '@angular/material';

import { ActivatedRoute, Router } from '@angular/router';

import { UploadFile } from '../../_models/upload-file';

import { AuthService } from "../../_services/auth.service";

import { Observable } from 'rxjs/Observable';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {Title} from '@angular/platform-browser';

import {environment} from '../../../environments/environment';

import * as firebase from "firebase";
// https://go.tinymce.com/essay/angular-2-and-tinymce/
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
import {Essay} from '../../_models/essay';
import {EssayService} from '../../_services/essay.service';
import {toTitleCase, cleanHtml} from '../../_shared/utils';
@Component({
  selector: 'app-essay-create',
  templateUrl: './essay-create.component.html',
  styleUrls: ['./essay-create.component.scss']
})
export class EssayCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  editorId = "post-editor";
  essay:Essay;
  userProfile: UserProfile;
  userId: number;
  extraEssayOptions =false;

  essayFile: UploadFile;
  uploadProgress: number;
  editor: any;
  editMode=false;
  options: Object;
  isLoggedIn: boolean;
  enivronment = environment;
  toTitleCase = toTitleCase;

  constructor(public ref:ChangeDetectorRef,
              public userProfileService: UserProfileService,
              public essayService: EssayService,
              public authService: AuthService,
              public router: Router,
              public snackBar: MatSnackBar,
              public route: ActivatedRoute,
              public firebaseService: MyFirebaseService,
              public titleService: Title,) {

    this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
    // this.options = {
    //     placeholder: "Share your thoughts",
    //     events : {
    //       'froalaEditor.focus' : function(e, editor) {
    //       }
    //     },
    //   heightMin: 200,
    //   }
  }

  ngOnInit() {

    let essayId = this.route.snapshot.params['id'];

    if(isNaN(this.userId)){

      setTimeout( () => {
        this.snackBar.open('Please Log In','',{duration: 3000});
      });


      this.essay = new Essay(0);
    }
    else{
      this.essay = new Essay(this.userId);
    }
    if(essayId){
      this.editMode = true;
      this.essayService.getById(essayId).subscribe(
        res => {
          this.essay = <any>res;
          if (this.userId!=this.essay.user.id && this.enivronment.adminIds.indexOf(this.userId) < 0) {
            this.router.navigate(['/login']);
          }
          if(this.editor){
            tinymce.get(this.editorId).setContent(this.essay.body);
          }
        },
        err => this.snackBar.open(err,'',{duration: 3000})
      )
    }

    else{

      //todo use an example of one of my uni applications
      this.essay.body = `Copy and Paste Your Essay Here. Including Questions`;
    }
    if (!isNaN(this.userId)){
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
      plugins: ['link', 'table','toc','preview','lists','media','autolink','code'],
      toolbar: 'undo redo | styleselect | bold italic | link image | fontsizeselect | numlist bullist',
      skin_url: '/assets/skins/light',
      height : "500",
      invalid_elements : 'script,style',
      default_link_target: "_blank",
      invalid_styles: {
        '*': 'padding background-color', // Global invalid styles
        // 'a': 'background' // Link specific invalid styles
      },
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', (e) => {
          const content = editor.getContent();
          this.onEditorContentChange(e,content, editor);
        });
        editor.on('paste', (e) => {
          console.log('editor.on(\'paste\', (e)',editor, e);
          setTimeout(() => {
          let content = editor.getContent();
          content = cleanHtml(content);
          this.onEditorContentChange(e,content, editor);
          editor.setContent(content);
          }, 300);

        });
      },
      init_instance_callback : (editor) => {

        if(this.essay.body){ //body may not be loaded from server yet
          editor.setContent(this.essay.body);
        }
        this.editor = editor;
      },
      paste_preprocess : (pl, o) => {
        console.log('paste_preprocess', pl, o);
        o.content = cleanHtml(o.content);
        this.essay.body = o.content;
      },
    });

  }
  onEditorContentChange(event:any, content:any, editor: any){

    if((<KeyboardEvent>event).keyCode == 13) {



      this.essay.body = content;

    }
    this.essay.body = content;
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


  saveEssay(isPublished:boolean){


    //if the essay has already been published, keep the publication status.
    this.essay.published = isPublished;

    let postOperation: Observable<any>;

    if(this.editMode){

      //change author from dict to ID to match API pattern
      this.essay.user = this.essay.user.id;
      postOperation = this.essayService.update(this.essay.id,this.essay);
    }
    else{

      postOperation = this.essayService.create(this.essay);
      this.editMode = true;
      this.titleService.setTitle(`Edit Essay - ${this.essay.title} - Atila`);
    }

    postOperation.subscribe(
      res => {
        this.essay = res
      },

      err => {
        console.log('essay, err',this.essay, err);
        this.snackBar.open('Error: '+ JSON.stringify(err.error),'', {
          duration: 5000
        });
      },
      () => {

        let snackbarMessage = '';
        if (this.essay.published){
          snackbarMessage = "Sucessfully Published Essay";
        }


        else {
          snackbarMessage = "Sucessfully Saved Essay";
        }


        let snackBarRef = this.snackBar.open(snackbarMessage, 'View Essay', {
          duration: 3000
        });

        snackBarRef.onAction().subscribe(
          () => {
            if (this.essay.slug) {
              this.router.navigate(['essay',this.essay.user.username,this.essay.slug]);
            }

          },
          err =>  {}
        )




      }
    )


  }

  titleToSlug(slugInput: HTMLInputElement){


    this.essay.slug = this.convertToSlug(this.essay.title);
  }

  scrollToElement(elementSelector: string) {
    $("html, body").animate({scrollTop: $(elementSelector).offset().top}, 1000);
  }

  uploadEssay(uploadPicInput:HTMLInputElement){


    if(!this.essay.id){
      this.snackBar.open("Save Essay Before Uploading Picture", '', {
        duration: 3000
      });
      return;
    }

    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.


    var uploadEssayFile = uploadPicInput.files[0];


    this.essayFile = new UploadFile(uploadEssayFile);

    // Instructions on how the file should be saved to the database
    this.essayFile.uploadInstructions = {
      type: 'update_model',
      model: "Essay",
      id: this.essay.id,
      fieldName: 'header_image_url'
    };


    // the path where the file should be saved on firebase
    this.essayFile.path = `user-profiles/${this.userId}/essays/${this.essay.id}/`;
    this.essayFile.path = this.essayFile.path + this.essayFile.name;

    if(!isNaN(this.userId)) {
      this.essayFile.metadata['owner'] = this.userId;
    }
    this.firebaseService.fileUpload(this.essayFile)
      .subscribe(
        res => {

          let uploadTask = res;

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot:any) => {
              this.uploadProgress = (uploadTask.snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            },
            (error)=> {
              this.snackBar.open(error.message,'', {
                duration: 5000
              });
            },
            () => {

              this.essay.essay_source_url = uploadTask.snapshot.downloadURL;
              this.uploadProgress = null;
              this.saveEssay(false);

            });
        },
        err => {
          this.snackBar.open(err,'',{ duration: 3000});
        },
      )



  }


  convertToSlug(text){
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-')
      ;
  }
}
