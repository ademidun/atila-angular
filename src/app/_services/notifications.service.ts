import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import * as admin from 'firebase-admin';
import {Scholarship} from '../_models/scholarship';
import {UserProfile} from '../_models/user-profile';
import {DatePipe} from '@angular/common';
import {SwPush} from '@angular/service-worker';

// import NotificationMessagePayload = admin.messaging.NotificationMessagePayload;

@Injectable()
export class NotificationsService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  readonly VAPID_PUBLIC_KEY = 'BAjiETJuDgtXH6aRXgeCZgK8vurMT7AbFmPPhz1ybyfcDmfGFFydSXkYDC359HIXUmWw8w79-miI6NtmbfodiVI';
  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public datePipe: DatePipe,
    public swPush: SwPush) {
  }


  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;

      const data = {[user.uid]: token}
      this.db.object('fcmTokens/').update(data)
    })
  }

  getPermission() {
    return this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      this.currentMessage.next(payload)
    });

  }

  pushMessage(messageData) {

    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) {
        return;
      }

      return this.db.list(`notificationMessages/${user.uid}`).push(messageData);
    })

  }

  createScholarshipNotifications(userProfile: UserProfile, scholarship: Scholarship) {
    this.getPermission().then((sub: PushSubscription) => {

        console.log({sub});
        let sendDate: Date | number = new Date(scholarship.deadline);

        sendDate.setDate(sendDate.getDate() - 7);
        sendDate = sendDate.getTime();
        const messageData = { // type NotificationMessagePayloadv
          title: `${scholarship.name} is due in 7 days on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}`,
          body: `The ${scholarship.name} you saved is due on: ${scholarship.deadline}. Submit your Application!`,
          clickAction: `https://atila.ca/scholarship/${scholarship.slug}?utm_source=push_notification`,
          sendDate: sendDate,
        };

        this.pushMessage(messageData);

        const messageData2 = messageData;

        sendDate = new Date(scholarship.deadline);
        sendDate.setDate(sendDate.getDate() - 1);
        sendDate = sendDate.getTime();

        messageData2.sendDate = sendDate;
        messageData2.title = `${scholarship.name} is due in 24 hours on ${this.datePipe.transform(scholarship.deadline, 'fullDate')}`;

        this.pushMessage(messageData2);
      },
    )
      .catch((err) => {
        console.log('Unable to createScholarshipNotifications()', err);
      });
  }
}
