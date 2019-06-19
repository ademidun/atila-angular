import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {Application} from '../_models/application';
import {createTestUserProfile} from '../_models/user-profile';
import {UserProfileService} from './user-profile.service';

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

  getApplicationOwner(appId: any): Observable<any>{
    return this.http.get(`${environment.apiUrl}application-owner/?app-id=${appId}/`)
      .map(res=>res)
      .catch(err=>Observable.throw(err));
  }

   update(application: Application) {
     return this.http.patch(this.applicationsUrl+application.id+'/',application)
      .map(res=>res)
      .catch(err=>Observable.throw(err))
  }

  getTimeOfDay(){
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
  public writeEmail(generalData){

    let sentences = this.generateRandomSentences(generalData);

    let randIndices = {};

    for (const key in sentences) {
      let index = Math.floor(Math.random() * sentences[key].length);
      randIndices[key]=index;
    }


    let email_subject = generalData.scholarship.submission_info.email_subject_is_custom ? generalData.scholarship.submission_info.email_subject
      : `${generalData.userProfile.first_name} ${generalData.userProfile.last_name}'s ${generalData.scholarship.name} Application`;

    let emailBody = '';

    for (const key in sentences) {
      emailBody += sentences[key][randIndices[key]]
    }

    let emailMessage = `        
    To: ${generalData.scholarship.submission_info.email_address}
    
    Subject: ${email_subject} 
    
    `+ emailBody;



    let appMailToLink = `mailto:${generalData.scholarship.submission_info.email_address}
    ?&subject=${email_subject}
    &body=`+ emailBody;

    appMailToLink = encodeURI(appMailToLink);

    return [emailMessage,appMailToLink];
  }


  generateRandomSentences(generalData) {
    let timeOfDay = this.getTimeOfDay();
    let sentences = {};

    let openingSentence = [`Good ${timeOfDay},
  
    My name is ${generalData.userProfile.first_name} ${generalData.userProfile.last_name}. `,

      `Hello,
  
    I hope your ${timeOfDay} is going well. My name is ${generalData.userProfile.first_name} ${generalData.userProfile.last_name}. `,
    ];

    let middleSentence = [`I am emailing you regarding the ${generalData.scholarship.name}. This email contains my application, please see attached. `,
      `I am interested in applying for the ${generalData.scholarship.name} and I have attached my application. `,
      `This email contains my submission for the ${generalData.scholarship.name}, please see attached. `,

    ];

    let closingSentence = [`Thank you for sponsoring this scholarship.
    
    Regards,
    ${generalData.userProfile.first_name}`,

      `Thank you for your taking the time to review my application.
    
    Kind Regards,
    ${generalData.userProfile.first_name}  ${generalData.userProfile.last_name}`,

      `Thank you for reviewing my application.
    
    Sincerely,
    ${generalData.userProfile.first_name}  ${generalData.userProfile.last_name}`,

    `Thank you for reviewing my submission.
    
    Regards,
    ${generalData.userProfile.first_name}  ${generalData.userProfile.last_name}`,

      `Thank you for organizing this scholarship.
    
    ${generalData.userProfile.first_name}`,
    ];

    sentences['openingSentence'] = openingSentence;
    sentences['middleSentence'] = middleSentence;
    sentences['closingSentence'] = closingSentence;

    return sentences;
  }

}


export let ApplicationServiceStub: Partial<ApplicationService> = {

};
