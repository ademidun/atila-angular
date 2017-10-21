import { Directive, ElementRef, 
  Input, Renderer, OnInit } from '@angular/core';

@Directive({ selector: '[appStyleCell]'})

export class StyleCellDirective implements OnInit {
  @Input() appStyleCell: string;
  constructor(
  private el: ElementRef, 
  private renderer: Renderer) { }
  
  ngOnInit() {
    if (this.appStyleCell === undefined) {
        this.renderer.setElementStyle(
              this.el.nativeElement, 
              'color', 
              '#dcdcdc');
        this.renderer.setElementStyle(
              this.el.nativeElement, 
              'text-align', 
              'center');
    }
    if (typeof this.appStyleCell === 'number') {
        this.renderer.setElementStyle(
              this.el.nativeElement, 
              'text-align', 
              'right');
    }
  }
}