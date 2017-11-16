import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthService {

  private loginUrl = 'http://127.0.0.1:8000/login/';
  private userUrl = 'http://127.0.0.1:8000/users/';
  private usernameUrl = 'http://127.0.0.1:8000/user-name/';
  private apiKeyUrl = 'http://127.0.0.1:8000/api-keys/';
  public  isLoggedIn: boolean = false; //should this be private or protected?
  token: string;
  constructor(private http: Http) {
    this.token = localStorage.token;
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
