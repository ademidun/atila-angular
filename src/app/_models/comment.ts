export class Comment {
    id?: any;    
    owner?: any;
    text?: string;
    title?: string;
    date_created?: any;
    parent_comment?: any;
    parent_model_type?: any;
    parent_model_id?: any;
    up_votes?: any;
    down_votes?: any;
    constructor(owner: number, parent_model_type: string,  parent_model_id: any, text?:string, title?:string) {
        this.owner = owner;
        this.parent_model_type=parent_model_type;
        this.parent_model_id = parent_model_id;
        this.text = text ? text : '';
        this.title = title ? title : '';
     }

}