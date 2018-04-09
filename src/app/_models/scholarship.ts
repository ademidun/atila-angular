
import {EDUCATION_FIELDS, EDUCATION_LEVEL, FUNDING_TYPES, APPLICATION_FORM_TYPES, AUTOCOMPLETE_DICT} from './constants';

export class Scholarship {
  constructor(
  public activities?: string[],
  public citizenship?: string[],
  public applicants?: any[],
  public city?: any,
  public country?: any,
  public cover_letter_required?: any,
  public criteria_info?: string,
  public date_created?: string,
  public deadline?: string,
  public description?: string,
  public disability?: string[],
  public financial_need?: string,
  public education_field?: any,
  public education_level?: any,
  public eligible_programs?: string[],
  public eligible_schools?: any,
  public enrollment_proof_required?: any,
  public ethnicity?: string[],
  public extra_questions?: any,
  public extra_criteria?: any,
  public female_only?: boolean,
  public form_url?: string,
  public funding_amount?: number,
  public funding_type?: string[],
  public heritage?: string[],
  public id?: number,
  public img_url?: any,
  public is_automated?: boolean,
  public language?: any,
  public local_form_location?: any,
  public metadata?: any,
  public name?: string,
  public no_essay_required?: boolean,
  public number_available_scholarships?: number,
  public owner?: any,
  public open_date?: any,
  public province?: any,
  public purpose?: any,
  public reference_letter_required?:number,
  public religion?: string[],
  public resume_required?:any,
  public scholarship_img_url?: string,
  public scholarship_url?: string,
  public slug?: string,
  public sports?:string[],
  public submission_info?:any,
  public transcript_required?:any,
  ) {

    this.extra_questions = {};
    this.submission_info = {};
    this.metadata = {};
    this.submission_info.application_form_type = APPLICATION_FORM_TYPES[1];
    this.funding_type = [FUNDING_TYPES[0]];
    this.reference_letter_required =0;
    this.number_available_scholarships =1;


    this.extra_questions.funding_amount_varies = true;

    this.submission_info.web_form_entries = [
      {
        attribute_type : '',
        attribute_value: '',
        question_key: ''
      },];

    this.submission_info.web_form_parent = {
      element_type: '',
      attribute_type : '',
      attribute_value: '',
    };
    for (let key in AUTOCOMPLETE_DICT ) {
      this[key] = [];
    }
}

  }

  export function scholarshipQuickCreate(scholarship: Scholarship) {


    scholarship = scholarshipCreationHelper(scholarship);
    scholarship.metadata['quick_add'] = true;
    scholarship.metadata['needs_review'] = true;
    scholarship.extra_questions.funding_amount_varies = !scholarship.funding_amount;

    return scholarship
  }

  export function scholarshipCreationHelper(scholarship: Scholarship){

    if(!scholarship.metadata){
      scholarship.metadata = {};
    }

    scholarship.education_field = scholarship.education_field || EDUCATION_FIELDS;
    scholarship.education_level = scholarship.education_level || EDUCATION_LEVEL;
    // Sometimes jQuery takes a bit too long and the change isn't reflected in the form
    // scholarship.description = scholarship.description || $(scholarship.criteria_info).text().slice(0,300);
    if (scholarship.criteria_info) {
      if ($){
        scholarship.description = scholarship.description ||$(scholarship.criteria_info).text().slice(0,300);
      }
      else {
        scholarship.description = scholarship.description ||
          scholarship.criteria_info.replace(/<(?:.|\n)*?>/gm, '').replace('&nbsp;','').replace('&ndash;','').slice(0,300);
      }

      }

    return scholarship;
  }

  export function getScholarshipDiff(oldScholarship: Scholarship, newScholarship: Scholarship) {
    let changes = {};
    for (let property in oldScholarship) {
      if (oldScholarship.hasOwnProperty(property)) {
        if (oldScholarship[property] == newScholarship[property]) {
          continue;
        }
        console.log('property,oldScholarship[property],newScholarship[property]',
          property,oldScholarship[property],newScholarship[property]);
        changes[property] = {
          key: property,
          current: oldScholarship[property],
          next: newScholarship[property],
        }
      }

      return changes;
    }

    console.log('changes',changes);

  }

