import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { UploadFile } from '../_models/upload-file';
import * as firebase from "firebase";
import {environment} from '../../environments/environment';
import { AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class MyFirebaseService {


  public apiKeyUrl = environment.apiUrl + 'api-keys/';
  public saveFirebaseUrl = environment.apiUrl + 'save-firebase/';
  constructor(public http: HttpClient,
              private db: AngularFireDatabase) {

  }

  addSubscriber(subscriber) {

    if (subscriber) {
      subscriber = this.addMetadata(subscriber);
      return this.db.list('email_subscribers').push(subscriber);
    }


  }

  saveUserAnalytics(user, path?) {

    user = this.addMetadata(user);
    const customPath = path ? 'user_analytics/'+ path  : 'user_analytics/general';
    return this.db.list(customPath).push(user);
  }

  saveSearchAnalytics(queryData) {

    queryData = this.addMetadata(queryData);

    return $.getJSON('//freegeoip.net/json/?callback=?',
      data => {
        queryData.geo_ip = data;
        this.db.list('search_analytics').push(queryData);

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

        },
        done => {

        });
    }
  }

  //reference: https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
  uploadFile(uploadFile: UploadFile, uploadInstructions: any): Observable<any>{


    //1. Get the API keys used to configure firebase from backend database.

    //2. Then, use those key to upload the files to firebase and return the results of the uploads

    return this.getAPIKey("FIREBASE_CONFIG_KEYS")
    .map(res => this.uploadFileFirebase(res, uploadFile,uploadInstructions))
    .catch(this.handleError)

  }

  uploadFileFirebase(res: Response, uploadFile: UploadFile, uploadInstructions: any){


        let config;
        config = res['api_key'];

        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }

        uploadFile.name = config.toString();
        //why does google documentation use var instead of ref

        //preparing the firebase storage for upload
        var storage = firebase.storage();
        let storageRef = storage.ref();
        let uploadRef = storageRef.child(uploadFile.path);
        var metadata = {
          contentType: uploadFile.file.type,
          size: uploadFile.file.size,
          name: uploadFile.file.name,
        };

        var uploadTask = uploadRef.put(uploadFile.file, metadata);

        //https://firebase.google.com/docs/storage/web/upload-files?authuser=0

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
         (snapshot:any) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = ( snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        },
         (error)=> {
          this.handleError(error);
        },
         () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          //var downloadURL = uploadTask.snapshot.downloadURL;

           this.saveUploadResult(uploadTask.snapshot,uploadFile.uploadInstructions);
        });


  }

  saveUploadResult(uploadResult, uploadInstructions){



    let postData = {
      "uploadResult": uploadResult,
      "uploadInstructions": uploadInstructions,
    }

    return this.http.post(this.saveFirebaseUrl,postData)
    .map(this.extractData)
    .catch(this.handleError)

    // .map( res => )
    // .catch(this.handleError).subscribe(res =>

    //

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

    return data;
  }


  public extractData(res: HttpResponse<any>) {
    return res;

  }

  public handleError (error: Response | any) {
    return Observable.throw(error);
  }

}
