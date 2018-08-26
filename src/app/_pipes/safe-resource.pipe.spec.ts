import { SafeResourcePipe } from './safe-resource.pipe';
import {DomSanitizer} from '@angular/platform-browser';
import {inject} from '@angular/core/testing';

describe('SafeResourcePipe', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
  it('create an instance', () => {
    const pipe = new SafeResourcePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
}));
