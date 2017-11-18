export class Message {
    
        constructor(
            public message: string,
            public user: number,
            public thread: number,
            public id?: number,
            public date_created?: string,
        ) { }
}