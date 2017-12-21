import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class ApplicationService {

  public applicationDataUrl = environment.apiUrl + 'application-data/';

  public applicationsUrl = environment.apiUrl + 'applications/';

  constructor(public http: HttpClient) {
   }

   public params = new URLSearchParams();

  getOrCreateApp(data: any): Observable<any> {

    data.scholarshipId = parseInt(data.scholarshipId);


    return this.http.post(environment.apiUrl+'application-get-create/', data)
    .map(res=><any>res)
    .catch(err=>Observable.throw(err));
  }

  getAppData(appId: any): Observable<any>{
    return this.http.get(`${this.applicationsUrl}${appId}/application/`)
    .map(res=><any>res)
    .catch(err=>Observable.throw(err));


  }


}


export function getTimeOfDay(){
  var myDate = new Date();
  var hrs = myDate.getHours();

  var timeString;
  if (hrs < 12)
    timeString = 'Morning';
  else if (hrs >= 12 && hrs <= 17)
    timeString = 'Afternoon';
  else if (hrs >= 17 && hrs <= 24)
    timeString = 'Evening';

  return timeString;
}

/**
 * TODO: Make this more dynamic/customized TRY to be DRY.
 */
export function writeEmail(){

  let email_subject = this.generalData.scholarship.submission_info.email_subject_is_custom ? this.generalData.scholarship.submission_info.email_subject
    : `${this.generalData.userProfile.first_name} ${this.generalData.userProfile.last_name}'s ${this.generalData.scholarship.name} Application`;

  this.emailBody = `        
    To: ${this.generalData.scholarship.submission_info.email_address}
    
    Subject: ${email_subject} 
    
    Good ${this.timeOfDay},
  
    My name is ${this.generalData.userProfile.first_name} ${this.generalData.userProfile.last_name}.
    This email contains my application for the ${this.generalData.scholarship.name}, please see attached. Thank you for sponsoring this scholarship.
  
    Regards,
    ${this.generalData.userProfile.first_name}`;

  this.appMailToLink = `mailto:${this.generalData.scholarship.submission_info.email_address}
    ?&subject=${email_subject}
    &body=Good ${this.timeOfDay},
    
    My name is ${this.generalData.userProfile.first_name} ${this.generalData.userProfile.last_name}.
    This email contains my application for the ${this.generalData.scholarship.name}, please see attached. Thank you for sponsoring this scholarship.
    
    Regards,
    ${this.generalData.userProfile.first_name}`;

  this.appMailToLink = encodeURI(this.appMailToLink);
}


