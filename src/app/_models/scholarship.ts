import {
  APPLICATION_FORM_TYPES, AUTOCOMPLETE_DICT, AUTOCOMPLETE_KEY_LIST, EDUCATION_FIELDS, EDUCATION_LEVEL, FUNDING_TYPES} from './constants';

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
              public essay_set?: any[],
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
              public international_students_eligible?: boolean,
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
              public reference_letter_required?: number,
              public religion?: string[],
              public resume_required?: any,
              public scholarship_img_url?: string,
              public scholarship_url?: string,
              public slug?: string,
              public sports?: string[],
              public submission_info?: any,
              public transcript_required?: any,) {

    this.extra_questions = {};
    this.submission_info = {};
    this.metadata = {};
    this.submission_info.application_form_type = APPLICATION_FORM_TYPES[1];
    this.funding_type = [FUNDING_TYPES[0]];
    this.reference_letter_required = 0;
    this.number_available_scholarships = 1;


    this.extra_questions.funding_amount_varies = true;

    this.submission_info.web_form_entries = [
      {
        attribute_type: '',
        attribute_value: '',
        question_key: ''
      },];

    this.submission_info.web_form_parent = {
      element_type: '',
      attribute_type: '',
      attribute_value: '',
    };
    for (let key in AUTOCOMPLETE_DICT) {
      this[key] = [];
    }
  }
}

export function hasExtraCriteria(scholarship: Scholarship) {

  let showExtraCriteria = AUTOCOMPLETE_KEY_LIST.some(key => scholarship[key] && scholarship[key].length > 0);
  if (!showExtraCriteria) {
    showExtraCriteria = ['city', 'province', 'country'].some(locationType => scholarship[locationType] && scholarship[locationType].length > 0);
  }
  else if (!showExtraCriteria) {
    showExtraCriteria = scholarship.female_only || scholarship.international_students_eligible;
  }
  return showExtraCriteria;
}

export interface ScholarshipEdit {
  id: string,
  firebase_path: string,
  timestamp: number,
  scholarship: number,
  changes: Change[],
  user: any,
  metadata: any,
  status: 'PENDING',
}

export interface Change {
  current: any;
  suggested: any;
  upvotes: any[];
  downvotes: any[];
  key: string;
  status: string, // ['PENDING','ACCEPTED','REJECTED']

}

export function scholarshipQuickCreate(scholarship: Scholarship) {


  scholarship = scholarshipCreationHelper(scholarship);
  scholarship.metadata['quick_add'] = true;
  scholarship.metadata['needs_review'] = true;
  scholarship.extra_questions.funding_amount_varies = !scholarship.funding_amount;

  return scholarship
}

export function scholarshipCreationHelper(scholarship: Scholarship) {

  if (!scholarship.metadata) {
    scholarship.metadata = {};
  }

  scholarship.education_field = scholarship.education_field || EDUCATION_FIELDS;
  scholarship.education_level = scholarship.education_level || EDUCATION_LEVEL;

  return scholarship;
}

export function getScholarshipDiff(oldScholarship: Scholarship, newScholarship: Scholarship) {
  let changes = {};

  for (let property in oldScholarship) {

    // Comparison operator for complex object only works if its a primitive like a string.
    if (oldScholarship[property] != newScholarship[property]) {


      if (!oldScholarship[property] || !newScholarship[property]) {
        changes[property] = {
          key: property,
          current: oldScholarship[property],
          suggested: newScholarship[property],
          upvotes: [],
          downvotes: [],
          status: 'PENDING',
        };
        continue;
      }
      if (property == 'criteria_info') {


        let oldCriteria = oldScholarship[property];
        let newCriteria = newScholarship[property];


        oldCriteria = oldCriteria.replace(/(\n|\s)/gm, '');
        newCriteria = newCriteria.replace(/(\n|\s)/gm, '');


        let txt = document.createElement('textarea');
        txt.innerHTML = newCriteria;
        newCriteria = txt.value;

        if (oldCriteria.toString().length == newCriteria.toString().length) {
          continue;
        }

      }
      if (oldScholarship[property].toString() != newScholarship[property].toString()) {


        changes[property] = {
          key: property,
          current: oldScholarship[property],
          suggested: newScholarship[property],
          upvotes: [],
          downvotes: [],
          status: 'PENDING',
        }
      }
    }
  }


  return changes;

}

export function cleanHtml(rawHtml: string) {

  // https://stackoverflow.com/questions/19356398/remove-style-attribute-on-style-tag#19564598

  rawHtml = rawHtml.replace(/(<[^>]+) style=".*?"/gi, '$1');

  rawHtml = rawHtml.replace(/(<[^>]+) class=".*?"/gi, '$1');
  rawHtml = rawHtml.replace(/<iframe.+?<\/iframe>/gi, '');

  return rawHtml
}

export function createTestScholarship(scholarshipName = '') {
  const scholarship = new Scholarship();

  scholarship.name = scholarshipName || 'Test Scholarship Name Title';
  scholarship.description = 'This is just a scholarship that we created for testing purposes';
  scholarship.funding_amount = 1;
  scholarship.id = 100;
  scholarship.slug = convertToSlug(scholarship.name);
  const scholarshipDeadline = new Date();
  scholarshipDeadline.setDate(scholarshipDeadline.getDate() + 10);
  scholarship.deadline = scholarshipDeadline.toISOString();
  scholarship.img_url = 'https://cdn-images-1.medium.com/max/1200/1*WsXC2qnQf8OlhNunq3Lrcg.png';
  scholarship.metadata = {};

  return scholarship
}

export function convertToSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    ;
}
