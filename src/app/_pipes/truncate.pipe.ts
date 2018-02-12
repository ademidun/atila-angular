import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, length: number) : string {

    // Set the limit to truncated
    let limit = length;

    // Truncate string if its greater than the limit
    if(value){
      console.log('limit, value, value.length',limit, value, value.length);
      console.log('value.length > limit ? value.substring(0, limit) + "..." : value',value.length >= limit ? value.substring(0, limit) + "..." : value);
      console.log('value.length > limit ? value.substring(0, limit) + "..." : value',value.length > limit ? value.substring(0, limit) + "..." : value);

      return value.length > limit ? value.substring(0, limit) + "..." : value;
    }

    else{
      return value;
    }

  }

}
