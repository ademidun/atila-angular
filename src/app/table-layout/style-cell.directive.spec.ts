import {StyleCellDirective} from './style-cell.directive';
import {inject} from '@angular/core/testing';
import {ElementRef, Renderer} from '@angular/core';

describe('StyleCellDirective', inject([ElementRef, Renderer], (el: ElementRef, renderer: Renderer) => {
  it('should create an instance', () => {
    const directive = new StyleCellDirective(el, renderer);
    expect(directive).toBeTruthy();
  });
}));
