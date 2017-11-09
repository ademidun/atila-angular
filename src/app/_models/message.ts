export class Message {
    
        constructor(
            public message: string,
            public user: number,
            public thread: number,
            private id?: number,
            private date_created?: string,
        ) { }
    }