import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

import { Scholarship } from "../_models/scholarship";
import { Comment } from "../_models/comment";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';
@Injectable()
export class ScholarshipService {

  private scholarshipsUrl = 'http://127.0.0.1:8000/scholarships/';
  private scholarshipsPreviewUrl = 'http://127.0.0.1:8000/scholarship-preview/';
  private scholarshipSlugUrl = 'http://127.0.0.1:8000/scholarship-slug/';
  constructor(private http: HttpClient) { }
  form_data: any;

  create(scholarship: Scholarship): Observable<Scholarship>{
    
    return this.http.post(this.scholarshipsUrl, scholarship)
      .map(this.extractData)
      .catch(this.handleError);
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
  
  setScholarshipPreviewForm(user_data:any): Promise<any>{ //made a promise so we can wait til function is called before navigating url
    this.form_data = user_data;
    console.log('inside scholarshipService saving previewform', this.form_data);
    return Promise.resolve(this.form_data);
  }

  getScholarshipPreviewForm(): Promise<any>{
    console.log('inside ScholarshipService returning previewform', this.form_data);
    return Promise.resolve(this.form_data);
  }

  getScholarshipPreviewList(form_data): Observable<Scholarship[]> {
    console.log('inside ScholarshipService getScholarshipPreviewList: ', form_data);
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


  
  private extractData(res: HttpResponse<any>) {
    
    console.log('scholarshipService res: ', res);
    return res || { };

  }


  private handleError (error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    
    console.error(error);
    return Observable.throw(error);
  }


}
