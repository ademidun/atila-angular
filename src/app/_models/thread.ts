import { UserProfile } from './user-profile';

export class Thread {

    constructor(
        public users: number[],
        public name?: string,
        public id?: number
    ) { }
}