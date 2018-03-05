// https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
export class UploadFile {
    $key: string;
    file:File;
    metadata: any;
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
      this.metadata = {};
    }

  }

  export function isValidDemoFile(fileInput: File, snackBar, router) {

    let fileTypes: string[] = ["application/pdf", ".doc",".docx",".xml","application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (! fileTypes.includes(fileInput.type)) {
      let snackBarRef = snackBar.open("Invalid file for Demo (Try PDF or Word).", 'Register', {
        duration: 3000
      });
      snackBarRef.onAction().subscribe(
        () => {
          router.navigate(['/register']);
        });
      return false;
    }

    let fileSize = fileInput.size / 1024 / 1024; // in MB
    if (fileSize > 4) {
      let snackBarRef = snackBar.open("File Must Be Less than 2 MB in Demo Mode.", 'Register', {
        duration: 3000
      });
      snackBarRef.onAction().subscribe(
        () => {
          router.navigate(['/register']);
        });
      return false;
    }

    return true;
  }
