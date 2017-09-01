export class UserProfile {    
        constructor(
            public city?: string,
            public country?: string,
            public birth_date?: Date,
            public first_name?: string,
            public education_level?: string[],
            public education_field?: string[],
            public is_sponsor?:any, 
            public last_name?: string,
            public postal_code?: string,
            public province?: string,
            public street_address?: string,
            public user?: number,
            public user_img_url?: string,
            
            
        ) { }
    }