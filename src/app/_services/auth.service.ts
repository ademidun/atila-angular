import {Injectable} from '@angular/core';

import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

import {Router} from '@angular/router'
import {Observable} from 'rxjs/Observable';
import * as CryptoJS from 'crypto-js';
//import * as crypto from "crypto";

import * as firebase from 'firebase';
//ES6 style imports
//https://stackoverflow.com/questions/39415661/what-does-resolves-to-a-non-module-entity-and-cannot-be-imported-using-this

import {map, filter, catchError, timeout, flatMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {

  public loginUrl = environment.apiUrl + 'login/';
  public userUrl = environment.apiUrl + 'users/';
  public usernameUrl = environment.apiUrl + 'user-name/';
  public apiKeyUrl = environment.apiUrl + 'api-keys/';
  public authUrl = environment.apiUrl + 'auth/';
  public redirectUrl = null;
  public isLoggedIn: boolean = false; //should this be public or protected?
  public secretKey: string;
  token: string;
  public username: string;

  constructor(public http: HttpClient,
              public snackBar: MatSnackBar,
              public router: Router,) {
    this.token = localStorage.token;

    this.initializeSecretKey();

    if (localStorage.getItem('username')) {
      this.username = this.decryptLocalStorage('username');
    }

  }


  logout() {
    // remove user from local storage to log user out
    localStorage.clear();

    // there should always be a secret key available even after you clear local storage
    this.initializeSecretKey(true);
    this.isLoggedIn = false;
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }

  login(credentials: any) {
    return this.http.post(this.loginUrl, credentials)
      .map(res => {

        const data: any = res;

        this.encryptlocalStorage('token', data.token);
        this.encryptlocalStorage('firebase_token', data.firebase_token);

        this.username = data.username;

        // this.cookieService.putObject('userId', data.id);
        this.encryptlocalStorage('uid', data.id);
        this.encryptlocalStorage('username', data.username);

        this.isLoggedIn = true;
        try {
          firebase.auth().signInWithCustomToken(data.firebase_token)
            .then(res2 => {

            })
            .catch(error => {
              // Handle Errors here.

            });
        }
        catch (err) {

        }
        return res;
      })
      .catch(this.handleError);
  }

  //https://stackoverflow.com/questions/35739791/encrypting-the-client-side-local-storage-data-using-angularjs
  /**
   * Encrypt a certain value berfore placing it in Local storage pseudocode = localstorage.setItem(key, encrypy(secretKey, value))
   * @param key
   * @param value
   */
  public encryptlocalStorage(key: string, value: any) {
    //base64 values must be converted to string first, before they can be saved
    this.initializeSecretKey();

    var encryptedData = CryptoJS.AES.encrypt(value.toString(), this.secretKey).toString();
    localStorage.setItem(key, encryptedData);

    this.decryptLocalStorage(key);

  }

  public decryptLocalStorage(key: string) {

    let encryptedData = localStorage.getItem(key);

    let decryptedValue = '';
    if (encryptedData) {
      decryptedValue = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
      return decryptedValue;
    }

    return null;
  }


  isUserLoggedIn(): boolean {
    try {
      return !isNaN(parseInt(this.decryptLocalStorage('uid')));
    }

    catch (err) {
      return false;
    }
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  getUser(userId: any) {
    return this.http.get(`${this.usernameUrl}?user-id=${userId}/`)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getAPIKey(apiKey: any) {

    return this.http.get(`${this.apiKeyUrl}?api-key-name=${apiKey}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public extractData(res: Response) {
    return res;

  }

  public handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    return Observable.throw(error);
  }

  randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  /**
   * Always have a randomly generated key available for encrypting local storage values. Maintain the keys between browser refresh.
   */
  initializeSecretKey(forceInsert = false) {

    if (forceInsert || !localStorage.getItem('xkcd')) {
      this.secretKey = this.randomString(16);
      this.secretKey = CryptoJS.AES.encrypt(this.secretKey, 'dante').toString();
      localStorage.setItem('xkcd', this.secretKey);
    }

    this.secretKey = localStorage.getItem('xkcd');
    this.secretKey = CryptoJS.AES.decrypt(this.secretKey, 'dante').toString(CryptoJS.enc.Utf8);


  }

  hashFileName(fileName, length = 8, appendTimeStamp = true) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

    result = appendTimeStamp ? result + '-' + Date.now().toString() + '-' + fileName : result + '-' + fileName;

    return result;

  }

}


export function handleError(error: Response | any) {

  return Observable.throw(error);
}

export function extractData(res: Response | any) {
  let body = res.json();


  return body;

}

export function hashFileName(fileName, length = 8, appendTimeStamp = true) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

  result = appendTimeStamp ? result + '-' + Date.now().toString() + '-' + fileName : result + '-' + fileName;

  return result;

}

export let AuthServiceStub: Partial<AuthService> = {
  loginUrl: environment.apiUrl + 'login/',

  decryptLocalStorage: key => {
    const localStorageTestDict = {
      'uid': -1
    };

    return localStorageTestDict[key]
  }
};
