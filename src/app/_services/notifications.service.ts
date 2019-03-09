import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

import 'rxjs/add/operator/take';
import {Scholarship} from '../_models/scholarship';
import {UserProfile} from '../_models/user-profile';
import {DatePipe} from '@angular/common';
import {SwPush} from '@angular/service-worker';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import * as admin from 'firebase-admin';
import NotificationMessagePayload = admin.messaging.NotificationMessagePayload;
import {Observable} from 'rxjs/Observable';

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

  pushMessage(messageData) {

    return this.http.post(environment.atilaMicroservicesApiUrl, messageData);

  }

  createScholarshipNotifications(userProfile: UserProfile, scholarship: Scholarship) {

    return this.getPermission().then((sub: PushSubscription) => {

        console.log({sub});

        const notificationMessage = this.createScholarshipNotificationMessage(userProfile, scholarship);

        const fullMessagePayload = {...sub, ...notificationMessage};
        return this.pushMessage(fullMessagePayload)
          .map(res => res)
          .catch(err => Observable.throw(err));
      },
    )
      .catch((err: DOMException) => {
        console.log('Unable to createScholarshipNotifications()', err);
        console.log('Unable to createScholarshipNotifications()', err.message);
        return Observable.throw({
          message: 'Unable to createScholarshipNotifications()',
          error: JSON.stringify(err),
        })
      });
  }

  createScholarshipNotificationMessage(userProfile: UserProfile, scholarship: Scholarship) {
    let sendDate: Date | number = new Date(scholarship.deadline);

    sendDate.setDate(sendDate.getDate() - 7);
    sendDate = sendDate.getTime();

    const messageData = {
      title: `${scholarship.name} is due in 7 days on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}`,
      body: `The ${scholarship.name} you saved is due on: ${scholarship.deadline}. Submit your Application!`,
      clickAction: `https://atila.ca/scholarship/${scholarship.slug}?utm_source=push_notification`,
      // sendDate: sendDate,
    };

    return messageData;
  }
}
