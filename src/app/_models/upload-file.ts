// https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
export class UploadFile {
    $key: string;
    file:File;
    name:string;
    url:string;
    path:string;
    progress:number;
    createdAt: Date = new Date();
    uploadInstructions = {
      type: '',
      model:'',
      id: 0,
      fieldName:'',
    }
    constructor(file:File) {
      this.file = file;
      this.name = file.name;
    }
    
  }