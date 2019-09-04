import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

import {createTestScholarship, Scholarship, ScholarshipEdit} from '../_models/scholarship';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
import {MyFirebaseService} from './myfirebase.service';
import {createTestUserProfile} from '../_models/user-profile';
@Injectable()
export class ScholarshipService {

  public scholarshipsUrl = environment.apiUrl + 'scholarships/';
  public scholarshipsPreviewUrl = environment.apiUrl + 'scholarship-preview/';
  public scholarshipSlugUrl = environment.apiUrl + 'scholarship-slug/';
  public scholarshipEditUrl = environment.apiUrl + 'scholarship/edits/';
  constructor(public http: HttpClient,
              public firebaseService: MyFirebaseService) { }
  form_data: any;
  preventViewDoubleCount= false;
  // hackx When the sort by drop down is clicked, all the newly loaded scholarships get double counted
  // So count the first 9 results when sort by is clicked and exclude those from the initial count
  preventSortByDoubleCount: boolean;

  create(scholarship: Scholarship): Observable<Scholarship>{

    return this.http.post(this.scholarshipsUrl, scholarship)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createEdit(scholarshipEdit: ScholarshipEdit | any,opts={}): Observable<ScholarshipEdit>{

    if (opts['translateEdit']) {
      scholarshipEdit = this.translateEditData(scholarshipEdit);
    }
    return this.http.post(this.scholarshipEditUrl, scholarshipEdit)
      .map(this.extractData)
      .catch(this.handleError);
  }

  translateEditData(scholarshipEdit) {
    scholarshipEdit['user'] = scholarshipEdit.user.id != 0 ? scholarshipEdit.user.id : null;

    return scholarshipEdit;
  }

  createAny(data: any): Observable<Scholarship>{

    return this.http.post(this.scholarshipsUrl, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  update(scholarship: Scholarship): Observable<Scholarship>{

    return this.http.put(`${this.scholarshipsUrl}${scholarship['id']}/`, scholarship)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateAny(data: any): Observable<any>{

    return this.http.put(`${this.scholarshipsUrl}${data.scholarship['id']}/`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  patch(id,data,) {
    return this.http.patch(`${this.scholarshipsUrl}${id}/`,data)
      .map(res => res)
      .catch(err => Observable.throw(err));
  }

  setScholarshipPreviewForm(user_data:any): Promise<any>{ //made a promise so we can wait til function
                                                          // is called before navigating url
    this.form_data = user_data;

    return Promise.resolve(this.form_data);
  }

  getScholarshipPreviewForm(): Promise<any>{

    return Promise.resolve(this.form_data);
  }

  getScholarshipPreviewList(form_data): Observable<Scholarship[]> {

    return this.http.post(this.scholarshipsPreviewUrl, form_data)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getPaginatedscholarships(form_data, page): Observable<Scholarship[]> {
    return this.http.post(`${this.scholarshipsPreviewUrl}?page=${page}/`, form_data)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getById(id: number) {
    return this.http.get(`${this.scholarshipsUrl}${id}/`)
      .map(this.extractData)
      .catch(this.handleError);
}

getBySlug(slug: string) {
  return this.http.get(`${this.scholarshipSlugUrl}?slug=${slug}/`)
    .map(this.extractData)
    .catch(this.handleError);
}

  public extractData(res: HttpResponse<any>) {


    return res || { };

  }


  public handleError (error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure

    if(this.firebaseService){
      this.firebaseService.saveAny('error_logs/scholarships',error);
    }
    return Observable.throw(error);
  }

  searchSchools (query: any) {

    return $.getJSON(`http://universities.hipolabs.com/search?name=${query}`,
      res => {
        return res
      },
      err => {
        Observable.throw(err);
      });
    // return this.http.get(`http://universities.hipolabs.com/search?name=${query}`)
    //   .map(res=>res)
    //   .catch(err=>Observable.throw(err));

  }


}

export let ScholarshipServiceStub: Partial<ScholarshipService> = {
  form_data: {},
  getScholarshipPreviewForm(): Promise<any> {
    return Promise.resolve(this.form_data);
  },
  getPaginatedscholarships(form_data, page): Observable<Scholarship[]> | Observable<any> {

    const scholarships = [
      createTestScholarship('Due Tomorrow Foundation'),
      createTestScholarship('Test Scholarship 1'),
      createTestScholarship('Test Scholarship 2'),
      createTestScholarship('Test Scholarship 3')
    ];
    return Observable.of({
      data: scholarships,
      length: scholarships.length
    });
  }
};
