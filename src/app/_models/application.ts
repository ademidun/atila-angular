import { Scholarship } from '../_models/scholarship';
export class Application {
    constructor(
        public userprofile: number,
        public scholarship: Scholarship,
        public date_created: string,
        public responses: any,
        public id?: number,
    ) { }
}