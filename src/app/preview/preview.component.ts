import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

import { ScholarshipService } from "../_services/scholarship.service";

import { Router, ActivatedRoute } from '@angular/router'
export class PreviewResponse {
  
  constructor(
  public city :string[],
  public education_level :string[],
  public education_field :string[],
    ) { }
}


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  CITY_CHOICES = [
    'Milton',
    'Oakville',
    'Burlington',
    'Toronto',
    'Mississauga',
    'Brampton',
    'Other',
   ]
   
   EDUCATION_LEVEL = [
       'University', 
       'College', 
       'Workplace or Apprenticeship',
   ]
   
   EDUCATION_FIELD = [
       'Arts (Undergrad)',
       'STEM (Undergrad)',
       'Trade School', 
       'Visual + Performing Arts', 
       'Law School', 
       'Medical School', 
       'MBA', 
       'Arts (Grad School)', 
       'STEM (Grad School)', 
       'Other' 
   ]

   model = new PreviewResponse([''],[this.EDUCATION_LEVEL[0]],[this.EDUCATION_FIELD[0]]);
   diagnostic: any;
   constructor(
    public scholarshipService: ScholarshipService,
    private router: Router,
    ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    console.log('form: NgForm: ', form)
    // console.log('JSON.stringify(form): ',  JSON.stringify(form))
  console.log('model Json Stringify: ', JSON.stringify(this.model));
  //const capitalizeFirstChar = str => str.charAt(0).toUpperCase() + str.substring(1);
  //this.model.city[0] = capitalizeFirstChar(form.value['city']);
  this.model.city[0] = form.value['city'];
  console.log('model data: ', this.model)
  //console.log('JSON.stringify(previewForm): ', JSON.stringify(previewForm))
  console.log('previewForm: ', form.value);
  this.diagnostic = JSON.stringify(this.model);

  this.scholarshipService.setScholarshipPreviewForm(this.model).then(
    res => this.router.navigate(['scholarships-list']))  //use promise to ensure that form is saved to Service before navigating away
    

}

}
