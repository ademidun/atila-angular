import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { QuestionBase } from '../_models/question-base';
import { DateQuestion } from '../_models/question-date';
import { DropdownQuestion } from '../_models/question-dropdown';
import { TextboxQuestion } from '../_models/question-textbox';

@Component({
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss']
})
export class AddQuestionModalComponent implements OnInit {
  TYPE_CHOICES = [
    { 'value': 'textfield', 'name': 'Text Field' },
    { 'value': 'textarea', 'name': 'Text Area' },
    { 'value': 'number', 'name': 'Number' },
    { 'value': 'date', 'name': 'Date' },
    { 'value': 'file', 'name': 'File' }  
  ]

  question = {
    "value": "",
    "key": "",
    "label": "",
    "required": true,
    "order": null,
    "controlType": "",
    "type": ""
  };
  
  edit = false; // Default case is that we are adding a question

  constructor(
    public dialogRef: MdDialogRef<AddQuestionModalComponent>,
    @Inject(MD_DIALOG_DATA) public data
  ) { 
    if (data) {
      this.question = data;
      this.edit = true;
    }
    dialogRef.beforeClose().subscribe(
      () => {
        this.question.controlType = this.question.type;
      }
    )
  }

  ngOnInit() {    
  }

  
  
}
