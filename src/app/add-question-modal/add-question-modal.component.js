"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var AddQuestionModalComponent = (function () {
    function AddQuestionModalComponent(dialogRef, data) {
        var _this = this;
        this.dialogRef = dialogRef;
        this.data = data;
        this.TYPE_CHOICES = [
            { 'value': 'textfield', 'name': 'Text Field' },
            { 'value': 'textarea', 'name': 'Text Area' },
            { 'value': 'number', 'name': 'Number' },
            { 'value': 'date', 'name': 'Date' },
            { 'value': 'file', 'name': 'File' }
        ];
        this.question = {
            "value": "",
            "key": "",
            "label": "",
            "required": true,
            "order": null,
            "controlType": "",
            "type": ""
        };
        this.edit = false; // Default case is that we are adding a question
        if (data) {
            this.question = data;
            this.edit = true;
        }
        dialogRef.beforeClose().subscribe(function () {
            _this.question.controlType = _this.question.type;
        });
    }
    AddQuestionModalComponent.prototype.ngOnInit = function () {
    };
    AddQuestionModalComponent = __decorate([
        core_1.Component({
            selector: 'app-add-question-modal',
            templateUrl: './add-question-modal.component.html',
            styleUrls: ['./add-question-modal.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], AddQuestionModalComponent);
    return AddQuestionModalComponent;
}());
exports.AddQuestionModalComponent = AddQuestionModalComponent;
