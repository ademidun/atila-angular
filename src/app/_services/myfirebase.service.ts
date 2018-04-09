import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { UploadFile } from '../_models/upload-file';
import * as firebase from "firebase";
import {environment} from '../../environments/environment';
import { AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from './auth.service';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

@Injectable()
export class MyFirebaseService {


  public apiKeyUrl = environment.apiUrl + 'api-keys/';
  public saveFirebaseUrl = environment.apiUrl + 'save-firebase/';
  constructor(public http: HttpClient,
              private db: AngularFireDatabase,
              public fs: AngularFirestore,
              public authService: AuthService) {

  }

  addSubscriber(subscriber) {

    if (subscriber) {

      subscriber = this.addMetadata(subscriber);
      return $.getJSON('//freegeoip.net/json/?callback=?',
        data => {
          subscriber = this.addMetadata(subscriber);
          subscriber.geo_ip = data;
          return this.db.list('email_subscribers').push(subscriber);
        })
        .fail((jqXHR, textStatus) => {
          return this.db.list('email_subscribers').push(subscriber);
        });

    }

  }

  saveUserAnalytics(user, path?) {
    return $.getJSON('//freegeoip.net/json/?callback=?',
      data => {
        user = this.addMetadata(user);
        user.geo_ip = data;
        const customPath = path ? 'user_analytics/'+ path  : 'user_analytics/general';

        return this.db.list(customPath).push(user);

      })
      .fail((jqXHR, textStatus) => {
        return this.db.list(path).push(user);
      });


  }

  saveSearchAnalytics(queryData) {

    queryData = this.addMetadata(queryData);

    return $.getJSON('//freegeoip.net/json/?callback=?',
      data => {
        queryData.geo_ip = data;
        return this.db.list('search_analytics/queries').push(queryData);

      })
      .fail((jqXHR, textStatus) => {
        return this.db.list('search_analytics/queries').push(queryData);
      });

  }

  saveAny(path, data) {
    data = JSON.stringify(data);
    data = JSON.parse(data);

    if(path) {
      data = this.addMetadata(data);
      data.timestamp = new Date().getTime();
      return $.getJSON('//freegeoip.net/json/?callback=?',
        res => {
          data.geo_ip = res;
          return this.db.list(path).push(data);
        })
        .fail((jqXHR, textStatus) => {
        return this.db.list(path).push(data);
        });
    }
  }

  saveAny_fs(path, data) {
    const collection: AngularFirestoreCollection<any> = this.fs.collection(path);
    const id = this.fs.createId();
    collection.doc(id).set(data);

    return id;
  }

  firestoreListen(path) {
    return this.fs.collection(path).valueChanges()
  }


  getAPIKey(apiKey: any){
    apiKey = apiKey.toString();
    return this.http.get(`${this.apiKeyUrl}?api-key-name=${apiKey}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  addMetadata(data) {
    data.timestamp = new Date().getTime();
    data.vendor = navigator.vendor;
    data.user_agent = navigator.userAgent;
    data.user_id = parseInt(this.authService.decryptLocalStorage('uid'));

    if (isNaN(data.user_id)) {
      delete data.user_id;
    }

    return data;
  }


  public extractData(res: HttpResponse<any>) {
    return res;

  }

  public handleError (error: Response | any) {
    return Observable.throw(error);
  }


  //reference: https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
  // toodo show snackbar error handler if upload fails

  //TODO refactor so user gets automatically resigned in to server without forcing re-signing in.
  fileUpload(uploadFile: UploadFile, options={}){



    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    let user = firebase.auth().currentUser;

    if (user) {
      // User is signed in.

    } else {
      // User is logged in to Atila but not Firebase
      if(this.authService.isLoggedIn && !options['demoMode'] ) {
        return Observable.throw('Session Expired. Please log in again.')
      }
    }

    /**
     * Upload handler which gets the Firebase API keys before we upload the file.
     */
    let fileSize = uploadFile.file.size / 1024 / 1024; // in MB
    if (fileSize > 25) {
      return Observable.throw('File size must be less than 25 MB.');
    }


    return this.authService.getAPIKey("FIREBASE_CONFIG_KEYS")
      .map(res => {
        return this.uploadFileFirebase(res, uploadFile)
      })
      .catch(err=>Observable.throw(err))
  }

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
    let storage = firebase.storage();
    let storageRef = storage.ref();
    let uploadRef = storageRef.child(uploadFile.path);
    let metadata = {
      contentType: uploadFile.file.type,
      size: uploadFile.file.size,
      name: uploadFile.file.name,
      customMetadata: uploadFile.metadata,
    };




    return uploadRef.put(uploadFile.file, metadata);


  }

}
