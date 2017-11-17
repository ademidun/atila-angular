import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

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
  constructor(private http: HttpClient,
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
       .catch((error: any) => Observable.throw(error));
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
        decryptedValue = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedValue;
      }
         
        return null;
   }

   private extractToken(res: HttpResponse<any>) {
    this.token = res['token'];
    return res || { };
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

      return this.http.get(`${this.apiKeyUrl}?api-key-name=${apiKey}`)
      .map(this.extractData)
      .catch(this.handleError);
    }

    private extractData(res: Response) {
      console.log('private extractData res', res);
      return res;

    }

    private handleError (error: Response | any) {
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
  initializeSecretKey(forceInsert=false){

    if (forceInsert || !localStorage.getItem('xkcd')) {
      this.secretKey = this.randomString(16);
      this.secretKey = CryptoJS.AES.encrypt(this.secretKey,'dante').toString();
      localStorage.setItem('xkcd', this.secretKey);
    }

    this.secretKey = localStorage.getItem('xkcd');
    this.secretKey = CryptoJS.AES.decrypt(this.secretKey, 'dante').toString(CryptoJS.enc.Utf8);
    

  }

}


export function handleError (error: Response | any) {

  return Observable.throw(error);
}

export function extractData(res: Response | any) {
  let body = res.json();
  console.log('authservice extractData res: ', res);
  console.log('authservice body: ', body);
  return body;

}
