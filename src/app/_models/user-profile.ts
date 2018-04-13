export class UserProfile {
        constructor(
            public academic_average?: any,
            public activities?: string[],
            public citizenship?: string[],
            public city?: any,
            public country?: any,
            public country_extra?: any,
            public cover_letter?: any,
            public birth_date?: Date,
            public degree?: Date,
            public disability?: string[],
            public financial_need?: string,
            public first_name?: string,
            public education_level?: string[],
            public education_field?: string[],
            public eligible_programs?: string[],
            public eligible_schools?: string[],
            public enrollment_proof?: any,
            public email?: any,
            public ethnicity?: string[],
            public gender?: any,
            public heritage?: string[],
            public is_atila_admin?:any,
            public is_sponsor?:any,
            public is_verified?:any,
            public is_international_student?:any,
            public language?:string[],
            public last_name?: string,
            public major?: string,
            public metadata?: any,
            public postal_code?: string,
            public province?: any,
            public religion?: string[],
            public street_address?: string,
            public scholarships_match_score?: any[],
            public scholarships_not_interested?: any[],
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
            public saved_scholarships?:any,
            public saved_scholarships_metadata?:any,
            public secondary_school?:any,
            public signature?:any,
            public sports?:string[],
            public title?:string[],
            public post_secondary_school?:any,
            public verification_token?:any,


        ) {

          this.eligible_schools = [];
          this.eligible_programs = [];
          this.metadata = {};
        }
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


         for (let i =0; i<userProfile.saved_scholarships.length; i++) {
           if (userProfile.saved_scholarships[i] == item.id) {
             return [userProfile, false];
           }
         }

         if(!userProfile.saved_scholarships) {
           userProfile.saved_scholarships = [];
           userProfile.saved_scholarships_metadata = {};
         }

         userProfile.saved_scholarships.push(item.id,);
         userProfile.saved_scholarships_metadata[item.id] = {notes: ""};

         return [userProfile, true];

     }

export function updateScholarshipMatchScore(userProfile: UserProfile, opts={}) {
  if (opts['not_interested']) {
    let notInterested = userProfile.scholarships_not_interested;

    userProfile.scholarships_match_score = userProfile.scholarships_match_score.map(matchData => {
      if (userProfile.scholarships_not_interested.includes(matchData['id'])) {
        matchData['not_interested'] = true;
      }
      return matchData;
    });
  }
  console.log('updateScholarshipMatchScore() userProfile: ',userProfile);
  return userProfile;


}
