import {UserProfile} from './user-profile';

export class Essay {

  id?: number;
  title?:any;
  slug?: any;
  date_created?: any;
  header_image_url?: any;
  essay_source_url?: any;
  body?: any;
  description?:any;
  contributors?: any[];
  published?: boolean;
  up_votes_count?: any;
  down_votes_count?: any;
  down_votes_id?: any[];
  metadata?: any;
  up_votes_id?: any[];
  user?: any;
  status?: string;
  status_other?: string;
  constructor(userId=-1) {
    //Do we have to manually do this, is there a python-like equivalent of kwargs
    this.title = '';
    this.user= userId;
  }

}

export function createTestEssay() {
  const essay = new Essay();
  essay.title = 'The Way To Wealth';
  essay.essay_source_url = 'https://benfranklin.org';

  essay.user = {
    id: 1706,
    first_name: 'Benjamin',
    last_name: 'Franklin',
  };

  return essay
}
