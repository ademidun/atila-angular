import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import * as CryptoJS from "crypto-js";
//import * as crypto from "crypto";
//ES6 style imports
//https://stackoverflow.com/questions/39415661/what-does-resolves-to-a-non-module-entity-and-cannot-be-imported-using-this

@Injectable()
export class AuthService {

  private loginUrl = 'http://127.0.0.1:8000/login/';
  private userUrl = 'http://127.0.0.1:8000/users/';
  private usernameUrl = 'http://127.0.0.1:8000/user-name/';
  private apiKeyUrl = 'http://127.0.0.1:8000/api-keys/';
  public  isLoggedIn: boolean = false; //should this be private or protected?
  public secretKey:string;
  token: string;
  constructor(private http: Http) {
    this.token = localStorage.token;
    this.secretKey = this.randomString(16);
    console.log('this.secretKey',this.secretKey);
   }
   
  
  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.isLoggedIn = false;
  }

  login(credentials: any) {
    console.log('auth.service this',this);
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
   public encryptlocalStorage(key:string, value: any, encoding ='utf8'){
     //base64 values must be converted to string first, before they can be saved

      console.log('key, CryptoJS.AES.encrypt(userId.toString(),this.secretKey).toString()',key, CryptoJS.AES.encrypt(value.toString(),this.secretKey).toString());
      var encryptedData = CryptoJS.AES.encrypt(value.toString(),this.secretKey).toString();
      localStorage.setItem(key,encryptedData);
     

     this.decryptLocalStorage(key, encoding);
    }

   public decryptLocalStorage(key:string, encoding?:string){
        var encryptedData = localStorage.getItem(key);
        console.log('key, this, encrpyteddata, secretKey', this, encryptedData, this.secretKey);
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
