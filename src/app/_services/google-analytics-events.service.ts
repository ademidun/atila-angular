import { Injectable } from '@angular/core';


declare const ga: any;

@Injectable()
export class GoogleAnalyticsEventsService {

  constructor() { }

  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    // console.log(ga); // Just to make sure it's actually the ga function
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });

  }
}
