import { Injectable } from '@angular/core';
import { Message } from '../_models/message';
import { Thread } from '../_models/thread';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MessagingService {

  public messagesUrl = 'https://1552b637.ngrok.io/api/messages/';
  public threadUrl = 'https://1552b637.ngrok.io/api/threads/';
  public usersThreadsUrl = 'https://1552b637.ngrok.io/api/user-threads/';

  constructor(public http: Http) { }

  sendMessage(message: Message) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers});

    return this.http.post(this.messagesUrl, message, options)
        .map((response: Response) => response.json())
        .catch(this.handleError);
  }

  getThreadMessages(id: number) {

    return this.http.get(`${this.threadUrl}${id}/messages/`)
        .map((response: Response) => response.json())
        .catch(this.handleError);
  }

  getUsersThreads(id: number) {
    /**
     * Threads represent the 'conversations' that a user has.
     */
    return this.http.get(`${this.usersThreadsUrl}${id}/`)
        .map((response: Response) => response.json())
        .catch(this.handleError);
  }

  getOrCreateThread(thread: Thread) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers});

    return this.http.post(this.threadUrl, thread, options)
        .map((response: Response) => response.json())
        .catch(this.handleError);
  }

  public handleError (error: Response | any) {
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
