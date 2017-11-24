"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var firebase = require("firebase");
var environment_1 = require("../../environments/environment");
var MyFirebaseService = (function () {
    function MyFirebaseService(http) {
        this.http = http;
        this.apiKeyUrl = environment_1.environment.apiUrl + 'api-keys/';
        this.saveFirebaseUrl = environment_1.environment.apiUrl + 'save-firebase/';
    }
    //reference: https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
    MyFirebaseService.prototype.uploadFile = function (uploadFile, uploadInstructions) {
        //1. Get the API keys used to configure firebase from backend database.
        var _this = this;
        //2. Then, use those key to upload the files to firebase and return the results of the uploads
        return this.getAPIKey("FIREBASE_CONFIG_KEYS")
            .map(function (res) { return _this.uploadFileFirebase(res, uploadFile, uploadInstructions); })
            .catch(this.handleError);
    };
    MyFirebaseService.prototype.uploadFileFirebase = function (res, uploadFile, uploadInstructions) {
        var _this = this;
        var config;
        config = res['api_key'];
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        uploadFile.name = config.toString();
        //why does google documentation use var instead of ref
        //preparing the firebase storage for upload
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var uploadRef = storageRef.child(uploadFile.path);
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
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, function (error) {
            _this.handleError(error);
        }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            //var downloadURL = uploadTask.snapshot.downloadURL;
            _this.saveUploadResult(uploadTask.snapshot, uploadFile.uploadInstructions);
        });
    };
    MyFirebaseService.prototype.saveUploadResult = function (uploadResult, uploadInstructions) {
        var postData = {
            "uploadResult": uploadResult,
            "uploadInstructions": uploadInstructions,
        };
        return this.http.post(this.saveFirebaseUrl, postData)
            .map(this.extractData)
            .catch(this.handleError);
        // .map( res => )
        // .catch(this.handleError).subscribe(res =>
        //
    };
    MyFirebaseService.prototype.getAPIKey = function (apiKey) {
        apiKey = apiKey.toString();
        return this.http.get(this.apiKeyUrl + "?api-key-name=" + apiKey)
            .map(this.extractData)
            .catch(this.handleError);
    };
    MyFirebaseService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    MyFirebaseService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    MyFirebaseService = __decorate([
        core_1.Injectable()
    ], MyFirebaseService);
    return MyFirebaseService;
}());
exports.MyFirebaseService = MyFirebaseService;
