import { Pipe, PipeTransform } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeResource'
})
export class SafeResourcePipe implements PipeTransform {

  constructor(public sanitizer:DomSanitizer){}
  
    transform(html) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(html);
    }

}
