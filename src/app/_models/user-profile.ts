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
            
            
        ) { }
    }