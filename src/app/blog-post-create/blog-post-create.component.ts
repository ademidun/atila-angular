import { Component, OnInit, AfterViewInit, EventEmitter, OnDestroy, Input,Output, ChangeDetectorRef } from '@angular/core';
// https://go.tinymce.com/blog/angular-2-and-tinymce/
import 'tinymce';
import 'tinymce/themes/modern';

import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/lists';

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
      plugins: ['link', 'table','toc','preview','lists'],
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
  /** TODO: preload created blog posts
   * <h3 id="mcetoc_1buq82v580"><a href="http://blog.tomiwa.ca/hedged-optimism/">Hedged Optimism</a></h3> 
   * <p>This was potentially my favorite blog post to write.</p> <ol> <li>It was actionable</li> <li>It was on a 
   * topic which I really enjoyed.</li> <li>I think I may be right.&nbsp;</li> </ol> <blockquote> <p>"An investment in 
   * education pays the best interest."</p> <p>&nbsp; &nbsp; - Benjamin Franklin</p> </blockquote> <p>This is why I
   *  would prefer going back to my regular writing.</p> <p>&nbsp;</p>
   */

}
