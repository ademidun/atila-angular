import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Router } from '@angular/router'
import { Observable } from 'rxjs/Rx';
import * as CryptoJS from "crypto-js";
//import * as crypto from "crypto";
//ES6 style imports
//https://stackoverflow.com/questions/39415661/what-does-resolves-to-a-non-module-entity-and-cannot-be-imported-using-this

import { MdSnackBar } from '@angular/material';
@Injectable()
export class AuthService {

  private loginUrl = 'http://127.0.0.1:8000/login/';
  private userUrl = 'http://127.0.0.1:8000/users/';
  private usernameUrl = 'http://127.0.0.1:8000/user-name/';
  private apiKeyUrl = 'http://127.0.0.1:8000/api-keys/';
  public  isLoggedIn: boolean = false; //should this be private or protected?
  public secretKey:string;
  token: string;
  constructor(private http: Http,
              private snackBar: MdSnackBar,
              private router: Router,) {
    this.token = localStorage.token;

    this.initializeSecretKey();
   }
   
  
  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    
    // there should always be a secret key available even after you clear local storage
    this.initializeSecretKey(true);

    this.isLoggedIn = false;
  }

  login(credentials: any) {
    return this.http.post(this.loginUrl, credentials)
       .map(this.extractToken)
       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   //https://stackoverflow.com/questions/35739791/encrypting-the-client-side-local-storage-data-using-angularjs
   /**
    * Encrypt a certain value berfore placing it in Local storage pseudocode = localstorage.setItem(key, encrypy(secretKey, value))
    * @param key 
    * @param value 
    */
   public encryptlocalStorage(key:string, value: any){
     //base64 values must be converted to string first, before they can be saved
      this.initializeSecretKey();

      var encryptedData = CryptoJS.AES.encrypt(value.toString(),this.secretKey).toString();
      localStorage.setItem(key,encryptedData);
     
     this.decryptLocalStorage(key);

    }

   public decryptLocalStorage(key:string){

      var encryptedData = localStorage.getItem(key);

      var decryptedValue = '';
      if (encryptedData){
        //var encoder = encoding == 'base64'? CryptoJS.enc.Base64 : CryptoJS.enc.Utf8;
        console.log('CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8)',CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8));

        decryptedValue = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedValue;
      }
         
        return null;
   }

   private extractToken(res: Response) {
    let body = res.json();
    this.token = body.token;
    return body || { };
    }

    public getToken(): string {
      return localStorage.getItem('token');
    }

    getUser(userId: any){
      return this.http.get(`${this.usernameUrl}?user-id=${userId}/`)
      .map(this.extractData)
      .catch(this.handleError);
    }


    getAPIKey(apiKey: any){
      console.log('auth.service.getAPIKey, apiKey: ', apiKey);
      return this.http.get(`${this.apiKeyUrl}?api-key-name=${apiKey}`)
      .map(this.extractData)
      .catch(this.handleError);
    }

    private extractData(res: Response) {
      let body = res.json();
      console.log('scholarshipService res: ', res);
      console.log('scholarshipService body: ', body);
      return body || { };

    }

    private handleError (error: Response | any) {
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

   randomString(length) {
     var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  /**
   * Always have a randomly generated key available for encrypting local storage values. Maintain the keys between browser refresh.
   */
  initializeSecretKey(forceInsert=false){
    console.log("forceInsert, localStorage.getItem('xkcd')", forceInsert, localStorage.getItem('xkcd'));

    if (forceInsert || !localStorage.getItem('xkcd')) {
      this.secretKey = this.randomString(16);
      this.secretKey = CryptoJS.AES.encrypt(this.secretKey,'dante').toString();
      localStorage.setItem('xkcd', this.secretKey);
    }

    this.secretKey = localStorage.getItem('xkcd');
    this.secretKey = CryptoJS.AES.decrypt(this.secretKey, 'dante').toString(CryptoJS.enc.Utf8);
    
    console.log("forceInsert, localStorage.getItem('xkcd'), this.secretKey", forceInsert, localStorage.getItem('xkcd'),this.secretKey);

  }

}


export function handleError (error: Response | any) {
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

export function extractData(res: Response) {
  let body = res.json();
  console.log('authservice extractData res: ', res);
  console.log('authservice body: ', body);
  return body || { };

}
