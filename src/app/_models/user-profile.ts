export class UserProfile {    
        constructor(
            public city?: any,
            public country?: any,
            public birth_date?: Date,
            public first_name?: string,
            public education_level?: string[],
            public education_field?: string[],
            public email?: any,
            public is_sponsor?:any, 
            public last_name?: string,
            public postal_code?: string,
            public province?: any,
            public street_address?: string,
            public user?: number,
            public username?:any,
            public profile_pic_url?: string,
            phone_number?:any,
            resume?:any,
            transcript?:any,
            reference_letter?:any,
            reference_letter_alternate?:any,
            extracurricular_description?:any,
            academic_career_goals?:any,
            secondary_school?:any,
            post_secondary_school?:any,
            
            
        ) { }
    }