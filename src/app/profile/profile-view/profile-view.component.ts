import { Component, OnInit, AfterContentInit } from '@angular/core';
import { UserProfile } from '../../_models/user-profile';

import { UploadFile } from '../../_models/upload-file';
import { UserProfileService } from '../../_services/user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Title,DomSanitizer }     from '@angular/platform-browser';
import { AuthService } from "../../_services/auth.service";
import { MatSnackBar } from '@angular/material';


import { MessagingService } from '../../_services/messaging.service';

import { Thread } from '../../_models/thread';

import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import * as $ from 'jquery';
import {ApplicationService} from '../../_services/application.service';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {SCHOOLS_LIST} from '../../_models/constants';
import {SeoService} from '../../_services/seo.service';
import {BlogPost} from '../../_models/blog-post';
import {Essay} from '../../_models/essay';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, AfterContentInit {

  userProfile: UserProfile;
  userNameSlug: string;
  profileOwner: boolean;
  profilePicFile: UploadFile;
  uploadProgress: number;
  showPreview:boolean = false;
  userApplications: any;
  profile_pic_url;
  SCHOOLS_LIST = SCHOOLS_LIST;
  blogPosts: any[];
  essays: Essay[];

  currentUser:number;
  savedScholarships = [];

  myAtilaMode: boolean;
  constructor(
    route: ActivatedRoute,
    public userProfileService: UserProfileService,
    public titleService: Title,
    public snackBar: MatSnackBar,
    public authService: AuthService,
    public router: Router,
    public messagingService: MessagingService,
    public applicationService: ApplicationService,
    public sanitization: DomSanitizer,
    public firebaseService: MyFirebaseService,
    public seoService: SeoService,
  ) {
    this.userNameSlug = route.snapshot.params['username'];
  }

  ngOnInit() {

    this.userProfileService.getByUsername(this.userNameSlug).subscribe(
      res => {
        this.userProfile = res;



        this.titleService.setTitle(this.userProfile.first_name + " " +this.userProfile.last_name +"'s Profile" +' - Atila');

        let description = `${this.userProfile.first_name} ${this.userProfile.last_name} ${this.userProfile.title}
         ${this.userProfile.post_secondary_school || this.userProfile.secondary_school}`;
        this.seoService.generateTags({
          title: this.userProfile.first_name + " " +this.userProfile.last_name +"'s Profile",
          description: description,
          image: this.userProfile.profile_pic_url,
          slug: `profile/${this.userProfile.username}/`
        });

        this.currentUser = parseInt(this.authService.decryptLocalStorage('uid')); // Current user
        this.profileOwner = (this.currentUser == this.userProfile.user);

        this.profile_pic_url = this.sanitization.bypassSecurityTrustStyle(`url(${this.userProfile.profile_pic_url})`);

        this.getBlogs();
        if(this.profileOwner) {
          this.userProfileService.getRouteDetail(this.userProfile.user,'scholarships').subscribe(
            res => {
              this.savedScholarships = res['scholarships'];

              this.savedScholarships.forEach(scholarship => {
                if (!this.userProfile.saved_scholarships_metadata[scholarship.id]) {
                  this.userProfile.saved_scholarships_metadata[scholarship.id] = {'notes':''};
                }
              });


            },
            error2 => {},
          );
          if (this.router.url.indexOf('my-atila') !== -1) {
            this.myAtilaMode = true;
          }
        }


      }
    )

    //hide the .mat-card-header text div


  }

  ngAfterContentInit() {
    // https://stackoverflow.com/questions/43934727/how-to-use-jquery-plugin-with-angular-4

    $('.mat-card-header-text').css('display','none');

  }

//TODO: Nov 5 implement profile pic upload
  uploadProfilePic(uploadPicInput:HTMLInputElement){
    //let uploadOperation: Observable<any>;

    //create Upload file and configure its properties before uploading.

    var uploadPicFile = uploadPicInput.files[0];

    this.profilePicFile = new UploadFile(uploadPicFile);

    // Instructions on how the file should be saved to the database
    this.profilePicFile.uploadInstructions = {
      type: 'update_model',
      model: "UserProfile",
      id: this.userProfile.user,
      fieldName: 'profile_pic_url'
    };


    // the path where the file should be saved on firebase
    this.profilePicFile.path = "user-profiles/" + this.userProfile.user+ "/profile-pictures/";

    if(this.userProfile.metadata['test_mode']) {

      this.profilePicFile.path = "user-profiles/" + 777+ "/profile-pictures/";
    }

    this.profilePicFile.path = this.profilePicFile.path + this.profilePicFile.name;

    this.profilePicFile.metadata = {
      'owner': this.userProfile.user,
    };

    this.firebaseService.fileUpload(this.profilePicFile)
    .subscribe(
      res => {

        let uploadTask = res;
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot:any) => {
            this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          },
          (error)=> {
            this.snackBar.open('Upload Error','',{ duration: 3000});
            this.uploadProgress = null;
          },
          () => {

            this.userProfile.profile_pic_url = uploadTask.snapshot.downloadURL;
            this.uploadProgress = null;
            this.saveProfile();

          });
      },
    err => {
                  this.showSnackBar(err,'', 3000);
                },
    )

  }


  saveProfile(){

    this.userProfile.metadata['stale_cache'] = true;
    this.userProfileService.updateHelper(this.userProfile)
    .subscribe(
      data => {
        this.showSnackBar("Succesfully Updated Your Profile",'', 3000);
        this.userProfile = data;
      },
      err => {
        this.showSnackBar('Profile updated unsuccessfully - ' + err.error,'', 3000);
      }
    )
  }


  showSnackBar(text: string, action = '', duration: number) {
    this.snackBar.open(text, action, {
      duration: duration
    });
  }

  getApplications() {

    if(!this.userApplications){
      this.userProfileService.getApplications(this.userProfile.user)
        .subscribe(
          res => {
            this.userApplications = res.applications;
          },
        )
    }

  }

  getBlogs(options?: {}) {

    if(!this.blogPosts){
      this.userProfileService.getDetail(this.userProfile.user,'blogs')
        .subscribe(
          res => {
            this.blogPosts = res.blogs;

            this.blogPosts = this.blogPosts.map( blog => {
              blog = {
                title: blog.title,
                description: blog.description,
                slug: `/blog/${blog.user.username}/${blog.slug}`,
                image: blog.header_image_url,
                user: blog.user,
              };
              return blog;
            })
          },

        )
    }

    return;
  }

  getContent(options: any ={}) {
    if (options.contentType='essays') {
      if(!this.essays){
        this.userProfileService.getDetail(this.userProfile.user,'essays')
          .subscribe(
            res => {
              this.essays = res.essays;

              this.essays = this.essays.map( essay => {
                essay = {
                  title: essay.title,
                  description: essay.description,
                  slug: `/essay/${essay.user.username}/${essay.slug}`,
                  user: essay.user,
                };
                return essay;
              })
            },

          )
      }

      return;
    }
    else if (options.contentType='essays') {

    }
  }

  saveMyAtila(objectType, atilaObject, index?) {

    if (objectType=='application') {
      let tempObject = Object.assign({}, atilaObject);
      delete tempObject.scholarship;
      this.applicationService.update(tempObject)
        .subscribe(
          res => {
            this.showSnackBar("Succesfully Updated Your Profile",'', 3000);
          },
          err => {
            this.showSnackBar("Error saving profile.",'', 3000);}
        )
    }

    if (objectType=='scholarship') {
      this.saveProfile();
    }
  }

  message() {
    let thread = new Thread([this.currentUser, this.userProfile.user]);
    this.messagingService.getOrCreateThread(thread)
      .subscribe(
        res => {

          //todo assosciate a username with a thread
          // this.router.navigate(['messages', this.currentUser]);
          this.router.navigate(['messages']);
        },
        err => {

        }
      )
  }


  typeaheadEvent(event) {
    this.userProfile[event.type] = event.event.item;
  }

}
