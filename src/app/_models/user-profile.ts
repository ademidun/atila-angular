import {MatSnackBar} from '@angular/material';

export class UserProfile {
        constructor(
            public academic_average?: any,
            public city?: any,
            public country?: any,
            public cover_letter?: any,
            public birth_date?: Date,
            public degree?: Date,
            public first_name?: string,
            public education_level?: string[],
            public education_field?: string[],
            public eligible_programs?: string[],
            public eligible_schools?: string[],
            public email?: any,
            public is_sponsor?:any,
            public is_verified?:any,
            public last_name?: string,
            public major?: string,
            public metadata?: any,
            public postal_code?: string,
            public province?: any,
            public street_address?: string,
            public user?: number,
            public username?:any,
            public preferences?:any,
            public profile_pic_url?: string,
            public phone_number?:any,
            public resume?:any,
            public transcript?:any,
            public reference_letter?:any,
            public reference_letter_alternate?:any,
            public extracurricular_description?:any,
            public academic_career_goals?:any,
            public secondary_school?:any,
            public signature?:any,
            public post_secondary_school?:any,
            public verification_token?:any,


        ) { }
    }

     export function toTitleCase(str) {
       var i, j, lowers, uppers;
       str = str.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
       });

       // Certain minor words should be left lowercase unless
       // they are the first or last words in the string
       lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
         'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
       for (i = 0, j = lowers.length; i < j; i++) {
         str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
           function(txt) {
             return txt.toLowerCase();
           });
       }


       // Certain words such as initialisms or acronyms should be left uppercase
       uppers = ['Id', 'Tv'];
       for (i = 0, j = uppers.length; i < j; i++) {
         str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
           uppers[i].toUpperCase());
       }

       return str;
     }

     export function addToMyScholarshipHelper(userProfile, item) {


         for (let i =0; i<userProfile.metadata.saved_scholarships.length; i++) {
           if (userProfile.metadata.saved_scholarships[i].id == item.id) {

             return [userProfile, false];
           }
         }


         if(!userProfile.metadata.saved_scholarships) {
           userProfile.metadata.saved_scholarships = [];
         }
         let savedScholarship = {
           id: item.id,
           name: item.name,
           slug: item.slug,
           description: item.description,
           img_url: item.import,
           deadline: item.deadline,
         };
         userProfile.metadata.saved_scholarships.push(savedScholarship);

         return [userProfile, true];

     }
