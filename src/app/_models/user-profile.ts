export class UserProfile {    
        constructor(
            public audience?: string[],
            public bus_name?: string,
            public bus_number?: number,
            public city?: string,
            public date_bus_found?: Date,
            public first_name?: string,
            public industry?: string[],
            public is_sponsor?:any, 
            public last_name?: string,
            public postal_code?: string,
            public province?: string,
            public purpose?: string[],
            public street_address?: string,
            public user?: number,
            public user_img_url?: string,
            public title?: string
            
        ) { }
    }