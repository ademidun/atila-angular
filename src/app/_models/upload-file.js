"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
var UploadFile = (function () {
    function UploadFile(file) {
        this.createdAt = new Date();
        this.uploadInstructions = {
            type: '',
            model: '',
            id: 0,
            fieldName: '',
        };
        this.file = file;
        this.name = file.name;
    }
    return UploadFile;
}());
exports.UploadFile = UploadFile;
