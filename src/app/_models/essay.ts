export class Essay {

  id?: number;
  title?:any;
  slug?: any;
  date_created?: any;
  header_image_url?: any;
  essay_source_url?: any;
  body?: any;
  description?:any;
  contributors: any[];
  published?: boolean;
  up_votes_count?: any;
  down_votes_count?: any;
  down_votes_id?: any[];
  metadata?: any;
  up_votes_id?: any[];
  user?: any;
  status?: string;
  status_other?: string;
  constructor() {
    //Do we have to manually do this, is there a python-like equivalent of kwargs
    this.title = '';
  }

}
