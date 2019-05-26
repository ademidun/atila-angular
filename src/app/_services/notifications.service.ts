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
    console.log('this.swPush', this.swPush);

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

    let getPermissionPromise: Promise<PushSubscription | any> = this.getPermission();

    if (environment.name === 'dev') { // todo: remove before merge-master
      getPermissionPromise = Promise.reject({error: 'Permission Denied!'});
    }

    return getPermissionPromise
      .then((sub: PushSubscription|any) => {

      console.log({ sub });

        $('#dimScreen').css('display', 'none');

        // todo notificationOptions will be based on userProfile preferences
        const notificationOptions = {
          'email': [7, 1], // each array element represents the number of days before the scholarship deadline a notification should be sent
          'push': [7, 1]
        };

        const fullMessagePayloads = this.customizeNotificationMessage(notificationOptions, scholarship, userProfile, sub);

        console.log({fullMessagePayloads});
        return this.pushMessages(fullMessagePayloads)
          .map(res => res)
          .catch(err => Observable.throw(err));
      })
      .catch((err: DOMException) => {
        console.log({ err });
        // todo notificationOptions will be based on userProfile preferences
        const notificationOptions = {
          'email': [7, 1], // each array element represents the number of days before the scholarship deadline a notification should be sent
        };

        const fullMessagePayloads = this.customizeNotificationMessage(notificationOptions, scholarship, userProfile);

        console.log({fullMessagePayloads});
        return this.pushMessages(fullMessagePayloads)
          .map(res => res)
          .catch(err2 => Observable.throw(err2));
      });
  }

  customizeNotificationMessage(notificationOptions,
                               scholarship: Scholarship, userProfile: UserProfile, sub: PushSubscription | any ={}) {
    const fullMessagePayloads = [];

    for (const notificationType of Object.keys(notificationOptions)) {
      if (!notificationOptions.hasOwnProperty(notificationType)) {
        continue;
      }
      for (let i = 0; i < notificationOptions[notificationType].length; i++) {
        const daysBeforeDeadline = notificationOptions[notificationType][i];

        let sendDate: Date | number = new Date(scholarship.deadline);

        sendDate.setDate(sendDate.getDate() - daysBeforeDeadline);
        sendDate = sendDate.getTime();

        const notificationConfig = {notificationType: notificationType, sendDate: sendDate};
        const notificationMessage = this.createScholarshipNotificationMessage(userProfile, scholarship, notificationConfig);

        const fullMessagePayload = {...sub, ...notificationMessage};
        if (sub && sub.endpoint) {
          fullMessagePayload['endpoint'] = sub.endpoint;
          fullMessagePayload['_sub'] = sub;
        }

        fullMessagePayload['_notificationMessage'] = notificationMessage;
        fullMessagePayloads.push(fullMessagePayload);

      }
    }
    return fullMessagePayloads;
  }

  createScholarshipNotificationMessage(userProfile: UserProfile, scholarship: Scholarship,
                                       notificationConfig:
                                         { sendDate: number, notificationType: string} = {sendDate: 0, notificationType:''}) {

    const urlAnalyticsSuffix = `?utm_source=${notificationConfig.notificationType}
      &utm_medium=${notificationConfig.notificationType}&utm_campaign=scholarship-due-remind`;
    const messageData = {
      title: `${userProfile.first_name}, ${scholarship.name} is due in 7 days
       on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}`,
      body: `Scholarship due on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}: ${scholarship.name}.
       Submit your Application!`,
      clickAction: `https://atila.ca/scholarship/${scholarship.slug}/${urlAnalyticsSuffix}`,
      // todo: user scholarship.img_url, for now use Atila Logo to build brand awareness
      image: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      icon: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      badge: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      sendDate: notificationConfig.sendDate || 0,
      notificationType: notificationConfig.notificationType || 'push',
    };

    messageData['actions'] = [
      {
        action: `scholarship/${scholarship.slug}/${urlAnalyticsSuffix}`,
        title: 'View Scholarship',
        icon: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png'
      },
    ];


    return messageData;
  }
}

export let NotificationsServiceStub: Partial<NotificationsService> = {
};
