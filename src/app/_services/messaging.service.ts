import { Injectable } from '@angular/core';
import { Message } from '../_models/message';
import { Thread } from '../_models/thread';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import {environment} from '../../environments/environment';

@Injectable()
export class MessagingService {

  public messagesUrl = environment.apiUrl + 'messages/';
  public threadUrl = environment.apiUrl + 'threads/';
  public usersThreadsUrl = environment.apiUrl + 'user-threads/';

  constructor(public http: HttpClient) { }

  sendMessage(message: Message) {

    return this.http.post(this.messagesUrl, message)
        .map(res=><any>res)
        .catch(this.handleError);
  }

  getThreadMessages(id: number) {

    return this.http.get(`${this.threadUrl}${id}/messages/`)
        .map(res=><any>res)
        .catch(this.handleError);
  }

  getUsersThreads(id: number) {
    /**
     * Threads represent the 'conversations' that a user has.
     */
    return this.http.get(`${this.usersThreadsUrl}${id}/`)
        .map(res=><any>res)
        .catch(this.handleError);
  }

  getOrCreateThread(thread: Thread) {

    return this.http.post(this.threadUrl, thread)
        .map(res=><any>res)
        .catch(this.handleError);
  }

  public handleError (error: HttpErrorResponse | any) {

    return Observable.throw(error);
  }
}
