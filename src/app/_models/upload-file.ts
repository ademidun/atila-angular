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
    }
    
  }