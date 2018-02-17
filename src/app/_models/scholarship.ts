
import {EDUCATION_FIELDS, EDUCATION_LEVEL} from '../_models/constants';

export class Scholarship {
    activities?: string[];
    citizenship?: string[];
    applicants?: any[];
    city?: any;
    country?: any;
    cover_letter_required?: any;
    criteria_info?: string;
    date_created?: string;
    deadline?: string;
    description?: string;
    disability?: string[];
    financial_need?: string;
    education_field?: any;
    education_level?: any;
    eligible_programs?: string[];
    eligible_schools?: any;
    enrollment_proof_required?: any;
    ethnicity?: string[];
    extra_questions?: any;
    extra_criteria?: any;
    form_url?: string;
    funding_amount?: number;
    funding_type?: string[];
    heritage?: string[];
    id?: number;
    img_url?: any;
    is_automated?: boolean;
    language?: any;
    local_form_location?: any;
    metadata: any;
    name?: string;
    number_available_scholarships?: number;
    owner?: any;
    province?: any;
    purpose?: any;
    reference_letter_required?:number;
    religion?: string[];
    resume_required?:any;
    scholarship_img_url?: string;
    scholarship_url?: string;
    slug?: string;
    sports?:string[];
    submission_info?:any;
    transcript_required?:any;
  }


  export function scholarshipQuickCreate(scholarship: Scholarship) {

    scholarship.education_field = EDUCATION_FIELDS;
    scholarship.education_level = EDUCATION_LEVEL;
    scholarship.description = $(scholarship.criteria_info).text().slice(0,300);

    console.log('scholarshipQuickCreate() scholarship:',scholarship);
    if(!scholarship.metadata){
      scholarship.metadata = {};
    }
    scholarship.metadata['quick_add'] = true;
    scholarship.metadata['needs_review'] = true;
    return scholarship
  }
