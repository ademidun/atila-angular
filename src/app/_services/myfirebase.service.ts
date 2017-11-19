import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UploadFile } from '../_models/upload-file';
import * as firebase from "firebase";


@Injectable()
export class MyFirebaseService {

  
  public apiKeyUrl = 'https://1552b637.ngrok.io/api/api-keys/';
  public saveFirebaseUrl = 'https://1552b637.ngrok.io/api/save-firebase/';
  constructor(public http: Http) { 

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


  public extractData(res: Response) {
    let body = res.json();
    
    
    return body || { };

  }

  public handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }  

}
