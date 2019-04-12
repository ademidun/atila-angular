import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';

import 'rxjs/add/operator/take';
import {Scholarship} from '../_models/scholarship';
import {UserProfile} from '../_models/user-profile';
import {DatePipe} from '@angular/common';
import {SwPush} from '@angular/service-worker';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import * as $ from 'jquery';
import {ScholarshipService} from './scholarship.service';

@Injectable()
export class NotificationsService {

  readonly VAPID_PUBLIC_KEY = 'BAjiETJuDgtXH6aRXgeCZgK8vurMT7AbFmPPhz1ybyfcDmfGFFydSXkYDC359HIXUmWw8w79-miI6NtmbfodiVI';

  constructor(
    public db: AngularFireDatabase,
    public datePipe: DatePipe,
    public swPush: SwPush,
    public http: HttpClient) {
  }

  getPermission() {
    if (this.swPush.isEnabled) {
      return this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
    }

  }

  pushMessages(messagesList) {

    return this.http.post(`${environment.atilaMicroservicesApiUrlNode}notifications/save-notifications/`, messagesList);

  }

  createScholarshipNotifications(userProfile: UserProfile, scholarship: Scholarship) {

    return this.getPermission().then((sub: PushSubscription) => {

        $('#dimScreen').css('display', 'none');
        const notificationMessage = this.createScholarshipNotificationMessage(userProfile, scholarship);

        const fullMessagePayload = {...sub, ...notificationMessage};

        fullMessagePayload['endpoint'] = sub.endpoint;
        fullMessagePayload['_sub'] = sub;
        fullMessagePayload['_notificationMessage'] = notificationMessage;

        console.log({fullMessagePayload});
        return this.pushMessages([fullMessagePayload])
          .map(res => res)
          .catch(err => Observable.throw(err));
      },
    )
      .catch((err: DOMException) => {
        return Observable.throw({
          message: 'Unable to createScholarshipNotifications()',
          error: {
            message: err.message,
            name: err.name,
          }
        })
      });
  }

  createScholarshipNotificationMessage(userProfile: UserProfile, scholarship: Scholarship) {
    let sendDate: Date | number = new Date(scholarship.deadline);

    sendDate.setDate(sendDate.getDate() - 7);
    sendDate = sendDate.getTime();

    const messageData = {
      title: `${scholarship.name} is due in 7 days on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}`,
      body: `The ${scholarship.name} you saved is due on: ${this.datePipe.transform(scholarship.deadline, 'fullDate')}.
       Submit your Application!`,
      clickAction: `https://atila.ca/scholarship/${scholarship.slug}?utm_source=push_notification`,
      // todo: user scholarship.img_url, for now use Atila Logo to build brand awareness
      image: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      icon: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      badge: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      sendDate: sendDate,
    };

    messageData['actions'] = [
      {
        action: 'view', title: 'View Scholarship',
        icon: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png'
      },
    ];


    return messageData;
  }
}

export let NotificationsServiceStub : Partial<NotificationsService> = {
};
