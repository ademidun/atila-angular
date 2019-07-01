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

  public DEFAULT_NOTIFICATION_CONFIG = {sendDate: 0, notificationType:'email', daysBeforeDeadline: 1};

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

    return this.http.post(`${environment.atilaMicroservicesNodeApiUrl}notifications/save-notifications/`, messagesList);

  }

  createScholarshipNotifications(userProfile: UserProfile, scholarship: Scholarship) {

    let getPermissionPromise: Promise<PushSubscription | any> = this.getPermission();

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

    const today = new Date();

    const scholarshipDeadline: Date | number = new Date(scholarship.deadline);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    for (const notificationType of Object.keys(notificationOptions)) {
      if (!notificationOptions.hasOwnProperty(notificationType)) {
        continue;
      }
      for (let i = 0; i < notificationOptions[notificationType].length; i++) {
        // don't create notification for scholarship if deadline was more than 1 day ago
        // or sendDate is more than 48 hours ago

        if (scholarshipDeadline.getTime() < yesterday.getTime()) {
          break
        }

        const daysBeforeDeadline = notificationOptions[notificationType][i];
        let sendDate: Date | number = new Date();
        // following line fails because if deadline is July 6 and current date is June 22
        // and sendDate is 1 day before Deadline, the send date will be June 5

        sendDate.setTime( scholarshipDeadline.getTime() - (daysBeforeDeadline * 86400000) );


        if (sendDate.getTime() < twoDaysAgo.getTime()) {
          continue;
        }

        sendDate = sendDate.getTime();
        const notificationConfig = {notificationType, sendDate, daysBeforeDeadline};
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
                                         { sendDate: number, notificationType: string, daysBeforeDeadline: number | string}
                                         = this.DEFAULT_NOTIFICATION_CONFIG) {

    let createdAt: Date | number = new Date(scholarship.deadline);

    createdAt = createdAt.getTime();

    const urlAnalyticsSuffix = `?utm_source=${notificationConfig.notificationType}&utm_medium=${notificationConfig.notificationType}`+
      `&utm_campaign=scholarship-due-remind-${notificationConfig.daysBeforeDeadline}`;

    notificationConfig.daysBeforeDeadline = notificationConfig.daysBeforeDeadline === 1 ?
      '1 day ': `${notificationConfig.daysBeforeDeadline} days `;
    const messageData:any = {
      title: `${userProfile.first_name}, a scholarship you saved: ${scholarship.name} is due in ${notificationConfig.daysBeforeDeadline}`+
      `on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}`,
      body: `Scholarship due on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}: ${scholarship.name}.
       Submit your Application!`,
      clickAction: `https://atila.ca/scholarship/${scholarship.slug}/${urlAnalyticsSuffix}`,
      // todo: user scholarship.img_url, for now use Atila Logo to build brand awareness
      image: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      icon: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      badge: 'https://storage.googleapis.com/atila-7.appspot.com/public/atila-logo-right-way-circle-transparent.png',
      sendDate: notificationConfig.sendDate || 0,
      notificationType: notificationConfig.notificationType || 'push',
      userId: userProfile.user,
      createdAt: createdAt,
    };

    if (messageData.notificationType === 'email') {
      messageData.email = userProfile.email;

      messageData.body = `Hey ${userProfile.first_name},
      The scholarship you saved, ${scholarship.name} is due in ${notificationConfig.daysBeforeDeadline} on
      ${this.datePipe.transform(scholarship.deadline, 'fullDate')}. View Scholarship: ${messageData.clickAction}`;

      messageData.html = `Hey ${userProfile.first_name}, <br/> <br/>
      The scholarship you saved, <strong>${scholarship.name} is due in ${notificationConfig.daysBeforeDeadline} on
      ${this.datePipe.transform(scholarship.deadline, 'fullDate')}. </strong> <br/> <br/>
      <a href="${messageData.clickAction}">View Scholarship: ${scholarship.name}</a> <br/> <br/>`;
    }

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
