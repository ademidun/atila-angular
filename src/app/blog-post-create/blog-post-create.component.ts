import { Component, OnInit, AfterViewInit, EventEmitter, OnDestroy, Input,Output, ChangeDetectorRef } from '@angular/core';
// https://go.tinymce.com/blog/angular-2-and-tinymce/
import 'tinymce';
import 'tinymce/themes/modern';

import 'tinymce/plugins/table';
import 'tinymce/plugins/link';

declare var tinymce: any;

@Component({
  selector: 'app-blog-post-create',
  templateUrl: './blog-post-create.component.html',
  styleUrls: ['./blog-post-create.component.scss']
})
export class BlogPostCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  elementId = "post-editor";
  myJson = JSON;
  blogPost:any;
  constructor(private ref:ChangeDetectorRef) { }

  ngOnInit() {

  this.blogPost = {
    'title': 'My First Post',
    'html':'',
  };


  }
  editor: any;
  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'table'],
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', (e) => {
          const content = editor.getContent();
          this.onEditorContentChange(e,content, editor);
        });
      }
    });
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    tinymce.remove(this.editor);
  }

  onEditorContentChange(event:any, content:any, editor: any){

    if((<KeyboardEvent>event).keyCode == 13) {
      
      console.log('onEditorContentChange: event, content',event, content);
      console.log('onEditorContentChange: editor, ', editor);
      this.blogPost.html = content;
      console.log('onEditorContentChange: editor, ', this.blogPost);
      this.ref.detectChanges();
    }

  }

}
