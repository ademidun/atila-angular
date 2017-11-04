export class Comment {
    id?: any;    
    owner?: any;
    text?: string;
    title?: string;
    date_created?: any;
    parent_comment?: any;
    parent_model_type?: any;
    parent_model_id?: any;
    up_votes_count?: any;
    down_votes_count?: any;
    up_votes_id?: any[];
    down_votes_id?: any[];
    constructor(owner: number, parent_model_type: string,  parent_model_id: any, text?:string, title?:string) {
        this.owner = owner;
        this.parent_model_type=parent_model_type;
        this.parent_model_id = parent_model_id;
        this.text = text ? text : '';
        this.title = title ? title : '';
     }

     //TODO make this less repetitive and combine into one method? Or is 2 seperate methods more modular and better?

}


export function upVoteComment(userId: number, comment: Comment): Comment{

    console.log('inside exported function Commment.up_vote_comment, comment', comment, 'userID:', userId);

    if(comment.up_votes_id.includes(userId)){

        console.log('inside Commment.up_vote_comment, user has already upvoted comment', comment, 'userID:', userId);
        return comment;
    }
    else{
        comment['user_already_upvoted'] = true;
        comment.up_votes_count = comment.up_votes_id.push(userId);
        console.log('inside Commment.up_vote_comment, userID just upvoted comment', comment, 'userID:', userId);
        return comment;
    }
}

export function downVoteComment(userId: number, comment: Comment): Comment{

    if(comment.down_votes_id.includes(userId)){
        return comment;
    }
    else{
        comment['user_already_downvoted'] = true;
        comment.down_votes_count = comment.down_votes_id.push(userId);
        return comment;
    }
}