import { Comment } from './comment';

export class Forum {

    public user: any;
    public title?: string;
    public id?: number;
    public slug?: any;
    public date_created?: any;
    public starting_comment?: {
    "title": "",
    "username": "",
    "text": "",
    "up_votes_count": number,
    "down_votes_count": number,
    "id": number,
    "up_votes_id": number[],
};
    constructor(user,title   ) {
        //Do we have to manually do this, is there a python-like equivalent of kwargs
        this.user = user;
        this.title =title;
    }
}
