import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { UploadFile } from '../_models/upload-file';
import * as firebase from "firebase";
import {environment} from '../../environments/environment';
import { AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from './auth.service';

@Injectable()
export class MyFirebaseService {


  public apiKeyUrl = environment.apiUrl + 'api-keys/';
  public saveFirebaseUrl = environment.apiUrl + 'save-firebase/';
  constructor(public http: HttpClient,
              private db: AngularFireDatabase,
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
        },
        done => {

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

      },
      done => {

      });


  }

  saveSearchAnalytics(queryData) {

    queryData = this.addMetadata(queryData);

    return $.getJSON('//freegeoip.net/json/?callback=?',
      data => {
        queryData.geo_ip = data;
        return this.db.list('search_analytics/queries').push(queryData);

      },
      done => {

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
        },
        done => {

        });
    }
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
  fileUpload(uploadFile: UploadFile){
    /**
     * Upload handler which gets the Firebase API keys before we upload the file.
     */
    let fileSize = uploadFile.file.size / 1024 / 1024; // in MB
    if (fileSize > 25) {
      return Observable.throw('File size must be less than 25 MB.');
    }

    console.log('uploadFile', uploadFile);
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
    };
    console.log('uploadFileFirebase', uploadRef);

    return uploadRef.put(uploadFile.file, metadata);


  }

}
